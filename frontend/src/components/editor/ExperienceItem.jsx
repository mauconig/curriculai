import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import AIButton from './AIButton';
import CustomDatePicker from '../common/CustomDatePicker';
import { FORM_LABELS, FORM_PLACEHOLDERS, HELP_TEXTS } from '../../utils/constants';
import './ExperienceItem.css';

const ExperienceItem = ({ experience, index, onUpdate, onRemove, canRemove }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [improvingWithAI, setImprovingWithAI] = useState(false);

  const handleChange = (field, value) => {
    onUpdate(experience.id, field, value);
  };

  const handleCurrentChange = (checked) => {
    handleChange('current', checked);
    if (checked) {
      handleChange('endDate', '');
    }
  };

  const handleImproveWithAI = async () => {
    if (!experience.description.trim()) {
      return;
    }

    setImprovingWithAI(true);

    // TODO: Implementar llamada real a la API de IA
    // Por ahora simulamos un delay
    setTimeout(() => {
      // Simulación de mejora
      const improved = experience.description.trim() + '\n\n[Versión mejorada por IA - Próximamente]';
      handleChange('description', improved);
      setImprovingWithAI(false);
    }, 2000);
  };

  return (
    <div className={`experience-item ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="experience-item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="experience-item-title">
          <span className="experience-number">Experiencia #{index + 1}</span>
          {experience.position && experience.company && (
            <span className="experience-preview">
              {experience.position} en {experience.company}
            </span>
          )}
        </div>
        <div className="experience-item-actions">
          {canRemove && (
            <button
              type="button"
              className="remove-experience-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(experience.id);
              }}
              title="Eliminar experiencia"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button type="button" className="toggle-btn">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="experience-item-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`company-${experience.id}`}>
                {FORM_LABELS.company} *
              </label>
              <input
                type="text"
                id={`company-${experience.id}`}
                value={experience.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder={FORM_PLACEHOLDERS.company}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`position-${experience.id}`}>
                {FORM_LABELS.position} *
              </label>
              <input
                type="text"
                id={`position-${experience.id}`}
                value={experience.position}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder={FORM_PLACEHOLDERS.position}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`location-${experience.id}`}>
              {FORM_LABELS.location}
            </label>
            <input
              type="text"
              id={`location-${experience.id}`}
              value={experience.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder={FORM_PLACEHOLDERS.location}
            />
          </div>

          <div className="form-group current-job-toggle">
            <label className="toggle-switch-label">
              <input
                type="checkbox"
                checked={experience.current || false}
                onChange={(e) => handleCurrentChange(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Trabajo Actual</span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`startDate-${experience.id}`}>
                {FORM_LABELS.startDate} *
              </label>
              <CustomDatePicker
                selected={experience.startDate ? new Date(experience.startDate) : null}
                onChange={(date) => handleChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                placeholderText="Selecciona fecha de inicio"
                maxDate={experience.endDate ? new Date(experience.endDate) : new Date()}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`endDate-${experience.id}`}>
                {FORM_LABELS.endDate} {!experience.current && '*'}
              </label>
              <CustomDatePicker
                selected={experience.endDate ? new Date(experience.endDate) : null}
                onChange={(date) => handleChange('endDate', date ? date.toISOString().split('T')[0] : '')}
                placeholderText={experience.current ? 'Trabajo actual' : 'Selecciona fecha de fin'}
                disabled={experience.current}
                minDate={experience.startDate ? new Date(experience.startDate) : null}
                maxDate={new Date()}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`description-${experience.id}`}>
              {FORM_LABELS.description}
            </label>
            <textarea
              id={`description-${experience.id}`}
              value={experience.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={FORM_PLACEHOLDERS.description}
              rows={6}
            />
            <p className="help-text">{HELP_TEXTS.experience}</p>
          </div>

          {experience.description.trim() && (
            <div className="ai-improve-section">
              <AIButton
                onClick={handleImproveWithAI}
                loading={improvingWithAI}
                variant="secondary"
              >
                Mejorar descripción con IA
              </AIButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceItem;
