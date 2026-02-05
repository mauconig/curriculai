import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import './ResumePreview.css';

/**
 * Componente que renderiza el CV con la plantilla seleccionada
 * Soporta paginación visual y exportación a PDF
 * @param {Object} data - Datos del CV (personalInfo, experience, education, skills, summary, additionalSections)
 * @param {string} template - ID de la plantilla seleccionada
 * @param {string} pageSize - 'a4' or 'letter'
 * @param {boolean} showWatermark - Mostrar marca de agua
 * @param {boolean} showPageBreaks - Mostrar indicadores de salto de página
 */
const ResumePreview = forwardRef(({ data, template = 'modern', pageSize = 'a4', showWatermark = false, showPageBreaks = true }, ref) => {
  const contentRef = useRef(null);
  const [pageBreakPositions, setPageBreakPositions] = useState([]);

  // Page dimensions in pixels (at 96 DPI for screen)
  // A4: 210mm × 297mm, Letter: 215.9mm × 279.4mm
  // 1mm = 3.7795275591 pixels at 96 DPI
  const MM_TO_PX = 3.7795275591;
  const MARGIN_TOP_MM = 20;
  const MARGIN_BOTTOM_MM = 20;

  const pageDimensions = {
    a4: { widthMm: 210, heightMm: 297 },
    letter: { widthMm: 215.9, heightMm: 279.4 }
  };

  const { heightMm } = pageDimensions[pageSize] || pageDimensions.a4;
  const pageHeightPx = heightMm * MM_TO_PX;
  const printableHeightPx = (heightMm - MARGIN_TOP_MM - MARGIN_BOTTOM_MM) * MM_TO_PX;

  // Calculate page break positions based on content
  const calculatePageBreaks = useCallback(() => {
    if (!contentRef.current || !showPageBreaks) return;

    const sections = contentRef.current.querySelectorAll('.preview-section, .preview-header, .preview-summary');
    const breaks = [];
    let currentPageBottom = printableHeightPx;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      // If section crosses page boundary, add a page break before it
      if (sectionTop < currentPageBottom && sectionBottom > currentPageBottom) {
        // Check if we can fit the section header on this page
        const headerHeight = section.querySelector('.preview-section-title')?.offsetHeight || 40;
        if (sectionTop + headerHeight > currentPageBottom) {
          // Move entire section to next page
          breaks.push(sectionTop);
          currentPageBottom = sectionTop + printableHeightPx;
        } else {
          // Section starts on this page but overflows
          // Find a good break point within the section (between items)
          const items = section.querySelectorAll('.preview-item');
          items.forEach((item) => {
            const itemTop = item.offsetTop;
            const itemBottom = itemTop + item.offsetHeight;
            if (itemTop < currentPageBottom && itemBottom > currentPageBottom) {
              // Add break before this item
              breaks.push(itemTop);
              currentPageBottom = itemTop + printableHeightPx;
            }
          });
        }
      }

      // Check if we've passed a page boundary
      while (sectionBottom > currentPageBottom) {
        currentPageBottom += printableHeightPx;
      }
    });

    setPageBreakPositions(breaks);
  }, [printableHeightPx, showPageBreaks]);

  // Expose methods for PDF generation
  useImperativeHandle(ref, () => ({
    getPageInfo: () => ({
      pageHeightPx,
      printableHeightPx,
      marginTopMm: MARGIN_TOP_MM,
      marginBottomMm: MARGIN_BOTTOM_MM,
      pageBreakPositions,
      contentHeight: contentRef.current?.scrollHeight || 0
    }),
    getContentElement: () => contentRef.current
  }), [pageHeightPx, printableHeightPx, pageBreakPositions]);

  useEffect(() => {
    // Calculate page breaks after render
    const timer = setTimeout(calculatePageBreaks, 100);
    return () => clearTimeout(timer);
  }, [data, template, pageSize, calculatePageBreaks]);

  // Calculate total pages needed
  const totalContentHeight = contentRef.current?.scrollHeight || pageHeightPx;
  const totalPages = Math.ceil(totalContentHeight / printableHeightPx);
  // Renderizar descripción con bullet points en líneas separadas
  const renderDescription = (text) => {
    if (!text) return null;

    // Split by bullet points (• ) and filter empty strings
    const parts = text.split(/(?=•\s)/).filter(part => part.trim());

    if (parts.length <= 1) {
      // No bullet points, render as single paragraph
      return <p className="preview-description">{text}</p>;
    }

    // Multiple bullet points, render as list
    return (
      <ul className="preview-description-list">
        {parts.map((part, idx) => (
          <li key={idx}>{part.replace(/^•\s*/, '')}</li>
        ))}
      </ul>
    );
  };
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
            {exp.description && renderDescription(exp.description)}
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
            {edu.description && renderDescription(edu.description)}
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
                  {item.description && renderDescription(item.description)}
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
                  {item.description && renderDescription(item.description)}
                </>
              )}
              {section.type === 'academic' && (
                <>
                  <div className="preview-item-header">
                    <strong>{item.name}</strong>
                    {item.date && <span className="preview-date">{item.date}</span>}
                  </div>
                  {item.issuer && <p className="preview-company">{item.issuer}</p>}
                  {item.description && renderDescription(item.description)}
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
    <div className={`resume-preview template-${template} page-${pageSize} ${showPageBreaks ? 'show-page-breaks' : ''}`}>
      <div className="preview-paper" ref={contentRef}>
        {showWatermark && <div className="preview-watermark" />}

        {/* Page break indicators */}
        {showPageBreaks && Array.from({ length: totalPages - 1 }, (_, i) => (
          <div
            key={i}
            className="page-break-indicator"
            style={{ top: `${(i + 1) * printableHeightPx}px` }}
          >
            <span className="page-break-label">Página {i + 1} / {totalPages}</span>
            <div className="page-break-line" />
            <span className="page-break-label-next">Página {i + 2}</span>
          </div>
        ))}

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

      {/* Page count indicator */}
      {showPageBreaks && totalPages > 1 && (
        <div className="page-count-indicator">
          Total: {totalPages} páginas
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
