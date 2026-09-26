// Banco de preguntas y configuraciones psicométricas oficiales para SAHER
// Batería: DERS-16, PSS-14, COPE-28 con baremos oficiales y claves de corrección

export const TESTS = [
  {
    id: 'ders16',
    number: 1,
    title: 'DERS-16: Regulación Emocional y Control de Impulsos',
    shortTitle: 'Regulación Emocional (DERS-16)',
    subtitle: 'Escala Breve de Dificultades en la Regulación Emocional (16 ítems)',
    citation: 'Bjureberg et al. (2016)',
    badge: '16 Ítems · Escala 1 a 5 · Rango: 16 a 80 pts',
    description: 'Evalúa la capacidad del aspirante para modular respuestas emocionales negativas, tolerar la frustración, mantener la concentración en el servicio y no actuar de forma impulsiva.',
    scaleInstruction: 'Indica con qué frecuencia se aplican a ti las siguientes afirmaciones (del 1 al 5):',
    scaleType: '1-5',
    options: [
      { value: 1, label: '1 · Casi nunca' },
      { value: 2, label: '2 · A veces' },
      { value: 3, label: '3 · Aproximadamente la mitad de las veces' },
      { value: 4, label: '4 · La mayor parte del tiempo' },
      { value: 5, label: '5 · Casi siempre' }
    ],
    baremos: [
      { min: 16, max: 28, nivel: 'Muy Bajo', aprobado: true, desc: 'Excelente control emocional y estabilidad.' },
      { min: 29, max: 39, nivel: 'Bajo', aprobado: true, desc: 'Buen control emocional, baja dificultad.' },
      { min: 40, max: 55, nivel: 'Promedio', aprobado: true, desc: 'Manejo normativo y estándar de emociones.' },
      { min: 56, max: 70, nivel: 'Alto', aprobado: false, desc: 'Dificultades evidentes en control emocional e impulsos.' },
      { min: 71, max: 80, nivel: 'Muy Alto', aprobado: false, desc: 'Requiere revisión clínica o intervención terapéutica previa.' }
    ],
    subdimensions: [
      { id: 'reaccion_negativa', name: '1. Reacción frente a emociones negativas', items: [9, 10, 13, 14], description: 'Cómo reacciona la persona ante la tristeza, enojo o vergüenza.' },
      { id: 'metas_tareas', name: '2. Capacidad de realizar tareas y concentrarse ante el malestar', items: [3, 7, 15], description: 'Capacidad de seguir funcionando y cumplir el servicio aun sintiendo tensión.' },
      { id: 'control_impulsos', name: '3. Dificultades en el control de impulsos', items: [4, 8, 11], description: 'Dominio de la conducta y prevención de actos agresivos o descontrolados.' },
      { id: 'estrategias_reg', name: '4. Acceso limitado a estrategias de regulación', items: [5, 6, 12, 16], description: 'Recursos personales para recuperar la calma y serenidad operativa.' },
      { id: 'claridad_emocional', name: '5. Claridad emocional (reconocimiento consciente)', items: [1, 2], description: 'Saber identificar y dar sentido nítido a lo que se siente.' }
    ],
    questions: [
      { id: 'ders_1', num: 1, text: 'Me cuesta dar sentido a mis sentimientos.', subdim: 'claridad_emocional' },
      { id: 'ders_2', num: 2, text: 'Estoy confundido/a sobre cómo me siento.', subdim: 'claridad_emocional' },
      { id: 'ders_3', num: 3, text: 'Cuando estoy alterado/a, me cuesta hacer mi trabajo.', subdim: 'metas_tareas' },
      { id: 'ders_4', num: 4, text: 'Cuando estoy alterado/a, pierdo el control.', subdim: 'control_impulsos' },
      { id: 'ders_5', num: 5, text: 'Cuando estoy alterado/a, creo que me sentiré así durante mucho tiempo.', subdim: 'estrategias_reg' },
      { id: 'ders_6', num: 6, text: 'Cuando estoy alterado/a, creo que acabaré sintiéndome muy deprimido/a.', subdim: 'estrategias_reg' },
      { id: 'ders_7', num: 7, text: 'Cuando estoy alterado/a, me cuesta concentrarme en otras cosas.', subdim: 'metas_tareas' },
      { id: 'ders_8', num: 8, text: 'Cuando estoy alterado/a, me siento fuera de control.', subdim: 'control_impulsos' },
      { id: 'ders_9', num: 9, text: 'Cuando estoy alterado/a, me da vergüenza sentirme así.', subdim: 'reaccion_negativa' },
      { id: 'ders_10', num: 10, text: 'Cuando estoy alterado/a, me siento débil.', subdim: 'reaccion_negativa' },
      { id: 'ders_11', num: 11, text: 'Cuando estoy alterado/a, me cuesta controlar mi comportamiento.', subdim: 'control_impulsos' },
      { id: 'ders_12', num: 12, text: 'Cuando estoy alterado/a, creo que no hay nada que pueda hacer para sentirme mejor.', subdim: 'estrategias_reg' },
      { id: 'ders_13', num: 13, text: 'Cuando estoy alterado/a, me irrito conmigo mismo/a por sentirme así.', subdim: 'reaccion_negativa' },
      { id: 'ders_14', num: 14, text: 'Cuando estoy alterado/a, empiezo a sentirme muy mal conmigo mismo/a.', subdim: 'reaccion_negativa' },
      { id: 'ders_15', num: 15, text: 'Cuando estoy alterado/a, me cuesta pensar en otra cosa.', subdim: 'metas_tareas' },
      { id: 'ders_16', num: 16, text: 'Cuando estoy alterado/a, mis emociones me resultan abrumadoras.', subdim: 'estrategias_reg' }
    ]
  },
  {
    id: 'pss14',
    number: 2,
    title: 'PSS-14: Percepción del Estrés',
    shortTitle: 'Percepción del Estrés (PSS)',
    subtitle: 'Escala de Estrés Percibido (14 ítems: 7 directos, 7 inversos)',
    citation: 'Cohen, Kamarck & Mermelstein (1983)',
    badge: '14 Ítems · Escala 0 a 4 · Rango: 0 a 56 pts',
    description: 'Mide el grado de estrés experimentado ante eventos cotidianos y laborales (evaluación de riesgo de desbordamiento y burnout).',
    scaleInstruction: 'En el último mes, indica con qué frecuencia has pensado o sentido de esta manera (del 0 al 4):',
    scaleType: '0-4',
    options: [
      { value: 0, label: '0 · Nunca' },
      { value: 1, label: '1 · Casi nunca' },
      { value: 2, label: '2 · De vez en cuando' },
      { value: 3, label: '3 · A menudo' },
      { value: 4, label: '4 · Muy a menudo' }
    ],
    baremos: [
      { min: 0, max: 26, nivel: 'Bajo', desc: 'Nivel bajo de estrés. Buen control ante la presión cotidiana.' },
      { min: 27, max: 40, nivel: 'Moderado / Promedio', desc: 'Nivel medio de estrés. Manejo regular con momentos de tensión.' },
      { min: 41, max: 56, nivel: 'Alto', desc: 'Nivel alto de estrés percibido (riesgo de insomnio, ansiedad o desbordamiento en guardia).' }
    ],
    subdimensions: [
      { id: 'directa', name: 'Escala Directa (Sobrecarga y Tensión)', items: [1, 2, 3, 8, 11, 12, 14], type: 'direct', description: 'Reactivos que expresan descontrol y tensión cotidiana (suman 0 a 4).' },
      { id: 'inversa', name: 'Escala Inversa (Afrontamiento y Dominio)', items: [4, 5, 6, 7, 9, 10, 13], type: 'inverse', description: 'Reactivos que expresan control positivo (califican al revés: 4→0, 3→1, 2→2, 1→3, 0→4).' }
    ],
    questions: [
      { id: 'pss_1', num: 1, text: 'En el último mes, ¿con qué frecuencia ha estado afectado/a por algo que ocurrió inesperadamente?', reversed: false, subdim: 'directa' },
      { id: 'pss_2', num: 2, text: 'En el último mes, ¿con qué frecuencia ha sentido que no podía controlar las cosas importantes en su vida?', reversed: false, subdim: 'directa' },
      { id: 'pss_3', num: 3, text: 'En el último mes, ¿con qué frecuencia ha estado nervioso/a o estresado/a?', reversed: false, subdim: 'directa' },
      { id: 'pss_4', num: 4, text: 'En el último mes, ¿con qué frecuencia ha manejado con éxito los pequeños problemas irritantes de la vida?', reversed: true, subdim: 'inversa' },
      { id: 'pss_5', num: 5, text: 'En el último mes, ¿con qué frecuencia ha sentido que ha afrontado con éxito los cambios importantes en su vida?', reversed: true, subdim: 'inversa' },
      { id: 'pss_6', num: 6, text: 'En el último mes, ¿con qué frecuencia ha estado seguro/a sobre su capacidad para manejar sus problemas personales?', reversed: true, subdim: 'inversa' },
      { id: 'pss_7', num: 7, text: 'En el último mes, ¿con qué frecuencia ha sentido que las cosas le van bien?', reversed: true, subdim: 'inversa' },
      { id: 'pss_8', num: 8, text: 'En el último mes, ¿con qué frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?', reversed: false, subdim: 'directa' },
      { id: 'pss_9', num: 9, text: 'En el último mes, ¿con qué frecuencia ha podido controlar las dificultades de su vida?', reversed: true, subdim: 'inversa' },
      { id: 'pss_10', num: 10, text: 'En el último mes, ¿con qué frecuencia ha sentido que tenía todo bajo control?', reversed: true, subdim: 'inversa' },
      { id: 'pss_11', num: 11, text: 'En el último mes, ¿con qué frecuencia ha estado enfadado/a porque las cosas que le ocurrían estaban fuera de su control?', reversed: false, subdim: 'directa' },
      { id: 'pss_12', num: 12, text: 'En el último mes, ¿con qué frecuencia ha pensado en las cosas que todavía le quedan por hacer de manera abrumadora?', reversed: false, subdim: 'directa' },
      { id: 'pss_13', num: 13, text: 'En el último mes, ¿con qué frecuencia ha podido controlar la forma de pasar su tiempo?', reversed: true, subdim: 'inversa' },
      { id: 'pss_14', num: 14, text: 'En el último mes, ¿con qué frecuencia ha sentido que las dificultades se acumulaban tanto que no podía superarlas?', reversed: false, subdim: 'directa' }
    ]
  },
  {
    id: 'cope28',
    number: 3,
    title: 'COPE-28: Cuestionario Breve de Afrontamiento',
    shortTitle: 'Estrategias de Afrontamiento (COPE-28)',
    subtitle: 'Afrontamiento Adaptativo vs Potencialmente No Adaptativo (28 ítems)',
    citation: 'Carver (Brief-COPE)',
    badge: '28 Ítems · Escala 0 a 3 · 2 Macro-Dimensiones',
    description: 'Evalúa qué hace el guardia frente al estrés: si emplea recursos funcionales y resolución directa, o recurre a evasión, desenganche o consumo de sustancias.',
    scaleInstruction: 'Ponga el número que mejor refleja su propia forma de enfrentarse a problemas o situaciones difíciles (del 0 al 3):',
    scaleType: '0-3',
    options: [
      { value: 0, label: '0 · En absoluto' },
      { value: 1, label: '1 · Un poco' },
      { value: 2, label: '2 · Bastante' },
      { value: 3, label: '3 · Mucho' }
    ],
    macroDimensions: [
      {
        id: 'adaptativo',
        name: 'Afrontamiento Adaptativo (16 ítems)',
        items: [1, 2, 3, 6, 7, 9, 10, 14, 16, 17, 18, 19, 20, 21, 26, 28],
        maxScore: 48,
        description: 'Recursos funcionales, planificación, búsqueda de apoyo y resolución activa de problemas.'
      },
      {
        id: 'no_adaptativo',
        name: 'Afrontamiento Potencialmente No Adaptativo (12 ítems)',
        items: [4, 5, 8, 11, 12, 13, 15, 22, 23, 24, 25, 27],
        maxScore: 36,
        description: 'Conductas de riesgo: desenganche conductual, negación, autoinculpación excesiva y consumo de alcohol/sustancias.'
      }
    ],
    questions: [
      { id: 'cope_1', num: 1, text: 'Intento conseguir que alguien me ayude o aconseje sobre qué hacer.', macro: 'adaptativo' },
      { id: 'cope_2', num: 2, text: 'Concentro mis esfuerzos en hacer algo sobre la situación en la que estoy.', macro: 'adaptativo' },
      { id: 'cope_3', num: 3, text: 'Acepto la realidad de lo que ha sucedido.', macro: 'adaptativo' },
      { id: 'cope_4', num: 4, text: 'Recurro al trabajo o a otras actividades para apartar las cosas de mi mente.', macro: 'no_adaptativo' },
      { id: 'cope_5', num: 5, text: 'Me digo a mí mismo/a: «Esto no es real».', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_6', num: 6, text: 'Intento proponer una estrategia sobre qué hacer.', macro: 'adaptativo' },
      { id: 'cope_7', num: 7, text: 'Hago bromas sobre ello.', macro: 'adaptativo' },
      { id: 'cope_8', num: 8, text: 'Me critico a mí mismo/a.', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_9', num: 9, text: 'Consigo apoyo emocional de otros.', macro: 'adaptativo' },
      { id: 'cope_10', num: 10, text: 'Tomo medidas para intentar que la situación mejore.', macro: 'adaptativo' },
      { id: 'cope_11', num: 11, text: 'Renuncio a intentar ocuparme de ello.', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_12', num: 12, text: 'Digo cosas para dar rienda suelta a mis sentimientos desagradables.', macro: 'no_adaptativo' },
      { id: 'cope_13', num: 13, text: 'Me niego a creer que haya sucedido.', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_14', num: 14, text: 'Intento verlo con otros ojos, para hacer que parezca más positivo.', macro: 'adaptativo' },
      { id: 'cope_15', num: 15, text: 'Utilizo alcohol u otras drogas para hacerme sentir mejor.', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_16', num: 16, text: 'Intento encontrar consuelo en mi religión o creencias espirituales.', macro: 'adaptativo' },
      { id: 'cope_17', num: 17, text: 'Consigo el consuelo y la comprensión de alguien.', macro: 'adaptativo' },
      { id: 'cope_18', num: 18, text: 'Busco algo bueno en lo que está sucediendo.', macro: 'adaptativo' },
      { id: 'cope_19', num: 19, text: 'Me río de la situación.', macro: 'adaptativo' },
      { id: 'cope_20', num: 20, text: 'Rezo o medito.', macro: 'adaptativo' },
      { id: 'cope_21', num: 21, text: 'Aprendo a vivir con ello.', macro: 'adaptativo' },
      { id: 'cope_22', num: 22, text: 'Hago algo para pensar menos en ello, tal como ir al cine o ver la televisión.', macro: 'no_adaptativo' },
      { id: 'cope_23', num: 23, text: 'Expreso mis sentimientos negativos.', macro: 'no_adaptativo' },
      { id: 'cope_24', num: 24, text: 'Utilizo alcohol u otras drogas para ayudarme a superarlo.', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_25', num: 25, text: 'Renuncio al intento de hacer frente al problema.', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_26', num: 26, text: 'Pienso detenidamente sobre los pasos a seguir.', macro: 'adaptativo' },
      { id: 'cope_27', num: 27, text: 'Me hago eco de la culpa de lo que ha sucedido.', macro: 'no_adaptativo', isRisk: true },
      { id: 'cope_28', num: 28, text: 'Consigo que otras personas me ayuden o aconsejen.', macro: 'adaptativo' }
    ]
  }
];

export const TOTAL_QUESTIONS = TESTS.reduce((acc, test) => acc + test.questions.length, 0); // 16 + 14 + 28 = 58
