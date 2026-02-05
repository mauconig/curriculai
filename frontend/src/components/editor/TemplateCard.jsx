import { HugeiconsIcon } from '@hugeicons/react';
import { TickIcon } from '@hugeicons/core-free-icons';
import './TemplateCard.css';

const SAMPLE_DATA = {
  name: 'María García López',
  title: 'Desarrolladora Full Stack',
  email: 'maria.garcia@email.com',
  phone: '+34 612 345 678',
  location: 'Madrid, España',
  summary: 'Desarrolladora con 5+ años de experiencia en aplicaciones web escalables. Especializada en React, Node.js y arquitecturas cloud.',
  experience: [
    {
      position: 'Senior Developer',
      company: 'TechCorp Solutions',
      date: 'Ene 2022 — Presente',
      description: 'Liderazgo técnico de equipo de 5 desarrolladores. Implementación de microservicios.'
    },
    {
      position: 'Full Stack Developer',
      company: 'StartupXYZ',
      date: 'Mar 2019 — Dic 2021',
      description: 'Desarrollo de plataforma e-commerce con React y Node.js.'
    }
  ],
  education: {
    degree: 'Ingeniería Informática',
    institution: 'Universidad Politécnica',
    year: '2019'
  },
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS']
};

const TemplateCard = ({ template, isSelected, onSelect }) => {
  return (
    <div
      className={`template-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(template.id)}
    >
      <div className="template-preview">
        <div className={`template-realistic ${template.style}`}>
          {/* Header Section */}
          <div className="realistic-header">
            {template.hasPhoto && (
              <div className="realistic-photo">
                <span>MG</span>
              </div>
            )}
            <div className="realistic-info">
              <h4 className="realistic-name">{SAMPLE_DATA.name}</h4>
              <p className="realistic-title">{SAMPLE_DATA.title}</p>
              <div className="realistic-contact">
                <span>{SAMPLE_DATA.email}</span>
                <span>{SAMPLE_DATA.phone}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="realistic-section">
            <h5 className="realistic-section-title">RESUMEN</h5>
            <p className="realistic-text">{SAMPLE_DATA.summary}</p>
          </div>

          {/* Experience */}
          <div className="realistic-section">
            <h5 className="realistic-section-title">EXPERIENCIA</h5>
            {SAMPLE_DATA.experience.map((exp, idx) => (
              <div key={idx} className="realistic-item">
                <div className="realistic-item-header">
                  <strong>{exp.position}</strong>
                  <span className="realistic-date">{exp.date}</span>
                </div>
                <p className="realistic-company">{exp.company}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="realistic-section">
            <h5 className="realistic-section-title">HABILIDADES</h5>
            <div className="realistic-skills">
              {SAMPLE_DATA.skills.slice(0, 4).map((skill, idx) => (
                <span key={idx} className="realistic-skill">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="template-selected-badge">
            <HugeiconsIcon icon={TickIcon} size={16} />
          </div>
        )}
      </div>

      <div className="template-info">
        <h3 className="template-name">{template.name}</h3>
        <p className="template-description">{template.description}</p>
      </div>
    </div>
  );
};

export default TemplateCard;
