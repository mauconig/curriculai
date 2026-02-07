import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';

const PAGE_DIMENSIONS = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 }
};

/**
 * Generate a PDF from a container element that holds a ResumePreview.
 * Applies smart page breaks so no item is cut across pages.
 *
 * @param {HTMLElement} containerEl - Element containing .preview-paper
 * @param {Object} options
 * @param {'a4'|'letter'} options.pageSize
 * @param {number} options.scale - pixel ratio (default 4 = ~300 DPI)
 * @param {number} options.breathingRoom - extra px margin at top of new page (default 80)
 * @returns {Promise<{ pdf: jsPDF, totalPages: number }>}
 */
export async function generatePDF(containerEl, { pageSize = 'a4', scale = 4, breathingRoom = 80 } = {}) {
  const paperElement = containerEl.querySelector('.preview-paper');
  if (!paperElement) {
    throw new Error('No se encontró el elemento del CV');
  }

  const { width: pageWidth, height: pageHeight } = PAGE_DIMENSIONS[pageSize];

  // Query individual items (atomic blocks that should not be split)
  const items = paperElement.querySelectorAll('.preview-item, .preview-skill-group');
  const pageHeightPx = pageHeight * 3.7795275591; // mm → px at 96 DPI
  const paperRect = paperElement.getBoundingClientRect();

  // --- Smart page-break algorithm ---
  let accumulatedSpacing = 0;
  const spacers = [];
  let currentPageBottom = pageHeightPx;

  items.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const originalTop = rect.top - paperRect.top;
    const originalBottom = originalTop + rect.height;

    let adjustedTop = originalTop + accumulatedSpacing;
    let adjustedBottom = originalBottom + accumulatedSpacing;

    while (adjustedTop < currentPageBottom && adjustedBottom > currentPageBottom) {
      const section = element.closest('.preview-section');
      const isFirstItemInSection =
        section?.querySelector('.preview-item') === element ||
        section?.querySelector('.preview-skill-group') === element;

      let targetElement = element;
      let spacerHeight = currentPageBottom - adjustedTop;

      if (isFirstItemInSection && section) {
        const sectionOriginalTop = section.getBoundingClientRect().top - paperRect.top;
        const sectionAdjustedTop = sectionOriginalTop + accumulatedSpacing;
        spacerHeight = currentPageBottom - sectionAdjustedTop;
        targetElement = section;
      }

      spacerHeight += breathingRoom;

      spacers.push({ element: targetElement, spacerHeight });
      accumulatedSpacing += spacerHeight;
      currentPageBottom += pageHeightPx;

      adjustedTop = originalTop + accumulatedSpacing;
      adjustedBottom = originalBottom + accumulatedSpacing;
    }

    while (adjustedBottom > currentPageBottom) {
      currentPageBottom += pageHeightPx;
    }
  });

  // Apply spacers
  spacers.forEach(({ element, spacerHeight }) => {
    element.style.marginTop = `${parseFloat(element.style.marginTop || 0) + spacerHeight}px`;
  });

  await new Promise((resolve) => setTimeout(resolve, 50));

  // Capture at high resolution using browser's native SVG renderer
  const canvas = await toCanvas(paperElement, {
    pixelRatio: scale,
    backgroundColor: '#ffffff',
    cacheBusts: true,
    includeQueryParams: true
  });

  // Remove spacers
  spacers.forEach(({ element, spacerHeight }) => {
    const currentMargin = parseFloat(element.style.marginTop || 0);
    element.style.marginTop = `${currentMargin - spacerHeight}px`;
    if (element.style.marginTop === '0px') {
      element.style.marginTop = '';
    }
  });

  // Build PDF
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

    pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidthInMm, imgHeightInMm);

    pdf.restoreGraphicsState();
  }

  return { pdf, totalPages };
}

/** Trigger browser download of a generated PDF. */
export function downloadGeneratedPDF(pdf, fileName) {
  pdf.save(fileName);
}

/** Get base64 string from a generated PDF (for server upload). */
export function getPDFBase64(pdf) {
  return pdf.output('datauristring').split(',')[1];
}
