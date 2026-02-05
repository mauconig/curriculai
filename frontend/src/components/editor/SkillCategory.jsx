import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelIcon, AddIcon } from '@hugeicons/core-free-icons';
import './SkillCategory.css';

const SkillCategory = ({ category, skills, onAddSkill, onRemoveSkill, onRemoveCategory, canRemove }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAddSkill(category, inputValue.trim());
      setInputValue('');
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAddSkill(category, inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="skill-category">
      <div className="skill-category-header">
        <h3 className="skill-category-title">{category}</h3>
        {canRemove && (
          <button
            type="button"
            className="remove-category-btn"
            onClick={() => onRemoveCategory(category)}
            title="Eliminar categoría"
          >
            <HugeiconsIcon icon={CancelIcon} size={16} />
          </button>
        )}
      </div>

      <div className="skills-container">
        {skills.map((skill, index) => (
          <div key={index} className="skill-tag">
            <span>{skill}</span>
            <button
              type="button"
              className="remove-skill-btn"
              onClick={() => onRemoveSkill(category, index)}
            >
              <HugeiconsIcon icon={CancelIcon} size={14} />
            </button>
          </div>
        ))}

        <div className="skill-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Añadir habilidad..."
            className="skill-input"
          />
          <button
            type="button"
            className="add-skill-btn"
            onClick={handleAddClick}
            disabled={!inputValue.trim()}
          >
            <HugeiconsIcon icon={AddIcon} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCategory;
