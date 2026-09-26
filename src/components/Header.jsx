import React from 'react';
import { ShieldCheck, Database, Award, UserCheck, Shield, Lock, LogOut } from 'lucide-react';

export default function Header({ 
  currentView, 
  setCurrentView, 
  isPsychologistLoggedIn, 
  onOpenPsychologistModal,
  onLogoutPsychologist 
}) {
  const handlePsychologistButtonClick = () => {
    if (isPsychologistLoggedIn) {
      if (currentView === 'psychologist') {
        setCurrentView('login');
      } else {
        setCurrentView('psychologist');
      }
    } else {
      onOpenPsychologistModal();
    }
  };

  return (
    <header className="bg-[#0b0c10] border-b-2 border-red-600 sticky top-0 z-50 shadow-lg shadow-black/20 no-print text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Branding SAHER */}
        <div 
          onClick={() => {
            if (currentView !== 'assessment') {
              setCurrentView(isPsychologistLoggedIn ? 'psychologist' : 'login');
            }
          }}
          className="flex items-center space-x-3.5 cursor-pointer group"
        >
          {/* Escudo Dorado con Rojo y Negro */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#1c1917] to-[#0a0a0a] border-2 border-amber-500/70 flex items-center justify-center text-amber-400 shadow-md shadow-amber-950/30 group-hover:border-amber-400 group-hover:scale-105 transition-all">
            <ShieldCheck className="w-7 h-7 text-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-2xl tracking-widest text-white">
                SA<span className="text-red-600">HER</span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 tracking-widest uppercase border border-amber-500/30">
                SEGURIDAD
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 tracking-widest uppercase border border-red-500/30">
                DERS-16
              </span>
            </div>
            <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
              Escuela para Guardias de Seguridad &bull; <span className="text-amber-400">Certificación de Confianza</span>
            </p>
          </div>
        </div>

        {/* Acciones de la barra */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Botón para Panel del Psicólogo con control de login */}
          {isPsychologistLoggedIn && currentView === 'psychologist' ? (
            <div className="flex items-center space-x-2">
              <span className="hidden md:inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                🟢 Sesión Psicólogo Activa
              </span>
              <button
                onClick={() => setCurrentView('login')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Portal Aspirante</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handlePsychologistButtonClick}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white border border-red-500 shadow-md shadow-red-950/40 transition group cursor-pointer"
            >
              {isPsychologistLoggedIn ? (
                <Database className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition" />
              ) : (
                <Lock className="w-4 h-4 text-amber-300 group-hover:scale-110 transition" />
              )}
              <span>Base Interna del Psicólogo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
