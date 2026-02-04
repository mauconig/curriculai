import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, FileText, Plus, FolderKanban, Award,
  BookOpen, Users, GraduationCap, UserCheck, X, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import AIButton from '../../components/editor/AIButton';
import aiService from '../../services/aiService';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import { BUTTON_LABELS, FORM_LABELS, FORM_PLACEHOLDERS, HELP_TEXTS } from '../../utils/constants';
import toast from 'react-hot-toast';
import './SummaryForm.css';

const MIN_CHARACTERS = 50;
const MAX_CHARACTERS = 500;
const RECOMMENDED_MIN = 100;
const RECOMMENDED_MAX = 300;

// Additional sections configuration
const ADDITIONAL_SECTIONS = [
  {
    id: 'projects',
    name: 'Proyectos',
    icon: FolderKanban,
    description: 'Proyectos personales o profesionales destacados',
    fields: ['name', 'description', 'technologies', 'link']
  },
  {
    id: 'certifications',
    name: 'Certificaciones',
    icon: Award,
    description: 'Certificaciones profesionales obtenidas',
    fields: ['name', 'issuer', 'date', 'credentialId']
  },
  {
    id: 'coursework',
    name: 'Cursos',
    icon: BookOpen,
    description: 'Cursos relevantes completados',
    fields: ['name', 'institution', 'date']
  },
  {
    id: 'involvement',
    name: 'Voluntariado / Actividades',
    icon: Users,
    description: 'Participación en organizaciones o causas sociales',
    fields: ['organization', 'role', 'description', 'dates']
  },
  {
    id: 'academic',
    name: 'Premios y Honores',
    icon: GraduationCap,
    description: 'Reconocimientos académicos o profesionales',
    fields: ['name', 'issuer', 'date', 'description']
  },
  {
    id: 'references',
    name: 'Referencias',
    icon: UserCheck,
    description: 'Contactos profesionales que pueden dar referencias',
    fields: ['name', 'position', 'company', 'email', 'phone']
  }
];

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
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);
  const [additionalSections, setAdditionalSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const addMenuRef = useRef(null);

  // Load existing data
  useEffect(() => {
    if (resumeData.summary) {
      setSummary(resumeData.summary);
    }
    if (resumeData.additionalSections) {
      setAdditionalSections(resumeData.additionalSections);
      // Expand all existing sections by default
      const expanded = {};
      resumeData.additionalSections.forEach(section => {
        expanded[section.instanceId] = true;
      });
      setExpandedSections(expanded);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setShowAddSectionMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Auto-save when additional sections change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateResumeData('additionalSections', additionalSections);
    }, 500);

    return () => clearTimeout(timer);
  }, [additionalSections]);

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
    toast.loading('Mejorando resumen con IA...', { id: 'ai-summary' });

    try {
      const improved = await aiService.improveSummary(summary, resumeData);
      if (improved && improved !== summary) {
        setSummary(improved);
        toast.success('¡Resumen mejorado!', { id: 'ai-summary' });
      } else {
        toast.success('Tu resumen ya está muy bien escrito', { id: 'ai-summary' });
      }
    } catch (error) {
      console.error('Error al mejorar resumen:', error);
      toast.error('Error al mejorar el resumen', { id: 'ai-summary' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);
    toast.loading('Generando resumen con IA...', { id: 'ai-summary' });

    try {
      const generated = await aiService.generateProfessionalSummary(resumeData);
      if (generated) {
        setSummary(generated);
        toast.success('¡Resumen generado!', { id: 'ai-summary' });
      } else {
        toast.error('No se pudo generar el resumen. Completa más información primero.', { id: 'ai-summary' });
      }
    } catch (error) {
      console.error('Error al generar resumen:', error);
      toast.error('Error al generar el resumen', { id: 'ai-summary' });
    } finally {
      setAiLoading(false);
    }
  };

  // Section management functions
  const handleAddSection = (sectionType) => {
    const sectionConfig = ADDITIONAL_SECTIONS.find(s => s.id === sectionType);
    if (!sectionConfig) return;

    const newSection = {
      instanceId: `${sectionType}-${Date.now()}`,
      type: sectionType,
      items: [createEmptyItem(sectionType)]
    };

    setAdditionalSections(prev => [...prev, newSection]);
    setExpandedSections(prev => ({ ...prev, [newSection.instanceId]: true }));
    setShowAddSectionMenu(false);
    toast.success(`Sección "${sectionConfig.name}" añadida`);
  };

  const createEmptyItem = (sectionType) => {
    const baseItem = { id: Date.now().toString() };

    switch (sectionType) {
      case 'projects':
        return { ...baseItem, name: '', description: '', technologies: '', link: '' };
      case 'certifications':
        return { ...baseItem, name: '', issuer: '', date: '', credentialId: '' };
      case 'coursework':
        return { ...baseItem, name: '', institution: '', date: '' };
      case 'involvement':
        return { ...baseItem, organization: '', role: '', description: '', dates: '' };
      case 'academic':
        return { ...baseItem, name: '', issuer: '', date: '', description: '' };
      case 'references':
        return { ...baseItem, name: '', position: '', company: '', email: '', phone: '' };
      default:
        return baseItem;
    }
  };

  const handleRemoveSection = (instanceId) => {
    setAdditionalSections(prev => prev.filter(s => s.instanceId !== instanceId));
    toast.success('Sección eliminada');
  };

  const handleAddItemToSection = (instanceId) => {
    setAdditionalSections(prev => prev.map(section => {
      if (section.instanceId === instanceId) {
        return {
          ...section,
          items: [...section.items, createEmptyItem(section.type)]
        };
      }
      return section;
    }));
  };

  const handleRemoveItemFromSection = (instanceId, itemId) => {
    setAdditionalSections(prev => prev.map(section => {
      if (section.instanceId === instanceId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    }));
  };

  const handleUpdateItem = (instanceId, itemId, field, value) => {
    setAdditionalSections(prev => prev.map(section => {
      if (section.instanceId === instanceId) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === itemId) {
              return { ...item, [field]: value };
            }
            return item;
          })
        };
      }
      return section;
    }));
  };

  const toggleSectionExpanded = (instanceId) => {
    setExpandedSections(prev => ({
      ...prev,
      [instanceId]: !prev[instanceId]
    }));
  };

  const getSectionConfig = (sectionType) => {
    return ADDITIONAL_SECTIONS.find(s => s.id === sectionType);
  };

  const getAvailableSections = () => {
    const addedTypes = additionalSections.map(s => s.type);
    return ADDITIONAL_SECTIONS.filter(s => !addedTypes.includes(s.id));
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

  const renderSectionFields = (section, item) => {
    const config = getSectionConfig(section.type);
    if (!config) return null;

    switch (section.type) {
      case 'projects':
        return (
          <>
            <div className="form-group">
              <label>Nombre del Proyecto *</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'name', e.target.value)}
                placeholder="Mi Proyecto Increíble"
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={item.description}
                onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'description', e.target.value)}
                placeholder="Describe brevemente el proyecto y tu rol..."
                rows={3}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tecnologías</label>
                <input
                  type="text"
                  value={item.technologies}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'technologies', e.target.value)}
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              <div className="form-group">
                <label>Enlace</label>
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'link', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </>
        );

      case 'certifications':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre de la Certificación *</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'name', e.target.value)}
                  placeholder="AWS Solutions Architect"
                />
              </div>
              <div className="form-group">
                <label>Emisor</label>
                <input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'issuer', e.target.value)}
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Obtención</label>
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'date', e.target.value)}
                  placeholder="Enero 2024"
                />
              </div>
              <div className="form-group">
                <label>ID de Credencial</label>
                <input
                  type="text"
                  value={item.credentialId}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'credentialId', e.target.value)}
                  placeholder="ABC123XYZ"
                />
              </div>
            </div>
          </>
        );

      case 'coursework':
        return (
          <>
            <div className="form-group">
              <label>Nombre del Curso *</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'name', e.target.value)}
                placeholder="Machine Learning Avanzado"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Institución</label>
                <input
                  type="text"
                  value={item.institution}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'institution', e.target.value)}
                  placeholder="Coursera / Universidad"
                />
              </div>
              <div className="form-group">
                <label>Fecha de Finalización</label>
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'date', e.target.value)}
                  placeholder="Marzo 2024"
                />
              </div>
            </div>
          </>
        );

      case 'involvement':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Organización *</label>
                <input
                  type="text"
                  value={item.organization}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'organization', e.target.value)}
                  placeholder="Cruz Roja"
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <input
                  type="text"
                  value={item.role}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'role', e.target.value)}
                  placeholder="Voluntario"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={item.description}
                onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'description', e.target.value)}
                placeholder="Describe tu participación..."
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Fechas</label>
              <input
                type="text"
                value={item.dates}
                onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'dates', e.target.value)}
                placeholder="Enero 2023 - Presente"
              />
            </div>
          </>
        );

      case 'academic':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del Premio/Honor *</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'name', e.target.value)}
                  placeholder="Summa Cum Laude"
                />
              </div>
              <div className="form-group">
                <label>Otorgado por</label>
                <input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'issuer', e.target.value)}
                  placeholder="Universidad de Madrid"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'date', e.target.value)}
                  placeholder="2023"
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'description', e.target.value)}
                  placeholder="Breve descripción..."
                />
              </div>
            </div>
          </>
        );

      case 'references':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'name', e.target.value)}
                  placeholder="Juan García López"
                />
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <input
                  type="text"
                  value={item.position}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'position', e.target.value)}
                  placeholder="Director de Tecnología"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Empresa</label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'company', e.target.value)}
                placeholder="TechCorp S.A."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={item.email}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'email', e.target.value)}
                  placeholder="juan.garcia@techcorp.com"
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={item.phone}
                  onChange={(e) => handleUpdateItem(section.instanceId, item.id, 'phone', e.target.value)}
                  placeholder="+34 600 123 456"
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
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

        {/* Additional Sections */}
        {additionalSections.map((section) => {
          const config = getSectionConfig(section.type);
          if (!config) return null;
          const IconComponent = config.icon;
          const isExpanded = expandedSections[section.instanceId];

          return (
            <div key={section.instanceId} className="additional-section-card">
              <div
                className="section-card-header"
                onClick={() => toggleSectionExpanded(section.instanceId)}
              >
                <div className="section-card-title">
                  <IconComponent size={20} className="section-icon" />
                  <span>{config.name}</span>
                  <span className="section-count">({section.items.length})</span>
                </div>
                <div className="section-card-actions">
                  <button
                    type="button"
                    className="remove-section-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSection(section.instanceId);
                    }}
                    title="Eliminar sección"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button type="button" className="toggle-section-btn">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="section-card-content">
                  {section.items.map((item, itemIndex) => (
                    <div key={item.id} className="section-item">
                      <div className="section-item-header">
                        <span className="item-number">{config.name} #{itemIndex + 1}</span>
                        {section.items.length > 1 && (
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() => handleRemoveItemFromSection(section.instanceId, item.id)}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <div className="section-item-fields">
                        {renderSectionFields(section, item)}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-item-btn"
                    onClick={() => handleAddItemToSection(section.instanceId)}
                  >
                    <Plus size={16} />
                    Añadir otro {config.name.toLowerCase().replace(/s$/, '')}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Section Button */}
        {getAvailableSections().length > 0 && (
          <div className="add-section-container" ref={addMenuRef}>
            <button
              type="button"
              className="add-section-btn"
              onClick={() => setShowAddSectionMenu(!showAddSectionMenu)}
            >
              <Plus size={24} />
              <span>Añadir Sección</span>
            </button>

            {showAddSectionMenu && (
              <div className="add-section-menu">
                <div className="add-section-menu-header">
                  <span>Selecciona una sección para añadir</span>
                  <button
                    type="button"
                    className="close-menu-btn"
                    onClick={() => setShowAddSectionMenu(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="add-section-menu-items">
                  {getAvailableSections().map((sectionType) => {
                    const IconComponent = sectionType.icon;
                    return (
                      <button
                        key={sectionType.id}
                        type="button"
                        className="section-option"
                        onClick={() => handleAddSection(sectionType.id)}
                      >
                        <IconComponent size={20} className="section-option-icon" />
                        <div className="section-option-info">
                          <span className="section-option-name">{sectionType.name}</span>
                          <span className="section-option-desc">{sectionType.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
