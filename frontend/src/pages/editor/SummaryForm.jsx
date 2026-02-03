import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import AIButton from '../../components/editor/AIButton';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { BUTTON_LABELS, FORM_LABELS, FORM_PLACEHOLDERS, HELP_TEXTS } from '../../utils/constants';
import toast from 'react-hot-toast';
import './SummaryForm.css';

const MIN_CHARACTERS = 50;
const MAX_CHARACTERS = 500;
const RECOMMENDED_MIN = 100;
const RECOMMENDED_MAX = 300;

const SummaryForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const {
    currentStep,
    resumeData,
    saving,
    updateResumeData,
    nextStep,
    previousStep
  } = useResumeWizard(5, resumeId);

  const [summary, setSummary] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Load existing summary
  useEffect(() => {
    if (resumeData.summary) {
      setSummary(resumeData.summary);
    }
  }, []);

  // Auto-save when summary changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (summary) {
        updateResumeData('summary', summary);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [summary]);

  const handleSummaryChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setSummary(value);
    }
  };

  const getCharacterCountClass = () => {
    const len = summary.length;
    if (len < MIN_CHARACTERS) return 'char-count-low';
    if (len >= RECOMMENDED_MIN && len <= RECOMMENDED_MAX) return 'char-count-optimal';
    if (len > RECOMMENDED_MAX) return 'char-count-high';
    return '';
  };

  const handleAIImprove = async () => {
    if (!summary.trim()) {
      toast.error('Escribe algo primero para que la IA pueda mejorarlo');
      return;
    }

    setAiLoading(true);

    // Simulate AI improvement (will be replaced with actual API call)
    setTimeout(() => {
      // This is a placeholder - in production, this would call the AI API
      toast.success('Funcionalidad de IA próximamente');
      setAiLoading(false);
    }, 1500);
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);

    // Simulate AI generation (will be replaced with actual API call)
    setTimeout(() => {
      // This is a placeholder - in production, this would call the AI API
      toast.success('Funcionalidad de IA próximamente');
      setAiLoading(false);
    }, 1500);
  };

  const validateSummary = () => {
    if (!summary.trim()) {
      toast.error('Escribe un resumen profesional');
      return false;
    }

    if (summary.length < MIN_CHARACTERS) {
      toast.error(`El resumen debe tener al menos ${MIN_CHARACTERS} caracteres`);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateSummary()) {
      return;
    }
    nextStep();
  };

  const handleBack = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate('/dashboard');
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  return (
    <div className="summary-form-page">
      <ConfirmModal
        isOpen={showCancelModal}
        title="¿Cancelar creación del currículum?"
        message="Si vuelves al dashboard, perderás todos los cambios que no se hayan guardado."
        confirmText="Sí, cancelar"
        cancelText="Continuar editando"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
        variant="warning"
      />

      <WizardProgress currentStep={currentStep} />

      <div className="summary-form-container">
        <div className="summary-form-header">
          <div>
            <h1>{FORM_LABELS.summary}</h1>
            <p>{HELP_TEXTS.summary}</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <FileText size={20} className="summary-icon" />
            <span>Tu resumen profesional</span>
          </div>

          <div className="summary-textarea-container">
            <textarea
              value={summary}
              onChange={handleSummaryChange}
              placeholder={FORM_PLACEHOLDERS.summary}
              className="summary-textarea"
              rows={6}
            />

            <div className="summary-footer">
              <div className={`character-count ${getCharacterCountClass()}`}>
                <span>{summary.length}</span>
                <span className="char-separator">/</span>
                <span>{MAX_CHARACTERS}</span>
                {summary.length >= RECOMMENDED_MIN && summary.length <= RECOMMENDED_MAX && (
                  <span className="optimal-badge">Longitud óptima</span>
                )}
              </div>
            </div>
          </div>

          <div className="summary-tips">
            <p className="tips-title">Consejos para un buen resumen:</p>
            <ul>
              <li>Menciona tus años de experiencia y especialización</li>
              <li>Incluye tus principales logros o habilidades</li>
              <li>Adapta el tono al sector donde buscas empleo</li>
              <li>Sé conciso pero impactante (100-300 caracteres ideal)</li>
            </ul>
          </div>

          <div className="ai-buttons-container">
            <AIButton
              onClick={handleAIImprove}
              loading={aiLoading}
              disabled={!summary.trim()}
            >
              {BUTTON_LABELS.improveWithAI}
            </AIButton>
            <AIButton
              onClick={handleAIGenerate}
              loading={aiLoading}
              variant="secondary"
            >
              {BUTTON_LABELS.generateWithAI}
            </AIButton>
          </div>
        </div>

        {/* Navigation */}
        <div className="form-navigation">
          <button
            type="button"
            className="btn-back"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            Volver al Dashboard
          </button>

          <div className="form-navigation-right">
            <div className="auto-save-indicator">
              {saving && <span className="saving-text">Guardando...</span>}
            </div>

            <button
              type="button"
              className="btn-prev"
              onClick={previousStep}
            >
              <ArrowLeft size={18} />
              Anterior
            </button>

            <button
              type="button"
              className="btn-next"
              onClick={handleNext}
            >
              {BUTTON_LABELS.next}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
