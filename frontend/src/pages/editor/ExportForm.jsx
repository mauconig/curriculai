import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeftIcon, DownloadIcon, TickIcon, FileIcon, ShareIcon, MailIcon, CopyIcon,
  ClockIcon, CheckmarkCircleIcon, AlertCircleIcon
} from '@hugeicons/core-free-icons';
import { generatePDF, downloadGeneratedPDF, getPDFBase64 } from '../../utils/pdfGenerator';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import ResumePreview from '../../components/editor/ResumePreview';
import LanguageSelector from '../../components/editor/LanguageSelector';
import TranslationEditor from '../../components/editor/TranslationEditor';
import { useResumeWizard } from '../../hooks/useResumeWizard';
import aiService from '../../services/aiService';
import pdfService from '../../services/pdfService';
import toast from 'react-hot-toast';
import './ExportForm.css';

const ExportForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const {
    currentStep,
    resumeData,
    updateResumeData,
    previousStep
  } = useResumeWizard(9, resumeId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [pageSize, setPageSize] = useState('a4'); // 'a4' or 'letter'
  const pdfContainerRef = useRef(null);

  // Translation state
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslationEditor, setShowTranslationEditor] = useState(false);

  // TODO: Check real payment status when Stripe is integrated
  // For now, assume payment is complete since it's a mockup
  const isPaid = true;

  // Translation handlers
  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);

    if (langCode === 'es') return;

    // Check if cached translation exists
    if (resumeData.translations?.[langCode]) return;

    // Translate via AI
    setIsTranslating(true);
    const translatingToast = toast.loading('Traduciendo currículum...');
    try {
      const translation = await aiService.translateResume(resumeData, langCode);
      translation.translatedAt = new Date().toISOString();

      const updatedTranslations = { ...(resumeData.translations || {}), [langCode]: translation };
      updateResumeData('translations', updatedTranslations);
      toast.success('Traducción completada', { id: translatingToast });
    } catch (error) {
      toast.error('Error al traducir: ' + error.message, { id: translatingToast });
      setSelectedLanguage('es');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRetranslate = async () => {
    if (selectedLanguage === 'es') return;

    setIsTranslating(true);
    const translatingToast = toast.loading('Re-traduciendo currículum...');
    try {
      const translation = await aiService.translateResume(resumeData, selectedLanguage);
      translation.translatedAt = new Date().toISOString();

      const updatedTranslations = { ...(resumeData.translations || {}), [selectedLanguage]: translation };
      updateResumeData('translations', updatedTranslations);
      toast.success('Re-traducción completada', { id: translatingToast });
    } catch (error) {
      toast.error('Error al re-traducir: ' + error.message, { id: translatingToast });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveTranslation = (updatedTranslation) => {
    const updatedTranslations = {
      ...(resumeData.translations || {}),
      [selectedLanguage]: { ...updatedTranslation, translatedAt: resumeData.translations?.[selectedLanguage]?.translatedAt }
    };
    updateResumeData('translations', updatedTranslations);
    setShowTranslationEditor(false);
    toast.success('Traducción actualizada');
  };

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

    if (!pdfContainerRef.current) {
      toast.error('Error: No se pudo encontrar el contenedor del CV');
      return;
    }

    setIsExporting(true);
    try {
      const { pdf, totalPages } = await generatePDF(pdfContainerRef.current, { pageSize });

      const fileName = getCVTitle().replace(/\s+/g, '_') || 'Mi_Curriculum';
      const langSuffix = selectedLanguage !== 'es' ? `_${selectedLanguage.toUpperCase()}` : '';
      downloadGeneratedPDF(pdf, `${fileName}_CV${langSuffix}.pdf`);

      setExportComplete(true);
      toast.success(`¡CV exportado exitosamente! (${totalPages} página${totalPages > 1 ? 's' : ''})`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error al exportar el CV. Por favor intenta de nuevo.');
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

  const handleGoToDashboard = async () => {
    if (!resumeId) {
      navigate('/dashboard');
      return;
    }

    setIsFinalizing(true);
    try {
      const paperElement = pdfContainerRef.current?.querySelector('.preview-paper');
      if (paperElement) {
        const { pdf } = await generatePDF(pdfContainerRef.current, { pageSize, breathingRoom: 50 });

        const pdfBase64 = getPDFBase64(pdf);
        const langSuffix = selectedLanguage !== 'es' ? `_${selectedLanguage.toUpperCase()}` : '';
        const fileName = `${getCVTitle().replace(/\s+/g, '_') || 'Mi_Curriculum'}_CV${langSuffix}.pdf`;

        await pdfService.savePDF(resumeId, fileName, pdfBase64);
        toast.success('CV guardado exitosamente');
      }
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error('No se pudo guardar el PDF, pero puedes descargarlo manualmente');
    } finally {
      setIsFinalizing(false);
      navigate('/dashboard');
    }
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

      {showTranslationEditor && (
        <TranslationEditor
          isOpen={showTranslationEditor}
          onClose={() => setShowTranslationEditor(false)}
          resumeData={resumeData}
          language={selectedLanguage}
          onSave={handleSaveTranslation}
        />
      )}

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
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={48} className="status-icon success" />
              ) : (
                <HugeiconsIcon icon={AlertCircleIcon} size={48} className="status-icon warning" />
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
                <HugeiconsIcon icon={ArrowLeftIcon} size={18} />
                Volver al Pago
              </button>
            )}
          </div>

          {/* Export Options */}
          <div className="export-options">
            <div className="export-card">
              <div className="card-header">
                <HugeiconsIcon icon={FileIcon} size={24} />
                <h3>Descargar PDF</h3>
              </div>
              <p>Descarga tu curriculum en formato PDF de alta calidad, listo para enviar a empleadores.</p>

              {/* Language Selector */}
              <div className="language-selector-export">
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  isTranslating={isTranslating}
                  translatedAt={resumeData.translations?.[selectedLanguage]?.translatedAt}
                  onEditTranslation={selectedLanguage !== 'es' && resumeData.translations?.[selectedLanguage]
                    ? () => setShowTranslationEditor(true)
                    : null}
                  onRetranslate={selectedLanguage !== 'es' && resumeData.translations?.[selectedLanguage]
                    ? handleRetranslate
                    : null}
                />
              </div>

              {/* Page Size Selector */}
              <div className="page-size-selector-export">
                <label>
                  <HugeiconsIcon icon={FileIcon} size={16} />
                  Tamaño de página:
                </label>
                <div className="page-size-buttons">
                  <button
                    className={`size-btn ${pageSize === 'a4' ? 'active' : ''}`}
                    onClick={() => setPageSize('a4')}
                    type="button"
                  >
                    A4
                  </button>
                  <button
                    className={`size-btn ${pageSize === 'letter' ? 'active' : ''}`}
                    onClick={() => setPageSize('letter')}
                    type="button"
                  >
                    Carta
                  </button>
                </div>
              </div>

              <div className="export-details">
                <div className="detail-item">
                  <HugeiconsIcon icon={TickIcon} size={16} />
                  <span>Formato {pageSize === 'a4' ? 'A4' : 'Carta'} profesional</span>
                </div>
                <div className="detail-item">
                  <HugeiconsIcon icon={TickIcon} size={16} />
                  <span>{isPaid ? 'Sin marca de agua' : 'Con marca de agua (demo)'}</span>
                </div>
                <div className="detail-item">
                  <HugeiconsIcon icon={TickIcon} size={16} />
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
                    <HugeiconsIcon icon={ClockIcon} size={18} className="spinning" />
                    Generando PDF...
                  </>
                ) : exportComplete ? (
                  <>
                    <HugeiconsIcon icon={CheckmarkCircleIcon} size={18} />
                    ¡Descargado!
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={DownloadIcon} size={18} />
                    {isPaid ? 'Descargar PDF' : 'Pago requerido'}
                  </>
                )}
              </button>
            </div>

            {/* Share Options */}
            <div className="export-card coming-soon-card">
              <div className="coming-soon-badge">Proximamente</div>
              <div className="card-header">
                <HugeiconsIcon icon={ShareIcon} size={24} />
                <h3>Compartir</h3>
              </div>
              <p>Comparte tu curriculum con un enlace unico o envialo por email directamente.</p>

              <div className="share-buttons">
                <button className="btn-share" onClick={handleCopyLink} disabled>
                  <HugeiconsIcon icon={CopyIcon} size={16} />
                  Copiar Enlace
                </button>
                <button className="btn-share" onClick={handleEmailCV} disabled>
                  <HugeiconsIcon icon={MailIcon} size={16} />
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
            <HugeiconsIcon icon={ArrowLeftIcon} size={18} />
            <span>Volver al Dashboard</span>
          </button>

          <div className="form-navigation-right">
            <button
              type="button"
              className="btn-prev"
              onClick={previousStep}
            >
              <HugeiconsIcon icon={ArrowLeftIcon} size={18} />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              className={`btn-finish ${isFinalizing ? 'loading' : ''}`}
              onClick={handleGoToDashboard}
              disabled={isFinalizing}
            >
              {isFinalizing ? (
                <>
                  <HugeiconsIcon icon={ClockIcon} size={18} className="spinning" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={TickIcon} size={18} />
                  <span>Finalizar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden PDF Container - Used for generating the PDF without watermark */}
      <div className="pdf-export-container" ref={pdfContainerRef}>
        <ResumePreview
          data={resumeData}
          template={resumeData.template || 'modern'}
          pageSize={pageSize}
          showWatermark={false}
          showPageBreaks={false}
          colorPalette={resumeData.colorPalette}
          language={selectedLanguage}
        />
      </div>
    </div>
  );
};

export default ExportForm;
