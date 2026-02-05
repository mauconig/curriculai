import { useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeftIcon, DownloadIcon, TickIcon, FileIcon, ShareIcon, MailIcon, CopyIcon,
  ClockIcon, CheckmarkCircleIcon, AlertCircleIcon
} from '@hugeicons/core-free-icons';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import WizardProgress from '../../components/editor/WizardProgress';
import ConfirmModal from '../../components/common/ConfirmModal';
import ThemeToggle from '../../components/common/ThemeToggle';
import ResumePreview from '../../components/editor/ResumePreview';
import { useResumeWizard } from '../../hooks/useResumeWizard';
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
    previousStep
  } = useResumeWizard(9, resumeId);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [pageSize, setPageSize] = useState('a4'); // 'a4' or 'letter'
  const pdfContainerRef = useRef(null);

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

    if (!pdfContainerRef.current) {
      toast.error('Error: No se pudo encontrar el contenedor del CV');
      return;
    }

    setIsExporting(true);
    try {
      // Get the paper element inside the container
      const paperElement = pdfContainerRef.current.querySelector('.preview-paper');
      if (!paperElement) {
        throw new Error('No se encontró el elemento del CV');
      }

      // Page dimensions in mm (the template CSS already includes padding: 20mm 18mm)
      const pageDimensions = {
        a4: { width: 210, height: 297 },
        letter: { width: 215.9, height: 279.4 }
      };
      const { width: pageWidth, height: pageHeight } = pageDimensions[pageSize];

      // Use high scale factor for crisp text (4x = ~300 DPI print quality)
      const scale = 4;

      // Query ONLY individual items (not entire sections) - each item is an atomic block
      const items = paperElement.querySelectorAll('.preview-item, .preview-skill-group');
      const pageHeightPx = pageHeight * 3.7795275591; // mm to px at 96 DPI
      const paperRect = paperElement.getBoundingClientRect();

      // Calculate which items would be cut and add spacing to push them to next page
      let accumulatedSpacing = 0;
      const spacers = [];
      let currentPageBottom = pageHeightPx;

      items.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top - paperRect.top + accumulatedSpacing;
        const elementBottom = elementTop + rect.height;

        // If this item would be cut across a page boundary
        if (elementTop < currentPageBottom && elementBottom > currentPageBottom) {
          const overflow = elementBottom - currentPageBottom;

          // If ANY overflow occurs, push entire item to next page
          if (overflow > 0) {
            // Check if this is the first item in a section (title should stay with it)
            const section = element.closest('.preview-section');
            const isFirstItemInSection = section?.querySelector('.preview-item') === element ||
                                          section?.querySelector('.preview-skill-group') === element;

            let targetElement = element;
            let spacerHeight = currentPageBottom - elementTop;

            // If first item in section, push the section title with it
            if (isFirstItemInSection && section) {
              const sectionTop = section.getBoundingClientRect().top - paperRect.top + accumulatedSpacing;
              spacerHeight = currentPageBottom - sectionTop;
              targetElement = section;
            }

            // Add top margin for visual breathing room on new page
            spacerHeight += 80;

            spacers.push({ element: targetElement, spacerHeight });
            accumulatedSpacing += spacerHeight;
            currentPageBottom += pageHeightPx;
          }
        }

        // Move to next page if we've passed the boundary
        while (elementBottom + accumulatedSpacing > currentPageBottom) {
          currentPageBottom += pageHeightPx;
        }
      });

      // Apply spacers to push content to next page
      spacers.forEach(({ element, spacerHeight }) => {
        element.style.marginTop = `${parseFloat(element.style.marginTop || 0) + spacerHeight}px`;
      });

      // Wait for layout to update
      await new Promise(resolve => setTimeout(resolve, 50));

      // Use html2canvas to capture the CV at high resolution
      // Don't remove padding - the template's built-in padding IS the margin
      const canvas = await html2canvas(paperElement, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        letterRendering: true,
        imageTimeout: 0
      });

      // Remove the spacers we added
      spacers.forEach(({ element, spacerHeight }) => {
        const currentMargin = parseFloat(element.style.marginTop || 0);
        element.style.marginTop = `${currentMargin - spacerHeight}px`;
        if (element.style.marginTop === '0px') {
          element.style.marginTop = '';
        }
      });

      // Create PDF with the selected page size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: pageSize === 'a4' ? 'a4' : 'letter',
        compress: true
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Calculate scaling: image should match page width exactly (no extra margins)
      const imgAspectRatio = canvas.width / canvas.height;
      const imgWidthInMm = pageWidth;
      const imgHeightInMm = imgWidthInMm / imgAspectRatio;

      // Calculate how many pages we need
      const totalPages = Math.ceil(imgHeightInMm / pageHeight);

      // For each page, extract the relevant portion
      for (let pageNum = 0; pageNum < totalPages; pageNum++) {
        if (pageNum > 0) {
          pdf.addPage();
        }

        // Calculate the vertical position offset for this page
        // No extra margins - template already has padding built in
        const yOffset = -(pageNum * pageHeight);

        // Add clip region for this page
        pdf.saveGraphicsState();
        pdf.rect(0, 0, pageWidth, pageHeight);
        pdf.clip();
        pdf.discardPath();

        // Add the full image at the calculated offset
        pdf.addImage(
          imgData,
          'PNG',
          0,
          yOffset,
          imgWidthInMm,
          imgHeightInMm
        );

        pdf.restoreGraphicsState();
      }

      // Generate filename
      const fileName = getCVTitle().replace(/\s+/g, '_') || 'Mi_Curriculum';
      pdf.save(`${fileName}_CV.pdf`);

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
      // Generate PDF and save to backend
      const paperElement = pdfContainerRef.current?.querySelector('.preview-paper');
      if (paperElement) {
        // Page dimensions in mm (template CSS already includes padding)
        const pageDimensions = {
          a4: { width: 210, height: 297 },
          letter: { width: 215.9, height: 279.4 }
        };
        const { width: pageWidth, height: pageHeight } = pageDimensions[pageSize];

        const scale = 4;
        const pageHeightPx = pageHeight * 3.7795275591;
        const paperRect = paperElement.getBoundingClientRect();

        // Query ONLY individual items - each item is an atomic block
        const items = paperElement.querySelectorAll('.preview-item, .preview-skill-group');
        let accumulatedSpacing = 0;
        const spacers = [];
        let currentPageBottom = pageHeightPx;

        items.forEach((element) => {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top - paperRect.top + accumulatedSpacing;
          const elementBottom = elementTop + rect.height;

          if (elementTop < currentPageBottom && elementBottom > currentPageBottom) {
            const overflow = elementBottom - currentPageBottom;

            // If ANY overflow occurs, push entire item to next page
            if (overflow > 0) {
              const section = element.closest('.preview-section');
              const isFirstItemInSection = section?.querySelector('.preview-item') === element ||
                                            section?.querySelector('.preview-skill-group') === element;

              let targetElement = element;
              let spacerHeight = currentPageBottom - elementTop;

              if (isFirstItemInSection && section) {
                const sectionTop = section.getBoundingClientRect().top - paperRect.top + accumulatedSpacing;
                spacerHeight = currentPageBottom - sectionTop;
                targetElement = section;
              }

              // Add top margin for visual breathing room on new page
              spacerHeight += 50;

              spacers.push({ element: targetElement, spacerHeight });
              accumulatedSpacing += spacerHeight;
              currentPageBottom += pageHeightPx;
            }
          }

          while (elementBottom + accumulatedSpacing > currentPageBottom) {
            currentPageBottom += pageHeightPx;
          }
        });

        // Apply spacers
        spacers.forEach(({ element, spacerHeight }) => {
          element.style.marginTop = `${parseFloat(element.style.marginTop || 0) + spacerHeight}px`;
        });

        await new Promise(resolve => setTimeout(resolve, 50));

        const canvas = await html2canvas(paperElement, {
          scale: scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          imageTimeout: 0
        });

        // Remove spacers
        spacers.forEach(({ element, spacerHeight }) => {
          const currentMargin = parseFloat(element.style.marginTop || 0);
          element.style.marginTop = `${currentMargin - spacerHeight}px`;
          if (element.style.marginTop === '0px') {
            element.style.marginTop = '';
          }
        });

        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: pageSize === 'a4' ? 'a4' : 'letter',
          compress: true
        });

        const imgData = canvas.toDataURL('image/png');
        const imgAspectRatio = canvas.width / canvas.height;
        const imgWidthInMm = pageWidth;
        const imgHeightInMm = imgWidthInMm / imgAspectRatio;
        const totalPages = Math.ceil(imgHeightInMm / pageHeight);

        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
          if (pageNum > 0) {
            pdf.addPage();
          }

          const yOffset = -(pageNum * pageHeight);

          pdf.saveGraphicsState();
          pdf.rect(0, 0, pageWidth, pageHeight);
          pdf.clip();
          pdf.discardPath();

          pdf.addImage(
            imgData,
            'PNG',
            0,
            yOffset,
            imgWidthInMm,
            imgHeightInMm
          );

          pdf.restoreGraphicsState();
        }

        // Get PDF as base64
        const pdfBase64 = pdf.output('datauristring').split(',')[1];
        const fileName = `${getCVTitle().replace(/\s+/g, '_') || 'Mi_Curriculum'}_CV.pdf`;

        // Save to backend
        await pdfService.savePDF(resumeId, fileName, pdfBase64);
        toast.success('CV guardado exitosamente');
      }
    } catch (error) {
      console.error('Error saving PDF:', error);
      // Don't block navigation if save fails
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
        />
      </div>
    </div>
  );
};

export default ExportForm;
