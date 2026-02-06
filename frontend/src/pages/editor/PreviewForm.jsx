import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeftIcon, ArrowRightIcon, EditIcon, CancelIcon, UserIcon, BriefcaseIcon, MortarboardIcon,
  ToolsIcon, FileIcon, ArrowDownIcon, ArrowUpIcon, ViewOffIcon
} from '@hugeicons/core-free-icons';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import ResumePreview from '../../components/editor/ResumePreview';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { BUTTON_LABELS } from '../../utils/constants';
import toast from 'react-hot-toast';
import './PreviewForm.css';

const EDIT_SECTIONS = [
  { id: 'personalInfo', name: 'Información Personal', icon: UserIcon },
  { id: 'summary', name: 'Resumen Profesional', icon: FileIcon },
  { id: 'experience', name: 'Experiencia', icon: BriefcaseIcon },
  { id: 'education', name: 'Educación', icon: MortarboardIcon },
  { id: 'skills', name: 'Habilidades', icon: ToolsIcon }
];

const PreviewForm = () => {
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
  } = useResumeWizard(7, resumeId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [localData, setLocalData] = useState({});
  const [pageSize, setPageSize] = useState('a4'); // 'a4' or 'letter'
  const [initialized, setInitialized] = useState(false);

  // Sync local data with resumeData (solo una vez cuando dataLoaded cambia a true)
  useEffect(() => {
    if (!dataLoaded || initialized) return; // Solo ejecutar una vez
    setLocalData(resumeData);
    setInitialized(true);
  }, [dataLoaded]);

  const handleOpenEdit = (sectionId) => {
    setEditingSection(sectionId);
    setShowEditPanel(true);
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
  };

  const handleCloseEdit = () => {
    setShowEditPanel(false);
    setEditingSection(null);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Personal Info handlers
  const handlePersonalInfoChange = (field, value) => {
    const updated = { ...localData.personalInfo, [field]: value };
    setLocalData(prev => ({ ...prev, personalInfo: updated }));
    updateResumeData('personalInfo', updated);
  };

  // Summary handler
  const handleSummaryChange = (value) => {
    setLocalData(prev => ({ ...prev, summary: value }));
    updateResumeData('summary', value);
  };

  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    const updated = [...localData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setLocalData(prev => ({ ...prev, experience: updated }));
    updateResumeData('experience', updated);
  };

  // Education handlers
  const handleEducationChange = (index, field, value) => {
    const updated = [...localData.education];
    updated[index] = { ...updated[index], [field]: value };
    setLocalData(prev => ({ ...prev, education: updated }));
    updateResumeData('education', updated);
  };

  // Skills handlers
  const handleSkillChange = (groupIndex, skillIndex, value) => {
    const updated = [...localData.skills];
    const skills = [...(updated[groupIndex].skills || [])];
    skills[skillIndex] = value;
    updated[groupIndex] = { ...updated[groupIndex], skills };
    setLocalData(prev => ({ ...prev, skills: updated }));
    updateResumeData('skills', updated);
  };

  const handleSkillCategoryChange = (groupIndex, value) => {
    const updated = [...localData.skills];
    updated[groupIndex] = { ...updated[groupIndex], category: value };
    setLocalData(prev => ({ ...prev, skills: updated }));
    updateResumeData('skills', updated);
  };

  // Render edit forms
  const renderPersonalInfoEdit = () => (
    <div className="quick-edit-fields">
      <div className="quick-edit-row">
        <div className="quick-edit-field">
          <label>Nombre</label>
          <input
            type="text"
            value={localData.personalInfo?.firstName || ''}
            onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
            placeholder="Juan"
          />
        </div>
        <div className="quick-edit-field">
          <label>Apellido</label>
          <input
            type="text"
            value={localData.personalInfo?.lastName || ''}
            onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
            placeholder="Pérez"
          />
        </div>
      </div>
      <div className="quick-edit-field">
        <label>Email</label>
        <input
          type="email"
          value={localData.personalInfo?.email || ''}
          onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
          placeholder="email@ejemplo.com"
        />
      </div>
      <div className="quick-edit-row">
        <div className="quick-edit-field">
          <label>Teléfono</label>
          <input
            type="tel"
            value={localData.personalInfo?.phone || ''}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            placeholder="+34 600 123 456"
          />
        </div>
        <div className="quick-edit-field">
          <label>Ubicación</label>
          <input
            type="text"
            value={localData.personalInfo?.location || ''}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            placeholder="Madrid, España"
          />
        </div>
      </div>
      <div className="quick-edit-field">
        <label>LinkedIn</label>
        <input
          type="text"
          value={localData.personalInfo?.linkedin || ''}
          onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
          placeholder="linkedin.com/in/usuario"
        />
      </div>
      <div className="quick-edit-field">
        <label>Sitio Web</label>
        <input
          type="text"
          value={localData.personalInfo?.website || ''}
          onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
          placeholder="miportfolio.com"
        />
      </div>
    </div>
  );

  const renderSummaryEdit = () => (
    <div className="quick-edit-fields">
      <div className="quick-edit-field">
        <label>Resumen Profesional</label>
        <textarea
          value={localData.summary || ''}
          onChange={(e) => handleSummaryChange(e.target.value)}
          placeholder="Describe tu perfil profesional..."
          rows={6}
        />
        <span className="char-count">{(localData.summary || '').length} caracteres</span>
      </div>
    </div>
  );

  const renderExperienceEdit = () => (
    <div className="quick-edit-fields">
      {(localData.experience || []).map((exp, index) => (
        <div key={exp.id || index} className="quick-edit-item">
          <div className="quick-edit-item-header">
            <span className="item-number">#{index + 1}</span>
            <strong>{exp.position || 'Nueva experiencia'}</strong>
          </div>
          <div className="quick-edit-row">
            <div className="quick-edit-field">
              <label>Puesto</label>
              <input
                type="text"
                value={exp.position || ''}
                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                placeholder="Desarrollador"
              />
            </div>
            <div className="quick-edit-field">
              <label>Empresa</label>
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                placeholder="Empresa S.A."
              />
            </div>
          </div>
          <div className="quick-edit-field">
            <label>Descripción</label>
            <textarea
              value={exp.description || ''}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              placeholder="Describe tus responsabilidades..."
              rows={3}
            />
          </div>
        </div>
      ))}
      {(localData.experience || []).length === 0 && (
        <p className="empty-message">No hay experiencias. Vuelve al paso 2 para añadir.</p>
      )}
    </div>
  );

  const renderEducationEdit = () => (
    <div className="quick-edit-fields">
      {(localData.education || []).map((edu, index) => (
        <div key={edu.id || index} className="quick-edit-item">
          <div className="quick-edit-item-header">
            <span className="item-number">#{index + 1}</span>
            <strong>{edu.degree || 'Nueva educación'}</strong>
          </div>
          <div className="quick-edit-row">
            <div className="quick-edit-field">
              <label>Título</label>
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                placeholder="Licenciatura"
              />
            </div>
            <div className="quick-edit-field">
              <label>Institución</label>
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                placeholder="Universidad"
              />
            </div>
          </div>
          <div className="quick-edit-row">
            <div className="quick-edit-field">
              <label>Campo de Estudio</label>
              <input
                type="text"
                value={edu.field || ''}
                onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                placeholder="Ingeniería"
              />
            </div>
            <div className="quick-edit-field">
              <label>GPA (Opcional)</label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                placeholder="3.8 / 4.0"
              />
            </div>
          </div>
        </div>
      ))}
      {(localData.education || []).length === 0 && (
        <p className="empty-message">No hay educación. Vuelve al paso 3 para añadir.</p>
      )}
    </div>
  );

  const renderSkillsEdit = () => (
    <div className="quick-edit-fields">
      {(localData.skills || []).map((group, groupIndex) => (
        <div key={group.id || groupIndex} className="quick-edit-item">
          <div className="quick-edit-field">
            <label>Categoría</label>
            <input
              type="text"
              value={group.category || ''}
              onChange={(e) => handleSkillCategoryChange(groupIndex, e.target.value)}
              placeholder="Técnicas"
            />
          </div>
          <div className="quick-edit-field">
            <label>Habilidades</label>
            <div className="skills-edit-list">
              {(group.skills || []).map((skill, skillIndex) => (
                <input
                  key={skillIndex}
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(groupIndex, skillIndex, e.target.value)}
                  placeholder="Habilidad"
                  className="skill-input"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
      {(localData.skills || []).length === 0 && (
        <p className="empty-message">No hay habilidades. Vuelve al paso 4 para añadir.</p>
      )}
    </div>
  );

  const renderEditContent = () => {
    switch (editingSection) {
      case 'personalInfo':
        return renderPersonalInfoEdit();
      case 'summary':
        return renderSummaryEdit();
      case 'experience':
        return renderExperienceEdit();
      case 'education':
        return renderEducationEdit();
      case 'skills':
        return renderSkillsEdit();
      default:
        return null;
    }
  };

  const handleNext = () => {
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
    <div className="preview-form-page">
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

      <div className="preview-form-container">
        <div className="preview-form-header">
          <div>
            <h1>Vista Previa</h1>
            <p>Revisa cómo quedará tu currículum y haz ajustes rápidos si es necesario</p>
          </div>
          <div className="header-actions">
            <div className="page-size-selector">
              <HugeiconsIcon icon={FileIcon} size={16} />
              <button
                className={`size-btn ${pageSize === 'a4' ? 'active' : ''}`}
                onClick={() => setPageSize('a4')}
              >
                A4
              </button>
              <button
                className={`size-btn ${pageSize === 'letter' ? 'active' : ''}`}
                onClick={() => setPageSize('letter')}
              >
                Carta
              </button>
            </div>
            <button
              className={`toggle-edit-btn ${showEditPanel ? 'active' : ''}`}
              onClick={() => setShowEditPanel(!showEditPanel)}
            >
              {showEditPanel ? <HugeiconsIcon icon={ViewOffIcon} size={18} /> : <HugeiconsIcon icon={EditIcon} size={18} />}
              {showEditPanel ? 'Ocultar Editor' : 'Edición Rápida'}
            </button>
            <ThemeToggle />
          </div>
        </div>

        <div className={`preview-content ${showEditPanel ? 'with-panel' : ''}`}>
          {/* CV Preview */}
          <div className="preview-cv-container">
            <ResumePreview
              data={localData}
              template={localData.template || 'modern'}
              pageSize={pageSize}
              showWatermark={true}
              colorPalette={localData.colorPalette}
            />
          </div>

          {/* Quick Edit Panel */}
          {showEditPanel && (
            <div className="quick-edit-panel">
              <div className="quick-edit-header">
                <h3>Edición Rápida</h3>
                <button className="close-panel-btn" onClick={handleCloseEdit}>
                  <HugeiconsIcon icon={CancelIcon} size={18} />
                </button>
              </div>

              <div className="quick-edit-sections">
                {EDIT_SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isExpanded = expandedSections[section.id];
                  const isActive = editingSection === section.id;

                  return (
                    <div
                      key={section.id}
                      className={`quick-edit-section ${isActive ? 'active' : ''}`}
                    >
                      <button
                        className="quick-edit-section-header"
                        onClick={() => {
                          toggleSection(section.id);
                          setEditingSection(isExpanded ? null : section.id);
                        }}
                      >
                        <div className="section-title">
                          <HugeiconsIcon icon={Icon} size={16} />
                          <span>{section.name}</span>
                        </div>
                        {isExpanded ? <HugeiconsIcon icon={ArrowUpIcon} size={16} /> : <HugeiconsIcon icon={ArrowDownIcon} size={16} />}
                      </button>

                      {isExpanded && (
                        <div className="quick-edit-section-content">
                          {renderEditContent()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="quick-edit-footer">
                <div className="auto-save-note">
                  {saving ? (
                    <span className="saving">Guardando...</span>
                  ) : (
                    <span className="saved">Cambios guardados automáticamente</span>
                  )}
                </div>
              </div>
            </div>
          )}
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

export default PreviewForm;
