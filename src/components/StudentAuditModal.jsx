import React, { useState } from 'react';
import { 
  X, Printer, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, Eye, FileText, ChevronRight, Download,
  CheckSquare, Square, Calculator, Award, UserCheck, Shield
} from 'lucide-react';
import { TESTS } from '../data/questionsData';
import { getDetailedQuestionAudit } from '../data/scoringEngine';

export default function StudentAuditModal({ evaluation, onClose, isPsychologistView = true }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ders16', 'pss14', 'cope28'
  const { candidate, results, answers = {}, createdAt, psychologistReview, id } = evaluation;
  const { ders, pss, cope, isApproved } = results;

  const auditList = getDetailedQuestionAudit(answers);

  const dersList = auditList.filter(item => item.testId === 'ders16');
  const pssList = auditList.filter(item => item.testId === 'pss14');
  const copeList = auditList.filter(item => item.testId === 'cope28');

  const dersTest = TESTS.find(t => t.id === 'ders16') || { options: [] };
  const pssTest = TESTS.find(t => t.id === 'pss14') || { options: [] };
  const copeTest = TESTS.find(t => t.id === 'cope28') || { options: [] };

  const handlePrintAudit = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 overflow-y-auto modal-print-unroll">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden border-2 border-red-600 modal-card-print-unroll">
        
        {/* ========================================================= */}
        {/* CABECERA EN PANTALLA (NO-PRINT)                           */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 bg-[#0c0d12] text-white border-b-2 border-red-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 no-print">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-black/60 px-2.5 py-0.5 rounded border border-amber-500/40">
                EXPEDIENTE COMPLETO &bull; 58 REACTIVOS &bull; 3 BLOQUES
              </span>
              <span className="text-xs text-slate-500">&bull;</span>
              <span className="text-xs text-slate-300 font-bold">SAHER Escuela para Guardias</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Auditoría y Cotejo Manual: {candidate?.nombre} {candidate?.apellidos}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-1">
              <span>Nombres: <strong className="text-white font-bold">{candidate?.nombre}</strong></span>
              <span>Apellidos: <strong className="text-white font-bold">{candidate?.apellidos}</strong></span>
              <span>Número de Cédula: <strong className="text-amber-300 font-mono font-bold">{candidate?.cedula}</strong></span>
              <span>Puesto: <strong className="text-white">{candidate?.cargo}</strong></span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintAudit}
              title="Descargar o imprimir las 58 preguntas en PDF continuo"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-2 transition shadow-md cursor-pointer border border-red-500"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Imprimir Expediente Completo (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CABECERA EXCLUSIVA PARA IMPRESIÓN (PRINT ONLY)           */}
        {/* ========================================================= */}
        <div className="hidden print:block p-4 border-b-2 border-slate-900 bg-white text-black mb-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-300">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black text-amber-400 flex items-center justify-center font-black rounded-lg border border-amber-500">
                <ShieldCheck className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-base font-black uppercase tracking-tight text-black leading-tight">
                  ESCUELA PARA GUARDIAS DE SEGURIDAD SAHER CIA. LTDA.
                </h1>
                <p className="text-[11px] font-black uppercase text-red-700 tracking-wider">
                  DEPARTAMENTO DE EVALUACIÓN PSICOLÓGICA &bull; CONTROL DE CONFIANZA
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">
                  EXPEDIENTE OFICIAL DE AUDITORÍA Y COTEJO MANUAL DE RESPUESTAS (58 REACTIVOS)
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] font-semibold text-slate-700 border-l pl-3 border-slate-300">
              <div><strong>Fecha de Evaluación:</strong> {new Date(createdAt).toLocaleDateString('es-ES')}</div>
              <div><strong>Expediente ID:</strong> {id ? String(id).slice(0, 14) : 'SAHER-2026'}</div>
              <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 border border-slate-300">
                Dictamen Sistema: {isApproved ? 'APROBADO' : 'NO APROBADO'}
              </div>
            </div>
          </div>

          {/* Ficha del Aspirante para Impresión - 2 Nombres, 2 Apellidos y Cédula */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2.5 text-[11px]">
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-black">Nombres (2 Nombres):</span>
              <strong className="text-black uppercase text-xs block">{candidate?.nombre}</strong>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-black">Apellidos (2 Apellidos):</span>
              <strong className="text-black uppercase text-xs block">{candidate?.apellidos}</strong>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-black">Número de Cédula:</span>
              <strong className="text-red-700 text-xs font-mono block">{candidate?.cedula}</strong>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <span className="text-slate-500 block text-[9px] uppercase font-black">Puesto / Institución:</span>
              <strong className="text-black text-xs block">{candidate?.cargo || 'Aspirante'}</strong>
              <span className="block text-[9px] text-slate-500">{candidate?.empresa || 'SAHER Seguridad'}</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NAVEGACIÓN POR PESTAÑAS EN PANTALLA (NO-PRINT)            */}
        {/* ========================================================= */}
        <div className="bg-slate-100 p-2.5 sm:p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 no-print">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-sm border border-red-500'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ver los 3 Bloques Completos (58 Ítems)</span>
            </button>

            <button
              onClick={() => setActiveTab('ders16')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'ders16'
                  ? 'bg-black text-amber-400 shadow-sm border border-amber-500/40'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>1. DERS-16 (16 ítems)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                ders.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {ders.totalScore} pts
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pss14')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'pss14'
                  ? 'bg-black text-amber-400 shadow-sm border border-amber-500/40'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>2. PSS-14 (14 ítems)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-blue-100 text-blue-800">
                {pss.totalScore}/56
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cope28')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'cope28'
                  ? 'bg-black text-amber-400 shadow-sm border border-amber-500/40'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span>3. COPE-28 (28 ítems)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-black bg-emerald-100 text-emerald-800">
                Adaptativo {cope.adaptativeScore}/48
              </span>
            </button>
          </div>

          <div className="text-xs font-bold text-slate-700">
            Baremo Global:{' '}
            <strong className={isApproved ? 'text-emerald-700' : 'text-red-700'}>
              {isApproved ? 'APROBADO (16-55)' : 'NO APROBADO (56-80)'}
            </strong>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONTENIDO DEL EXPEDIENTE (3 BLOQUES Y COTEJO MANUAL)      */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 modal-body-print-unroll">
          
          {/* ------------------------------------------------------- */}
          {/* CUADRO COMPARATIVO: SISTEMA vs. REVISIÓN MANUAL         */}
          {/* ------------------------------------------------------- */}
          <div className={`p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl ${activeTab === 'all' ? 'block' : 'hidden print:block'} print-break-avoid`}>
            <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-slate-200">
              <Calculator className="w-4 h-4 text-red-600 shrink-0" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Cuadro Comparativo: Calificación Automatizada del Sistema vs. Cotejo Manual del Psicólogo
              </h3>
            </div>
            <p className="text-[11px] text-slate-600 mb-3 font-medium">
              Este cuadro permite al psicólogo contrastar las sumatorias arrojadas por la plataforma frente a su cálculo manual item por item para corroborar la idoneidad del aspirante.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300 rounded-lg overflow-hidden bg-white">
                <thead className="bg-slate-900 text-white font-black text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Prueba / Bloque</th>
                    <th className="py-2.5 px-3">Criterio Oficial de Aprobación</th>
                    <th className="py-2.5 px-3 text-center">Cálculo del Sistema</th>
                    <th className="py-2.5 px-3 text-center bg-slate-800">Cálculo Manual Psicólogo</th>
                    <th className="py-2.5 px-3 text-center">Cotejo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {/* Fila DERS-16 */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <strong className="text-black block text-xs">Bloque 1 &bull; DERS-16</strong>
                      <span className="text-[10px] text-slate-500">Regulación Emocional (16 ítems)</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px]">
                      Aprobado: <strong>16 a 55 pts</strong><br />
                      <span className="text-red-700">No Aprobado: 56 a 80 pts</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-md font-black text-xs ${
                        ders.isApproved ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                      }`}>
                        {ders.totalScore} / 80 pts ({ders.nivel})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center bg-slate-50/80">
                      <span className="inline-block border-2 border-dashed border-slate-400 rounded px-3 py-1 font-mono text-xs font-black text-slate-700">
                        [ &nbsp; &nbsp; &nbsp; &nbsp; ] / 80 pts
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs">
                      <span className="inline-block border border-slate-400 rounded px-2 py-0.5 text-[11px]">
                        [&nbsp;&nbsp;] Conforme
                      </span>
                    </td>
                  </tr>

                  {/* Fila PSS-14 */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <strong className="text-black block text-xs">Bloque 2 &bull; PSS-14</strong>
                      <span className="text-[10px] text-slate-500">Estrés Percibido (14 ítems)</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px]">
                      0-26 Bajo &bull; 27-40 Moderado<br />
                      <span className="text-red-700">41-56 Alto (Riesgo estrés)</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md font-black text-xs bg-blue-50 text-blue-900 border border-blue-200">
                        {pss.totalScore} / 56 pts ({pss.nivelEstres})
                      </span>
                      <span className="block text-[9px] text-slate-500 mt-0.5">
                        Directos: {pss.directSum} + Inversos: {pss.reverseComputedSum}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center bg-slate-50/80">
                      <span className="inline-block border-2 border-dashed border-slate-400 rounded px-3 py-1 font-mono text-xs font-black text-slate-700">
                        [ &nbsp; &nbsp; &nbsp; &nbsp; ] / 56 pts
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs">
                      <span className="inline-block border border-slate-400 rounded px-2 py-0.5 text-[11px]">
                        [&nbsp;&nbsp;] Conforme
                      </span>
                    </td>
                  </tr>

                  {/* Fila COPE-28 */}
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <strong className="text-black block text-xs">Bloque 3 &bull; COPE-28</strong>
                      <span className="text-[10px] text-slate-500">Afrontamiento (28 ítems)</span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px]">
                      Adaptativo: 16 ítems (máx 48)<br />
                      No Adaptativo: 12 ítems (máx 36)
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md font-black text-xs bg-emerald-50 text-emerald-900 border border-emerald-200">
                        Adapt: {cope.adaptativeScore}/48 | NoAdapt: {cope.noAdaptativeScore}/36
                      </span>
                      <span className="block text-[9px] text-slate-500 mt-0.5">
                        Balance: <strong>{cope.balanceAfrontamiento}</strong>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center bg-slate-50/80">
                      <span className="inline-block border-2 border-dashed border-slate-400 rounded px-2 py-1 font-mono text-[11px] font-black text-slate-700">
                        Adapt:[ &nbsp; ] / NoAdapt:[ &nbsp; ]
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-xs">
                      <span className="inline-block border border-slate-400 rounded px-2 py-0.5 text-[11px]">
                        [&nbsp;&nbsp;] Conforme
                      </span>
                    </td>
                  </tr>

                  {/* Dictamen Oficial Final */}
                  <tr className="bg-slate-100/90 font-black">
                    <td colSpan="2" className="py-2.5 px-3 text-xs uppercase tracking-wider text-black">
                      DICTAMEN OFICIAL INSTITUCIONAL SAHER:
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        isApproved ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {isApproved ? 'APROBADO PARA SERVICIO' : 'NO APROBADO'}
                      </span>
                    </td>
                    <td colSpan="2" className="py-2.5 px-3 text-center text-xs text-slate-700">
                      Dictamen Clínico Ratificado: [&nbsp;&nbsp;] APROBADO &nbsp;&nbsp; [&nbsp;&nbsp;] NO APROBADO
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          {/* ------------------------------------------------------- */}
          {/* BLOQUE 1: DERS-16 (16 PREGUNTAS COMPLETAS)              */}
          {/* ------------------------------------------------------- */}
          <div className={activeTab === 'ders16' || activeTab === 'all' ? 'space-y-3' : 'hidden print:block space-y-3'}>
            <div className="p-3.5 rounded-2xl bg-red-50/80 border-2 border-red-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print-break-avoid">
              <div>
                <span className="text-[10px] font-black tracking-widest text-red-700 uppercase block">
                  BLOQUE 1 &bull; 16 REACTIVOS
                </span>
                <h4 className="font-black text-black text-sm uppercase tracking-wide">
                  DERS-16: Escala de Dificultades en la Regulación Emocional
                </h4>
                <p className="text-slate-600 font-medium text-[11px]">
                  <strong>Instrucción / Regla de corrección:</strong> Sumatoria directa de los 16 ítems (escala 1 a 5). Aprobado: 16 a 55 puntos. No Aprobado: 56 a 80 puntos.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-500 block">Suma Automatizada:</span>
                <strong className={`text-base font-black ${ders.isApproved ? 'text-emerald-700' : 'text-red-700'}`}>
                  {ders.totalScore} / 80 pts
                </strong>
                <span className="block text-[10px] font-black uppercase text-slate-600">
                  Nivel: {ders.nivel} ({ders.isApproved ? 'APROBADO' : 'NO APROBADO'})
                </span>
              </div>
            </div>

            {/* Subdimensiones DERS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-bold print-break-avoid">
              <div className="p-2 bg-white border border-slate-300 rounded-xl">
                <span className="text-slate-500 block text-[9px]">1. Reacción Negativa:</span>
                <strong className="text-black text-xs">{ders.subscores?.reaccion_negativa}/20</strong>
                <span className="block text-[9px] text-slate-400 font-mono">Manual: [ &nbsp; ]/20</span>
              </div>
              <div className="p-2 bg-white border border-slate-300 rounded-xl">
                <span className="text-slate-500 block text-[9px]">2. Metas / Tareas:</span>
                <strong className="text-black text-xs">{ders.subscores?.metas_tareas}/15</strong>
                <span className="block text-[9px] text-slate-400 font-mono">Manual: [ &nbsp; ]/15</span>
              </div>
              <div className="p-2 bg-white border border-slate-300 rounded-xl">
                <span className="text-slate-500 block text-[9px]">3. Control de Impulsos:</span>
                <strong className="text-black text-xs">{ders.subscores?.control_impulsos}/15</strong>
                <span className="block text-[9px] text-slate-400 font-mono">Manual: [ &nbsp; ]/15</span>
              </div>
              <div className="p-2 bg-white border border-slate-300 rounded-xl">
                <span className="text-slate-500 block text-[9px]">4. Estrategias Reg.:</span>
                <strong className="text-black text-xs">{ders.subscores?.estrategias_reg}/20</strong>
                <span className="block text-[9px] text-slate-400 font-mono">Manual: [ &nbsp; ]/20</span>
              </div>
              <div className="p-2 bg-white border border-slate-300 rounded-xl">
                <span className="text-slate-500 block text-[9px]">5. Claridad Emocional:</span>
                <strong className="text-black text-xs">{ders.subscores?.claridad_emocional}/10</strong>
                <span className="block text-[9px] text-slate-400 font-mono">Manual: [ &nbsp; ]/10</span>
              </div>
            </div>

            {/* Tabla de 16 preguntas DERS-16 con Escala Completa y Respuesta Marcada */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-10">#</th>
                    <th className="py-2.5 px-3">Reactivo / Pregunta y Opciones de la Escala</th>
                    <th className="py-2.5 px-3 text-center w-36">Respuesta Aspirante</th>
                    <th className="py-2.5 px-3 text-center w-24">Puntaje Sistema</th>
                    <th className="py-2.5 px-3 text-center w-32 bg-slate-800">Cálculo Manual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {dersList.map(item => {
                    const isHigh = item.rawValue >= 4;
                    return (
                      <tr key={item.questionId} className={`hover:bg-slate-50 ${isHigh ? 'bg-red-50/40' : ''}`}>
                        <td className="py-2.5 px-3 text-center align-top font-black text-slate-700">
                          {String(item.questionNum).padStart(2, '0')}
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          <div className="flex items-center space-x-2">
                            <span className="text-black font-bold text-xs">{item.text}</span>
                            <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                              {item.subdim?.replace(/_/g, ' ')}
                            </span>
                          </div>

                          {/* Escala de opciones completa: con la respuesta marcada resaltada */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5">
                              Escala:
                            </span>
                            {dersTest.options.map(opt => {
                              const isSelected = item.rawValue === opt.value;
                              return (
                                <span
                                  key={opt.value}
                                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] border ${
                                    isSelected
                                      ? 'bg-slate-950 text-white border-slate-950 font-black shadow-xs ring-1 ring-amber-400'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 font-medium'
                                  }`}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full inline-flex items-center justify-center text-[7px] font-black ${
                                      isSelected ? 'bg-amber-400 text-black' : 'border border-slate-400 bg-white'
                                    }`}
                                  >
                                    {isSelected ? '✓' : ''}
                                  </span>
                                  <span>{opt.label}</span>
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Respuesta Elegida */}
                        <td className="py-2.5 px-3 text-center align-top w-36">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${
                            isHigh 
                              ? 'bg-red-50 text-red-900 border-red-300' 
                              : item.rawValue <= 2 
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}>
                            {item.optionLabel}
                          </span>
                        </td>

                        {/* Puntaje Sistema */}
                        <td className="py-2.5 px-3 text-center align-top w-24">
                          <span className={`inline-block px-2.5 py-1 rounded text-xs font-black ${
                            item.rawValue <= 2 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : item.rawValue === 3
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-red-600 text-white'
                          }`}>
                            {item.rawValue} pts
                          </span>
                        </td>

                        {/* Cotejo Manual Psicólogo */}
                        <td className="py-2.5 px-3 text-center align-top w-32 bg-slate-50/60">
                          <div className="flex items-center justify-center space-x-1.5 pt-0.5">
                            <span className="inline-block border-2 border-dashed border-slate-400 rounded px-2 py-0.5 font-mono text-xs font-black text-slate-700 bg-white">
                              [ &nbsp; &nbsp; &nbsp; ] pts
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              [&nbsp;&nbsp;]
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-black text-xs text-black border-t-2 border-slate-300">
                  <tr>
                    <td colSpan="3" className="py-2.5 px-3 text-right uppercase">
                      SUMA TOTAL DERS-16 (Suma directa simple de los 16 reactivos):
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-sm font-black text-black">{ders.totalScore} / 80</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[10px] text-slate-600">
                      [ &nbsp; &nbsp; &nbsp; ] / 80
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>


          {/* ------------------------------------------------------- */}
          {/* BLOQUE 2: PSS-14 (14 PREGUNTAS COMPLETAS)              */}
          {/* ------------------------------------------------------- */}
          <div className={`${activeTab === 'pss14' || activeTab === 'all' ? 'space-y-3' : 'hidden print:block space-y-3'} print-page-break`}>
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print-break-avoid">
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-800 uppercase block">
                  BLOQUE 2 &bull; 14 REACTIVOS
                </span>
                <h4 className="font-black text-black text-sm uppercase tracking-wide">
                  PSS-14: Escala de Estrés Percibido
                </h4>
                <p className="text-slate-600 font-medium text-[11px]">
                  <strong>Regla de corrección:</strong> Escala 0 a 4 (Nunca a Muy a menudo). Ítems Directos suman su valor. Los <strong>7 ítems Inversos (4, 5, 6, 7, 9, 10, 13)</strong> evalúan autoeficacia y se computan como (4 - valor) para la sumatoria total.
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-500 block">Suma PSS-14:</span>
                <strong className="text-base font-black text-black">
                  {pss.totalScore} / 56 pts
                </strong>
                <span className="block text-[10px] font-black text-slate-600 uppercase">
                  Nivel: {pss.nivelEstres}
                </span>
              </div>
            </div>

            {/* Tabla de 14 preguntas PSS-14 con Escala Completa y Respuesta Marcada */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-10">#</th>
                    <th className="py-2.5 px-3">Reactivo / Pregunta y Opciones de la Escala</th>
                    <th className="py-2.5 px-3 text-center w-36">Respuesta Aspirante</th>
                    <th className="py-2.5 px-3 text-center w-24">Puntaje Sistema</th>
                    <th className="py-2.5 px-3 text-center w-32 bg-slate-800">Cálculo Manual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {pssList.map(item => {
                    return (
                      <tr key={item.questionId} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 text-center align-top font-black text-slate-700">
                          {String(item.questionNum).padStart(2, '0')}
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          <div className="flex items-center space-x-2">
                            <span className="text-black font-bold text-xs">{item.text}</span>
                            {item.isReversed ? (
                              <span className="text-[9px] font-black uppercase text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                                Inverso (4 - X)
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                                Directo (0-4)
                              </span>
                            )}
                          </div>

                          {/* Opciones de la escala PSS */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5">
                              Escala:
                            </span>
                            {pssTest.options.map(opt => {
                              const isSelected = item.rawValue === opt.value;
                              return (
                                <span
                                  key={opt.value}
                                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] border ${
                                    isSelected
                                      ? 'bg-slate-950 text-white border-slate-950 font-black shadow-xs ring-1 ring-amber-400'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 font-medium'
                                  }`}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full inline-flex items-center justify-center text-[7px] font-black ${
                                      isSelected ? 'bg-amber-400 text-black' : 'border border-slate-400 bg-white'
                                    }`}
                                  >
                                    {isSelected ? '✓' : ''}
                                  </span>
                                  <span>{opt.label}</span>
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Respuesta Aspirante */}
                        <td className="py-2.5 px-3 text-center align-top w-36">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-900 border border-slate-300">
                            {item.optionLabel}
                          </span>
                          <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                            (Marcado: {item.rawValue})
                          </span>
                        </td>

                        {/* Puntaje Sistema */}
                        <td className="py-2.5 px-3 text-center align-top w-24">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-black ${
                            item.computedValue >= 3 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {item.computedValue} pts
                          </span>
                          {item.isReversed ? (
                            <span className="block text-[9px] text-amber-800 font-mono mt-0.5">
                              4 - {item.rawValue} = {item.computedValue}
                            </span>
                          ) : (
                            <span className="block text-[9px] text-slate-400 font-mono mt-0.5">
                              directo
                            </span>
                          )}
                        </td>

                        {/* Cotejo Manual */}
                        <td className="py-2.5 px-3 text-center align-top w-32 bg-slate-50/60">
                          <div className="flex flex-col items-center justify-center space-y-1 pt-0.5">
                            <span className="inline-block border-2 border-dashed border-slate-400 rounded px-2 py-0.5 font-mono text-[11px] font-black text-slate-700 bg-white">
                              {item.isReversed ? `4 - [ ${item.rawValue} ] = [ &nbsp; ]` : `[ &nbsp; &nbsp; &nbsp; ] pts`}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              [&nbsp;&nbsp;] Conforme
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-black text-xs text-black border-t-2 border-slate-300">
                  <tr>
                    <td colSpan="3" className="py-2.5 px-3 text-right uppercase">
                      SUMA TOTAL PSS-14 (Directos: {pss.directSum}/28 + Inversos: {pss.reverseComputedSum}/28):
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-sm font-black text-black">{pss.totalScore} / 56</span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[10px] text-slate-600">
                      [ &nbsp; &nbsp; &nbsp; ] / 56
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>


          {/* ------------------------------------------------------- */}
          {/* BLOQUE 3: COPE-28 (28 PREGUNTAS COMPLETAS)              */}
          {/* ------------------------------------------------------- */}
          <div className={`${activeTab === 'cope28' || activeTab === 'all' ? 'space-y-3' : 'hidden print:block space-y-3'} print-page-break`}>
            <div className="p-3.5 rounded-2xl bg-slate-100 border-2 border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print-break-avoid">
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-700 uppercase block">
                  BLOQUE 3 &bull; 28 REACTIVOS
                </span>
                <h4 className="font-black text-black text-sm uppercase tracking-wide">
                  COPE-28: Inventario Breve de Estrategias de Afrontamiento al Estrés
                </h4>
                <p className="text-slate-600 font-medium text-[11px]">
                  <strong>Regla de corrección:</strong> Escala 0 a 3 (0=En absoluto / NUNCA, 1=Un poco, 2=Bastante, 3=Mucho). Se evalúa balance entre 16 ítems adaptativos (máx 48) frente a 12 ítems no adaptativos (máx 36).
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-slate-500 block">Balance de Afrontamiento:</span>
                <strong className="text-sm font-black text-emerald-800">
                  Adaptativo: {cope.adaptativeScore}/48 &bull; No Adapt.: {cope.noAdaptativeScore}/36
                </strong>
                <span className="block text-[10px] font-black text-slate-600 uppercase">
                  Estado: {cope.balanceAfrontamiento}
                </span>
              </div>
            </div>

            {/* Tabla de 28 preguntas COPE-28 con Escala Completa y Respuesta Marcada */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-10">#</th>
                    <th className="py-2.5 px-3">Reactivo / Pregunta y Opciones de la Escala</th>
                    <th className="py-2.5 px-3 text-center w-36">Respuesta Aspirante</th>
                    <th className="py-2.5 px-3 text-center w-24">Puntaje Sistema</th>
                    <th className="py-2.5 px-3 text-center w-32 bg-slate-800">Cálculo Manual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                  {copeList.map(item => {
                    const isNoAdaptative = item.subdim === 'no_adaptativo';
                    const isSevereRisk = isNoAdaptative && item.rawValue >= 2;

                    return (
                      <tr key={item.questionId} className={`hover:bg-slate-50 ${isSevereRisk ? 'bg-red-50/50' : ''}`}>
                        <td className="py-2.5 px-3 text-center align-top font-black text-slate-700">
                          {String(item.questionNum).padStart(2, '0')}
                        </td>
                        <td className="py-2.5 px-3 align-top">
                          <div className="flex items-center space-x-2">
                            <span className="text-black font-bold text-xs">{item.text}</span>
                            {isNoAdaptative ? (
                              <span className="text-[9px] font-black uppercase text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                                No Adaptativo
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold uppercase text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 shrink-0">
                                Adaptativo
                              </span>
                            )}
                            {item.isRisk && (
                              <span className="text-[9px] font-black uppercase text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300 shrink-0">
                                Reactivo Crítico
                              </span>
                            )}
                          </div>

                          {/* Opciones de la escala COPE */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mr-0.5">
                              Escala:
                            </span>
                            {copeTest.options.map(opt => {
                              const isSelected = item.rawValue === opt.value;
                              return (
                                <span
                                  key={opt.value}
                                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] border ${
                                    isSelected
                                      ? 'bg-slate-950 text-white border-slate-950 font-black shadow-xs ring-1 ring-amber-400'
                                      : 'bg-slate-50 text-slate-600 border-slate-200 font-medium'
                                  }`}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full inline-flex items-center justify-center text-[7px] font-black ${
                                      isSelected ? 'bg-amber-400 text-black' : 'border border-slate-400 bg-white'
                                    }`}
                                  >
                                    {isSelected ? '✓' : ''}
                                  </span>
                                  <span>{opt.label}</span>
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Respuesta Aspirante */}
                        <td className="py-2.5 px-3 text-center align-top w-36">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${
                            isSevereRisk 
                              ? 'bg-red-600 text-white border-red-700' 
                              : 'bg-slate-100 text-slate-900 border-slate-300'
                          }`}>
                            {item.optionLabel}
                          </span>
                        </td>

                        {/* Puntaje Sistema */}
                        <td className="py-2.5 px-3 text-center align-top w-24">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-black ${
                            isSevereRisk
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {item.rawValue} pts
                          </span>
                        </td>

                        {/* Cotejo Manual */}
                        <td className="py-2.5 px-3 text-center align-top w-32 bg-slate-50/60">
                          <div className="flex items-center justify-center space-x-1.5 pt-0.5">
                            <span className="inline-block border-2 border-dashed border-slate-400 rounded px-2 py-0.5 font-mono text-xs font-black text-slate-700 bg-white">
                              [ &nbsp; &nbsp; &nbsp; ] pts
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              [&nbsp;&nbsp;]
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-black text-xs text-black border-t-2 border-slate-300">
                  <tr>
                    <td colSpan="3" className="py-2.5 px-3 text-right uppercase">
                      TOTALES COPE-28 &bull; Adaptativo (máx 48) vs No Adaptativo (máx 36):
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-xs font-black text-black">
                        {cope.adaptativeScore} / {cope.noAdaptativeScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[9px] text-slate-600">
                      [ &nbsp; &nbsp; ] / [ &nbsp; &nbsp; ]
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>


          {/* ------------------------------------------------------- */}
          {/* SECCIÓN DE DICTAMEN CLÍNICO Y FIRMAS DE RESPONSABILIDAD */}
          {/* ------------------------------------------------------- */}
          <div className={`pt-6 border-t-2 border-slate-300 space-y-5 ${activeTab === 'all' ? 'block' : 'hidden print:block'} print-break-avoid`}>
            {/* Notas clínicas */}
            <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs space-y-1.5">
              <strong className="text-slate-900 uppercase tracking-wide block font-black text-[11px]">
                Observaciones Clínicas y Conclusiones del Evaluador:
              </strong>
              <p className="text-slate-700 leading-relaxed font-medium">
                {psychologistReview?.notes 
                  ? psychologistReview.notes 
                  : 'Cotejo y auditoría psicométrica completada. Las respuestas concuerdan con el perfil reportado en la prueba automatizada, confirmando la idoneidad psicológica para el servicio en seguridad privada.'}
              </p>
              <div className="h-10 border-b border-dashed border-slate-300 print:block hidden"></div>
            </div>

            {/* Firmas institucionales */}
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="text-center">
                <div className="w-56 h-14 border-b-2 border-slate-800 mx-auto mb-1 flex items-end justify-center">
                  <span className="text-[10px] text-slate-400 italic">Firma del Profesional Evaluador</span>
                </div>
                <strong className="block text-xs uppercase font-black text-slate-900">
                  {psychologistReview?.psychologistName || 'Lic. Evaluador / Psicólogo Responsable'}
                </strong>
                <span className="text-[10px] text-slate-600 font-semibold block">
                  Departamento de Psicología &bull; SAHER Escuela de Seguridad
                </span>
                <span className="text-[9px] text-slate-400 font-mono block">
                  Reg. Prof. MSP / SENESCYT
                </span>
              </div>

              <div className="text-center">
                <div className="w-56 h-14 border-b-2 border-slate-800 mx-auto mb-1 flex items-end justify-center">
                  <span className="text-[10px] text-slate-400 italic">Firma / Sello de Dirección</span>
                </div>
                <strong className="block text-xs uppercase font-black text-slate-900">
                  Dirección de Instrucción y Seguridad
                </strong>
                <span className="text-[10px] text-slate-600 font-semibold block">
                  SAHER Escuela para Guardias de Seguridad Cía. Ltda.
                </span>
                <span className="text-[9px] text-slate-400 block font-semibold">
                  Certificación de Confianza Oficial
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 font-medium pt-2 border-t border-slate-200">
              Documento clínico confidencial amparado por el Código de Ética Psicológica y la normativa de Seguridad Privada.
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* PIE DEL MODAL (NO-PRINT)                                  */}
        {/* ========================================================= */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0 no-print">
          <div className="text-slate-500 font-medium flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Expediente auditado completo: 58 preguntas &bull; Escuela SAHER</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintAudit}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center space-x-1.5 transition shadow-sm cursor-pointer border border-red-500"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Imprimir Expediente Completo</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-white font-black transition cursor-pointer border border-amber-500/40"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
