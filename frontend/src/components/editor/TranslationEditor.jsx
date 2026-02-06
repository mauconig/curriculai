import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelIcon, LanguageSkillIcon } from '@hugeicons/core-free-icons';
import { SUPPORTED_LANGUAGES } from '../../utils/constants';
import './TranslationEditor.css';

const TranslationEditor = ({ isOpen, onClose, resumeData, language, onSave }) => {
  const [editedTranslation, setEditedTranslation] = useState(null);

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const translation = resumeData?.translations?.[language];

  useEffect(() => {
    if (translation) {
      setEditedTranslation(JSON.parse(JSON.stringify(translation)));
    }
  }, [language, isOpen]);

  if (!isOpen || !translation || !editedTranslation) return null;

  const updateField = (path, value) => {
    setEditedTranslation(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
        obj = obj[key];
      }
      const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : parseInt(keys[keys.length - 1]);
      obj[lastKey] = value;
      return updated;
    });
  };

  const handleSave = () => {
    onSave(editedTranslation);
  };

  return (
    <div className="translation-editor-overlay" onClick={onClose}>
      <div className="translation-editor" onClick={(e) => e.stopPropagation()}>
        <div className="te-header">
          <div className="te-header-title">
            <HugeiconsIcon icon={LanguageSkillIcon} size={20} />
            <h2>Editar traducción — {langInfo?.nativeName}</h2>
          </div>
          <button className="te-close" onClick={onClose}>
            <HugeiconsIcon icon={CancelIcon} size={20} />
          </button>
        </div>

        <div className="te-body">
          {/* Location */}
          {editedTranslation.personalInfo?.location && (
            <div className="te-section">
              <h3 className="te-section-title">Ubicación</h3>
              <div className="te-field">
                <div className="te-original">{resumeData.personalInfo?.location}</div>
                <input
                  type="text"
                  value={editedTranslation.personalInfo.location}
                  onChange={(e) => updateField('personalInfo.location', e.target.value)}
                  className="te-input"
                />
              </div>
            </div>
          )}

          {/* Summary */}
          {editedTranslation.summary && (
            <div className="te-section">
              <h3 className="te-section-title">Resumen Profesional</h3>
              <div className="te-field">
                <div className="te-original">{resumeData.summary}</div>
                <textarea
                  value={editedTranslation.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  className="te-textarea"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Experience */}
          {editedTranslation.experience?.length > 0 && (
            <div className="te-section">
              <h3 className="te-section-title">Experiencia</h3>
              {editedTranslation.experience.map((exp, i) => (
                <div key={i} className="te-item">
                  <div className="te-item-label">
                    #{i + 1} — {resumeData.experience?.[i]?.company || ''}
                  </div>
                  {exp.position !== undefined && (
                    <div className="te-field">
                      <label className="te-label">Puesto</label>
                      <div className="te-original">{resumeData.experience?.[i]?.position}</div>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateField(`experience.${i}.position`, e.target.value)}
                        className="te-input"
                      />
                    </div>
                  )}
                  {exp.description !== undefined && (
                    <div className="te-field">
                      <label className="te-label">Descripción</label>
                      <div className="te-original">{resumeData.experience?.[i]?.description}</div>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateField(`experience.${i}.description`, e.target.value)}
                        className="te-textarea"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {editedTranslation.education?.length > 0 && (
            <div className="te-section">
              <h3 className="te-section-title">Educación</h3>
              {editedTranslation.education.map((edu, i) => (
                <div key={i} className="te-item">
                  <div className="te-item-label">
                    #{i + 1} — {resumeData.education?.[i]?.institution || ''}
                  </div>
                  {edu.degree !== undefined && (
                    <div className="te-field">
                      <label className="te-label">Título</label>
                      <div className="te-original">{resumeData.education?.[i]?.degree}</div>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateField(`education.${i}.degree`, e.target.value)}
                        className="te-input"
                      />
                    </div>
                  )}
                  {edu.field !== undefined && (
                    <div className="te-field">
                      <label className="te-label">Campo</label>
                      <div className="te-original">{resumeData.education?.[i]?.field}</div>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => updateField(`education.${i}.field`, e.target.value)}
                        className="te-input"
                      />
                    </div>
                  )}
                  {edu.description !== undefined && (
                    <div className="te-field">
                      <label className="te-label">Descripción</label>
                      <div className="te-original">{resumeData.education?.[i]?.description}</div>
                      <textarea
                        value={edu.description}
                        onChange={(e) => updateField(`education.${i}.description`, e.target.value)}
                        className="te-textarea"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {editedTranslation.skills?.length > 0 && (
            <div className="te-section">
              <h3 className="te-section-title">Habilidades</h3>
              {editedTranslation.skills.map((group, i) => (
                <div key={i} className="te-item">
                  {group.category !== undefined && (
                    <div className="te-field">
                      <label className="te-label">Categoría</label>
                      <div className="te-original">{resumeData.skills?.[i]?.category}</div>
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => updateField(`skills.${i}.category`, e.target.value)}
                        className="te-input"
                      />
                    </div>
                  )}
                  {group.skills && (
                    <div className="te-field">
                      <label className="te-label">Habilidades</label>
                      <div className="te-original">{resumeData.skills?.[i]?.skills?.join(', ')}</div>
                      <div className="te-skills-grid">
                        {group.skills.map((skill, j) => (
                          <input
                            key={j}
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...group.skills];
                              newSkills[j] = e.target.value;
                              updateField(`skills.${i}.skills`, newSkills);
                            }}
                            className="te-skill-input"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="te-footer">
          <button className="te-btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="te-btn-save" onClick={handleSave}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
};

export default TranslationEditor;
