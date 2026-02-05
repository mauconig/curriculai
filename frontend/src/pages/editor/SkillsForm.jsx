import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from '@hugeicons/core-free-icons';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import SkillCategory from '../../components/editor/SkillCategory';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { BUTTON_LABELS, SKILL_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';
import './SkillsForm.css';

const SkillsForm = () => {
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
  } = useResumeWizard(4, resumeId);

  // Skills structure: { category: string, skills: string[] }[]
  const [skillGroups, setSkillGroups] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Cargar habilidades existentes (solo una vez cuando dataLoaded cambia a true)
  useEffect(() => {
    if (!dataLoaded || initialized) return; // Solo ejecutar una vez

    if (resumeData.skills && resumeData.skills.length > 0) {
      setSkillGroups(resumeData.skills);
    } else {
      // Solo crear categorías por defecto si es la primera vez y no hay datos
      const defaultGroups = SKILL_CATEGORIES.slice(0, 3).map(cat => ({
        category: cat,
        skills: []
      }));
      setSkillGroups(defaultGroups);
    }
    setInitialized(true);
  }, [dataLoaded]);

  // Auto-guardar cuando cambian las habilidades (solo después de inicializar)
  useEffect(() => {
    if (skillGroups.length > 0 && initialized) {
      updateResumeData('skills', skillGroups);
    }
  }, [skillGroups, initialized]);

  const addSkillToCategory = (category, skill) => {
    setSkillGroups(prev => prev.map(group => {
      if (group.category === category) {
        // Evitar duplicados
        if (group.skills.includes(skill)) {
          toast.error('Esta habilidad ya existe en esta categoría');
          return group;
        }
        return { ...group, skills: [...group.skills, skill] };
      }
      return group;
    }));
  };

  const removeSkillFromCategory = (category, skillIndex) => {
    setSkillGroups(prev => prev.map(group => {
      if (group.category === category) {
        return {
          ...group,
          skills: group.skills.filter((_, idx) => idx !== skillIndex)
        };
      }
      return group;
    }));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Ingresa un nombre para la categoría');
      return;
    }

    const exists = skillGroups.some(
      g => g.category.toLowerCase() === newCategoryName.trim().toLowerCase()
    );

    if (exists) {
      toast.error('Esta categoría ya existe');
      return;
    }

    setSkillGroups(prev => [...prev, { category: newCategoryName.trim(), skills: [] }]);
    setNewCategoryName('');
    setShowAddCategory(false);
    toast.success('Categoría añadida');
  };

  const removeCategory = (category) => {
    setSkillGroups(prev => prev.filter(g => g.category !== category));
    toast.success('Categoría eliminada');
  };

  const validateSkills = () => {
    // Debe haber al menos una habilidad en alguna categoría
    const hasSkills = skillGroups.some(group => group.skills.length > 0);

    if (!hasSkills) {
      toast.error('Añade al menos una habilidad');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateSkills()) {
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

  const availableCategories = SKILL_CATEGORIES.filter(
    cat => !skillGroups.some(g => g.category === cat)
  );

  return (
    <div className="skills-form-page">
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

      <div className="skills-form-container">
        <div className="skills-form-header">
          <div>
            <h1>Habilidades</h1>
            <p>Añade tus habilidades organizadas por categorías</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="skill-categories-list">
          {skillGroups.map((group) => (
            <SkillCategory
              key={group.category}
              category={group.category}
              skills={group.skills}
              onAddSkill={addSkillToCategory}
              onRemoveSkill={removeSkillFromCategory}
              onRemoveCategory={removeCategory}
              canRemove={skillGroups.length > 1}
            />
          ))}
        </div>

        {/* Add category section */}
        {showAddCategory ? (
          <div className="add-category-form">
            <div className="add-category-input-group">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nombre de la categoría..."
                className="add-category-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCategory();
                  if (e.key === 'Escape') {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }
                }}
              />
              <button className="add-category-confirm" onClick={addCategory}>
                Añadir
              </button>
              <button
                className="add-category-cancel"
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
              >
                Cancelar
              </button>
            </div>

            {availableCategories.length > 0 && (
              <div className="suggested-categories">
                <span className="suggested-label">Sugerencias:</span>
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    className="suggested-category-btn"
                    onClick={() => {
                      setSkillGroups(prev => [...prev, { category: cat, skills: [] }]);
                      setShowAddCategory(false);
                      toast.success('Categoría añadida');
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button className="add-category-btn" onClick={() => setShowAddCategory(true)}>
            <HugeiconsIcon icon={AddIcon} size={20} />
            Añadir otra categoría
          </button>
        )}

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

export default SkillsForm;
