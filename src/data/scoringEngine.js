// Motor de cálculo psicométrico oficial SAHER
// Criterios validados: DERS-16 (16-80), PSS-14 (0-56 con inversas), COPE-28 (2 macro-dimensiones)
import { TESTS } from './questionsData';

export function calculateDersScore(answers) {
  let totalScore = 0;
  
  // 5 Dimensiones oficiales del DERS-16 explicadas por el psicólogo:
  // 1. Reacción frente a emociones negativas (9, 10, 13, 14) - 4 ítems (min 4, max 20)
  // 2. Capacidad de realizar tareas y concentrarse ante malestar (3, 7, 15) - 3 ítems (min 3, max 15)
  // 3. Dificultades en control de impulsos (4, 8, 11) - 3 ítems (min 3, max 15)
  // 4. Acceso limitado a estrategias de regulación (5, 6, 12, 16) - 4 ítems (min 4, max 20)
  // 5. Claridad emocional / reconocimiento consciente (1, 2) - 2 ítems (min 2, max 10)
  const subscores = {
    reaccion_negativa: 0,
    metas_tareas: 0,
    control_impulsos: 0,
    estrategias_reg: 0,
    claridad_emocional: 0
  };

  for (let i = 1; i <= 16; i++) {
    const val = Number(answers[`ders_${i}`]) || 1;
    totalScore += val;

    if ([9, 10, 13, 14].includes(i)) subscores.reaccion_negativa += val;
    else if ([3, 7, 15].includes(i)) subscores.metas_tareas += val;
    else if ([4, 8, 11].includes(i)) subscores.control_impulsos += val;
    else if ([5, 6, 12, 16].includes(i)) subscores.estrategias_reg += val;
    else if ([1, 2].includes(i)) subscores.claridad_emocional += val;
  }

  // Baremos oficiales exactos:
  // 16 - 28: Nivel Muy Bajo (Buen control emocional)
  // 29 - 39: Nivel Bajo
  // 40 - 55: Promedio (Manejo normativo)
  // 56 - 70: Nivel Alto (Dificultades evidentes en control emocional e impulsos)
  // 71 - 80: Nivel Muy Alto (Requiere revisión clínica previa)
  let nivel = 'Promedio';
  let nivelDescripcion = 'Manejo normativo de emociones.';
  let isApproved = true;

  if (totalScore <= 28) {
    nivel = 'Muy Bajo';
    nivelDescripcion = 'Excelente control emocional y estabilidad.';
    isApproved = true;
  } else if (totalScore <= 39) {
    nivel = 'Bajo';
    nivelDescripcion = 'Buen control emocional, baja dificultad.';
    isApproved = true;
  } else if (totalScore <= 55) {
    nivel = 'Promedio';
    nivelDescripcion = 'Manejo normativo de emociones (Apto para el servicio).';
    isApproved = true;
  } else if (totalScore <= 70) {
    nivel = 'Alto';
    nivelDescripcion = 'Dificultades evidentes en control emocional e impulsos.';
    isApproved = false;
  } else {
    nivel = 'Muy Alto';
    nivelDescripcion = 'Requiere revisión clínica o intervención terapéutica previa.';
    isApproved = false;
  }

  const statusLabel = isApproved ? 'APROBADO' : 'NO APROBADO';
  const percentage = Math.max(0, Math.min(100, Math.round(((80 - totalScore) / (80 - 16)) * 100)));

  return {
    totalScore, // 16 a 80
    minScore: 16,
    maxScore: 80,
    nivel,
    nivelDescripcion,
    isApproved,
    statusLabel,
    percentage,
    subscores,
    subpercentages: {
      reaccion_negativa: Math.round(((20 - subscores.reaccion_negativa) / 16) * 100),
      no_aceptacion: Math.round(((20 - subscores.reaccion_negativa) / 16) * 100),
      metas_tareas: Math.round(((15 - subscores.metas_tareas) / 12) * 100),
      metas: Math.round(((15 - subscores.metas_tareas) / 12) * 100),
      control_impulsos: Math.round(((15 - subscores.control_impulsos) / 12) * 100),
      impulsos: Math.round(((15 - subscores.control_impulsos) / 12) * 100),
      estrategias_reg: Math.round(((20 - subscores.estrategias_reg) / 16) * 100),
      estrategias: Math.round(((20 - subscores.estrategias_reg) / 16) * 100),
      claridad_emocional: Math.round(((10 - subscores.claridad_emocional) / 8) * 100),
      claridad: Math.round(((10 - subscores.claridad_emocional) / 8) * 100)
    }
  };
}

export function calculatePssScore(answers) {
  // Ítems directos (7): 1, 2, 3, 8, 11, 12, 14 (suman 0 a 4)
  // Ítems inversos (7): 4, 5, 6, 7, 9, 10, 13 (4->0, 3->1, 2->2, 1->3, 0->4)
  const directItems = [1, 2, 3, 8, 11, 12, 14];
  const reverseItems = [4, 5, 6, 7, 9, 10, 13];

  let directSum = 0;
  let reverseComputedSum = 0;
  let rawInverseSum = 0; // Para control de mentira / inconsistencia

  for (let i = 1; i <= 14; i++) {
    const rawVal = Number(answers[`pss_${i}`]) || 0;

    if (directItems.includes(i)) {
      directSum += rawVal;
    } else if (reverseItems.includes(i)) {
      rawInverseSum += rawVal;
      const inverted = 4 - rawVal;
      reverseComputedSum += inverted;
    }
  }

  const totalScore = directSum + reverseComputedSum; // 0 a 56

  // Baremos oficiales sobre 56:
  // 0 – 26: Nivel bajo de estrés
  // 27 – 40: Nivel moderado / promedio
  // 41 – 56: Nivel alto de estrés percibido
  let nivelEstres = 'Bajo';
  let nivelDescripcion = 'Buen manejo y tolerancia al estrés cotidiano.';

  if (totalScore >= 27 && totalScore <= 40) {
    nivelEstres = 'Moderado / Promedio';
    nivelDescripcion = 'Nivel medio de estrés. Resistencia adecuada con momentos de tensión.';
  } else if (totalScore > 40) {
    nivelEstres = 'Alto';
    nivelDescripcion = 'Nivel alto de estrés percibido (riesgo de insomnio, ansiedad o desbordamiento).';
  }

  // Escala de control / detección de inconsistencia o distorsión
  // Si respondió 4 a todas o 0 a todas en ambas escalas
  const directAvg = directSum / 7;
  const rawInverseAvg = rawInverseSum / 7;
  const posibleInconsistencia = (directAvg >= 3.2 && rawInverseAvg >= 3.2) || (directAvg <= 0.8 && rawInverseAvg <= 0.8);

  const resiliencePercentage = Math.max(0, Math.min(100, Math.round(((56 - totalScore) / 56) * 100)));

  return {
    totalScore,
    minScore: 0,
    maxScore: 56,
    directSum,
    reverseComputedSum,
    rawInverseSum,
    nivelEstres,
    nivelDescripcion,
    resiliencePercentage,
    posibleInconsistencia,
    subpercentages: {
      sobrecarga: Math.max(0, Math.min(100, Math.round(((28 - directSum) / 28) * 100))),
      autoeficacia: Math.max(0, Math.min(100, Math.round((reverseComputedSum / 28) * 100)))
    }
  };
}

export function calculateCopeScore(answers) {
  // Macro-dimensiones según las instrucciones oficiales del psicólogo:
  // Adaptativo (16 ítems): 1, 2, 3, 6, 7, 9, 10, 14, 16, 17, 18, 19, 20, 21, 26, 28 (max 48)
  // Potencialmente No Adaptativo (12 ítems): 4, 5, 8, 11, 12, 13, 15, 22, 23, 24, 25, 27 (max 36)
  const adaptativeItems = [1, 2, 3, 6, 7, 9, 10, 14, 16, 17, 18, 19, 20, 21, 26, 28];
  const noAdaptativeItems = [4, 5, 8, 11, 12, 13, 15, 22, 23, 24, 25, 27];

  let adaptativeScore = 0;
  let noAdaptativeScore = 0;

  adaptativeItems.forEach(num => {
    adaptativeScore += (Number(answers[`cope_${num}`]) || 0);
  });

  noAdaptativeItems.forEach(num => {
    noAdaptativeScore += (Number(answers[`cope_${num}`]) || 0);
  });

  const adaptativeMax = 48;
  const noAdaptativeMax = 36;

  const adaptativePercentage = Math.round((adaptativeScore / adaptativeMax) * 100);
  const noAdaptativePercentage = Math.round((noAdaptativeScore / noAdaptativeMax) * 100);

  // Criterio del psicólogo: Comparativa entre ambas macro-dimensiones
  let balanceAfrontamiento = 'Favorable';
  let balanceDescripcion = 'Predominio de estrategias adaptativas y funcionales para resolver problemas.';

  if (noAdaptativePercentage > adaptativePercentage) {
    balanceAfrontamiento = 'Desfavorable / Riesgo';
    balanceDescripcion = 'Predominio de conductas evasivas, desenganche o riesgo ante la presión.';
  } else if (adaptativePercentage - noAdaptativePercentage < 15) {
    balanceAfrontamiento = 'Mixto / Observación';
    balanceDescripcion = 'Recursos adaptativos presentes pero acompañados de evasión en momentos difíciles.';
  }

  // Alerta de distorsión / respuestas inconsistentes (ambas escalas muy altas)
  const alertaDistorsion = adaptativePercentage >= 75 && noAdaptativePercentage >= 65;

  return {
    adaptativeScore,
    adaptativeMax,
    adaptativePercentage,
    noAdaptativeScore,
    noAdaptativeMax,
    noAdaptativePercentage,
    balanceAfrontamiento,
    balanceDescripcion,
    alertaDistorsion,
    subpercentages: {
      adaptativo: adaptativePercentage,
      no_adaptativo: noAdaptativePercentage,
      activo_plan: Math.min(100, Math.round((adaptativeScore / adaptativeMax) * 100)),
      apoyo_social: Math.min(100, Math.round((adaptativeScore / adaptativeMax) * 100)),
      reevaluacion_aceptacion: Math.min(100, Math.round((adaptativeScore / adaptativeMax) * 100)),
      humor_espiritualidad: Math.min(100, Math.round((adaptativeScore / adaptativeMax) * 100)),
      distraccion_desahogo: Math.min(100, Math.round((noAdaptativeScore / noAdaptativeMax) * 100)),
      evasion_riesgo: noAdaptativePercentage
    }
  };
}

export function calculateGlobalResults(answers) {
  const ders = calculateDersScore(answers);
  const pss = calculatePssScore(answers);
  const cope = calculateCopeScore(answers);

  // Índice Global de Confiabilidad e Idoneidad SAHER (%)
  // 50% Regulación e Impulsos (DERS-16), 25% PSS-14, 25% COPE Adaptativo
  let trustIndex = (ders.percentage * 0.50) + (pss.resiliencePercentage * 0.25) + (cope.adaptativePercentage * 0.25);
  trustIndex = Number(trustIndex.toFixed(1));

  const riskIndex = Number((100 - trustIndex).toFixed(1));

  // Aprobación oficial según baremo DERS-16 (16-55 Aprobado, 56-80 No Aprobado)
  const isApproved = ders.isApproved;
  const certificationStatus = isApproved ? 'APROBADO' : 'NO APROBADO';

  let tier = 'Certificación Plena de Confianza SAHER';
  if (!isApproved) {
    tier = ders.totalScore >= 71 
      ? 'No Aprobado / Requiere Intervención Clínica Previa' 
      : 'No Aprobado / Dificultad Evidente en Control de Impulsos';
  } else if (trustIndex >= 85) {
    tier = 'Nivel Sobresaliente / Idóneo para Custodia y Escoltas';
  } else if (trustIndex >= 70) {
    tier = 'Nivel Estándar / Guardia de Seguridad Confiable';
  } else {
    tier = 'Aprobado con Observaciones de Seguimiento';
  }

  const foda = generateSWOT(ders, pss, cope, trustIndex);

  return {
    trustIndex,
    riskIndex,
    isApproved,
    certificationStatus,
    tier,
    ders,
    pss,
    cope,
    foda
  };
}

function generateSWOT(ders, pss, cope, trustIndex) {
  const fortalezas = [];
  const oportunidades = [];
  const debilidades = [];
  const amenazas = [];

  // DERS-16
  if (ders.isApproved) {
    fortalezas.push(`Puntaje DERS-16 de ${ders.totalScore}/80 (${ders.nivel}): cumple con el baremo normativo (16 a 55 pts) para portar armamento y prestar servicio.`);
    fortalezas.push('Adecuada capacidad para dominar impulsos y reaccionar con prudencia y disciplina operativa.');
  } else {
    debilidades.push(`Puntaje DERS-16 de ${ders.totalScore}/80 (${ders.nivel}): supera el límite de aprobación (55 pts), evidenciando dificultades para regular emociones intensas.`);
    amenazas.push('Riesgo de reactividad desmedida, descontrol de impulsos o pérdida de concentración durante eventos críticos.');
  }

  // PSS-14
  if (pss.totalScore <= 26) {
    fortalezas.push(`Estrés percibido Bajo (${pss.totalScore}/56): alta tolerancia y autoeficacia para afrontar situaciones imprevistas en guardia.`);
  } else if (pss.totalScore <= 40) {
    debilidades.push(`Estrés Moderado (${pss.totalScore}/56): experimenta tensión en momentos de alta exigencia.`);
  } else {
    debilidades.push(`Estrés percibido Alto (${pss.totalScore}/56): sintomatología de sobrecarga o tensión acumulada.`);
    amenazas.push('Vulnerabilidad a fatiga crónica (burnout), somatización o fallas de atención en turnos prolongados.');
  }

  // OPORTUNIDADES DE ENTRENAMIENTO (Siempre nutridas y contextualizadas a SAHER)
  oportunidades.push('Entrenamiento continuo en técnicas de mediación verbal y resolución pacífica de altercados.');
  oportunidades.push('Capacitación táctica en simulacros de reacción armada y manejo de crisis bajo estrés.');
  if (pss.totalScore <= 26) {
    oportunidades.push('Aspirar a cursos avanzados de especialización en Custodia de Valores o Protección VIP (Escoltas).');
  } else {
    oportunidades.push('Implementar protocolos de respiración táctica y pausas activas durante relevos de guardia.');
  }
  if (cope.adaptativePercentage < 75) {
    oportunidades.push('Reforzar los canales de reporte y apego estricto a la cadena de mando ante contingencias.');
  }

  // COPE-28
  if (cope.adaptativePercentage >= 60) {
    fortalezas.push(`Afrontamiento Adaptativo elevado (${cope.adaptativeScore}/${cope.adaptativeMax} pts): se orienta a la resolución directa de problemas y respeto a la cadena de mando.`);
  } else {
    oportunidades.push('Reforzar el hábito de consultar oportunamente con supervisores ante contingencias complejas.');
  }

  if (cope.noAdaptativePercentage <= 30) {
    fortalezas.push('Bajo índice de conductas no adaptativas: no recurre a la evasión, negación o consumo de sustancias como mecanismo de escape.');
  } else {
    debilidades.push(`Presencia de mecanismos no adaptativos (${cope.noAdaptativeScore}/${cope.noAdaptativeMax} pts): tendencia al desenganche conductual o postergación del problema.`);
    amenazas.push('Riesgo de abandono del puesto o evasión de responsabilidades ante crisis bajo presión.');
  }

  if (cope.alertaDistorsion) {
    amenazas.push('Alerta de Inconsistencia Psicométrica: puntajes elevados simultáneamente en conductas opuestas. Requiere entrevista clínica confirmatoria.');
  }

  return {
    fortalezas,
    oportunidades,
    debilidades,
    amenazas,
    conclusionPsicologica: ders.isApproved
      ? `El aspirante/guardia cumple con el baremo de idoneidad psicológica para el servicio de seguridad (DERS-16 = ${ders.totalScore} pts, Nivel ${ders.nivel}). Muestra estabilidad afectiva, control de impulsos y estrategias de afrontamiento funcionales.`
      : `El aspirante/guardia NO cumple con el baremo de aprobación para el servicio (DERS-16 = ${ders.totalScore} pts, Nivel ${ders.nivel}). Se recomienda suspender asignación de funciones operativas críticas y derivar a proceso de orientación o retest posterior.`
  };
}

// Función auxiliar para que el psicólogo audite cada una de las 58 preguntas y respuestas
export function getDetailedQuestionAudit(answers) {
  const audit = [];

  TESTS.forEach(test => {
    test.questions.forEach(q => {
      const rawVal = answers[q.id];
      const hasAnswer = rawVal !== undefined && rawVal !== null && rawVal !== '';
      const numVal = hasAnswer ? Number(rawVal) : null;
      
      let optionLabel = 'Sin responder';
      if (hasAnswer) {
        const foundOpt = test.options.find(o => o.value === numVal);
        optionLabel = foundOpt ? foundOpt.label : String(numVal);
      }

      let computedValue = numVal;
      if (test.id === 'pss14' && q.reversed && hasAnswer) {
        computedValue = 4 - numVal;
      }

      audit.push({
        testId: test.id,
        testTitle: test.title,
        testNumber: test.number,
        questionId: q.id,
        questionNum: q.num,
        text: q.text,
        hasAnswer,
        rawValue: numVal,
        optionLabel,
        isReversed: !!q.reversed,
        computedValue,
        subdim: q.subdim || q.macro,
        isRisk: !!q.isRisk
      });
    });
  });

  return audit;
}
