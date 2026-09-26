import React, { useState, useEffect } from 'react';
import { ArrowRight, FileSearch, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { getDraft } from '../data/storageEngine';

const COUNTRIES = [
  'Ecuador', 'Colombia', 'México', 'Perú', 'Chile', 'Argentina',
  'España', 'Estados Unidos', 'Panamá', 'Costa Rica', 'Uruguay', 'Otro'
];

const SECTORS = [
  'Seguridad Privada y Vigilancia Fija',
  'Custodia de Valores / Blindados',
  'Protección de Personas Muy Importantes (Escoltas / VIP)',
  'Seguridad Electrónica, Monitoreo CCTV y Alarmas',
  'Seguridad Industrial, Petrolera y Minera',
  'Control de Accesos y Seguridad Portuaria / Aeroportuaria',
  'Fuerzas del Orden / Ex-Fuerzas Armadas / Policía',
  'Seguridad Comercial y Bancaria',
  'Otro Sector'
];

export const INITIAL_CANDIDATE_STATE = {
  nombre: '',
  apellidos: '',
  pais: 'Ecuador',
  cedula: '',
  email: '',
  telefono: '',
  empresa: 'SAHER Escuela para Guardias de Seguridad',
  sector: 'Seguridad Privada y Vigilancia Fija',
  cargo: 'Aspirante a Guardia de Seguridad',
  experiencia: '1 a 3 años'
};

export default function RegistrationForm({ onStartEvaluation, currentCandidate, onRestoreDraft }) {
  const [formData, setFormData] = useState(currentCandidate || INITIAL_CANDIDATE_STATE);
  const [existingDraft, setExistingDraft] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Detectar si hay un borrador guardado cuando escribe la cédula
  useEffect(() => {
    if (formData.cedula && formData.cedula.trim().length >= 4) {
      const draft = getDraft(formData.cedula.trim());
      if (draft && draft.answers && Object.keys(draft.answers).length > 0) {
        setExistingDraft(draft);
      } else {
        setExistingDraft(null);
      }
    } else {
      setExistingDraft(null);
    }
  }, [formData.cedula]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanNombre = formData.nombre.trim();
    const nombresList = cleanNombre.split(/\s+/).filter(w => w.length >= 2);
    if (nombresList.length < 2) {
      setErrorMsg('Requisito obligatorio: Debes ingresar obligatoriamente tus DOS (2) nombres (ej. Carlos Andrés).');
      return;
    }

    const cleanApellidos = formData.apellidos.trim();
    const apellidosList = cleanApellidos.split(/\s+/).filter(w => w.length >= 2);
    if (apellidosList.length < 2) {
      setErrorMsg('Requisito obligatorio: Debes ingresar obligatoriamente tus DOS (2) apellidos (ej. Morales Pérez).');
      return;
    }

    const cleanCedula = formData.cedula.trim();
    if (!cleanCedula || cleanCedula.length < 8) {
      setErrorMsg('Por favor ingresa un número de cédula válido (mínimo 8 a 10 dígitos).');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }

    onStartEvaluation({
      ...formData,
      nombre: cleanNombre,
      apellidos: cleanApellidos,
      cedula: cleanCedula
    });
  };

  const handleApplyDraft = () => {
    if (existingDraft) {
      if (existingDraft.candidate) {
        setFormData(prev => ({ ...prev, ...existingDraft.candidate }));
      }
      onRestoreDraft(existingDraft);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 flex flex-col items-center justify-center bg-[#fbfbfc]">
      {/* Encabezado descriptivo SAHER con Rojo, Negro y Dorado */}
      <div className="text-center max-w-2xl mb-10">
        <div className="inline-flex items-center space-x-2 bg-black text-white border border-amber-500/40 px-4 py-1.5 rounded-full mb-3 shadow-md">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
            SAHER &bull; ESCUELA PARA GUARDIAS DE SEGURIDAD
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-black mt-2 mb-4 tracking-tight leading-tight">
          Certificación de <span className="text-red-600">Confianza</span> e Idoneidad
        </h1>
        <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
          Evaluación psicométrica oficial para certificar la estabilidad emocional, control de impulsos y confiabilidad en el servicio de seguridad privada.
        </p>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-semibold">
          Baremos oficiales de calificación: <strong className="text-red-600">DERS-16</strong> (Aprobado 16-55 pts), <strong className="text-slate-900">PSS-14</strong> y <strong className="text-slate-900">COPE-28</strong>.
        </p>
      </div>

      {/* Formulario Card estilo SAHER */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-slate-900/5 border-t-4 border-t-red-600 border border-slate-200 p-6 sm:p-10">
        {/* Aviso de borrador encontrado */}
        {existingDraft && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <FileSearch className="w-5 h-5 text-amber-800 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-black text-amber-950">
                  ¡Tienes una evaluación en progreso para esta cédula!
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Guardado el: {new Date(existingDraft.savedAt).toLocaleDateString()} ({Object.keys(existingDraft.answers || {}).length} preguntas respondidas).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyDraft}
              className="shrink-0 ml-2 px-3 py-1.5 text-xs font-black text-white bg-black hover:bg-slate-800 rounded-xl transition border border-amber-500/50 cursor-pointer"
            >
              Continuar
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
                Nombres (2 Nombres Obligatorios) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Carlos Andrés"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 text-black font-semibold"
              />
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Mínimo 2 nombres</span>
            </div>
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
                Apellidos (2 Apellidos Obligatorios) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ej. Morales Pérez"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 text-black font-semibold"
              />
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Mínimo 2 apellidos</span>
            </div>
          </div>

          {/* País */}
          <div>
            <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
              País de Residencia <span className="text-red-600">*</span>
            </label>
            <select
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 cursor-pointer font-semibold"
            >
              {COUNTRIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Cédula / Identificación */}
          <div>
            <label className="block text-xs font-black text-black mb-1 uppercase tracking-wide">
              Cédula / Identificación Oficial <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              placeholder="Número de cédula o DNI"
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 text-black font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Permite guardar y recuperar tu progreso automáticamente.
            </p>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-xs font-black text-black mb-1 uppercase tracking-wide">
              Correo Electrónico <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 text-black font-semibold"
            />
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Te enviaremos los resultados detallados a esta dirección.
            </p>
          </div>

          {/* Teléfono / WhatsApp */}
          <div>
            <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
              Teléfono / Celular / WhatsApp
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-200 text-xs font-black text-slate-700">
                📞
              </span>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+593 99 999 9999"
                className="w-full px-4 py-3 text-sm rounded-r-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 text-black font-semibold"
              />
            </div>
          </div>

          {/* Empresa / Institución y Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
                Academia / Empresa
              </label>
              <input
                type="text"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                placeholder="Nombre de la institución"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 text-black font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
                Cargo o Rol a Evaluar <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                placeholder="Ej. Guardia de Seguridad / Custodio"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 text-black font-semibold"
              />
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-xs font-black text-black mb-1.5 uppercase tracking-wide">
              Área de Seguridad <span className="text-red-600">*</span>
            </label>
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 bg-slate-50/70 cursor-pointer font-semibold"
            >
              {SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Botón Comenzar - Rojo y Negro con flecha */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-base shadow-lg shadow-red-950/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 group cursor-pointer border border-red-500"
            >
              <span>Comenzar Evaluación Oficial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-300" />
            </button>
          </div>

          {/* Nota al pie */}
          <p className="text-[11px] text-center text-slate-500 pt-2 leading-relaxed">
            Al comenzar, aceptas los términos de confidencialidad y tratamiento de datos de <strong>SAHER</strong>. Tus respuestas se guardan de forma segura bajo tu número de cédula.
          </p>
        </form>
      </div>
    </div>
  );
}
