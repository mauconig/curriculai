import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true;

const pdfService = {
  /**
   * Guardar un nuevo PDF
   * @param {number} resumeId - ID del currículum
   * @param {string} filename - Nombre del archivo
   * @param {string} pdfBase64 - Datos del PDF en base64
   */
  async savePDF(resumeId, filename, pdfBase64) {
    const response = await axios.post(`${API_URL}/pdfs`, {
      resume_id: resumeId,
      filename,
      pdf_data: pdfBase64
    });
    return response.data.pdf;
  },

  /**
   * Obtener todos los PDFs del usuario
   */
  async getPDFs() {
    const response = await axios.get(`${API_URL}/pdfs`);
    return response.data.pdfs;
  },

  /**
   * Obtener PDFs de un currículum específico
   * @param {number} resumeId - ID del currículum
   */
  async getPDFsByResume(resumeId) {
    const response = await axios.get(`${API_URL}/pdfs/resume/${resumeId}`);
    return response.data.pdfs;
  },

  /**
   * Descargar un PDF
   * @param {number} pdfId - ID del PDF
   * @param {string} filename - Nombre del archivo para la descarga
   */
  async downloadPDF(pdfId, filename) {
    const response = await axios.get(`${API_URL}/pdfs/${pdfId}/download`, {
      responseType: 'blob'
    });

    // Crear un enlace de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'curriculum.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  },

  /**
   * Eliminar un PDF
   * @param {number} pdfId - ID del PDF
   */
  async deletePDF(pdfId) {
    const response = await axios.delete(`${API_URL}/pdfs/${pdfId}`);
    return response.data;
  },

  /**
   * Obtener estadísticas de PDFs
   */
  async getStats() {
    const response = await axios.get(`${API_URL}/pdfs/stats`);
    return response.data;
  }
};

export default pdfService;
