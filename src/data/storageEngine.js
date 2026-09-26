// Sistema de persistencia y base de datos interna para el psicólogo y estudiantes

const DB_KEY = 'drs16_evaluations_database_v1';
const DRAFT_PREFIX = 'drs16_draft_';
const TOKENS_KEY = 'saher_temporary_tokens_v1';
const PSYCHOLOGIST_AUTH_KEY = 'saher_psychologist_session_v1';

export function getEvaluations() {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      // Sembrar datos de demostración iniciales para que el psicólogo pueda evaluar de inmediato
      const demoData = generateInitialDemoData();
      saveAllEvaluations(demoData);
      return demoData;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer evaluaciones:', err);
    return [];
  }
}

export function saveAllEvaluations(list) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Error al guardar evaluaciones:', err);
  }
}

export function saveEvaluation(evalData) {
  const list = getEvaluations();
  const newEntry = {
    id: 'eval_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    psychologistReview: {
      decision: evalData.results.isApproved ? 'APROBADO' : 'NO APROBADO',
      officialVerdict: evalData.results.isApproved ? 'Aprobado por Baremo' : 'No Aprobado por Baremo',
      notes: '',
      reviewedAt: null,
      psychologistName: ''
    },
    ...evalData
  };

  // Reemplazar si ya existía una evaluación con la misma cédula reciente o añadir
  const existingIndex = list.findIndex(e => e.candidate?.cedula === evalData.candidate?.cedula);
  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...newEntry };
  } else {
    list.unshift(newEntry);
  }

  saveAllEvaluations(list);

  // Limpiar borrador de esta cédula
  if (evalData.candidate?.cedula) {
    localStorage.removeItem(DRAFT_PREFIX + evalData.candidate.cedula);
  }

  return newEntry;
}

export function updateEvaluationPsychologistReview(evalId, reviewData) {
  const list = getEvaluations();
  const index = list.findIndex(e => e.id === evalId);
  if (index >= 0) {
    list[index].psychologistReview = {
      ...list[index].psychologistReview,
      ...reviewData,
      reviewedAt: new Date().toISOString()
    };
    saveAllEvaluations(list);
    return list[index];
  }
  return null;
}

export function deleteEvaluation(evalId) {
  const list = getEvaluations();
  const filtered = list.filter(e => e.id !== evalId);
  saveAllEvaluations(filtered);
  return filtered;
}

// Guardar y recuperar borrador
export function saveDraft(cedula, candidate, answers) {
  if (!cedula) return;
  try {
    const draft = {
      savedAt: new Date().toISOString(),
      candidate,
      answers
    };
    localStorage.setItem(DRAFT_PREFIX + cedula, JSON.stringify(draft));
  } catch (err) {
    console.error('Error al guardar borrador:', err);
  }
}

export function getDraft(cedula) {
  if (!cedula) return null;
  try {
    const data = localStorage.getItem(DRAFT_PREFIX + cedula);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

// Exportación a Excel (CSV con UTF-8 BOM para apertura perfecta en Excel)
export function exportEvaluationsToExcel(evaluations = null) {
  const list = evaluations || getEvaluations();
  if (list.length === 0) {
    alert('No hay evaluaciones registradas para exportar.');
    return;
  }

  const headers = [
    'ID Evaluación',
    'Fecha',
    'Nombre Completo',
    'Cédula / ID',
    'Correo Electrónico',
    'Teléfono',
    'Empresa / Institución',
    'Cargo / Rol',
    'Puntaje DERS-16 (16-80)',
    'Resultado DERS',
    'Estrés Percibido PSS (0-56)',
    'Nivel Estrés PSS',
    'Afrontamiento COPE (%)',
    'Riesgo Evasión COPE (%)',
    'Índice Confiabilidad (%)',
    'Índice Riesgo (%)',
    'Estado Aprobación',
    'Decisión del Psicólogo',
    'Notas del Psicólogo'
  ];

  const rows = list.map(item => {
    const c = item.candidate || {};
    const r = item.results || {};
    const ders = r.ders || {};
    const pss = r.pss || {};
    const cope = r.cope || {};
    const rev = item.psychologistReview || {};

    return [
      item.id,
      new Date(item.createdAt).toLocaleString('es-ES'),
      `"${(c.nombre || '') + ' ' + (c.apellidos || '')}"`,
      `"${c.cedula || ''}"`,
      `"${c.email || ''}"`,
      `"${c.telefono || ''}"`,
      `"${c.empresa || ''}"`,
      `"${c.cargo || ''}"`,
      ders.totalScore || '',
      ders.isApproved ? 'Aprobado (16-55)' : 'No Aprobado (56-80)',
      pss.totalScore || '',
      pss.nivelEstres || '',
      cope.adaptativePercentage || '',
      cope.riskPercentage || '',
      r.trustIndex || '',
      r.riskIndex || '',
      r.certificationStatus || '',
      rev.decision || '',
      `"${(rev.notes || '').replace(/"/g, '""')}"`
    ].join(';');
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Base_Evaluaciones_Confianza_DERS16_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Exportación a JSON
export function exportEvaluationsToJSON(evaluations = null) {
  const list = evaluations || getEvaluations();
  const jsonStr = JSON.stringify(list, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BD_Evaluaciones_DERS16_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// GESTIÓN DE CREDENCIALES TEMPORALES (ASPIRANTES)
// ==========================================

export function getTemporaryTokens() {
  try {
    const data = localStorage.getItem(TOKENS_KEY);
    if (!data) {
      const demoTokens = [
        {
          id: 'tok_demo_active_1',
          username: 'saher-asp-101',
          password: 'SAHER-2026',
          isUsed: false,
          createdAt: new Date().toISOString(),
          usedAt: null,
          candidate: {
            nombre: 'Juan Carlos',
            apellidos: 'Pérez Salazar',
            cedula: '1720394851',
            cargo: 'Aspirante a Guardia de Seguridad',
            empresa: 'SAHER Escuela de Seguridad',
            email: 'juan.perez@saher.edu.ec',
            telefono: '+593 98 765 4321'
          }
        },
        {
          id: 'tok_demo_used_1',
          username: 'saher-asp-100',
          password: 'SAHER-8821',
          isUsed: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          usedAt: new Date(Date.now() - 82800000).toISOString(),
          evaluationId: 'eval_demo_1',
          candidate: {
            nombre: 'Carlos Andrés',
            apellidos: 'Mendoza Vera',
            cedula: '1718293041',
            cargo: 'Jefe de Operaciones y Seguridad',
            empresa: 'Logística Continental S.A.',
            email: 'carlos.mendoza@ejemplo.com',
            telefono: '+593 998765432'
          }
        }
      ];
      saveTemporaryTokens(demoTokens);
      return demoTokens;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer tokens temporales:', err);
    return [];
  }
}

export function saveTemporaryTokens(tokens) {
  try {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } catch (err) {
    console.error('Error al guardar tokens temporales:', err);
  }
}

export function createTemporaryToken(candidateData) {
  const tokens = getTemporaryTokens();
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const randPass = Math.floor(1000 + Math.random() * 9000);

  const newToken = {
    id: 'tok_' + Date.now() + '_' + randSuffix,
    username: `asp-${randSuffix}`,
    password: `DERS-${randPass}`,
    isUsed: false,
    createdAt: new Date().toISOString(),
    usedAt: null,
    evaluationId: null,
    candidate: {
      nombre: candidateData.nombre || 'Aspirante',
      apellidos: candidateData.apellidos || '',
      cedula: candidateData.cedula || '',
      cargo: candidateData.cargo || 'Aspirante a Guardia de Seguridad',
      empresa: candidateData.empresa || 'SAHER Escuela para Guardias de Seguridad',
      email: candidateData.email || '',
      telefono: candidateData.telefono || '',
      pais: candidateData.pais || 'Ecuador',
      sector: candidateData.sector || 'Seguridad Privada y Vigilancia Fija'
    }
  };

  tokens.unshift(newToken);
  saveTemporaryTokens(tokens);
  return newToken;
}

export function validateTemporaryToken(username, password) {
  if (!username || !password) {
    return { 
      success: false, 
      reason: 'MISSING_FIELDS', 
      message: 'Por favor ingresa tu usuario y contraseña temporal.' 
    };
  }

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  const tokens = getTemporaryTokens();
  const found = tokens.find(t => t.username.toLowerCase() === cleanUser);

  if (!found) {
    return { 
      success: false, 
      reason: 'NOT_FOUND', 
      message: 'El usuario temporal ingresado no existe en el sistema SAHER.' 
    };
  }

  if (found.password !== cleanPass) {
    return { 
      success: false, 
      reason: 'WRONG_PASSWORD', 
      message: 'Contraseña temporal incorrecta. Verifique mayúsculas y números.' 
    };
  }

  if (found.isUsed) {
    return { 
      success: false, 
      reason: 'ALREADY_USED', 
      message: `Esta credencial temporal ya fue utilizada el ${new Date(found.usedAt).toLocaleString('es-ES')}. Por motivos de seguridad y validez psicométrica, solo se permite un solo intento. Solicite una nueva credencial al responsable de SAHER.` 
    };
  }

  return { 
    success: true, 
    token: found, 
    candidate: found.candidate 
  };
}

export function consumeTemporaryToken(username, evaluationId = null) {
  if (!username) return;
  const cleanUser = username.trim().toLowerCase();
  const tokens = getTemporaryTokens();
  const index = tokens.findIndex(t => t.username.toLowerCase() === cleanUser);

  if (index >= 0) {
    tokens[index] = {
      ...tokens[index],
      isUsed: true,
      usedAt: new Date().toISOString(),
      evaluationId: evaluationId || tokens[index].evaluationId
    };
    saveTemporaryTokens(tokens);
  }
}

export function deleteTemporaryToken(tokenId) {
  const tokens = getTemporaryTokens();
  const filtered = tokens.filter(t => t.id !== tokenId);
  saveTemporaryTokens(filtered);
  return filtered;
}

// ==========================================
// AUTENTICACIÓN Y SESIÓN DEL PSICÓLOGO
// ==========================================

export function validatePsychologistLogin(username, password) {
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const isUserValid = cleanUser === 'psicologia@saher.edu.ec' || cleanUser === 'psicologo' || cleanUser === 'admin';
  const isPassValid = cleanPass === 'saher2026';

  if (isUserValid && isPassValid) {
    const sessionData = {
      isAuthenticated: true,
      username: cleanUser,
      role: 'Psicólogo Evaluador SAHER',
      loggedInAt: new Date().toISOString()
    };
    savePsychologistSession(sessionData);
    return { success: true, session: sessionData };
  }

  return { 
    success: false, 
    message: 'Usuario o contraseña de Psicólogo incorrectos. (Acceso restringido).' 
  };
}

export function getPsychologistSession() {
  try {
    const data = sessionStorage.getItem(PSYCHOLOGIST_AUTH_KEY) || localStorage.getItem(PSYCHOLOGIST_AUTH_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

export function savePsychologistSession(session) {
  try {
    const str = JSON.stringify(session);
    sessionStorage.setItem(PSYCHOLOGIST_AUTH_KEY, str);
    localStorage.setItem(PSYCHOLOGIST_AUTH_KEY, str);
  } catch (err) {
    console.error('Error al guardar sesión de psicólogo:', err);
  }
}

export function clearPsychologistSession() {
  try {
    sessionStorage.removeItem(PSYCHOLOGIST_AUTH_KEY);
    localStorage.removeItem(PSYCHOLOGIST_AUTH_KEY);
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  }
}

// Datos demostrativos iniciales
function generateInitialDemoData() {
  return [
    {
      id: 'eval_demo_1',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      candidate: {
        nombre: 'Carlos Andrés',
        apellidos: 'Mendoza Vera',
        cedula: '1718293041',
        email: 'carlos.mendoza@ejemplo.com',
        telefono: '+593 998765432',
        pais: 'Ecuador',
        empresa: 'Logística Continental S.A.',
        cargo: 'Jefe de Operaciones y Seguridad'
      },
      results: {
        trustIndex: 84.5,
        riskIndex: 15.5,
        isApproved: true,
        certificationStatus: 'APROBADO',
        tier: 'Nivel Sobresaliente / Alta Integridad',
        ders: {
          totalScore: 26,
          isApproved: true,
          statusLabel: 'APROBADO',
          percentage: 84,
          subscores: { claridad: 3, metas: 3, impulsos: 4, estrategias: 8, no_aceptacion: 8 },
          subpercentages: { claridad: 88, metas: 88, impulsos: 92, estrategias: 85, no_aceptacion: 75 }
        },
        pss: {
          totalScore: 16,
          nivelEstres: 'Bajo',
          resiliencePercentage: 71,
          subpercentages: { sobrecarga: 75, autoeficacia: 79 }
        },
        cope: {
          adaptativePercentage: 79,
          riskPercentage: 8,
          copingMaturity: 85,
          subpercentages: { activo_plan: 83, apoyo_social: 75, reevaluacion_aceptacion: 80, humor_espiritualidad: 70, distraccion_desahogo: 60, evasion_riesgo: 8 }
        },
        foda: {
          fortalezas: [
            'Autocontrol emocional óptimo con puntaje DERS de 26/80 (dentro del rango aprobado de 16 a 55).',
            'Capacidad demostrada para contener impulsos y mantener conducta ética bajo situaciones de tensión laboral.',
            'Alta claridad en la identificación y diferenciación de estados emocionales propios.',
            'Excelente tolerancia al estrés cotidiano y alta percepción de autoeficacia para resolver imprevistos.',
            'Predominio de estrategias proactivas: orienta sus esfuerzos a la resolución directa de problemas.'
          ],
          oportunidades: [
            'Consolidar su liderazgo emocional compartiendo sus estrategias de autocontrol con compañeros de equipo.',
            'Entrenar técnicas de resiliencia avanzada para situaciones de crisis operativa extrema.'
          ],
          debilidades: [
            'Exigencia personal elevada ante desajustes menores en la planificación operativa.'
          ],
          amenazas: [
            'Riesgo de asumir excesiva carga de responsabilidades ajenas por perfeccionismo.'
          ],
          conclusionPsicologica: 'El evaluado cumple con los criterios psicométricos para la Certificación de Confianza (DERS-16 = 26, rango 16-55). Muestra suficiente regulación afectiva, prudencia conductual y recursos de afrontamiento funcional para desempeñar roles de confianza y responsabilidad.'
        }
      },
      psychologistReview: {
        decision: 'APROBADO',
        officialVerdict: 'Aprobado y Certificado',
        notes: 'Perfil con excelente estabilidad emocional, bajo riesgo conductual y buena proyección en manejo de equipos bajo estrés.',
        reviewedAt: new Date(Date.now() - 86400000).toISOString(),
        psychologistName: 'Dra. Patricia Silva - Reg. Prof. 8492'
      }
    },
    {
      id: 'eval_demo_2',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      candidate: {
        nombre: 'Mariana Sofia',
        apellidos: 'Gómez Restrepo',
        cedula: '0928374651',
        email: 'mariana.gomez@ejemplo.com',
        telefono: '+57 3109876543',
        pais: 'Colombia',
        empresa: 'Finanzas & Valores S.A.S.',
        cargo: 'Analista de Tesorería'
      },
      results: {
        trustIndex: 42.0,
        riskIndex: 58.0,
        isApproved: false,
        certificationStatus: 'NO APROBADO',
        tier: 'No Acreditado / Requiere Intervención',
        ders: {
          totalScore: 63,
          isApproved: false,
          statusLabel: 'NO APROBADO',
          percentage: 27,
          subscores: { claridad: 8, metas: 9, impulsos: 13, estrategias: 19, no_aceptacion: 14 },
          subpercentages: { claridad: 25, metas: 25, impulsos: 22, estrategias: 30, no_aceptacion: 38 }
        },
        pss: {
          totalScore: 41,
          nivelEstres: 'Alto',
          resiliencePercentage: 27,
          subpercentages: { sobrecarga: 25, autoeficacia: 29 }
        },
        cope: {
          adaptativePercentage: 42,
          riskPercentage: 63,
          copingMaturity: 40,
          subpercentages: { activo_plan: 42, apoyo_social: 50, reevaluacion_aceptacion: 40, humor_espiritualidad: 35, distraccion_desahogo: 60, evasion_riesgo: 63 }
        },
        foda: {
          fortalezas: [
            'Apertura y disposición para consultar dudas y solicitar consejo calificado a terceros.'
          ],
          oportunidades: [
            'Desarrollar mayor autoconciencia y claridad emocional para no prolongar momentos de confusión.',
            'Entrenar técnicas de regulación de impulsos y pausas reflexivas antes de responder a imprevistos.'
          ],
          debilidades: [
            'Puntaje DERS de 63/80 se ubica en rango no aprobado (>55), evidenciando dificultad para modular emociones críticas.',
            'Elevada percepción de estrés acumulado (41/56), lo cual puede agotar su energía psíquica y capacidad de atención.',
            'Tendencia a mecanismos de evasión y desbordamiento en situaciones de tensión.'
          ],
          amenazas: [
            'Riesgo de reactividad impulsiva o dificultad de concentración en momentos de alta alteración o conflicto.',
            'Vulnerabilidad a fatiga laboral (burnout) y sobrecarga en periodos de alta demanda.'
          ],
          conclusionPsicologica: 'El evaluado no alcanza el umbral de aprobación psicométrica (DERS-16 = 63, superior a 55). Se recomienda no asignar responsabilidades críticas de alta presión hasta que complete un programa de fortalecimiento en regulación emocional y manejo de impulsos.'
        }
      },
      psychologistReview: {
        decision: 'NO APROBADO',
        officialVerdict: 'No Aprobado por Baremo',
        notes: 'Dificultades notorias en control de impulsos (13/15) y estrés elevado. Se recomienda reevaluar en 6 meses posterior a proceso de orientación.',
        reviewedAt: new Date().toISOString(),
        psychologistName: 'Dra. Patricia Silva - Reg. Prof. 8492'
      }
    }
  ];
}
