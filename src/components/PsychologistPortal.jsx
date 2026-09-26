import React, { useState, useMemo } from 'react';
import { 
  Users, CheckCircle2, AlertTriangle, Search, Filter, 
  FileSpreadsheet, Download, Eye, Edit3, Trash2, ShieldCheck, 
  Save, X, Award, Activity, Calendar, ArrowLeft, FileText,
  KeyRound, Plus, Copy, Check, Clock, ShieldAlert, LogOut, RefreshCw,
  Lock, ArrowRight, Printer
} from 'lucide-react';
import { 
  getEvaluations, updateEvaluationPsychologistReview, 
  deleteEvaluation, exportEvaluationsToExcel, exportEvaluationsToJSON,
  getTemporaryTokens, createTemporaryToken, deleteTemporaryToken
} from '../data/storageEngine';
import StudentAuditModal from './StudentAuditModal';

export default function PsychologistPortal({ 
  onViewStudentReport, 
  onReturnToEvaluation,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('evaluations'); // 'evaluations' | 'tokens'
  const [evaluations, setEvaluations] = useState(() => getEvaluations());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, APPROVED, REJECTED
  const [editingEval, setEditingEval] = useState(null); // Evaluación siendo editada en modal
  const [auditingEval, setAuditingEval] = useState(null); // Evaluación abierta para auditoría de las 58 preguntas

  // Estado del módulo de Tokens Temporales
  const [tokens, setTokens] = useState(() => getTemporaryTokens());
  const [tokenSearchQuery, setTokenSearchQuery] = useState('');
  const [tokenFilter, setTokenFilter] = useState('ALL'); // ALL, ACTIVE, USED
  const [tokenForm, setTokenForm] = useState({
    nombre: '',
    apellidos: '',
    cedula: '',
    cargo: 'Aspirante a Guardia de Seguridad',
    empresa: 'SAHER Escuela para Guardias de Seguridad',
    email: '',
    telefono: ''
  });
  const [createdTokenAlert, setCreatedTokenAlert] = useState(null);
  const [copiedTokenId, setCopiedTokenId] = useState(null);

  // Formulario del psicólogo en modal
  const [reviewForm, setReviewForm] = useState({
    decision: 'APROBADO',
    officialVerdict: '',
    notes: '',
    psychologistName: 'Dra. Patricia Silva - Reg. Prof. 8492'
  });

  // Estado del modal de eliminación protegida (Supervisor angel001 / saher002)
  const [evalToDelete, setEvalToDelete] = useState(null);
  const [deleteAuthUser, setDeleteAuthUser] = useState('');
  const [deleteAuthPass, setDeleteAuthPass] = useState('');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const [deleteStep, setDeleteStep] = useState(1); // 1 = credenciales, 2 = confirmación definitiva
  const [toastMsg, setToastMsg] = useState('');

  const reloadData = () => {
    setEvaluations(getEvaluations());
    setTokens(getTemporaryTokens());
  };

  // Filtrado de evaluaciones
  const filteredList = useMemo(() => {
    return evaluations.filter(item => {
      const c = item.candidate || {};
      const fullName = `${c.nombre || ''} ${c.apellidos || ''}`.toLowerCase();
      const cedula = (c.cedula || '').toLowerCase();
      const cargo = (c.cargo || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || fullName.includes(query) || cedula.includes(query) || cargo.includes(query);
      
      const isApproved = item.results?.ders?.isApproved;
      let matchesStatus = true;
      if (statusFilter === 'APPROVED') matchesStatus = isApproved === true;
      if (statusFilter === 'REJECTED') matchesStatus = isApproved === false;

      return matchesSearch && matchesStatus;
    });
  }, [evaluations, searchQuery, statusFilter]);

  // Filtrado de tokens temporales
  const filteredTokens = useMemo(() => {
    return tokens.filter(t => {
      const c = t.candidate || {};
      const fullName = `${c.nombre || ''} ${c.apellidos || ''}`.toLowerCase();
      const cedula = (c.cedula || '').toLowerCase();
      const user = (t.username || '').toLowerCase();
      const query = tokenSearchQuery.toLowerCase().trim();

      const matchesSearch = !query || fullName.includes(query) || cedula.includes(query) || user.includes(query);
      
      let matchesStatus = true;
      if (tokenFilter === 'ACTIVE') matchesStatus = !t.isUsed;
      if (tokenFilter === 'USED') matchesStatus = !!t.isUsed;

      return matchesSearch && matchesStatus;
    });
  }, [tokens, tokenSearchQuery, tokenFilter]);

  // Estadísticas globales de evaluaciones
  const stats = useMemo(() => {
    const total = evaluations.length;
    if (total === 0) return { total: 0, approved: 0, rejected: 0, avgDers: 0, percentApproved: 0 };

    const approvedCount = evaluations.filter(e => e.results?.ders?.isApproved).length;
    const rejectedCount = total - approvedCount;
    const sumDers = evaluations.reduce((sum, e) => sum + (e.results?.ders?.totalScore || 0), 0);
    const avgDers = Math.round((sumDers / total) * 10) / 10;
    const percentApproved = Math.round((approvedCount / total) * 100);

    return { total, approved: approvedCount, rejected: rejectedCount, avgDers, percentApproved };
  }, [evaluations]);

  // Estadísticas de tokens
  const tokenStats = useMemo(() => {
    const total = tokens.length;
    const active = tokens.filter(t => !t.isUsed).length;
    const used = total - active;
    return { total, active, used };
  }, [tokens]);

  const handleOpenReview = (item) => {
    setEditingEval(item);
    setReviewForm({
      decision: item.psychologistReview?.decision || (item.results?.ders?.isApproved ? 'APROBADO' : 'NO APROBADO'),
      officialVerdict: item.psychologistReview?.officialVerdict || (item.results?.ders?.isApproved ? 'Aprobado por Baremo (16-55)' : 'No Aprobado por Baremo (56-80)'),
      notes: item.psychologistReview?.notes || '',
      psychologistName: item.psychologistReview?.psychologistName || 'Lic. Evaluador / Psicólogo Responsable'
    });
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!editingEval) return;

    updateEvaluationPsychologistReview(editingEval.id, reviewForm);
    reloadData();
    setEditingEval(null);
  };

  // Iniciar proceso de eliminación protegida
  const handleRequestDelete = (item) => {
    setEvalToDelete(item);
    setDeleteAuthUser('');
    setDeleteAuthPass('');
    setDeleteErrorMsg('');
    setDeleteStep(1);
  };

  // Paso 1: Verificar credenciales únicas de supervisor (angel001 / saher002)
  const handleVerifyDeleteAuth = (e) => {
    e.preventDefault();
    const cleanUser = deleteAuthUser.trim().toLowerCase();
    const cleanPass = deleteAuthPass.trim();

    if (cleanUser === 'angel001' && cleanPass === 'saher002') {
      setDeleteErrorMsg('');
      setDeleteStep(2); // Avanzar a confirmación final explícita (¿Sí o No?)
    } else {
      setDeleteErrorMsg('Credenciales de supervisor incorrectas. Acceso denegado para eliminar expedientes de la institución.');
    }
  };

  // Paso 2: Confirmación definitiva
  const handleConfirmDelete = () => {
    if (!evalToDelete) return;
    const candidateName = `${evalToDelete.candidate?.nombre || ''} ${evalToDelete.candidate?.apellidos || ''}`;
    deleteEvaluation(evalToDelete.id);
    reloadData();
    setEvalToDelete(null);
    setToastMsg(`Expediente de ${candidateName} eliminado definitivamente de la base.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleQuickFillDeleteAuth = () => {
    setDeleteAuthUser('angel001');
    setDeleteAuthPass('saher002');
    setDeleteErrorMsg('');
  };

  // Creación de token temporal para aspirante (Exige estrictamente 2 nombres y 2 apellidos)
  const handleCreateTokenSubmit = (e) => {
    e.preventDefault();

    // Validar mínimo 2 nombres
    const cleanNombre = tokenForm.nombre.trim();
    const nombresList = cleanNombre.split(/\s+/).filter(w => w.length >= 2);
    if (nombresList.length < 2) {
      alert('REQUISITO OBLIGATORIO: Debes ingresar obligatoriamente los DOS (2) nombres del aspirante (ej. Roberto Alexander). No se permite crear el acceso con un solo nombre.');
      return;
    }

    // Validar mínimo 2 apellidos
    const cleanApellidos = tokenForm.apellidos.trim();
    const apellidosList = cleanApellidos.split(/\s+/).filter(w => w.length >= 2);
    if (apellidosList.length < 2) {
      alert('REQUISITO OBLIGATORIO: Debes ingresar obligatoriamente los DOS (2) apellidos del aspirante (ej. Zambrano Morales). No se permite crear el acceso con un solo apellido.');
      return;
    }

    // Validar cédula
    const cleanCedula = tokenForm.cedula.trim();
    if (!cleanCedula || cleanCedula.length < 8) {
      alert('Por favor ingresa un número de cédula válido (mínimo 8 a 10 dígitos).');
      return;
    }

    const newToken = createTemporaryToken({
      ...tokenForm,
      nombre: cleanNombre,
      apellidos: cleanApellidos,
      cedula: cleanCedula
    });
    setTokens(getTemporaryTokens());
    setCreatedTokenAlert(newToken);

    // Resetear manteniendo datos por defecto
    setTokenForm(prev => ({
      ...prev,
      nombre: '',
      apellidos: '',
      cedula: '',
      email: '',
      telefono: ''
    }));
  };

  // Copiar credenciales con formato oficial listo para WhatsApp o Correo (con 2 nombres, 2 apellidos y cédula)
  const handleCopyCredentials = (tok) => {
    const testUrl = window.location.origin;
    const text = `*SAHER • Escuela para Guardias de Seguridad*
*Credenciales Oficiales de Evaluación Psicométrica (DERS-16)*

*DATOS DEL ASPIRANTE:*
- Nombres: ${tok.candidate?.nombre}
- Apellidos: ${tok.candidate?.apellidos}
- Número de Cédula: ${tok.candidate?.cedula}
- Cargo: ${tok.candidate?.cargo}
- Institución: ${tok.candidate?.empresa || 'SAHER Seguridad'}

🌐 *Enlace de Ingreso al Test:*
${testUrl}

🔑 *Credenciales Temporales de Acceso Único:*
👤 *Usuario:* ${tok.username}
🔒 *Contraseña:* ${tok.password}

⏱️ *Tiempo Límite:* 20 minutos cronometrados
⚠️ *Aviso de Seguridad:* Credencial de UN SOLO USO. Al culminar el test, la clave se anula automáticamente. Queda terminantemente prohibida su adulteración o falsificación.`;

    navigator.clipboard.writeText(text);
    setCopiedTokenId(tok.id);
    setTimeout(() => setCopiedTokenId(null), 3000);
  };

  const handleDeleteTokenClick = (tokenId, username) => {
    if (window.confirm(`¿Eliminar la credencial temporal ${username}? El aspirante ya no podrá utilizarla.`)) {
      deleteTemporaryToken(tokenId);
      setTokens(getTemporaryTokens());
      if (createdTokenAlert && createdTokenAlert.id === tokenId) {
        setCreatedTokenAlert(null);
      }
    }
  };

  return (
    <>
      <div 
        className={`min-h-screen bg-[#fbfbfc] py-8 px-4 sm:px-6 ${auditingEval ? 'no-print print:hidden' : ''}`}
        data-no-print={auditingEval ? 'true' : undefined}
      >
        <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Barra superior de navegación interna SAHER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-t-4 border-t-red-600 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase bg-black px-3 py-1 rounded-md border border-amber-500/40">
                SAHER &bull; DEPARTAMENTO DE PSICOLOGÍA
              </span>
              <span className="text-xs font-bold text-slate-400">&bull;</span>
              <span className="text-xs font-bold text-slate-700">Base Interna Oficial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black mt-2">
              Panel de Idoneidad y Control Psicométrico &bull; Test DERS-16
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Baremo oficial: <strong className="text-emerald-700">Aprobado (16 a 55 puntos)</strong> &bull; <strong className="text-red-700">No Aprobado (56 a 80 puntos)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onReturnToEvaluation}
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-100 text-black text-xs font-black flex items-center space-x-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Vista Test</span>
            </button>
            <button
              onClick={() => exportEvaluationsToExcel(evaluations)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-1.5 transition shadow-md shadow-red-950/20 cursor-pointer border border-red-500"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-300" />
              <span>Descargar Excel</span>
            </button>
            <button
              onClick={() => exportEvaluationsToJSON(evaluations)}
              className="px-3 py-2.5 rounded-xl bg-black hover:bg-slate-900 text-white text-xs font-black flex items-center space-x-1 transition shadow-md cursor-pointer border border-amber-500/40"
              title="Exportar archivo JSON"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>JSON</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-red-700 text-xs font-black flex items-center space-x-1.5 transition cursor-pointer border border-slate-200"
                title="Cerrar sesión de psicólogo"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* Pestañas de Navegación: Base de Evaluaciones vs Gestor de Tokens */}
        <div className="flex items-center space-x-3 border-b-2 border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab('evaluations')}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'evaluations'
                ? 'bg-black text-amber-400 shadow-md border border-amber-500/40'
                : 'bg-white text-slate-600 hover:text-black border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Base de Evaluaciones ({evaluations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-5 py-3 rounded-2xl text-xs font-black transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-red-600 text-white shadow-md border border-red-500'
                : 'bg-white text-slate-600 hover:text-black border border-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-300" />
            <span>Gestor de Accesos Temporales ({tokenStats.active} activos)</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* PESTAÑA 1: BASE DE EVALUACIONES PSICOMÉTRICAS Y EXPEDIENTES */}
        {/* ========================================================= */}
        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            {/* Tarjetas KPI de Resumen */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Evaluados</span>
                  <Users className="w-5 h-5 text-black" />
                </div>
                <div className="text-3xl font-black text-black mt-2">{stats.total}</div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Registros en base de datos SAHER</p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-300 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">Aprobados (16-55)</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-700 mt-2">{stats.approved}</div>
                <p className="text-[11px] text-emerald-700 font-bold mt-1">
                  {stats.percentApproved}% aptos para servicio
                </p>
              </div>

              <div className="bg-red-50 rounded-2xl p-5 border-2 border-red-300 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-red-950 uppercase tracking-wider">No Aprobados (56-80)</span>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-3xl font-black text-red-600 mt-2">{stats.rejected}</div>
                <p className="text-[11px] text-red-700 font-bold mt-1">
                  {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}% con desregulación/riesgo
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Promedio DERS-16</span>
                  <Activity className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-black mt-2">{stats.avgDers}</div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Escala total (16 a 80 pts)</p>
              </div>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula o puesto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-slate-50 text-black"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-black text-slate-700 flex items-center space-x-1">
                  <Filter className="w-3.5 h-3.5 text-red-600" />
                  <span>Filtrar:</span>
                </span>
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    statusFilter === 'ALL'
                      ? 'bg-black text-amber-400 border border-amber-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos ({evaluations.length})
                </button>
                <button
                  onClick={() => setStatusFilter('APPROVED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    statusFilter === 'APPROVED'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  Aprobados ({stats.approved})
                </button>
                <button
                  onClick={() => setStatusFilter('REJECTED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    statusFilter === 'REJECTED'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  No Aprobados ({stats.rejected})
                </button>
              </div>
            </div>

            {/* Tabla de Evaluaciones */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0d12] border-b-2 border-red-600 text-slate-200 font-black uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Aspirante / Guardia</th>
                      <th className="py-3.5 px-4">Cédula / Contacto</th>
                      <th className="py-3.5 px-4">Fecha</th>
                      <th className="py-3.5 px-4 text-center">DERS-16 (16-80)</th>
                      <th className="py-3.5 px-4 text-center">Estrés PSS</th>
                      <th className="py-3.5 px-4 text-center">Confiabilidad</th>
                      <th className="py-3.5 px-4 text-center">Dictamen Psicólogo</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-10 text-slate-400 font-bold">
                          No se encontraron evaluaciones con el filtro especificado.
                        </td>
                      </tr>
                    ) : (
                      filteredList.map(item => {
                        const c = item.candidate || {};
                        const r = item.results || {};
                        const ders = r.ders || {};
                        const pss = r.pss || {};
                        const rev = item.psychologistReview || {};

                        return (
                          <tr key={item.id} className="hover:bg-slate-50 transition">
                            {/* Nombre y Cargo */}
                            <td className="py-3.5 px-4">
                              <div className="font-black text-black text-sm">
                                {c.nombre} {c.apellidos}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {c.cargo} &bull; {c.empresa || 'SAHER'}
                              </div>
                            </td>

                            {/* Cédula y Contacto */}
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-black">{c.cedula}</div>
                              <div className="text-[11px] text-slate-400 font-medium">{c.email}</div>
                            </td>

                            {/* Fecha */}
                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-medium">
                              {new Date(item.createdAt).toLocaleDateString('es-ES')}
                            </td>

                            {/* Puntaje DERS-16 con baremo oficial */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="font-black text-sm text-black">
                                {ders.totalScore} <span className="text-[10px] text-slate-400 font-normal">/ 80</span>
                              </div>
                              <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-md mt-0.5 border ${
                                ders.isApproved
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-red-100 text-red-900 border-red-300'
                              }`}>
                                {ders.isApproved ? 'APROBADO (16-55)' : 'NO APROBADO (56-80)'}
                              </span>
                            </td>

                            {/* Estrés PSS */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="font-extrabold text-black">{pss.totalScore}/56</span>
                              <span className="block text-[10px] text-slate-500 font-bold">
                                {pss.nivelEstres}
                              </span>
                            </td>

                            {/* Confiabilidad Global */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="font-black text-emerald-700 text-sm">
                                {r.trustIndex}%
                              </div>
                              <div className="w-16 bg-slate-200 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-full rounded-full"
                                  style={{ width: `${r.trustIndex}%` }}
                                />
                              </div>
                            </td>

                            {/* Decisión oficial del Psicólogo */}
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                rev.decision === 'APROBADO'
                                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                                  : rev.decision === 'CONDICIONAL'
                                  ? 'bg-amber-100 text-amber-950 border-amber-400'
                                  : 'bg-red-100 text-red-950 border-red-400'
                              }`}>
                                {rev.decision || (ders.isApproved ? 'APROBADO' : 'NO APROBADO')}
                              </span>
                              {rev.notes && (
                                <span className="block text-[10px] text-slate-500 italic truncate max-w-[140px] mx-auto mt-0.5">
                                  "{rev.notes}"
                                </span>
                              )}
                            </td>

                            {/* Acciones */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => setAuditingEval(item)}
                                  title="Abrir e Imprimir Expediente Oficial de 58 Reactivos para Cotejo Manual"
                                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs flex items-center space-x-1.5 transition shadow-xs cursor-pointer border border-red-500 group"
                                >
                                  <Printer className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                                  <span>PDF Evaluación (58 Reactivos)</span>
                                </button>
                                <button
                                  onClick={() => handleOpenReview(item)}
                                  title="Emitir dictamen o notas del psicólogo"
                                  className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4 text-red-600" />
                                </button>
                                <button
                                  onClick={() => onViewStudentReport(item)}
                                  title="Ver resumen ejecutivo y FODA"
                                  className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRequestDelete(item)}
                                  title="Eliminar expediente (Requiere clave única de supervisor)"
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA 2: GESTOR DE ACCESOS TEMPORALES (ASPIRANTES)      */}
        {/* ========================================================= */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            
            {/* Formulario para generar credencial temporal de un solo uso */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-t-4 border-t-red-600 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black border border-amber-400/60 flex items-center justify-center text-amber-400 shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black uppercase">
                    Generador de Accesos Temporales de Un Solo Uso
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Crea un usuario y contraseña temporal para el aspirante. Una vez que culmina el test o se vence el tiempo, la credencial queda invalidada para siempre.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateTokenSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      Nombres (2 Nombres Obligatorios) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Roberto Alexander"
                      value={tokenForm.nombre}
                      onChange={(e) => setTokenForm(prev => ({ ...prev, nombre: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <span className="text-[10px] text-slate-500 font-bold block mt-1">Obligatorio: Mínimo 2 nombres</span>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      Apellidos (2 Apellidos Obligatorios) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Zambrano Morales"
                      value={tokenForm.apellidos}
                      onChange={(e) => setTokenForm(prev => ({ ...prev, apellidos: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <span className="text-[10px] text-slate-500 font-bold block mt-1">Obligatorio: Mínimo 2 apellidos</span>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      Número de Cédula de Identidad <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 1718293041"
                      value={tokenForm.cedula}
                      onChange={(e) => setTokenForm(prev => ({ ...prev, cedula: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                    <span className="text-[10px] text-slate-500 font-bold block mt-1">Documento oficial sin guiones</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      Cargo / Rol a Evaluar
                    </label>
                    <input
                      type="text"
                      value={tokenForm.cargo}
                      onChange={(e) => setTokenForm(prev => ({ ...prev, cargo: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      Institución / Empresa
                    </label>
                    <input
                      type="text"
                      value={tokenForm.empresa}
                      onChange={(e) => setTokenForm(prev => ({ ...prev, empresa: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-black uppercase mb-1">
                      Teléfono / WhatsApp (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="+593 99 999 9999"
                      value={tokenForm.telefono}
                      onChange={(e) => setTokenForm(prev => ({ ...prev, telefono: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition shadow-md shadow-red-950/20 cursor-pointer border border-red-500"
                  >
                    <Plus className="w-4 h-4 text-amber-300" />
                    <span>Generar Credenciales Temporales de Un Solo Uso</span>
                  </button>
                </div>
              </form>

              {/* Alerta de credencial recién generada lista para copiar */}
              {createdTokenAlert && (
                <div className="mt-6 p-5 rounded-2xl bg-black border-2 border-amber-400 text-white animate-in fade-in slide-in-from-top-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
                          ¡CREDENCIALES TEMPORALES GENERADAS CON ÉXITO!
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-medium">
                        Asignadas a: <strong className="text-white">{createdTokenAlert.candidate?.nombre} {createdTokenAlert.candidate?.apellidos}</strong> (Cédula: {createdTokenAlert.candidate?.cedula})
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 font-mono text-xs">
                        <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                          <span className="text-slate-400 text-[10px] uppercase block font-sans">Enlace al Test:</span>
                          <strong className="text-amber-300 text-xs font-sans break-all">{window.location.origin}</strong>
                        </div>
                        <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                          <span className="text-slate-400 text-[10px] uppercase block font-sans">Usuario Temporal:</span>
                          <strong className="text-amber-400 text-sm">{createdTokenAlert.username}</strong>
                        </div>
                        <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                          <span className="text-slate-400 text-[10px] uppercase block font-sans">Contraseña Temporal:</span>
                          <strong className="text-emerald-400 text-sm">{createdTokenAlert.password}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans">
                          &bull; 20 minutos cronometrados &bull; 1 solo uso
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(createdTokenAlert)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center space-x-2 transition cursor-pointer shadow-md shrink-0"
                    >
                      {copiedTokenId === createdTokenAlert.id ? (
                        <>
                          <Check className="w-4 h-4 text-black" />
                          <span>¡Copiado para Enviar!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-black" />
                          <span>Copiar Mensaje Completo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Filtros de la tabla de tokens */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula o usuario..."
                  value={tokenSearchQuery}
                  onChange={(e) => setTokenSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-slate-50 text-black"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setTokenFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    tokenFilter === 'ALL'
                      ? 'bg-black text-amber-400 border border-amber-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos ({tokens.length})
                </button>
                <button
                  onClick={() => setTokenFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    tokenFilter === 'ACTIVE'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  🟢 Activos ({tokenStats.active})
                </button>
                <button
                  onClick={() => setTokenFilter('USED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                    tokenFilter === 'USED'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                  }`}
                >
                  🔴 Usados ({tokenStats.used})
                </button>
              </div>
            </div>

            {/* Tabla de Credenciales y Tokens */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0c0d12] border-b-2 border-red-600 text-slate-200 font-black uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Aspirante / Datos</th>
                      <th className="py-3.5 px-4">Usuario Temporal</th>
                      <th className="py-3.5 px-4">Contraseña</th>
                      <th className="py-3.5 px-4">Fecha Creación</th>
                      <th className="py-3.5 px-4 text-center">Estado del Acceso</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {filteredTokens.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-400 font-bold">
                          No hay credenciales temporales que coincidan con el filtro.
                        </td>
                      </tr>
                    ) : (
                      filteredTokens.map(tok => {
                        const c = tok.candidate || {};
                        const isUsed = !!tok.isUsed;

                        // Buscar si existe evaluación vinculada
                        const matchedEval = evaluations.find(e => 
                          (tok.evaluationId && e.id === tok.evaluationId) || 
                          (c.cedula && e.candidate?.cedula === c.cedula)
                        );

                        return (
                          <tr key={tok.id} className="hover:bg-slate-50 transition">
                            {/* Aspirante */}
                            <td className="py-3.5 px-4">
                              <div className="font-black text-black text-sm">
                                {c.nombre} {c.apellidos}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                Cédula: <strong className="text-slate-800">{c.cedula}</strong> &bull; {c.cargo}
                              </div>
                            </td>

                            {/* Usuario Temporal */}
                            <td className="py-3.5 px-4 font-mono font-black text-sm text-black">
                              {tok.username}
                            </td>

                            {/* Contraseña */}
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                              {tok.password}
                            </td>

                            {/* Fecha */}
                            <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                              {new Date(tok.createdAt).toLocaleString('es-ES', { 
                                day: '2-digit', month: '2-digit', year: 'numeric', 
                                hour: '2-digit', minute: '2-digit' 
                              })}
                            </td>

                            {/* Estado de Uso */}
                            <td className="py-3.5 px-4 text-center">
                              {isUsed ? (
                                <div>
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-300">
                                    🔴 Usado / Invalidadas
                                  </span>
                                  {tok.usedAt && (
                                    <span className="block text-[10px] text-slate-400 mt-0.5">
                                      {new Date(tok.usedAt).toLocaleTimeString('es-ES')}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  🟢 Activo (Sin Usar)
                                </span>
                              )}
                            </td>

                            {/* Acciones */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleCopyCredentials(tok)}
                                  title="Copiar credenciales para enviar"
                                  className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                >
                                  {copiedTokenId === tok.id ? (
                                    <Check className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>

                                {isUsed && matchedEval && (
                                  <button
                                    onClick={() => onViewStudentReport(matchedEval)}
                                    title="Ver informe del examen completado"
                                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteTokenClick(tok.id, tok.username)}
                                  title="Eliminar credencial"
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modal para emitir dictamen y notas del psicólogo */}
      {editingEval && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200 border-t-4 border-t-red-600 border border-slate-300">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-black tracking-widest text-red-600 uppercase">
                  DICTAMEN CLÍNICO SAHER &bull; IDONEIDAD
                </span>
                <h3 className="text-xl font-black text-black">
                  {editingEval.candidate?.nombre} {editingEval.candidate?.apellidos}
                </h3>
                <p className="text-xs text-slate-600 font-semibold">
                  Cédula: {editingEval.candidate?.cedula} &bull; Puntaje DERS: {editingEval.results?.ders?.totalScore}/80
                </p>
              </div>
              <button
                onClick={() => setEditingEval(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 mt-5">
              {/* Baremo DERS-16 de referencia rápida */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 text-xs flex justify-between items-center font-bold">
                <span>Baremo Oficial DERS-16:</span>
                <span className={`font-black ${editingEval.results?.ders?.isApproved ? 'text-emerald-700' : 'text-red-700'}`}>
                  {editingEval.results?.ders?.isApproved 
                    ? `APROBADO (${editingEval.results?.ders?.totalScore} pts en rango 16-55)` 
                    : `NO APROBADO (${editingEval.results?.ders?.totalScore} pts en rango 56-80)`}
                </span>
              </div>

              {/* Decisión oficial del psicólogo */}
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase tracking-wide">
                  Decisión / Dictamen del Psicólogo:
                </label>
                <select
                  value={reviewForm.decision}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, decision: e.target.value }))}
                  className="w-full px-3 py-2.5 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-600 bg-white"
                >
                  <option value="APROBADO">APROBADO (Apto para portar armamento y servicio)</option>
                  <option value="NO APROBADO">NO APROBADO (No apto / Riesgo de impulsividad)</option>
                  <option value="CONDICIONAL">CONDICIONAL (Requiere entrevista clínica adicional)</option>
                </select>
              </div>

              {/* Veredicto descriptivo */}
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase tracking-wide">
                  Veredicto resumido:
                </label>
                <input
                  type="text"
                  value={reviewForm.officialVerdict}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, officialVerdict: e.target.value }))}
                  placeholder="Ej. Cumple con el perfil de autocontrol para seguridad privada"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500/20 bg-white font-semibold"
                />
              </div>

              {/* Notas del psicólogo */}
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase tracking-wide">
                  Observaciones cualitativas del Psicólogo:
                </label>
                <textarea
                  rows="3"
                  value={reviewForm.notes}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Añade recomendaciones, observaciones sobre manejo de armas o áreas a supervisar..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500/20 bg-white font-semibold"
                />
              </div>

              {/* Nombre y Firma del Evaluador */}
              <div>
                <label className="block text-xs font-black text-black mb-1 uppercase tracking-wide">
                  Nombre y Registro Profesional del Psicólogo Evaluador:
                </label>
                <input
                  type="text"
                  value={reviewForm.psychologistName}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, psychologistName: e.target.value }))}
                  placeholder="Ej. Dra. Patricia Silva - Lic. Psicología 48102"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500/20 bg-white font-semibold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingEval(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-md shadow-red-950/20 cursor-pointer border border-red-500"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Guardar Dictamen Oficial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* Modal de Eliminación Protegida de 2 Pasos (Clave angel001/saher002 + Confirmación Sí/No) */}
      {evalToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-red-600 animate-in zoom-in-95 duration-200">
            {/* Cabecera de Alerta Crítica */}
            <div className="bg-gradient-to-r from-red-700 via-red-600 to-black text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                    <ShieldAlert className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block">
                      Seguridad Institucional SAHER
                    </span>
                    <h3 className="text-base font-black tracking-tight">
                      Eliminación Protegida de Expediente
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEvalToDelete(null)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Resumen del estudiante a eliminar */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Expediente a eliminar:</span>
                  <span className="font-mono text-slate-700">ID: {evalToDelete.id?.slice(0, 10)}...</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {evalToDelete.candidate?.nombre} {evalToDelete.candidate?.apellidos}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 font-medium">
                  <span>Cédula: <strong className="text-black">{evalToDelete.candidate?.cedula}</strong></span>
                  <span>Fecha: <strong>{new Date(evalToDelete.createdAt).toLocaleDateString('es-ES')}</strong></span>
                  <span>DERS: <strong className={evalToDelete.results?.ders?.isApproved ? 'text-emerald-700' : 'text-red-700'}>
                    {evalToDelete.results?.ders?.totalScore}/80 ({evalToDelete.results?.ders?.isApproved ? 'APROBADO' : 'NO APROBADO'})
                  </strong></span>
                </div>
              </div>

              {/* Advertencia de pérdida permanente */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>ADVERTENCIA:</strong> Perder el expediente de un estudiante de forma accidental es perjudicial. Esta acción purgará de forma permanente sus 58 respuestas y el certificado oficial.
                </p>
              </div>

              {/* PASO 1: Autenticación de Supervisor */}
              {deleteStep === 1 && (
                <form onSubmit={handleVerifyDeleteAuth} className="space-y-4">
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Lock className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Paso 1: Ingrese Credencial Única de Supervisor
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Solo el supervisor institucional autorizado puede habilitar el borrado permanente.
                    </p>
                  </div>

                  {deleteErrorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2 animate-in fade-in">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="font-semibold">{deleteErrorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Usuario de Supervisor:
                      </label>
                      <input
                        type="text"
                        required
                        value={deleteAuthUser}
                        onChange={(e) => setDeleteAuthUser(e.target.value)}
                        placeholder="ej. angel001"
                        autoFocus
                        className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Contraseña Única:
                      </label>
                      <input
                        type="password"
                        required
                        value={deleteAuthPass}
                        onChange={(e) => setDeleteAuthPass(e.target.value)}
                        placeholder="ej. saher002"
                        className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  {/* Acceso rápido de credencial para demostración / prueba */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                    <span>Credenciales autorizadas: <strong>angel001</strong> / <strong>saher002</strong></span>
                    <button
                      type="button"
                      onClick={handleQuickFillDeleteAuth}
                      className="text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Autocompletar
                    </button>
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEvalToDelete(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-md shadow-red-950/20 cursor-pointer"
                    >
                      <span>Validar Credenciales</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </form>
              )}

              {/* PASO 2: Confirmación Definitiva (¿Sí o No?) */}
              {deleteStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-950 space-y-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                        Credenciales Autorizadas (Supervisor angel001)
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-red-900 pt-1">
                      ¿DE VERDAD ESTÁ SEGURO EN ELIMINARLO?
                    </h4>
                    <p className="text-xs leading-relaxed text-red-800 font-medium">
                      Confirme si desea destruir permanentemente el registro de <strong>{evalToDelete.candidate?.nombre} {evalToDelete.candidate?.apellidos}</strong>. Esta acción no se puede deshacer.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEvalToDelete(null)}
                      className="w-full py-3 px-4 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center justify-center space-x-2 cursor-pointer transition shadow-sm"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                      <span>NO, CONSERVAR REGISTRO</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center justify-center space-x-2 cursor-pointer transition shadow-lg shadow-red-950/30 border border-red-500"
                    >
                      <Trash2 className="w-4 h-4 text-amber-300" />
                      <span>SÍ, ELIMINAR DEFINITIVAMENTE</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast de confirmación de eliminación exitosa */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3.5 rounded-2xl border-2 border-emerald-400 shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg('')}
            className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      </div>

      {/* Modal de auditoría y cotejo manual de las 58 preguntas para el psicólogo */}
      {auditingEval && (
        <StudentAuditModal
          evaluation={auditingEval}
          onClose={() => setAuditingEval(null)}
          isPsychologistView={true}
        />
      )}
    </>
  );
}
