import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from '@hugeicons/core-free-icons';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import EducationItem from '../../components/editor/EducationItem';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { BUTTON_LABELS } from '../../utils/constants';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import './EducationForm.css';

const EducationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const {
    currentStep,
    resumeData,
    saving,
    dataLoaded,
    updateResumeData,
    nextStep,
    previousStep
  } = useResumeWizard(3, resumeId);

  const [educations, setEducations] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cargar educaciones existentes (solo una vez cuando dataLoaded cambia a true)
  useEffect(() => {
    if (!dataLoaded || initialized) return; // Solo ejecutar una vez

    if (resumeData.education && resumeData.education.length > 0) {
      setEducations(resumeData.education);
    } else {
      // Solo crear educación vacía si es la primera vez y no hay datos
      const newEducation = {
        id: nanoid(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
      setEducations([newEducation]);
    }
    setInitialized(true);
  }, [dataLoaded]);

  // Auto-guardar cuando cambian las educaciones (solo después de inicializar)
  useEffect(() => {
    if (educations.length > 0 && initialized) {
      updateResumeData('education', educations);
    }
  }, [educations, initialized]);

  const addEducation = () => {
    const newEducation = {
      id: nanoid(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setEducations([...educations, newEducation]);
  };

  const updateEducation = (id, field, value) => {
    // Si se marca como cursando actualmente, desmarcar las demás
    if (field === 'current' && value === true) {
      setEducations(prev => prev.map(edu =>
        edu.id === id
          ? { ...edu, [field]: value }
          : { ...edu, current: false }
      ));
    } else {
      setEducations(prev => prev.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ));
    }
  };

  const removeEducation = (id) => {
    if (educations.length === 1) {
      toast.error('Debe haber al menos una educación');
      return;
    }
    setEducations(educations.filter(edu => edu.id !== id));
    toast.success('Educación eliminada');
  };

  const validateEducations = () => {
    // Al menos debe haber una educación con datos básicos
    const hasValidEducation = educations.some(edu =>
      edu.institution.trim() && edu.degree.trim() && edu.field.trim()
    );

    if (!hasValidEducation) {
      toast.error('Completa al menos una educación con institución, título y campo');
      return false;
    }

    // Validar fechas
    for (const edu of educations) {
      if (edu.institution.trim() || edu.degree.trim()) {
        if (!edu.startDate) {
          toast.error('Completa la fecha de inicio en todas las educaciones');
          return false;
        }
        if (!edu.current && !edu.endDate) {
          toast.error('Completa la fecha de fin o marca como cursando actualmente');
          return false;
        }
        if (!edu.current && edu.endDate && edu.startDate > edu.endDate) {
          toast.error('La fecha de fin debe ser posterior a la de inicio');
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateEducations()) {
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
    <div className="education-form-page">
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

      <div className="education-form-container">
        <div className="education-form-header">
          <div>
            <h1>Educación</h1>
            <p>Añade tu formación académica más relevante</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="educations-list">
          {educations.map((education, index) => (
            <EducationItem
              key={education.id}
              education={education}
              index={index}
              onUpdate={updateEducation}
              onRemove={removeEducation}
              canRemove={educations.length > 1}
            />
          ))}
        </div>

        <button className="add-education-btn" onClick={addEducation}>
          <HugeiconsIcon icon={AddIcon} size={20} />
          Añadir otra educación
        </button>

        {/* Navigation */}
        <div className="form-navigation">
          <button
            type="button"
            className="btn-back"
            onClick={handleBack}
          >
            <HugeiconsIcon icon={ArrowLeftIcon} size={18} />
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
              <HugeiconsIcon icon={ArrowLeftIcon} size={18} />
              Anterior
            </button>

            <button
              type="button"
              className="btn-next"
              onClick={handleNext}
            >
              {BUTTON_LABELS.next}
              <HugeiconsIcon icon={ArrowRightIcon} size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationForm;
