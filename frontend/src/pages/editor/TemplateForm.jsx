import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftIcon, ArrowRightIcon, ImageIcon, ImageNotFoundIcon, SearchAreaIcon, PaintBrushIcon } from '@hugeicons/core-free-icons';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import TemplateCard from '../../components/editor/TemplateCard';
import ColorPaletteSelector from '../../components/editor/ColorPaletteSelector';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { getTemplateSupportsColorPalette } from '../../utils/colorPalettes';
import { BUTTON_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';
import './TemplateForm.css';

const TEMPLATES_WITH_PHOTO = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Diseño limpio con acentos de color',
    style: 'modern',
    hasPhoto: true
  },
  {
    id: 'classic',
    name: 'Clásico',
    description: 'Estilo tradicional y profesional',
    style: 'classic',
    hasPhoto: true
  },
  {
    id: 'creative',
    name: 'Creativo',
    description: 'Ideal para industrias creativas',
    style: 'creative',
    hasPhoto: true
  },
  {
    id: 'executive',
    name: 'Ejecutivo',
    description: 'Perfecto para puestos directivos',
    style: 'executive',
    hasPhoto: true
  },
  {
    id: 'elegant',
    name: 'Elegante',
    description: 'Acento lateral, tipografía refinada',
    style: 'elegant',
    hasPhoto: true
  },
  {
    id: 'bold',
    name: 'Audaz',
    description: 'Tipografía impactante y llamativa',
    style: 'bold',
    hasPhoto: true
  },
  {
    id: 'compact',
    name: 'Compacto',
    description: 'Diseño denso, maximiza el espacio',
    style: 'compact',
    hasPhoto: true
  },
  {
    id: 'corporate',
    name: 'Corporativo',
    description: 'Estructurado, estilo empresarial',
    style: 'corporate',
    hasPhoto: true
  }
];

const TEMPLATES_WITHOUT_PHOTO = [
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Simple y elegante, sin distracciones',
    style: 'minimal',
    hasPhoto: false
  },
  {
    id: 'modern-text',
    name: 'Moderno Texto',
    description: 'Enfocado en el contenido',
    style: 'modern',
    hasPhoto: false
  },
  {
    id: 'classic-text',
    name: 'Clásico Texto',
    description: 'Tradicional sin foto',
    style: 'classic',
    hasPhoto: false
  },
  {
    id: 'elegant-text',
    name: 'Elegante Texto',
    description: 'Elegante sin foto, acento lateral',
    style: 'elegant',
    hasPhoto: false
  },
  {
    id: 'bold-text',
    name: 'Audaz Texto',
    description: 'Impactante sin foto',
    style: 'bold',
    hasPhoto: false
  },
  {
    id: 'compact-text',
    name: 'Compacto Texto',
    description: 'Máximo contenido sin foto',
    style: 'compact',
    hasPhoto: false
  },
  {
    id: 'clean',
    name: 'Limpio',
    description: 'Espacios amplios, líneas finas',
    style: 'clean',
    hasPhoto: false
  },
  {
    id: 'academic',
    name: 'Académico',
    description: 'Ideal para investigación y docencia',
    style: 'academic',
    hasPhoto: false
  }
];

const TEMPLATES_ATS = [
  {
    id: 'ats-standard',
    name: 'ATS Estándar',
    description: 'Máxima compatibilidad con sistemas ATS',
    style: 'ats',
    hasPhoto: false,
    isATS: true
  },
  {
    id: 'ats-professional',
    name: 'ATS Profesional',
    description: 'Formato limpio optimizado para parsing',
    style: 'ats-pro',
    hasPhoto: false,
    isATS: true
  },
  {
    id: 'ats-simple',
    name: 'ATS Simple',
    description: 'Sin formato complejo, 100% legible',
    style: 'ats-simple',
    hasPhoto: false,
    isATS: true
  },
  {
    id: 'ats-modern',
    name: 'ATS Moderno',
    description: 'Compatible ATS con toque moderno',
    style: 'ats-modern',
    hasPhoto: false,
    isATS: true
  }
];

const TemplateForm = () => {
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
  } = useResumeWizard(6, resumeId);

  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load existing template + palette selection (solo una vez cuando dataLoaded cambia a true)
  useEffect(() => {
    if (!dataLoaded || initialized) return;

    if (resumeData.template) {
      setSelectedTemplate(resumeData.template);
    }
    if (resumeData.colorPalette) {
      setSelectedPalette(resumeData.colorPalette);
    }
    setInitialized(true);
  }, [dataLoaded]);

  // Auto-save when template changes (solo después de inicializar)
  useEffect(() => {
    if (selectedTemplate && initialized) {
      updateResumeData('template', selectedTemplate);
    }
  }, [selectedTemplate, initialized]);

  // Auto-save when palette changes
  useEffect(() => {
    if (initialized && selectedPalette) {
      updateResumeData('colorPalette', selectedPalette);
    }
  }, [selectedPalette, initialized]);

  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    toast.success('Plantilla seleccionada');
  };

  const handleNext = () => {
    if (!selectedTemplate) {
      toast.error('Selecciona una plantilla');
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
    <div className="template-form-page">
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

      <div className="template-form-container">
        <div className="template-form-header">
          <div>
            <h1>Elige tu plantilla</h1>
            <p>Selecciona el diseño que mejor represente tu perfil profesional</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Palette Selector - at the top so user picks colors first */}
        <div className="template-category">
          <div className="category-header">
            <HugeiconsIcon icon={PaintBrushIcon} size={20} className="category-icon" />
            <h2>Paleta de colores</h2>
          </div>
          <p className="category-description">
            Elige los colores que se aplicarán a tu plantilla
          </p>
          <ColorPaletteSelector
            selectedPalette={selectedPalette}
            onSelectPalette={(paletteId) => {
              setSelectedPalette(paletteId);
            }}
            templateId={selectedTemplate}
          />
        </div>

        {/* Templates with Photo */}
        <div className="template-category">
          <div className="category-header">
            <HugeiconsIcon icon={ImageIcon} size={20} className="category-icon" />
            <h2>Con foto de perfil</h2>
          </div>
          <div className="templates-grid">
            {TEMPLATES_WITH_PHOTO.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={handleSelectTemplate}
                colorPalette={selectedPalette}
              />
            ))}
          </div>
        </div>

        {/* Templates without Photo */}
        <div className="template-category">
          <div className="category-header">
            <HugeiconsIcon icon={ImageNotFoundIcon} size={20} className="category-icon" />
            <h2>Sin foto de perfil</h2>
          </div>
          <div className="templates-grid">
            {TEMPLATES_WITHOUT_PHOTO.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={handleSelectTemplate}
                colorPalette={selectedPalette}
              />
            ))}
          </div>
        </div>

        {/* ATS Optimized Templates */}
        <div className="template-category">
          <div className="category-header">
            <HugeiconsIcon icon={SearchAreaIcon} size={20} className="category-icon" />
            <h2>Optimizados para ATS</h2>
            <span className="category-badge">Recomendado</span>
          </div>
          <p className="category-description">
            Diseñados para pasar filtros automáticos de selección de personal (Applicant Tracking Systems)
          </p>
          <div className="templates-grid">
            {TEMPLATES_ATS.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
        </div>

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

export default TemplateForm;
