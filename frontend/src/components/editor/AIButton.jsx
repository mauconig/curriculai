import { Sparkles, Loader2 } from 'lucide-react';
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
          <Loader2 size={16} className="ai-button-icon spinning" />
          <span>Generando...</span>
        </>
      ) : (
        <>
          <Sparkles size={16} className="ai-button-icon" />
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default AIButton;
