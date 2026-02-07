import { useState, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DownloadIcon, CancelCircleIcon, FileIcon, ShareIcon,
  CopyIcon, MailIcon, ClockIcon, CheckmarkCircleIcon
} from '@hugeicons/core-free-icons';
import ResumePreview from '../editor/ResumePreview';
import LanguageSelector from '../editor/LanguageSelector';
import aiService from '../../services/aiService';
import pdfService from '../../services/pdfService';
import resumeService from '../../services/resumeService';
import { generatePDF, downloadGeneratedPDF, getPDFBase64 } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';
import './ExportModal.css';

const ExportModal = ({ isOpen, onClose, resume, latestPdf, onResumeUpdated }) => {
  const [pageSize, setPageSize] = useState('a4');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [isQuickDownloading, setIsQuickDownloading] = useState(false);

  // Translation state
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);

  const pdfContainerRef = useRef(null);

  if (!isOpen || !resume) return null;

  const resumeData = resume.data || {};
  const template = resume.template || 'modern';
  const personalInfo = resumeData.personalInfo || {};

  const getCVTitle = () => {
    if (personalInfo.firstName && personalInfo.lastName) {
      return `${personalInfo.firstName} ${personalInfo.lastName}`;
    }
    return 'Mi Curriculum';
  };

  // Build the effective resume data (with translations applied)
  const getEffectiveData = () => {
    if (selectedLanguage === 'es' || !resumeData.translations?.[selectedLanguage]) {
      return resumeData;
    }
    return { ...resumeData, ...resumeData.translations[selectedLanguage] };
  };

  // Translation handler
  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);
    setExportComplete(false);

    if (langCode === 'es') return;
    if (resumeData.translations?.[langCode]) return;

    setIsTranslating(true);
    const translatingToast = toast.loading('Traduciendo curriculum...');
    try {
      const translation = await aiService.translateResume(resumeData, langCode);
      translation.translatedAt = new Date().toISOString();

      const updatedTranslations = { ...(resumeData.translations || {}), [langCode]: translation };
      const updatedData = { ...resumeData, translations: updatedTranslations };

      // Persist to server
      await resumeService.updateResume(resume.id, {
        title: resume.title,
        data: updatedData,
        template
      });

      // Notify parent to sync state
      onResumeUpdated?.({ ...resume, data: updatedData });

      toast.success('Traduccion completada', { id: translatingToast });
    } catch (error) {
      toast.error('Error al traducir: ' + error.message, { id: translatingToast });
      setSelectedLanguage('es');
    } finally {
      setIsTranslating(false);
    }
  };

  // Generate + download PDF
  const handleDownloadPDF = async () => {
    if (!pdfContainerRef.current) {
      toast.error('Error: No se pudo generar el PDF');
      return;
    }

    setIsExporting(true);
    try {
      const { pdf, totalPages } = await generatePDF(pdfContainerRef.current, { pageSize });

      const fileName = getCVTitle().replace(/\s+/g, '_') || 'Mi_Curriculum';
      const langSuffix = selectedLanguage !== 'es' ? `_${selectedLanguage.toUpperCase()}` : '';
      downloadGeneratedPDF(pdf, `${fileName}_CV${langSuffix}.pdf`);

      // Also save to server
      try {
        const pdfBase64 = getPDFBase64(pdf);
        await pdfService.savePDF(resume.id, `${fileName}_CV${langSuffix}.pdf`, pdfBase64);
      } catch {
        // Non-blocking — download already succeeded
      }

      setExportComplete(true);
      toast.success(`PDF descargado (${totalPages} pagina${totalPages > 1 ? 's' : ''})`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setIsExporting(false);
    }
  };

  // Quick download existing PDF from server
  const handleQuickDownload = async () => {
    if (!latestPdf) return;
    setIsQuickDownloading(true);
    try {
      await pdfService.downloadPDF(latestPdf.id, latestPdf.filename);
      toast.success('PDF descargado');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Error al descargar el PDF');
    } finally {
      setIsQuickDownloading(false);
    }
  };

  // Share handlers (WIP)
  const handleCopyLink = () => {
    toast('Funcion disponible proximamente', { icon: '🔜' });
  };

  const handleEmailCV = () => {
    toast('Funcion disponible proximamente', { icon: '🔜' });
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="export-modal-header">
          <h2>Exportar CV</h2>
          <button className="export-modal-close" onClick={onClose}>
            <HugeiconsIcon icon={CancelCircleIcon} size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="export-modal-body">
          {/* Quick download for existing PDF */}
          {latestPdf && (
            <div className="export-modal-quick-download">
              <div className="export-modal-quick-download-info">
                <strong>PDF guardado</strong>
                {latestPdf.filename}
              </div>
              <button
                className="export-modal-quick-download-btn"
                onClick={handleQuickDownload}
                disabled={isQuickDownloading}
              >
                {isQuickDownloading ? (
                  <HugeiconsIcon icon={ClockIcon} size={14} className="export-modal-spinning" />
                ) : (
                  <HugeiconsIcon icon={DownloadIcon} size={14} />
                )}
                Descargar
              </button>
            </div>
          )}

          {/* Language */}
          <div className="export-modal-section">
            <span className="export-modal-section-label">Idioma</span>
            <div className="export-modal-language">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
                translatedAt={resumeData.translations?.[selectedLanguage]?.translatedAt}
              />
            </div>
          </div>

          {/* Page Size */}
          <div className="export-modal-section">
            <span className="export-modal-section-label">Tamano de pagina</span>
            <div className="export-modal-page-size">
              <button
                className={`export-modal-size-btn ${pageSize === 'a4' ? 'active' : ''}`}
                onClick={() => setPageSize('a4')}
              >
                <HugeiconsIcon icon={FileIcon} size={16} />
                A4
              </button>
              <button
                className={`export-modal-size-btn ${pageSize === 'letter' ? 'active' : ''}`}
                onClick={() => setPageSize('letter')}
              >
                <HugeiconsIcon icon={FileIcon} size={16} />
                Carta
              </button>
            </div>
          </div>

          {/* Download Button */}
          <button
            className={`export-modal-download-btn ${exportComplete ? 'success' : ''}`}
            onClick={handleDownloadPDF}
            disabled={isExporting || isTranslating}
          >
            {isExporting ? (
              <>
                <HugeiconsIcon icon={ClockIcon} size={18} className="export-modal-spinning" />
                Generando PDF...
              </>
            ) : exportComplete ? (
              <>
                <HugeiconsIcon icon={CheckmarkCircleIcon} size={18} />
                Descargado
              </>
            ) : (
              <>
                <HugeiconsIcon icon={DownloadIcon} size={18} />
                Descargar PDF
              </>
            )}
          </button>

          <hr className="export-modal-divider" />

          {/* Share (WIP) */}
          <div className="export-modal-section export-modal-share">
            <span className="export-modal-share-badge">Proximamente</span>
            <span className="export-modal-section-label">
              <HugeiconsIcon icon={ShareIcon} size={14} /> Compartir
            </span>
            <div className="export-modal-share-buttons">
              <button className="export-modal-share-btn" onClick={handleCopyLink} disabled>
                <HugeiconsIcon icon={CopyIcon} size={14} />
                Copiar Enlace
              </button>
              <button className="export-modal-share-btn" onClick={handleEmailCV} disabled>
                <HugeiconsIcon icon={MailIcon} size={14} />
                Enviar por Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden PDF Container */}
      <div className="export-modal-pdf-container" ref={pdfContainerRef}>
        <ResumePreview
          data={getEffectiveData()}
          template={template}
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

export default ExportModal;
