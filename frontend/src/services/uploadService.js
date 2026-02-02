import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Sube una imagen al servidor (filesystem local)
 * @param {Blob} blob - Blob de la imagen a subir
 * @returns {Promise<string>} - URL de la imagen subida
 */
export const uploadImage = async (blob) => {
  try {
    // Preparar FormData con la imagen
    const formData = new FormData();
    formData.append('photo', blob, `profile-${Date.now()}.jpg`);

    // Subir al backend
    const response = await axios.post(
      `${API_URL}/upload/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Error al subir imagen');
    }

    // Retornar la URL completa de la imagen
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseURL}${response.data.url}`;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw new Error('Error al subir la imagen. Por favor intenta de nuevo.');
  }
};

/**
 * Convierte un blob (imagen recortada) a File para subirlo
 * @param {Blob} blob - Blob de la imagen
 * @param {string} fileName - Nombre del archivo
 * @returns {File} - Archivo listo para subir
 */
export const blobToFile = (blob, fileName) => {
  return new File([blob], fileName, { type: blob.type });
};
