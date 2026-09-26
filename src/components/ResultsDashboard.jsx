import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, ChevronDown, 
  ChevronRight, Sparkles, Printer, FileSpreadsheet, Download, 
  RotateCcw, Lock, Award, ArrowRight, Shield, FileText, Eye,
  ShieldAlert, LogOut
} from 'lucide-react';
import { exportEvaluationsToExcel, exportEvaluationsToJSON } from '../data/storageEngine';
import confetti from 'canvas-confetti';
import StudentAuditModal from './StudentAuditModal';

export default function ResultsDashboard({
  evaluation,
  onStartNewEvaluation,
  onOpenPsychologistReview,
  isPsychologistView = false
}) {
  const { candidate, results, createdAt, id } = evaluation;
  const { trustIndex, riskIndex, isApproved, tier, ders, pss, cope, foda } = results;

  const [showAudit, setShowAudit] = useState(false);

  // Estado para desplegar subdimensiones
  const [expandedDim, setExpandedDim] = useState({
    ders: true,
    pss: false,
    cope: false
  });

  // Disparar confeti si el estudiante aprobó
  useEffect(() => {
    if (isApproved) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#dc2626', '#f59e0b', '#000000', '#10b981']
      });
    }
  }, [isApproved]);

  const toggleDim = (key) => {
    setExpandedDim(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportSingleExcel = () => {
    exportEvaluationsToExcel([evaluation]);
  };

  const handleExportSingleJSON = () => {
    exportEvaluationsToJSON([evaluation]);
  };

  return (
    <>
      <div 
        className={`min-h-screen bg-[#fbfbfc] py-10 px-4 sm:px-6 ${showAudit ? 'no-print print:hidden' : ''}`}
        data-no-print={showAudit ? 'true' : undefined}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-900/5 border-t-4 border-t-red-600 border border-slate-200 p-6 sm:p-12">
        
        {/* Cabecera institucional SAHER - Negro, Rojo, Blanco y Dorado */}
        <div className="border-b-2 border-slate-100 pb-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-[#18181b] to-black border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-md">
                <ShieldCheck className="w-8 h-8 text-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-3xl tracking-wider text-black">
                    SA<span className="text-red-600">HER</span>
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 tracking-widest uppercase border border-amber-300">
                    SEGURIDAD
                  </span>
                </div>
                <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                  ESCUELA PARA GUARDIAS DE SEGURIDAD &bull; CERTIFICACIÓN DE CONFIANZA
                </p>
              </div>
            </div>

            {/* Badge de Aprobación Oficial según regla 16-55 / 56-80 */}
            <div className={`px-5 py-2.5 rounded-2xl flex items-center space-x-2.5 border-2 shadow-sm ${
              isApproved 
                ? 'bg-emerald-50 text-emerald-950 border-emerald-400' 
                : 'bg-red-50 text-red-950 border-red-500'
            }`}>
              {isApproved ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
              )}
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider block text-slate-500">
                  Dictamen Psicométrico DERS-16
                </span>
                <span className={`text-base font-black ${isApproved ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isApproved ? 'APROBADO (16 - 55)' : 'NO APROBADO (56 - 80)'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs font-black tracking-widest text-red-600 uppercase mb-1">
            INFORME DE EVALUACIÓN INDIVIDUAL &bull; SAHER
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
            {candidate.nombre} {candidate.apellidos}
          </h1>

          {/* Meta información del evaluado - 2 Nombres, 2 Apellidos y Cédula */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[10px] uppercase font-black">Nombres (2 Nombres):</span>
              <strong className="text-black font-extrabold text-sm">{candidate.nombre}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[10px] uppercase font-black">Apellidos (2 Apellidos):</span>
              <strong className="text-black font-extrabold text-sm">{candidate.apellidos}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[10px] uppercase font-black">Número de Cédula:</span>
              <strong className="text-red-700 font-extrabold text-sm font-mono">{candidate.cedula}</strong>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 block text-[10px] uppercase font-black">Puesto / Institución:</span>
              <strong className="text-black font-extrabold text-xs block">{candidate.cargo}</strong>
              <span className="text-[10px] text-slate-500 block">{candidate.empresa || 'SAHER Seguridad'}</span>
            </div>
          </div>
        </div>

        {/* Tarjetas Principales de Probabilidad de Éxito / Riesgo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {/* Tarjeta Confiabilidad (Verde Esmeralda con borde) */}
          <div className="bg-[#f0fdf4] border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 text-center shadow-xs">
            <span className="text-[11px] font-black tracking-wider text-emerald-900 uppercase block mb-1">
              PROBABILIDAD DE CONFIANZA / ÉXITO
            </span>
            <div className="text-5xl sm:text-6xl font-black text-emerald-700 tracking-tight my-2">
              {trustIndex}%
            </div>
            <p className="text-xs text-emerald-800 font-bold">
              Promedio ponderado de los tres bloques
            </p>
          </div>

          {/* Tarjeta Riesgo (Rojo Carmesí Corporativo) */}
          <div className="bg-[#fef2f2] border-2 border-red-300 rounded-3xl p-6 sm:p-8 text-center shadow-xs">
            <span className="text-[11px] font-black tracking-wider text-red-950 uppercase block mb-1">
              PROBABILIDAD DE RIESGO CONDUCTUAL
            </span>
            <div className="text-5xl sm:text-6xl font-black text-red-600 tracking-tight my-2">
              {riskIndex}%
            </div>
            <p className="text-xs text-red-800 font-bold">
              1 - probabilidad de confianza
            </p>
          </div>
        </div>

        {/* Barra de Distribución Dual (Éxito vs Riesgo) */}
        <div className="mb-8">
          <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-200 shadow-inner">
            <div
              className="bg-emerald-600 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-black text-white tracking-wider"
              style={{ width: `${trustIndex}%` }}
            >
              {trustIndex >= 15 && `Confiable ${trustIndex}%`}
            </div>
            <div
              className="bg-red-600 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-black text-white tracking-wider"
              style={{ width: `${riskIndex}%` }}
            >
              {riskIndex >= 15 && `Riesgo ${riskIndex}%`}
            </div>
          </div>
        </div>

        {/* Resumen por Bloques (3 Cards con estilo Rojo, Negro y Blanco) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <span className="text-[10px] font-black tracking-widest text-red-600 uppercase block">
              Test 1 &bull; DERS-16
            </span>
            <div className="text-2xl font-black text-black mt-1">
              {ders.totalScore} <span className="text-xs font-bold text-slate-400">/ 80 pts</span>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-0.5">
              Regulación Emocional
            </p>
            <div className="mt-2">
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${
                ders.isApproved ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-red-100 text-red-900 border-red-300'
              }`}>
                {ders.isApproved ? 'Aprobado (16-55)' : 'No Aprobado (56-80)'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <span className="text-[10px] font-black tracking-widest text-amber-700 uppercase block">
              Test 2 &bull; PSS-14
            </span>
            <div className="text-2xl font-black text-black mt-1">
              {pss.totalScore} <span className="text-xs font-bold text-slate-400">/ 56 pts</span>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-0.5">
              Estrés Percibido: <strong className="text-black">{pss.nivelEstres}</strong>
            </p>
            <div className="mt-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300">
                Resiliencia {pss.resiliencePercentage}%
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <span className="text-[10px] font-black tracking-widest text-black uppercase block">
              Test 3 &bull; COPE-28
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {cope.adaptativePercentage}%
            </div>
            <p className="text-xs font-bold text-slate-700 mt-0.5">
              Afrontamiento Operativo
            </p>
            <div className="mt-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800">
                Riesgo evasivo {cope.riskPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Desglose por Dimensión */}
        <div className="mb-12">
          <h3 className="text-xl font-black text-black mb-6 flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-600 rounded-sm"></span>
            <span>Desglose por dimensión psicométrica</span>
          </h3>

          <div className="space-y-6">
            {/* Dimensión 1: DERS-16 */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span className="font-black text-sm text-black">
                    Regulación Emocional y Control de Impulsos (DERS-16)
                  </span>
                </div>
                <span className={`text-sm font-black ${
                  ders.isApproved ? 'text-emerald-700' : 'text-red-600'
                }`}>
                  Puntaje: {ders.totalScore} / 80 ({ders.percentage}% madurez)
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    ders.isApproved ? 'bg-emerald-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${ders.percentage}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => toggleDim('ders')}
                className="text-xs font-black text-slate-600 hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                {expandedDim.ders ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>Ver subdimensiones detalladas</span>
              </button>

              {expandedDim.ders && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Claridad y Comprensión Emocional</span>
                    <strong className="font-black text-black">
                      {ders?.subpercentages?.claridad ?? ders?.subpercentages?.claridad_emocional ?? 75}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Foco en el Deber y Metas bajo Presión</span>
                    <strong className="font-black text-black">
                      {ders?.subpercentages?.metas ?? ders?.subpercentages?.metas_tareas ?? 75}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Control de Impulsos y Conducta Operativa</span>
                    <strong className="font-black text-black">
                      {ders?.subpercentages?.impulsos ?? ders?.subpercentages?.control_impulsos ?? 75}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Estrategias de Auto-regulación y Calma</span>
                    <strong className="font-black text-black">
                      {ders?.subpercentages?.estrategias ?? ders?.subpercentages?.estrategias_reg ?? 75}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Aceptación y Madurez ante el Error</span>
                    <strong className="font-black text-black">
                      {ders?.subpercentages?.no_aceptacion ?? ders?.subpercentages?.reaccion_negativa ?? 75}%
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Dimensión 2: PSS-14 */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span className="font-black text-sm text-black">
                    Percepción y Tolerancia al Estrés (PSS-14)
                  </span>
                </div>
                <span className="text-sm font-black text-amber-700">
                  Resiliencia: {pss?.resiliencePercentage ?? 70}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{ width: `${pss?.resiliencePercentage ?? 70}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => toggleDim('pss')}
                className="text-xs font-black text-slate-600 hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                {expandedDim.pss ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>Ver subdimensiones detalladas</span>
              </button>

              {expandedDim.pss && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Tolerancia a Sobrecarga e Imprevistos</span>
                    <strong className="font-black text-black">
                      {pss?.subpercentages?.sobrecarga ?? 70}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Autoeficacia y Percepción de Control Operativo</span>
                    <strong className="font-black text-black">
                      {pss?.subpercentages?.autoeficacia ?? 75}%
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Dimensión 3: COPE-28 */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-black" />
                  <span className="font-black text-sm text-black">
                    Estrategias de Afrontamiento al Estrés (COPE-28)
                  </span>
                </div>
                <span className="text-sm font-black text-emerald-700">
                  Adaptativo: {cope?.adaptativePercentage ?? 70}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-black transition-all"
                  style={{ width: `${cope?.adaptativePercentage ?? 70}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => toggleDim('cope')}
                className="text-xs font-black text-slate-600 hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                {expandedDim.cope ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <span>Ver subdimensiones detalladas</span>
              </button>

              {expandedDim.cope && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5 text-xs font-semibold">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Afrontamiento Activo y Planificación</span>
                    <strong className="font-black text-emerald-700">
                      {cope?.subpercentages?.activo_plan ?? cope?.adaptativePercentage ?? 70}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Búsqueda de Apoyo y Cadena de Mando</span>
                    <strong className="font-black text-emerald-700">
                      {cope?.subpercentages?.apoyo_social ?? cope?.adaptativePercentage ?? 70}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Reevaluación Positiva y Aceptación</span>
                    <strong className="font-black text-emerald-700">
                      {cope?.subpercentages?.reevaluacion_aceptacion ?? cope?.adaptativePercentage ?? 70}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Resiliencia y Serenidad</span>
                    <strong className="font-black text-emerald-700">
                      {cope?.subpercentages?.humor_espiritualidad ?? cope?.adaptativePercentage ?? 70}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Desahogo y Regulación de Atención</span>
                    <strong className="font-black text-emerald-700">
                      {cope?.subpercentages?.distraccion_desahogo ?? cope?.noAdaptativePercentage ?? 40}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span>Conductas de Evasión / Factores de Riesgo (Negación, Deserción, Sustancias)</span>
                    <strong className="font-black text-red-700">
                      {cope?.subpercentages?.evasion_riesgo ?? cope?.riskPercentage ?? 20}%
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección FODA generada con IA - Rojo, Negro, Blanco y Dorado */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-black text-black">
              Tu FODA Conductual, generado con Inteligencia Artificial
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 font-medium">
            A partir de los resultados psicométricos en DERS-16, PSS y COPE, la IA construye un análisis FODA adaptado a los estándares de confiabilidad de la Escuela de Seguridad SAHER.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Fortalezas */}
            <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-6">
              <h4 className="font-black text-emerald-900 text-sm tracking-wider uppercase mb-3 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Fortalezas Operativas</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-800 leading-relaxed font-semibold">
                {foda.fortalezas.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-black">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Oportunidades */}
            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6">
              <h4 className="font-black text-amber-900 text-sm tracking-wider uppercase mb-3 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Oportunidades de Entrenamiento</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-800 leading-relaxed font-semibold">
                {foda.oportunidades.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-700 font-black">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Debilidades */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-3xl p-6">
              <h4 className="font-black text-slate-900 text-sm tracking-wider uppercase mb-3 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                <span>Debilidades / Puntos de Atención</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-800 leading-relaxed font-semibold">
                {foda.debilidades.length > 0 ? (
                  foda.debilidades.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-slate-700 font-black">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">No se observan debilidades críticas en el baremo.</li>
                )}
              </ul>
            </div>

            {/* Amenazas */}
            <div className="bg-red-50/70 border-2 border-red-200 rounded-3xl p-6">
              <h4 className="font-black text-red-900 text-sm tracking-wider uppercase mb-3 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                <span>Amenazas / Factores de Riesgo</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-800 leading-relaxed font-semibold">
                {foda.amenazas.length > 0 ? (
                  foda.amenazas.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-red-600 font-black">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 italic">Bajo nivel de factores de riesgo detectados.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Conclusión psicológica SAHER */}
          <div className="mt-6 p-5 rounded-2xl bg-black text-white border-2 border-amber-400 text-xs sm:text-sm leading-relaxed shadow-lg">
            <div className="flex items-center space-x-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <strong className="font-black text-amber-400 uppercase tracking-wide">
                Dictamen Oficial del Departamento de Psicología SAHER:
              </strong>
            </div>
            <p className="text-slate-200 font-medium">
              {foda.conclusionPsicologica}
            </p>
          </div>
        </div>

        {/* Botón destacado para auditoría y visualización de las 58 preguntas */}
        <div className="mb-6 p-4 rounded-2xl bg-black border-2 border-amber-400 text-white flex flex-col sm:flex-row items-center justify-between gap-3 no-print shadow-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-black text-sm text-white uppercase tracking-wide">
                Expediente Clínico &bull; 3 Bloques Completos (58 Reactivos)
              </h4>
              <p className="text-xs text-slate-300">
                Audita y coteja manualmente cada una de las 58 preguntas de DERS-16, PSS-14 y COPE-28 o imprímelas en PDF continuo.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAudit(true)}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-2 transition cursor-pointer border border-red-500 shadow-md whitespace-nowrap"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Ver y Descargar Expediente Completo (PDF)</span>
          </button>
        </div>

        {/* Botones de acción inferiores - Condicional según si es Psicólogo o Aspirante */}
        <div className="pt-6 border-t-2 border-slate-100 no-print">
          {!isPsychologistView ? (
            /* Vista del Estudiante / Aspirante: Sin descargas */
            <div className="space-y-4">
              {/* Aviso oficial: solo el psicólogo descarga */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-semibold flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-black font-black uppercase text-[11px] tracking-wide">
                    AVISO DE SEGURIDAD PARA EL ASPIRANTE:
                  </strong>
                  <span>
                    Has culminado tu evaluación psicométrica. Tus respuestas y puntuaciones han sido registradas y enviadas automáticamente a la <strong>Base Interna del Departamento de Psicología de SAHER</strong>. Por política de seguridad institucional, <strong>el estudiante no tiene permiso para descargar el reporte en PDF ni en Excel</strong>; los certificados oficiales con validez legal solo pueden ser emitidos y descargados por el Psicólogo Responsable.
                  </span>
                </div>
              </div>

              {/* Aviso legal anti-falsificación */}
              <div className="p-4 rounded-2xl bg-[#0c0d12] border-2 border-red-600 text-white text-xs flex items-start space-x-3 shadow-md">
                <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-400 font-black uppercase text-[11px] tracking-wide">
                    DOCUMENTO OFICIAL PROTEGIDO &bull; PROHIBIDA SU FALSIFICACIÓN
                  </strong>
                  <span className="text-slate-300 text-[11px] leading-relaxed block mt-0.5">
                    Queda terminantemente prohibida la adulteración, copia no autorizada o falsificación de esta evaluación psicométrica. Cualquier irregularidad conllevará sanciones penales y la inhabilitación inmediata para portar armamento y prestar servicio de seguridad privada.
                  </span>
                </div>
              </div>

              {/* Botón de Finalización para el estudiante */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={onStartNewEvaluation}
                  className="px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-lg shadow-red-950/30 cursor-pointer border border-red-500"
                >
                  <LogOut className="w-4 h-4 text-amber-300" />
                  <span>Finalizar y Salir del Sistema</span>
                </button>
              </div>
            </div>
          ) : (
            /* Vista del Psicólogo Responsable: Acceso completo a descargas */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-black text-amber-400 border border-amber-500/40 text-xs font-black flex items-center justify-between">
                <span>MODO CLÍNICO AUTORIZADO: Descargas de Certificados y Expedientes habilitadas.</span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">PSICOLOGÍA SAHER</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={handleExportSingleExcel}
                  className="py-3.5 px-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-black font-black text-xs flex flex-col items-center justify-center text-center transition shadow-2xs cursor-pointer group hover:border-emerald-500"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span>Descargar resultados (Excel)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAudit(true)}
                  className="py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex flex-col items-center justify-center text-center transition shadow-md shadow-red-950/20 cursor-pointer group border border-red-500"
                >
                  <Printer className="w-5 h-5 text-amber-300 mb-1 group-hover:scale-110 transition-transform" />
                  <span>Imprimir Expediente (3 Bloques / 58 Ítems)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportSingleJSON}
                  className="py-3.5 px-4 rounded-2xl bg-black hover:bg-slate-900 text-white font-black text-xs flex flex-col items-center justify-center text-center transition shadow-md cursor-pointer group border border-amber-500/40"
                >
                  <Download className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span>Exportar datos (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenPsychologistReview}
                  className="py-3.5 px-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-black text-xs flex flex-col items-center justify-center text-center transition shadow-2xs cursor-pointer group hover:border-red-500"
                >
                  <RotateCcw className="w-5 h-5 text-red-600 mb-1 group-hover:rotate-45 transition-transform" />
                  <span>Volver a la Base Interna</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer institucional SAHER */}
        <div className="mt-12 text-center text-xs text-slate-500 space-y-1 border-t border-slate-100 pt-6">
          <p className="font-black text-black tracking-widest uppercase text-xs">
            SAHER &bull; ESCUELA PARA GUARDIAS DE SEGURIDAD
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Certificación Oficial de Idoneidad Psicológica y Confianza &bull; Metodología DERS-16, PSS y COPE
          </p>
        </div>

      </div>

      </div>

      {/* Modal de auditoría de preguntas para expediente */}
      {showAudit && (
        <StudentAuditModal
          evaluation={evaluation}
          onClose={() => setShowAudit(false)}
          isPsychologistView={isPsychologistView}
        />
      )}
    </>
  );
}
