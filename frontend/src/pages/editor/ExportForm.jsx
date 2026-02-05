import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Check, FileText, Share2, Mail, Copy,
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import toast from 'react-hot-toast';
import './ExportForm.css';

const ExportForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const {
    currentStep,
    resumeData,
    previousStep
  } = useResumeWizard(9, resumeId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // TODO: Check real payment status when Stripe is integrated
  // For now, assume payment is complete since it's a mockup
  const isPaid = true;

  const handleBack = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate('/dashboard');
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
  };

  const handleExportPDF = async () => {
    if (!isPaid) {
      toast.error('Debes completar el pago para exportar sin marca de agua');
      return;
    }

    setIsExporting(true);
    try {
      // TODO: Implement actual PDF export
      await new Promise(resolve => setTimeout(resolve, 2000));
      setExportComplete(true);
      toast.success('CV exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar el CV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    // TODO: Implement share link
    toast('Funcion disponible proximamente', { icon: '🔜' });
  };

  const handleEmailCV = () => {
    // TODO: Implement email CV
    toast('Funcion disponible proximamente', { icon: '🔜' });
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  // Get CV title from data
  const getCVTitle = () => {
    const { personalInfo } = resumeData;
    if (personalInfo?.firstName && personalInfo?.lastName) {
      return `${personalInfo.firstName} ${personalInfo.lastName}`;
    }
    return 'Mi Curriculum';
  };

  return (
    <div className="export-form-page">
      <ConfirmModal
        isOpen={showCancelModal}
        title="¿Volver al dashboard?"
        message="Tu curriculum esta guardado. Puedes volver a exportarlo en cualquier momento."
        confirmText="Si, ir al dashboard"
        cancelText="Continuar aqui"
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
        variant="info"
      />

      <WizardProgress currentStep={currentStep} />

      <div className="export-form-container">
        <div className="export-form-header">
          <div>
            <h1>Exportar Curriculum</h1>
            <p>Descarga tu curriculum profesional en formato PDF</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="export-content">
          {/* Export Status Card */}
          <div className="export-card status-card">
            <div className="status-icon-wrapper">
              {isPaid ? (
                <CheckCircle size={48} className="status-icon success" />
              ) : (
                <AlertCircle size={48} className="status-icon warning" />
              )}
            </div>

            <div className="status-info">
              <h2>{isPaid ? 'Pago Completado' : 'Pago Pendiente'}</h2>
              <p>
                {isPaid
                  ? 'Tu curriculum esta listo para exportar sin marca de agua.'
                  : 'Completa el pago para exportar tu curriculum sin marca de agua.'
                }
              </p>
            </div>

            {!isPaid && (
              <button
                className="btn-go-payment"
                onClick={previousStep}
              >
                <ArrowLeft size={18} />
                Volver al Pago
              </button>
            )}
          </div>

          {/* Export Options */}
          <div className="export-options">
            <div className="export-card">
              <div className="card-header">
                <FileText size={24} />
                <h3>Descargar PDF</h3>
              </div>
              <p>Descarga tu curriculum en formato PDF de alta calidad, listo para enviar a empleadores.</p>

              <div className="export-details">
                <div className="detail-item">
                  <Check size={16} />
                  <span>Formato A4 profesional</span>
                </div>
                <div className="detail-item">
                  <Check size={16} />
                  <span>{isPaid ? 'Sin marca de agua' : 'Con marca de agua (demo)'}</span>
                </div>
                <div className="detail-item">
                  <Check size={16} />
                  <span>Optimizado para ATS</span>
                </div>
              </div>

              <button
                className={`btn-export ${isExporting ? 'loading' : ''} ${!isPaid ? 'disabled' : ''}`}
                onClick={handleExportPDF}
                disabled={isExporting || !isPaid}
              >
                {isExporting ? (
                  <>
                    <Clock size={18} className="spinning" />
                    Exportando...
                  </>
                ) : exportComplete ? (
                  <>
                    <CheckCircle size={18} />
                    Exportado
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    {isPaid ? 'Descargar PDF' : 'Pago requerido'}
                  </>
                )}
              </button>
            </div>

            {/* Share Options */}
            <div className="export-card coming-soon-card">
              <div className="coming-soon-badge">Proximamente</div>
              <div className="card-header">
                <Share2 size={24} />
                <h3>Compartir</h3>
              </div>
              <p>Comparte tu curriculum con un enlace unico o envialo por email directamente.</p>

              <div className="share-buttons">
                <button className="btn-share" onClick={handleCopyLink} disabled>
                  <Copy size={16} />
                  Copiar Enlace
                </button>
                <button className="btn-share" onClick={handleEmailCV} disabled>
                  <Mail size={16} />
                  Enviar por Email
                </button>
              </div>
            </div>
          </div>

          {/* CV Summary */}
          <div className="export-card summary-card">
            <h3>Resumen del Curriculum</h3>
            <div className="cv-summary">
              <div className="summary-item">
                <span className="label">Nombre:</span>
                <span className="value">{getCVTitle()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Plantilla:</span>
                <span className="value">{resumeData.template || 'Moderno'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Experiencias:</span>
                <span className="value">{resumeData.experience?.length || 0}</span>
              </div>
              <div className="summary-item">
                <span className="label">Educacion:</span>
                <span className="value">{resumeData.education?.length || 0}</span>
              </div>
              <div className="summary-item">
                <span className="label">Habilidades:</span>
                <span className="value">
                  {resumeData.skills?.reduce((acc, group) => acc + (group.skills?.length || 0), 0) || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="form-navigation">
          <button
            type="button"
            className="btn-back"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            <span>Volver al Dashboard</span>
          </button>

          <div className="form-navigation-right">
            <button
              type="button"
              className="btn-prev"
              onClick={previousStep}
            >
              <ArrowLeft size={18} />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className="btn-finish"
              onClick={handleGoToDashboard}
            >
              <Check size={18} />
              <span>Finalizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportForm;
