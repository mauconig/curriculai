import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true;

const resumeService = {
  /**
   * Crear nuevo currículum
   */
  async createResume(data) {
    const response = await axios.post(`${API_URL}/resumes`, data);
    return response.data;
  },

  /**
   * Obtener todos los currículums del usuario
   */
  async getResumes() {
    const response = await axios.get(`${API_URL}/resumes`);
    return response.data;
  },

  /**
   * Obtener un currículum específico
   */
  async getResume(id) {
    const response = await axios.get(`${API_URL}/resumes/${id}`);
    return response.data;
  },

  /**
   * Actualizar currículum
   */
  async updateResume(id, data) {
    const response = await axios.put(`${API_URL}/resumes/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar currículum
   */
  async deleteResume(id) {
    const response = await axios.delete(`${API_URL}/resumes/${id}`);
    return response.data;
  },

  /**
   * Subir foto de perfil
   */
  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await axios.post(`${API_URL}/photos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  /**
   * Auto-guardar progreso del wizard
   */
  async saveProgress(resumeId, step, data) {
    const response = await axios.patch(`${API_URL}/resumes/${resumeId}/progress`, {
      step,
      data
    });
    return response.data;
  }
};

export default resumeService;
