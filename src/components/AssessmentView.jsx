import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Check, Save, ArrowRight, 
  ArrowLeft, Info, Shield, ShieldCheck, CheckCircle2,
  Clock, AlertTriangle, ShieldAlert, BookOpen, HelpCircle
} from 'lucide-react';
import { TESTS, TOTAL_QUESTIONS } from '../data/questionsData';
import { calculateDersScore } from '../data/scoringEngine';

// Guía rápida y educativa en la cabecera de cada bloque
const BLOCK_GUIDES = {
  ders16: {
    tag: 'BLOQUE 1 • REGULACIÓN EMOCIONAL Y CONTROL DE IMPULSOS',
    title: '¿Qué significa cada opción en el DERS-16? (Escala 1 al 5)',
    description: 'Evalúa la frecuencia con la que experimentas dificultades para modular emociones y contener impulsos. Menor puntaje = Mayor autocontrol (Aprobado de 16 a 55 puntos).',
    tip: '💡 Elige según la frecuencia real con la que te ocurre cada situación (1 = Casi nunca a 5 = Casi siempre).',
    options: [
      { val: '1', label: 'Casi nunca', desc: '0% a 10% de las veces. Rara vez o casi nunca te ocurre.', color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900' },
      { val: '2', label: 'A veces', desc: '11% a 35% de las veces. Ocurre en pocas ocasiones esporádicas.', color: 'border-emerald-200 bg-white text-slate-800' },
      { val: '3', label: 'La mitad de las veces', desc: 'Aproximadamente 50% de las veces ante malestar.', color: 'border-amber-200 bg-amber-50/40 text-amber-900' },
      { val: '4', label: 'La mayor parte del tiempo', desc: '66% a 90% de las veces. Es una reacción habitual en ti.', color: 'border-red-200 bg-red-50/40 text-red-900' },
      { val: '5', label: 'Casi siempre', desc: '91% a 100% de las veces. Es tu respuesta casi constante.', color: 'border-red-300 bg-red-100/60 text-red-950 font-black' }
    ]
  },
  pss14: {
    tag: 'BLOQUE 2 • TOLERANCIA Y PERCEPCIÓN DEL ESTRÉS',
    title: '¿Qué significa cada opción en el PSS-14? (Escala 0 al 4)',
    description: 'Evalúa cómo has percibido las demandas y tensiones durante el ÚLTIMO MES. Contiene preguntas directas e inversas para verificar coherencia y autoeficacia.',
    tip: '💡 Responde considerando exclusivamente lo vivido durante el ÚLTIMO MES (0 = Nunca a 4 = Muy a menudo).',
    options: [
      { val: '0', label: 'Nunca', desc: 'En ningún momento del último mes te ha sucedido.', color: 'border-slate-300 bg-white text-slate-800' },
      { val: '1', label: 'Casi nunca', desc: 'Solo 1 o 2 veces en todo el mes.', color: 'border-slate-300 bg-white text-slate-800' },
      { val: '2', label: 'De vez en cuando', desc: 'Ocasionalmente (tres o cuatro veces en el mes).', color: 'border-amber-200 bg-amber-50/40 text-amber-900' },
      { val: '3', label: 'A menudo', desc: 'Varias veces por semana de forma repetida.', color: 'border-amber-300 bg-amber-100/60 text-amber-950' },
      { val: '4', label: 'Muy a menudo', desc: 'Casi a diario o permanentemente.', color: 'border-red-300 bg-red-100/60 text-red-950 font-black' }
    ]
  },
  cope28: {
    tag: 'BLOQUE 3 • ESTRATEGIAS DE AFRONTAMIENTO OPERATIVO',
    title: '¿Qué significa cada opción en el COPE-28? (Escala 0 al 3)',
    description: 'Evalúa las conductas y acciones concretas que tomas ante situaciones críticas o problemas difíciles. Mide el predominio de estrategias adaptativas frente a evasión.',
    tip: '⚠️ RECORDATORIO VITAL: "En absoluto" significa NUNCA. Jamás haces eso ni de ninguna manera.',
    options: [
      { val: '0', label: 'En absoluto (NUNCA)', desc: 'Significa NUNCA. Jamás haces eso, nada, de ninguna manera.', color: 'border-black bg-black text-amber-400 font-black shadow-xs' },
      { val: '1', label: 'Un poco', desc: 'Rara vez o en mínima medida en situaciones aisladas.', color: 'border-slate-300 bg-white text-slate-800' },
      { val: '2', label: 'Bastante', desc: 'Frecuentemente, de forma habitual o como conducta regular.', color: 'border-emerald-200 bg-emerald-50/60 text-emerald-950' },
      { val: '3', label: 'Mucho', desc: 'Siempre o en gran medida; es tu método principal de respuesta.', color: 'border-emerald-400 bg-emerald-100 text-emerald-950 font-black' }
    ]
  }
};

export default function AssessmentView({
  candidate,
  answers,
  onAnswerChange,
  onSaveDraft,
  onSubmitEvaluation,
  onBackToProfile
}) {
  // Cronómetro de 20 minutos (1200 segundos)
  const [timeLeft, setTimeLeft] = useState(1200);
  const [activeStepTab, setActiveStepTab] = useState('ders16');
  const [openBlocks, setOpenBlocks] = useState({
    ders16: true,
    pss14: true,
    cope28: true
  });
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Efecto del cronómetro regresivo de 20 minutos
  useEffect(() => {
    if (timeLeft <= 0) {
      alert('¡El tiempo límite oficial de 20 minutos ha finalizado! Su evaluación se enviará automáticamente con las respuestas completadas.');
      onSubmitEvaluation();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onSubmitEvaluation]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleBlock = (blockId) => {
    setOpenBlocks(prev => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  // Cantidad de respondidas en total
  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== null && answers[k] !== '').length;
  }, [answers]);

  const percentCompleted = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);
  const isAllAnswered = answeredCount === TOTAL_QUESTIONS;

  // Contador por bloque
  const blockStats = useMemo(() => {
    return TESTS.map(test => {
      const answeredInTest = test.questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '').length;
      return {
        id: test.id,
        answered: answeredInTest,
        total: test.questions.length,
        isCompleted: answeredInTest === test.questions.length
      };
    });
  }, [answers]);

  // Estimación preliminar de confiabilidad
  const estimatedProbability = useMemo(() => {
    const dersAnswered = TESTS[0].questions.filter(q => answers[q.id] !== undefined).length;
    if (dersAnswered < 8) return 50;
    const dersCalc = calculateDersScore(answers);
    return dersCalc.percentage;
  }, [answers]);

  const handleSaveDraftClick = () => {
    onSaveDraft();
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 3000);
  };

  const handleNextStep = (nextTabId) => {
    onSaveDraft();
    setActiveStepTab(nextTabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-32 pt-4 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Barra de progreso superior estilo SAHER con Cronómetro */}
      <div className="bg-white rounded-2xl shadow-sm border-t-2 border-t-red-600 border border-slate-200 p-5 mb-4 sticky top-22 z-30 backdrop-blur-md bg-white/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 font-semibold mb-2 gap-2">
          <div className="flex items-center space-x-2">
            <span>Evaluando a:</span>
            <strong className="text-black text-sm font-black">
              {candidate.nombre} {candidate.apellidos}
            </strong>
            <span className="text-slate-500 font-medium">({candidate.cargo})</span>
          </div>

          {/* Cronómetro oficial de 20 minutos */}
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-xs border ${
              timeLeft > 300
                ? 'bg-black text-amber-400 border-amber-500/40'
                : timeLeft > 120
                ? 'bg-amber-500 text-black border-amber-600 animate-pulse'
                : 'bg-red-600 text-white border-red-700 animate-bounce'
            }`}>
              <Clock className="w-4 h-4 shrink-0" />
              <span>Tiempo: <strong className="font-mono text-sm tracking-wider">{formatTime(timeLeft)}</strong></span>
            </div>

            <div className="text-red-600 font-black text-sm">
              {percentCompleted}%
            </div>
          </div>
        </div>

        {/* Barra de progreso Rojo / Dorado / Esmeralda */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 mt-2 font-medium">
          <span>
            <strong className="text-black font-black">{answeredCount}</strong> de <strong className="text-black">{TOTAL_QUESTIONS}</strong> respondidas
          </span>
          <span>
            Confiabilidad estimada:{' '}
            <strong className="text-emerald-700 font-black">{estimatedProbability}%</strong>
          </span>
        </div>
      </div>

      {/* Banner de Aviso Legal y Evaluación Única */}
      <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>
            <strong>ADVERTENCIA OFICIAL:</strong> Esta prueba es de <strong>intento único</strong>. Al concluir, la credencial temporal quedará inhabilitada. Queda prohibida la adulteración o falsificación bajo sanciones legales.
          </span>
        </div>
        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
          SAHER SEGURIDAD
        </span>
      </div>

      {/* Tabs de secuencia de evaluación solicitada por el psicólogo */}
      <div className="mb-6 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-1.5 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          {TESTS.map(test => {
            const stats = blockStats.find(s => s.id === test.id);
            const isTabActive = activeStepTab === test.id;

            return (
              <button
                key={test.id}
                type="button"
                onClick={() => setActiveStepTab(test.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center space-x-2 cursor-pointer ${
                  isTabActive
                    ? 'bg-black text-amber-400 shadow-sm border border-amber-500/40'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Paso {test.number}: {test.id === 'ders16' ? 'DERS-16' : test.id === 'pss14' ? 'PSS-14' : 'COPE-28'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  stats.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {stats.answered}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setActiveStepTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
            activeStepTab === 'all'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-black'
          }`}
        >
          Ver los 3 juntos
        </button>
      </div>

      {/* Alerta de guardado de borrador */}
      {draftSavedToast && (
        <div className="fixed top-24 right-6 z-50 bg-black text-white border-2 border-amber-400 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4 text-amber-400" />
          <span>¡Progreso guardado con éxito en SAHER!</span>
        </div>
      )}

      {/* Caja de Instrucciones */}
      <div className="bg-white border-l-4 border-l-red-600 border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-xs">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-black text-black">Instrucciones Oficiales SAHER:</strong> Responde cada reactivo con total honestidad. Los 3 cuestionarios se aplican en orden secuencial (Paso 1: DERS-16, Paso 2: PSS-14, Paso 3: COPE-28) para conformar tu perfil de confiabilidad e idoneidad.
          </div>
        </div>
      </div>

      {/* Lista de Bloques del Test filtrados por activeStepTab */}
      <div className="space-y-6">
        {TESTS.filter(t => activeStepTab === 'all' || activeStepTab === t.id).map((test) => {
          const stats = blockStats.find(s => s.id === test.id);
          const isOpen = activeStepTab === 'all' ? openBlocks[test.id] : true;

          return (
            <div
              key={test.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Cabecera del Bloque */}
              <div
                onClick={() => activeStepTab === 'all' && toggleBlock(test.id)}
                className={`p-5 sm:p-6 select-none flex items-center justify-between ${
                  activeStepTab === 'all' ? 'cursor-pointer hover:bg-slate-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Badge B1, B2, B3 en Negro y Dorado */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                    stats.isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-black text-amber-400 border-amber-500/40 shadow-xs'
                  }`}>
                    {stats.isCompleted ? <Check className="w-5 h-5" /> : `B${test.number}`}
                  </div>
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-red-600 uppercase">
                      BLOQUE {test.number} &bull; SAHER
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-black">
                      {test.title}
                    </h2>
                    <p className="text-xs text-slate-500 hidden sm:block font-medium">
                      {test.subtitle} &bull; <span className="font-bold text-red-700">{test.badge}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    stats.isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {stats.answered}/{stats.total}
                  </span>
                  {activeStepTab === 'all' && (
                    <div className="text-slate-400">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                </div>
              </div>

              {/* Contenido de preguntas */}
              {isOpen && (
                <div className="border-t border-slate-100 p-5 sm:p-6 space-y-4 bg-slate-50/40">
                  {/* Guía Explicativa de Respuestas para este Bloque */}
                  {BLOCK_GUIDES[test.id] && (
                    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-red-600 shrink-0" />
                          <span className="text-[11px] font-black uppercase text-red-600 tracking-wider">
                            {BLOCK_GUIDES[test.id].tag}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">
                          Guía de Respuestas del Bloque {test.number}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-black">
                          {BLOCK_GUIDES[test.id].title}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                          {BLOCK_GUIDES[test.id].description}
                        </p>
                      </div>

                      {/* Tarjetas de opciones de respuesta */}
                      <div className={`grid grid-cols-1 ${
                        BLOCK_GUIDES[test.id].options.length === 5 ? 'sm:grid-cols-5' : 'sm:grid-cols-4'
                      } gap-2 pt-1`}>
                        {BLOCK_GUIDES[test.id].options.map(opt => (
                          <div 
                            key={opt.val} 
                            className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${opt.color}`}
                          >
                            <div className="flex items-center space-x-1.5 mb-1">
                              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center font-black text-xs shrink-0">
                                {opt.val}
                              </span>
                              <strong className="text-[11px] font-black leading-tight">
                                {opt.label}
                              </strong>
                            </div>
                            <p className="text-[10px] leading-tight opacity-90">
                              {opt.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Tip recordatorio */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-2">
                        <span>{BLOCK_GUIDES[test.id].tip}</span>
                      </div>
                    </div>
                  )}

                  {test.questions.map(q => {
                    const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isAnswered
                            ? 'bg-white border-slate-300 shadow-2xs'
                            : 'bg-white/80 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <span className="w-6 h-6 rounded-full bg-black text-amber-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                              {q.num}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 leading-snug">
                              {q.text}
                            </span>
                          </div>

                          {/* Select estilizado */}
                          <div className="sm:w-64 shrink-0 pl-9 sm:pl-0">
                            <select
                              value={answers[q.id] !== undefined ? answers[q.id] : ''}
                              onChange={(e) => onAnswerChange(q.id, e.target.value === '' ? undefined : Number(e.target.value))}
                              className={`w-full px-3 py-2 text-xs font-bold rounded-xl border cursor-pointer transition focus:outline-none focus:ring-2 ${
                                isAnswered
                                  ? 'border-red-600 bg-red-50/30 text-black font-extrabold focus:ring-red-600/20'
                                  : 'border-slate-300 bg-white text-slate-500 focus:ring-red-500/20'
                              }`}
                            >
                              <option value="">&mdash; Elige &mdash;</option>
                              {test.options.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Botones de navegación secuencial por paso */}
                  {activeStepTab !== 'all' && (
                    <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                      {test.id === 'ders16' ? (
                        <div className="text-xs text-slate-400 font-medium">
                          Paso 1 de 3 completándose
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleNextStep(test.id === 'pss14' ? 'ders16' : 'pss14')}
                          className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-black text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Volver al Test Anterior</span>
                        </button>
                      )}

                      {test.id === 'ders16' && (
                        <button
                          type="button"
                          onClick={() => handleNextStep('pss14')}
                          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-2 cursor-pointer shadow-md shadow-red-950/20"
                        >
                          <span>Guardar y Pasar al Test 2 (PSS)</span>
                          <ArrowRight className="w-4 h-4 text-amber-300" />
                        </button>
                      )}

                      {test.id === 'pss14' && (
                        <button
                          type="button"
                          onClick={() => handleNextStep('cope28')}
                          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-2 cursor-pointer shadow-md shadow-red-950/20"
                        >
                          <span>Guardar y Pasar al Test 3 (COPE)</span>
                          <ArrowRight className="w-4 h-4 text-amber-300" />
                        </button>
                      )}

                      {test.id === 'cope28' && (
                        <button
                          type="button"
                          disabled={!isAllAnswered}
                          onClick={onSubmitEvaluation}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-md ${
                            isAllAnswered
                              ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-red-950/30'
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span>Finalizar y Ver Diagnóstico Oficial</span>
                          <ArrowRight className="w-4 h-4 text-amber-300" />
                        </button>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Barra de acción inferior flotante estilo SAHER */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0c0d12]/95 backdrop-blur-md border-t-2 border-red-600 p-4 z-40 shadow-2xl text-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-slate-300">
            <div className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black flex items-center space-x-1.5 border ${
              timeLeft > 300 
                ? 'bg-black/80 text-amber-400 border-amber-500/40' 
                : 'bg-red-600 text-white border-red-400 animate-pulse'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <span className="text-slate-600">|</span>
            <span>
              Confiabilidad:{' '}
              <strong className="text-amber-400 font-black text-base">
                {estimatedProbability}%
              </strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-semibold">
              {answeredCount}/{TOTAL_QUESTIONS}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDraftClick}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-black/60 hover:bg-black text-slate-200 text-xs font-bold transition flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Guardar borrador</span>
            </button>

            <div className="relative">
              <button
                type="button"
                disabled={!isAllAnswered}
                onClick={onSubmitEvaluation}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition flex items-center space-x-2 shadow-md border ${
                  isAllAnswered
                    ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer border-red-500 shadow-red-950/40'
                    : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                }`}
              >
                <span>Ver mis resultados</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              {!isAllAnswered && (
                <span className="absolute -bottom-5 right-0 text-[10px] text-red-400 font-bold whitespace-nowrap">
                  Debes completar todas las preguntas ({TOTAL_QUESTIONS - answeredCount} pendientes).
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
