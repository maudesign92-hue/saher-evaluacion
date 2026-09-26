import React from 'react';
import { 
  ShieldCheck, Clock, CheckCircle2, ArrowRight, 
  Sparkles
} from 'lucide-react';

export default function InstructionsView({ candidate, onStartTest }) {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 bg-[#fbfbfc]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Encabezado Institucional y Datos del Aspirante */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border-t-4 border-t-red-600 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-black border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-md shrink-0">
                <ShieldCheck className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase bg-black px-2.5 py-0.5 rounded border border-amber-500/40">
                  SAHER &bull; ESCUELA PARA GUARDIAS DE SEGURIDAD
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-black mt-1">
                  Indicaciones Previas a tu Evaluación
                </h1>
              </div>
            </div>

            <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto border sm:border-0 border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-black block">Aspirante Registrado:</span>
              <strong className="text-sm font-black text-black block">{candidate.nombre} {candidate.apellidos}</strong>
              <div className="text-[11px] text-slate-600 font-bold mt-0.5">
                <span>Nombres: <strong className="text-black">{candidate.nombre}</strong></span> &bull; <span>Apellidos: <strong className="text-black">{candidate.apellidos}</strong></span>
              </div>
              <span className="text-[11px] text-red-700 font-mono font-bold block">Cédula: {candidate.cedula}</span>
            </div>
          </div>

          {/* Aviso: El tiempo aún no corre */}
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs sm:text-sm font-bold text-amber-950 flex items-start space-x-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-black font-black uppercase text-xs block mb-0.5">
                EL TIEMPO NO HA EMPEZADO TODAVÍA:
              </strong>
              <span>
                Lee con calma estas breves indicaciones. Tu cronómetro de <strong>20 minutos</strong> empezará a contar únicamente cuando hagas clic en el botón rojo <strong>"Iniciar Prueba Ahora"</strong> al final de esta página.
              </span>
            </div>
          </div>
        </div>

        {/* Explicación Sencilla de los 3 Tests (Fácil y clara como para 12 años) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-black tracking-widest text-red-600 uppercase">
              ¿EN QUÉ CONSISTE LA EVALUACIÓN?
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-black mt-0.5">
              Vas a responder 3 partes muy sencillas:
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Es un cuestionario fácil para conocer tu forma de actuar y resolver situaciones en el trabajo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            {/* Parte 1 */}
            <div className="p-4 rounded-2xl bg-red-50/50 border-2 border-red-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-sm mb-3">
                  1
                </div>
                <h3 className="font-black text-sm text-red-950 mb-1">
                  Tus Emociones
                </h3>
                <span className="text-[10px] font-bold text-red-700 block mb-2">
                  (16 preguntas &bull; DERS)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Preguntas sobre cómo te sientes cuando algo te preocupa o te enoja, y qué tan fácil logras calmarte para no perder el control.
                </p>
              </div>
              <div className="pt-2 border-t border-red-200/60 text-[11px] font-bold text-red-800">
                Opciones: Desde <em>Casi nunca</em> hasta <em>Casi siempre</em>.
              </div>
            </div>

            {/* Parte 2 */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border-2 border-amber-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-base shadow-sm mb-3">
                  2
                </div>
                <h3 className="font-black text-sm text-amber-950 mb-1">
                  El Estrés del Último Mes
                </h3>
                <span className="text-[10px] font-bold text-amber-700 block mb-2">
                  (14 preguntas &bull; PSS)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Preguntas sobre cómo te has sentido en las últimas semanas ante situaciones difíciles o de presión en el día a día.
                </p>
              </div>
              <div className="pt-2 border-t border-amber-200/60 text-[11px] font-bold text-amber-900">
                Opciones: Desde <em>Nunca</em> hasta <em>Muy a menudo</em>.
              </div>
            </div>

            {/* Parte 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 flex flex-col justify-between space-y-3">
              <div>
                <div className="w-10 h-10 rounded-xl bg-black text-amber-300 flex items-center justify-center font-black text-base shadow-sm mb-3">
                  3
                </div>
                <h3 className="font-black text-sm text-slate-900 mb-1">
                  Cómo Resuelves Problemas
                </h3>
                <span className="text-[10px] font-bold text-slate-600 block mb-2">
                  (28 preguntas &bull; COPE)
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Preguntas sobre qué haces cuando pasa un problema: si buscas soluciones, sigues órdenes o mantienes la calma.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-800">
                Opciones: <em>En absoluto (NUNCA)</em> hasta <em>Mucho</em>.
              </div>
            </div>
          </div>
        </div>

        {/* 3 Consejos de Oro */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>3 Consejos Importantes Antes de Empezar</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <strong className="text-black font-extrabold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1. Di la verdad</span>
              </strong>
              <p className="text-slate-600 font-medium leading-relaxed">
                No hay respuestas buenas ni malas. Lo más importante es que contestes lo que de verdad sientes y haces tú.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <strong className="text-black font-extrabold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2. Tendrás ayuda en el test</span>
              </strong>
              <p className="text-slate-600 font-medium leading-relaxed">
                Dentro de la prueba tendrás un recordatorio arriba de cada bloque que te explica qué significa cada número.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <strong className="text-black font-extrabold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>3. Un solo intento</span>
              </strong>
              <p className="text-slate-600 font-medium leading-relaxed">
                Tienes 20 minutos en total. Al terminar y enviar, tu usuario temporal se cerrará automáticamente.
              </p>
            </div>
          </div>
        </div>

        {/* Botón Principal de Inicio */}
        <div className="pt-2 flex flex-col items-center text-center space-y-2.5">
          <button
            type="button"
            onClick={onStartTest}
            className="w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base uppercase tracking-wider shadow-xl shadow-red-950/30 hover:shadow-red-950/50 transition-all flex items-center justify-center space-x-3 cursor-pointer border border-red-500 group"
          >
            <span>Iniciar Prueba Ahora &bull; Comenzar (20 Minutos)</span>
            <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <p className="text-xs text-slate-400 font-medium">
            Al presionar este botón comenzará a correr tu tiempo oficial de 20 minutos.
          </p>
        </div>

      </div>
    </div>
  );
}
