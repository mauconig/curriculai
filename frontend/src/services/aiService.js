import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true;

const aiService = {
  /**
   * Mejorar descripción de experiencia laboral
   * Transforma texto simple en bullet points de alto impacto con métricas
   */
  async improveExperienceDescription(description, context = {}) {
    try {
      const response = await axios.post(`${API_URL}/ai/improve-experience`, {
        description,
        context
      });
      return response.data.improved;
    } catch (error) {
      console.error('Error al mejorar con IA:', error);
      // Re-throw para que el componente maneje el error
      throw new Error(error.response?.data?.message || 'Error al conectar con el servicio de IA');
    }
  },

  /**
   * Generar resumen profesional basado en experiencias y habilidades
   */
  async generateProfessionalSummary(resumeData) {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-summary`, {
        resumeData
      });
      return response.data.summary;
    } catch (error) {
      console.error('Error al generar resumen:', error);
      throw new Error(error.response?.data?.message || 'Error al conectar con el servicio de IA');
    }
  },

  /**
   * Mejorar resumen existente
   */
  async improveSummary(summary, resumeData) {
    try {
      const response = await axios.post(`${API_URL}/ai/improve-summary`, {
        summary,
        resumeData
      });
      return response.data.improved;
    } catch (error) {
      console.error('Error al mejorar resumen:', error);
      throw new Error(error.response?.data?.message || 'Error al conectar con el servicio de IA');
    }
  }
};

export default aiService;
