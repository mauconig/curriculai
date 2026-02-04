import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import CustomDatePicker from '../common/CustomDatePicker';
import { FORM_LABELS, FORM_PLACEHOLDERS } from '../../utils/constants';
import './EducationItem.css';

const EducationItem = ({ education, index, onUpdate, onRemove, canRemove }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const handleChange = (field, value) => {
    onUpdate(education.id, field, value);
  };

  const handleCurrentChange = (checked) => {
    handleChange('current', checked);
    if (checked) {
      handleChange('endDate', '');
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      // Si selecciona una fecha, desmarcar "cursando actualmente"
      if (education.current) {
        handleChange('current', false);
      }
      handleChange('endDate', date.toISOString().split('T')[0]);
    } else {
      handleChange('endDate', '');
    }
  };

  return (
    <div className={`education-item ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="education-item-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="education-item-title">
          <span className="education-number">Educación #{index + 1}</span>
          {education.degree && education.institution && (
            <span className="education-preview">
              {education.degree} en {education.institution}
            </span>
          )}
        </div>
        <div className="education-item-actions">
          {canRemove && (
            <button
              type="button"
              className="remove-education-btn"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(education.id);
              }}
              title="Eliminar educación"
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
        <div className="education-item-content">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`institution-${education.id}`}>
                {FORM_LABELS.institution} *
              </label>
              <input
                type="text"
                id={`institution-${education.id}`}
                value={education.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder={FORM_PLACEHOLDERS.institution}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`degree-${education.id}`}>
                {FORM_LABELS.degree} *
              </label>
              <input
                type="text"
                id={`degree-${education.id}`}
                value={education.degree}
                onChange={(e) => handleChange('degree', e.target.value)}
                placeholder={FORM_PLACEHOLDERS.degree}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`field-${education.id}`}>
              {FORM_LABELS.field} *
            </label>
            <input
              type="text"
              id={`field-${education.id}`}
              value={education.field}
              onChange={(e) => handleChange('field', e.target.value)}
              placeholder={FORM_PLACEHOLDERS.field}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`startDate-${education.id}`}>
                {FORM_LABELS.startDate} *
              </label>
              <CustomDatePicker
                selected={education.startDate ? new Date(education.startDate) : null}
                onChange={(date) => handleChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                placeholderText="Selecciona fecha de inicio"
                maxDate={education.endDate ? new Date(education.endDate) : new Date()}
              />
            </div>

            <div className="form-group">
              <label htmlFor={`endDate-${education.id}`}>
                {FORM_LABELS.endDate} {!education.current && '*'}
              </label>
              <CustomDatePicker
                selected={education.endDate ? new Date(education.endDate) : null}
                onChange={handleEndDateChange}
                placeholderText={education.current ? 'En curso' : 'Selecciona fecha de fin'}
                minDate={education.startDate ? new Date(education.startDate) : null}
                maxDate={new Date()}
                disabled={education.current}
              />
              <div
                className="current-education-toggle"
                onClick={() => handleCurrentChange(!education.current)}
              >
                <span className="current-education-text">Cursando actualmente</span>
                <span className={`current-education-slider ${education.current ? 'checked' : ''}`}></span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={`gpa-${education.id}`}>
              GPA / Promedio (Opcional)
            </label>
            <input
              type="text"
              id={`gpa-${education.id}`}
              value={education.gpa || ''}
              onChange={(e) => handleChange('gpa', e.target.value)}
              placeholder="3.8 / 4.0 o 9.2 / 10"
            />
            <p className="help-text">Incluye tu promedio académico si es relevante para el puesto</p>
          </div>

          <div className="form-group">
            <label htmlFor={`description-${education.id}`}>
              Logros y actividades
            </label>
            <textarea
              id={`description-${education.id}`}
              value={education.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe tus logros académicos, actividades extracurriculares, proyectos destacados..."
              rows={4}
            />
            <p className="help-text">Incluye logros, becas, proyectos destacados o actividades relevantes</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationItem;
