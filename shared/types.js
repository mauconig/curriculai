/**
 * Estructura de datos del currículum
 * Compartido entre frontend y backend
 */

export const ResumeSchema = {
  id: 'String',              // ID único (autoincrement de DB)
  userId: 'String',          // ID del usuario propietario
  title: 'String',           // Título del currículum
  createdAt: 'Date',
  updatedAt: 'Date',

  personalInfo: {
    firstName: 'String',
    lastName: 'String',
    email: 'String',
    phone: 'String',
    location: 'String',      // "Madrid, España"
    linkedin: 'String',      // Opcional
    website: 'String',       // Opcional
    summary: 'String'        // Resumen profesional
  },

  experience: [
    {
      id: 'String',
      company: 'String',
      position: 'String',
      location: 'String',
      startDate: 'String',   // "2020-01"
      endDate: 'String',     // "2022-12" o "Presente"
      current: 'Boolean',
      description: 'String',
      achievements: ['String'] // Array de logros
    }
  ],

  education: [
    {
      id: 'String',
      institution: 'String',
      degree: 'String',       // "Licenciatura en Ingeniería"
      field: 'String',        // "Informática"
      location: 'String',
      startDate: 'String',
      endDate: 'String',
      current: 'Boolean',
      description: 'String'
    }
  ],

  skills: [
    {
      id: 'String',
      category: 'String',     // "Técnicas", "Idiomas", "Blandas"
      items: ['String']       // ["React", "Node.js"]
    }
  ],

  template: 'String',         // "modern", "classic", "minimal"
  language: 'es'              // Siempre español
};

/**
 * Función para crear un currículum vacío
 */
export const getEmptyResume = () => ({
  id: null,
  userId: null,
  title: 'Mi Currículum',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  },

  experience: [],
  education: [],
  skills: [],

  template: 'modern',
  language: 'es'
});

/**
 * Templates disponibles
 */
export const TEMPLATES = {
  modern: 'Moderno',
  classic: 'Clásico',
  minimal: 'Minimalista'
};
