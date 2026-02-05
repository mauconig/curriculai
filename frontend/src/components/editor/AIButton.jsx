import { HugeiconsIcon } from '@hugeicons/react';
import { StarsIcon, LoadingIcon } from '@hugeicons/core-free-icons';
import './AIButton.css';

const AIButton = ({ onClick, loading = false, children = 'Mejorar con IA', disabled = false, variant = 'primary' }) => {
  return (
    <button
      className={`ai-button ${variant} ${loading ? 'loading' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <HugeiconsIcon icon={LoadingIcon} size={16} className="ai-button-icon spinning" />
          <span>Generando...</span>
        </>
      ) : (
        <>
          <HugeiconsIcon icon={StarsIcon} size={16} className="ai-button-icon" />
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default AIButton;
