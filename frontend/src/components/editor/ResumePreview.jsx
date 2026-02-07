import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { MailIcon, SmartPhoneIcon, LocationIcon, GlobeIcon, LinkedinIcon } from '@hugeicons/core-free-icons';
import { getPaletteStyle } from '../../utils/colorPalettes';
import { SECTION_TITLES_BY_LANGUAGE, DATE_STRINGS_BY_LANGUAGE } from '../../utils/constants';
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
const ResumePreview = forwardRef(({ data, template = 'modern', pageSize = 'a4', showWatermark = false, showPageBreaks = true, colorPalette, language = 'es' }, ref) => {
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

    // Split by newlines, trim each line, remove empties
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const hasBullets = lines.some(l => l.startsWith('•'));

    if (!hasBullets || lines.length <= 1) {
      return <p className="preview-description">{text}</p>;
    }

    return (
      <ul className="preview-description-list">
        {lines.map((line, idx) => (
          <li key={idx}>{line.replace(/^•\s*/, '')}</li>
        ))}
      </ul>
    );
  };
  const {
    personalInfo: origPersonalInfo = {},
    experience: origExperience = [],
    education: origEducation = [],
    skills: origSkills = [],
    summary: origSummary = '',
    additionalSections: origAdditionalSections = []
  } = data || {};

  // Get translation data if language is not Spanish
  const translation = (language !== 'es' && data?.translations?.[language]) || null;

  // Merge translated fields over originals
  const personalInfo = translation?.personalInfo
    ? { ...origPersonalInfo, ...translation.personalInfo }
    : origPersonalInfo;

  const experience = origExperience.map((exp, i) => {
    const t = translation?.experience?.[i];
    return t ? { ...exp, ...t } : exp;
  });

  const education = origEducation.map((edu, i) => {
    const t = translation?.education?.[i];
    return t ? { ...edu, ...t } : edu;
  });

  const skills = origSkills.map((group, i) => {
    const t = translation?.skills?.[i];
    return t ? { ...group, ...t } : group;
  });

  const summary = translation?.summary || origSummary;

  const additionalSections = origAdditionalSections.map((section, i) => {
    const t = translation?.additionalSections?.[i];
    if (!t) return section;
    return {
      ...section,
      items: section.items?.map((item, j) => {
        const ti = t.items?.[j];
        return ti ? { ...item, ...ti } : item;
      })
    };
  });

  // Section titles based on language
  const sectionTitles = SECTION_TITLES_BY_LANGUAGE[language] || SECTION_TITLES_BY_LANGUAGE.es;
  const dateStrings = DATE_STRINGS_BY_LANGUAGE[language] || DATE_STRINGS_BY_LANGUAGE.es;

  // Obtener iniciales para el avatar placeholder
  const getInitials = () => {
    const first = origPersonalInfo.firstName?.[0] || '';
    const last = origPersonalInfo.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'CV';
  };

  // Formatear fecha with language-aware "Presente"/"Actual"
  const formatDate = (dateStr, isCurrent) => {
    if (isCurrent || dateStr === 'Presente' || dateStr === 'Actual') return dateStrings.present;
    if (!dateStr) return '';
    return dateStr;
  };

  // Determinar si la plantilla tiene foto
  const hasPhoto = ['modern', 'classic', 'creative', 'executive', 'elegant', 'bold', 'compact', 'corporate'].includes(template);

  // Renderizar sección de contacto
  const renderContact = () => (
    <div className="preview-contact-info">
      {personalInfo.email && (
        <span className="contact-item">
          <HugeiconsIcon icon={MailIcon} size={10} />
          {personalInfo.email}
        </span>
      )}
      {personalInfo.phone && (
        <span className="contact-item">
          <HugeiconsIcon icon={SmartPhoneIcon} size={10} />
          {personalInfo.phone}
        </span>
      )}
      {personalInfo.location && (
        <span className="contact-item">
          <HugeiconsIcon icon={LocationIcon} size={10} />
          {personalInfo.location}
        </span>
      )}
      {personalInfo.linkedin && (
        <span className="contact-item">
          <HugeiconsIcon icon={LinkedinIcon} size={10} />
          linkedin.com/in/{personalInfo.linkedin}
        </span>
      )}
      {personalInfo.website && (
        <span className="contact-item">
          <HugeiconsIcon icon={GlobeIcon} size={10} />
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
        <h3 className="preview-section-title">{sectionTitles.experience}</h3>
        {experience.map((exp, idx) => (
          <div key={exp.id || idx} className="preview-item">
            <div className="preview-item-header">
              <strong>{exp.position}</strong>
              <span className="preview-date">
                {formatDate(exp.startDate)} — {formatDate(exp.endDate, exp.current)}
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
        <h3 className="preview-section-title">{sectionTitles.education}</h3>
        {education.map((edu, idx) => (
          <div key={edu.id || idx} className="preview-item">
            <div className="preview-item-header">
              <strong>{edu.degree}</strong>
              <span className="preview-date">
                {formatDate(edu.startDate)} — {formatDate(edu.endDate, edu.current)}
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
        <h3 className="preview-section-title">{sectionTitles.skills}</h3>
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
      const sectionTitle = sectionTitles[section.type] || section.type?.toUpperCase();

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
                    <p className="preview-company">{item.position} — {item.company}</p>
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
    <div className={`resume-preview template-${template} page-${pageSize} ${showPageBreaks ? 'show-page-breaks' : ''}`} style={getPaletteStyle(colorPalette, template)}>
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
            <h3 className="preview-section-title">{sectionTitles.summary}</h3>
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
