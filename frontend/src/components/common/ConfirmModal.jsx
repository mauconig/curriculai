import { AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({
  isOpen,
  title = '¿Estás seguro?',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'warning' // 'warning' | 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-modal-icon ${variant}`}>
          <AlertTriangle size={32} />
        </div>

        <div className="confirm-modal-content">
          <h3>{title}</h3>
          <p>{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button className="confirm-btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`confirm-btn-confirm ${variant}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
