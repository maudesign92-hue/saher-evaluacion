import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StudentLoginView from './components/StudentLoginView';
import InstructionsView from './components/InstructionsView';
import AssessmentView from './components/AssessmentView';
import ResultsDashboard from './components/ResultsDashboard';
import PsychologistPortal from './components/PsychologistPortal';
import PsychologistLoginModal from './components/PsychologistLoginModal';
import { calculateGlobalResults } from './data/scoringEngine';
import { 
  saveEvaluation, saveDraft, getDraft, 
  consumeTemporaryToken, getPsychologistSession, 
  clearPsychologistSession 
} from './data/storageEngine';
import { INITIAL_CANDIDATE_STATE } from './components/RegistrationForm';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'instructions' | 'assessment' | 'results' | 'psychologist'
  const [candidate, setCandidate] = useState(INITIAL_CANDIDATE_STATE);
  const [studentToken, setStudentToken] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [isPsychologistView, setIsPsychologistView] = useState(false);

  // Estado de autenticación del psicólogo
  const [isPsychologistLoggedIn, setIsPsychologistLoggedIn] = useState(() => {
    return !!getPsychologistSession();
  });
  const [showPsychologistModal, setShowPsychologistModal] = useState(false);

  // Entrada exitosa del aspirante con credencial temporal
  const handleStudentLoginSuccess = ({ token, candidate: candData }) => {
    setStudentToken(token);
    setCandidate({
      ...INITIAL_CANDIDATE_STATE,
      ...candData
    });

    // Revisar si ya existía borrador previo para esta cédula
    const existingDraft = getDraft(candData.cedula);
    if (existingDraft && existingDraft.answers) {
      setAnswers(existingDraft.answers);
    } else {
      setAnswers({});
    }

    setIsPsychologistView(false);
    setCurrentView('instructions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Entrada exitosa del psicólogo con usuario y contraseña
  const handlePsychologistLoginSuccess = (session) => {
    setIsPsychologistLoggedIn(true);
    setCurrentView('psychologist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cierre de sesión del psicólogo
  const handlePsychologistLogout = () => {
    clearPsychologistSession();
    setIsPsychologistLoggedIn(false);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cambio de respuesta en una pregunta
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => {
      const updated = { ...prev };
      if (value === undefined || value === null || value === '') {
        delete updated[questionId];
      } else {
        updated[questionId] = value;
      }
      return updated;
    });
  };

  // Guardar borrador manual durante el examen
  const handleSaveDraft = () => {
    if (candidate && candidate.cedula) {
      saveDraft(candidate.cedula, candidate, answers);
    }
  };

  // Finalizar y calcular evaluación (se consume el token temporal inmediatamente)
  const handleSubmitEvaluation = () => {
    const results = calculateGlobalResults(answers);
    const saved = saveEvaluation({
      candidate,
      answers,
      results
    });

    // Invalidar token temporal para siempre (un solo uso)
    if (studentToken && studentToken.username) {
      consumeTemporaryToken(studentToken.username, saved.id);
    }

    setCurrentEvaluation(saved);
    setIsPsychologistView(false); // El estudiante no tiene permisos de descarga
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Volver a la pantalla de acceso tras terminar
  const handleStartNewEvaluation = () => {
    setStudentToken(null);
    setCandidate(INITIAL_CANDIDATE_STATE);
    setAnswers({});
    setCurrentEvaluation(null);
    setIsPsychologistView(false);
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ver informe desde el portal del psicólogo (con todos los permisos de descarga)
  const handleViewStudentReport = (evalItem) => {
    setCurrentEvaluation(evalItem);
    setIsPsychologistView(true);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfc] text-slate-800 antialiased selection:bg-red-200 selection:text-red-950">
      {/* Barra de Navegación Superior SAHER */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isPsychologistLoggedIn={isPsychologistLoggedIn}
        onOpenPsychologistModal={() => setShowPsychologistModal(true)}
        onLogoutPsychologist={handlePsychologistLogout}
      />

      {/* Vistas Principales */}
      <main className="flex-1">
        {/* 1. Vista de Login del Aspirante con Credenciales Temporales */}
        {currentView === 'login' && (
          <StudentLoginView
            onLoginSuccess={handleStudentLoginSuccess}
          />
        )}

        {/* 2. Vista de Instrucciones y Educación de Escalas (Antes del Cronómetro) */}
        {currentView === 'instructions' && (
          <InstructionsView
            candidate={candidate}
            onStartTest={() => {
              setCurrentView('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 3. Vista de Evaluación con Cronómetro de 20 Minutos */}
        {currentView === 'assessment' && (
          <AssessmentView
            candidate={candidate}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSaveDraft={handleSaveDraft}
            onSubmitEvaluation={handleSubmitEvaluation}
            onBackToProfile={() => setCurrentView('instructions')}
          />
        )}

        {/* 3. Vista de Resultados (Restringida para Aspirante / Completa para Psicólogo) */}
        {currentView === 'results' && currentEvaluation && (
          <ResultsDashboard
            evaluation={currentEvaluation}
            isPsychologistView={isPsychologistView}
            onStartNewEvaluation={handleStartNewEvaluation}
            onOpenPsychologistReview={() => setCurrentView('psychologist')}
          />
        )}

        {/* 4. Portal y Base Interna Protegida del Psicólogo */}
        {currentView === 'psychologist' && (
          <PsychologistPortal
            onViewStudentReport={handleViewStudentReport}
            onReturnToEvaluation={() => setCurrentView('login')}
            onLogout={handlePsychologistLogout}
          />
        )}
      </main>

      {/* Modal de Autenticación para el Psicólogo */}
      <PsychologistLoginModal
        isOpen={showPsychologistModal}
        onClose={() => setShowPsychologistModal(false)}
        onLoginSuccess={handlePsychologistLoginSuccess}
      />
    </div>
  );
}
