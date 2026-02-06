import { useState, useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { LanguageSkillIcon, ArrowDown01Icon, Loading03Icon, RepeatIcon, Edit02Icon } from '@hugeicons/core-free-icons';
import { SUPPORTED_LANGUAGES } from '../../utils/constants';
import './LanguageSelector.css';

const LanguageSelector = ({
  selectedLanguage,
  onLanguageChange,
  isTranslating,
  translatedAt,
  onEditTranslation,
  onRetranslate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
  const isTranslated = selectedLanguage !== 'es';

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (langCode) => {
    setIsOpen(false);
    if (langCode !== selectedLanguage) {
      onLanguageChange(langCode);
    }
  };

  const formatTranslatedAt = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button
        className={`language-selector-trigger ${isOpen ? 'open' : ''} ${isTranslating ? 'translating' : ''}`}
        onClick={() => !isTranslating && setIsOpen(!isOpen)}
        disabled={isTranslating}
      >
        {isTranslating ? (
          <HugeiconsIcon icon={Loading03Icon} size={16} className="lang-spinner" />
        ) : (
          <HugeiconsIcon icon={LanguageSkillIcon} size={16} />
        )}
        <span className="lang-name">{isTranslating ? 'Traduciendo...' : currentLang.nativeName}</span>
        {!isTranslating && <HugeiconsIcon icon={ArrowDown01Icon} size={14} className={`lang-arrow ${isOpen ? 'rotated' : ''}`} />}
      </button>

      {isTranslated && !isTranslating && (
        <div className="language-actions">
          {onEditTranslation && (
            <button className="lang-action-btn" onClick={onEditTranslation} title="Editar traducción">
              <HugeiconsIcon icon={Edit02Icon} size={14} />
            </button>
          )}
          {onRetranslate && (
            <button className="lang-action-btn" onClick={onRetranslate} title="Re-traducir">
              <HugeiconsIcon icon={RepeatIcon} size={14} />
            </button>
          )}
        </div>
      )}

      {translatedAt && isTranslated && !isTranslating && (
        <span className="translated-at">
          Traducido: {formatTranslatedAt(translatedAt)}
        </span>
      )}

      {isOpen && (
        <div className="language-dropdown">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${lang.code === selectedLanguage ? 'selected' : ''}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="lang-option-native">{lang.nativeName}</span>
              {lang.code === 'es' && <span className="lang-original-badge">Original</span>}
              {lang.code === selectedLanguage && lang.code !== 'es' && (
                <span className="lang-check">&#10003;</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
