import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import ExperienceItem from '../../components/editor/ExperienceItem';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { BUTTON_LABELS } from '../../utils/constants';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import './ExperienceForm.css';

const ExperienceForm = () => {
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
  } = useResumeWizard(2, resumeId);

  const [experiences, setExperiences] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Cargar experiencias existentes
  useEffect(() => {
    if (resumeData.experience && resumeData.experience.length > 0) {
      setExperiences(resumeData.experience);
    } else {
      // Crear una experiencia vacía por defecto
      addExperience();
    }
  }, []);

  // Auto-guardar cuando cambian las experiencias
  useEffect(() => {
    if (experiences.length > 0) {
      updateResumeData('experience', experiences);
    }
  }, [experiences]);

  const addExperience = () => {
    const newExperience = {
      id: nanoid(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setExperiences([...experiences, newExperience]);
  };

  const updateExperience = (id, field, value) => {
    // Si se marca como trabajo actual, desmarcar las demás
    if (field === 'current' && value === true) {
      setExperiences(experiences.map(exp =>
        exp.id === id
          ? { ...exp, [field]: value }
          : { ...exp, current: false }
      ));
    } else {
      setExperiences(experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ));
    }
  };

  const removeExperience = (id) => {
    if (experiences.length === 1) {
      toast.error('Debe haber al menos una experiencia');
      return;
    }
    setExperiences(experiences.filter(exp => exp.id !== id));
    toast.success('Experiencia eliminada');
  };

  const validateExperiences = () => {
    // Al menos debe haber una experiencia con datos básicos
    const hasValidExperience = experiences.some(exp =>
      exp.company.trim() && exp.position.trim()
    );

    if (!hasValidExperience) {
      toast.error('Completa al menos una experiencia con empresa y puesto');
      return false;
    }

    // Validar fechas
    for (const exp of experiences) {
      if (exp.company.trim() || exp.position.trim()) {
        if (!exp.startDate) {
          toast.error('Completa la fecha de inicio en todas las experiencias');
          return false;
        }
        if (!exp.current && !exp.endDate) {
          toast.error('Completa la fecha de fin o marca como trabajo actual');
          return false;
        }
        if (!exp.current && exp.endDate && exp.startDate > exp.endDate) {
          toast.error('La fecha de fin debe ser posterior a la de inicio');
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateExperiences()) {
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
    <div className="experience-form-page">
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

      <div className="experience-form-container">
        <div className="experience-form-header">
          <div>
            <h1>Experiencia Laboral</h1>
            <p>Añade tu experiencia profesional más relevante</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="experiences-list">
          {experiences.map((experience, index) => (
            <ExperienceItem
              key={experience.id}
              experience={experience}
              index={index}
              onUpdate={updateExperience}
              onRemove={removeExperience}
              canRemove={experiences.length > 1}
            />
          ))}
        </div>

        <button className="add-experience-btn" onClick={addExperience}>
          <Plus size={20} />
          Añadir otra experiencia
        </button>

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

export default ExperienceForm;
