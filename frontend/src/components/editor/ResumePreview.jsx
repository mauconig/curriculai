import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import './ResumePreview.css';

/**
 * Componente que renderiza el CV con la plantilla seleccionada
 * @param {Object} data - Datos del CV (personalInfo, experience, education, skills, summary, additionalSections)
 * @param {string} template - ID de la plantilla seleccionada
 */
const ResumePreview = ({ data, template = 'modern' }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    summary = '',
    additionalSections = []
  } = data || {};

  // Obtener iniciales para el avatar placeholder
  const getInitials = () => {
    const first = personalInfo.firstName?.[0] || '';
    const last = personalInfo.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'CV';
  };

  // Formatear fecha
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr === 'Presente' || dateStr === 'Actual') return dateStr;
    return dateStr;
  };

  // Determinar si la plantilla tiene foto
  const hasPhoto = ['modern', 'classic', 'creative', 'executive'].includes(template);

  // Renderizar sección de contacto
  const renderContact = () => (
    <div className="preview-contact-info">
      {personalInfo.email && (
        <span className="contact-item">
          <Mail size={10} />
          {personalInfo.email}
        </span>
      )}
      {personalInfo.phone && (
        <span className="contact-item">
          <Phone size={10} />
          {personalInfo.phone}
        </span>
      )}
      {personalInfo.location && (
        <span className="contact-item">
          <MapPin size={10} />
          {personalInfo.location}
        </span>
      )}
      {personalInfo.linkedin && (
        <span className="contact-item">
          <Linkedin size={10} />
          {personalInfo.linkedin}
        </span>
      )}
      {personalInfo.website && (
        <span className="contact-item">
          <Globe size={10} />
          {personalInfo.website}
        </span>
      )}
    </div>
  );

  // Renderizar sección de experiencia
  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div className="preview-section">
        <h3 className="preview-section-title">EXPERIENCIA PROFESIONAL</h3>
        {experience.map((exp, idx) => (
          <div key={exp.id || idx} className="preview-item">
            <div className="preview-item-header">
              <strong>{exp.position}</strong>
              <span className="preview-date">
                {formatDate(exp.startDate)} — {exp.current ? 'Presente' : formatDate(exp.endDate)}
              </span>
            </div>
            <p className="preview-company">{exp.company}</p>
            {exp.description && (
              <p className="preview-description">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Renderizar sección de educación
  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <div className="preview-section">
        <h3 className="preview-section-title">EDUCACIÓN</h3>
        {education.map((edu, idx) => (
          <div key={edu.id || idx} className="preview-item">
            <div className="preview-item-header">
              <strong>{edu.degree}</strong>
              <span className="preview-date">
                {formatDate(edu.startDate)} — {edu.current ? 'Presente' : formatDate(edu.endDate)}
              </span>
            </div>
            <p className="preview-company">{edu.institution}</p>
            {edu.field && <p className="preview-field">{edu.field}</p>}
            {edu.gpa && <p className="preview-gpa">GPA: {edu.gpa}</p>}
            {edu.description && (
              <p className="preview-description">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Renderizar sección de habilidades
  const renderSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div className="preview-section">
        <h3 className="preview-section-title">HABILIDADES</h3>
        {skills.map((skillGroup, idx) => (
          <div key={skillGroup.id || idx} className="preview-skill-group">
            {skillGroup.category && (
              <span className="preview-skill-category">{skillGroup.category}:</span>
            )}
            <div className="preview-skills-list">
              {(skillGroup.skills || []).map((skill, sIdx) => (
                <span key={sIdx} className="preview-skill">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar secciones adicionales
  const renderAdditionalSections = () => {
    if (!additionalSections || additionalSections.length === 0) return null;

    return additionalSections.map((section) => {
      const sectionTitle = {
        projects: 'PROYECTOS',
        certifications: 'CERTIFICACIONES',
        coursework: 'CURSOS',
        involvement: 'PARTICIPACIÓN',
        academic: 'LOGROS ACADÉMICOS',
        references: 'REFERENCIAS'
      }[section.type] || section.type?.toUpperCase();

      return (
        <div key={section.instanceId} className="preview-section">
          <h3 className="preview-section-title">{sectionTitle}</h3>
          {section.items?.map((item, idx) => (
            <div key={item.id || idx} className="preview-item">
              {section.type === 'projects' && (
                <>
                  <div className="preview-item-header">
                    <strong>{item.name}</strong>
                    {item.link && <span className="preview-link">{item.link}</span>}
                  </div>
                  {item.technologies && (
                    <p className="preview-technologies">{item.technologies}</p>
                  )}
                  {item.description && (
                    <p className="preview-description">{item.description}</p>
                  )}
                </>
              )}
              {section.type === 'certifications' && (
                <>
                  <div className="preview-item-header">
                    <strong>{item.name}</strong>
                    {item.date && <span className="preview-date">{item.date}</span>}
                  </div>
                  {item.issuer && <p className="preview-company">{item.issuer}</p>}
                  {item.credentialId && (
                    <p className="preview-credential">ID: {item.credentialId}</p>
                  )}
                </>
              )}
              {section.type === 'coursework' && (
                <>
                  <div className="preview-item-header">
                    <strong>{item.name}</strong>
                    {item.date && <span className="preview-date">{item.date}</span>}
                  </div>
                  {item.institution && <p className="preview-company">{item.institution}</p>}
                </>
              )}
              {section.type === 'involvement' && (
                <>
                  <div className="preview-item-header">
                    <strong>{item.role}</strong>
                    {item.dates && <span className="preview-date">{item.dates}</span>}
                  </div>
                  {item.organization && <p className="preview-company">{item.organization}</p>}
                  {item.description && (
                    <p className="preview-description">{item.description}</p>
                  )}
                </>
              )}
              {section.type === 'academic' && (
                <>
                  <div className="preview-item-header">
                    <strong>{item.name}</strong>
                    {item.date && <span className="preview-date">{item.date}</span>}
                  </div>
                  {item.issuer && <p className="preview-company">{item.issuer}</p>}
                  {item.description && (
                    <p className="preview-description">{item.description}</p>
                  )}
                </>
              )}
              {section.type === 'references' && (
                <>
                  <strong>{item.name}</strong>
                  {item.position && item.company && (
                    <p className="preview-company">{item.position} en {item.company}</p>
                  )}
                  <div className="preview-reference-contact">
                    {item.email && <span>{item.email}</span>}
                    {item.phone && <span>{item.phone}</span>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className={`resume-preview template-${template}`}>
      <div className="preview-paper">
        {/* Header */}
        <header className="preview-header">
          {hasPhoto && (
            <div className="preview-photo">
              {personalInfo.photo ? (
                <img src={personalInfo.photo} alt="Foto de perfil" />
              ) : (
                <span className="preview-initials">{getInitials()}</span>
              )}
            </div>
          )}
          <div className="preview-header-info">
            <h1 className="preview-name">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {renderContact()}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <div className="preview-section preview-summary">
            <h3 className="preview-section-title">RESUMEN PROFESIONAL</h3>
            <p className="preview-summary-text">{summary}</p>
          </div>
        )}

        {/* Main Content */}
        {renderExperience()}
        {renderEducation()}
        {renderSkills()}
        {renderAdditionalSections()}
      </div>
    </div>
  );
};

export default ResumePreview;
