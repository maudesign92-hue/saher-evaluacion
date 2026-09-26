import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, X, ArrowRight } from 'lucide-react';
import { validatePsychologistLogin } from '../data/storageEngine';

export default function PsychologistLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const res = validatePsychologistLogin(username, password);
    if (res.success) {
      onLoginSuccess(res.session);
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0f1015] border-2 border-red-600 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-white animate-in fade-in zoom-in duration-200 relative overflow-hidden">
        
        {/* Adorno superior dorado */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-red-600"></div>

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado con Escudo SAHER */}
        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#1f1d1a] to-black border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-md shadow-amber-950/40 shrink-0">
            <ShieldCheck className="w-7 h-7 text-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              ACCESO RESTRINGIDO &bull; SAHER
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              Base Interna del Psicólogo
            </h2>
            <p className="text-xs text-slate-400">
              Gestión de aspirantes, baremos DERS-16 y dictámenes
            </p>
          </div>
        </div>

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/60 text-red-200 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">
              Usuario o Correo Institucional
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMsg(''); }}
                placeholder="ej. usuario@saher.edu.ec"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-black/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">
              Contraseña de Acceso Clínico
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-black/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-red-950/50 flex items-center justify-center space-x-2 border border-red-500 cursor-pointer"
            >
              <span>Ingresar a la Base Interna</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </form>

        {/* Nota de confidencialidad institucional */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center font-medium">
          Acceso protegido y confidencial exclusivo para personal evaluador autorizado de SAHER.
        </div>

      </div>
    </div>
  );
}
