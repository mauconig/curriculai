import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configurar axios para incluir credenciales (cookies de sesión)
axios.defaults.withCredentials = true;

/**
 * Servicio de autenticación
 */
class AuthService {
  /**
   * Iniciar login con Google
   * Redirige al usuario a la página de autorización de Google
   */
  loginWithGoogle() {
    window.location.href = `${API_URL}/auth/google`;
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`);
      return response.data;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtener información del usuario actual
   */
  async getCurrentUser() {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return { authenticated: false, user: null };
      }
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  }

  /**
   * Verificar estado de autenticación
   */
  async checkAuthStatus() {
    try {
      const response = await axios.get(`${API_URL}/auth/status`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      return { authenticated: false, user: null };
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  async isAuthenticated() {
    const status = await this.checkAuthStatus();
    return status.authenticated;
  }
}

export default new AuthService();
