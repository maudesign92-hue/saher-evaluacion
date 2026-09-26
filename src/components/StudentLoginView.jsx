import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, User, Clock, AlertTriangle, 
  ArrowRight, ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';
import { validateTemporaryToken } from '../data/storageEngine';

export default function StudentLoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = validateTemporaryToken(username, password);
    if (res.success) {
      onLoginSuccess({
        token: res.token,
        candidate: res.candidate
      });
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleUseDemoActiveToken = () => {
    setUsername('saher-asp-101');
    setPassword('SAHER-2026');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 flex flex-col items-center justify-center bg-[#fbfbfc]">
      
      {/* Encabezado Institucional SAHER */}
      <div className="text-center max-w-2xl mb-8">
        <div className="inline-flex items-center space-x-2 bg-black text-white border border-amber-500/40 px-4 py-1.5 rounded-full mb-3 shadow-md">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
            SAHER &bull; ESCUELA PARA GUARDIAS DE SEGURIDAD
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-black mt-2 mb-3 tracking-tight leading-tight">
          Portal de Evaluación <span className="text-red-600">Psicométrica</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
          Certificación de Confianza, Estabilidad Emocional y Control de Impulsos (DERS-16, PSS-14, COPE-28).
        </p>
      </div>

      {/* Card Principal de Acceso con Credenciales Temporales */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-900/5 border-t-4 border-t-red-600 border border-slate-200 p-6 sm:p-10">
        
        {/* Banner de Reglas Estrictas: 20 Minutos y 1 Solo Intento */}
        <div className="mb-6 space-y-3">
          {/* Regla 1: Un solo uso */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-bold flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-black font-black uppercase text-[11px] tracking-wide">
                ACCESO DE UN SOLO USO (NO REPETIBLE):
              </strong>
              <span>
                Este examen solo se puede llenar <strong>una sola vez</strong>. Una vez completado o transcurrido el tiempo, las credenciales se anulan de forma permanente y ya no se puede volver a ingresar.
              </span>
            </div>
          </div>

          {/* Regla 2: Cronómetro de 20 minutos */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-700 text-xs font-medium flex items-start space-x-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-400 font-black uppercase text-[11px] tracking-wide">
                CRONÓMETRO OFICIAL DE 20 MINUTOS:
              </strong>
              <span className="text-slate-200">
                Al ingresar, dispondrá de <strong>20 minutos exactos</strong> para completar los 3 bloques secuenciales.
              </span>
            </div>
          </div>

          {/* Regla 3: Aviso legal anti-falsificación y no descarga */}
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-[11px] leading-snug font-semibold flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              <strong>Aviso Legal SAHER:</strong> Queda prohibida la falsificación o alteración de esta prueba. El aspirante solo visualiza sus resultados; los certificados oficiales en PDF son tramitados y descargados exclusivamente por el Psicólogo en la Base Interna.
            </span>
          </div>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 border-2 border-red-400 text-red-800 text-xs font-bold flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Formulario de Login de Aspirante */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
              Usuario Temporal Asignado <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                placeholder="Ej. saher-asp-101"
                required
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50 font-bold text-black"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Usuario creado previamente por la academia o el psicólogo responsable.
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
              Contraseña Temporal de Acceso Único <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="Ej. SAHER-2026"
                required
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50 font-bold text-black"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-950/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 border border-red-500 cursor-pointer group"
            >
              <span>Ingresar e Iniciar Evaluación (20 Min)</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Botón rápido para pruebas del evaluador */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span className="font-bold flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>¿Deseas probar de inmediato?</span>
          </span>
          <button
            type="button"
            onClick={handleUseDemoActiveToken}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black border border-amber-300 transition cursor-pointer"
          >
            Usar credencial temporal de prueba
          </button>
        </div>

      </div>

      {/* Pie de página institucional */}
      <p className="text-xs text-slate-400 mt-6 text-center">
        SAHER &bull; Escuela para Guardias de Seguridad &bull; Departamento de Evaluación Psicométrica
      </p>

    </div>
  );
}
