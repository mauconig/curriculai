// Textos y constantes en español para la aplicación

export const WIZARD_STEPS = [
  { id: 1, name: 'Contacto', path: '/editor/contacto' },
  { id: 2, name: 'Experiencia', path: '/editor/experiencia' },
  { id: 3, name: 'Educación', path: '/editor/educacion' },
  { id: 4, name: 'Habilidades', path: '/editor/habilidades' },
  { id: 5, name: 'Resumen', path: '/editor/resumen' },
  { id: 6, name: 'Preview', path: '/editor/preview' }
];

export const FORM_LABELS = {
  // Contacto
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'Correo Electrónico',
  phone: 'Teléfono',
  location: 'Ubicación',
  photo: 'Foto de Perfil (Opcional)',

  // Experiencia
  company: 'Empresa',
  position: 'Puesto',
  startDate: 'Fecha de Inicio',
  endDate: 'Fecha de Fin',
  current: 'Trabajo Actual',
  description: 'Descripción',

  // Educación
  institution: 'Institución',
  degree: 'Título',
  field: 'Campo de Estudio',

  // Habilidades
  category: 'Categoría',
  skills: 'Habilidades',

  // Resumen
  summary: 'Resumen Profesional'
};

export const FORM_PLACEHOLDERS = {
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@ejemplo.com',
  phone: '+34 600 123 456',
  location: 'Madrid, España',
  company: 'Empresa S.A.',
  position: 'Desarrollador Full Stack',
  description: 'Describe tus responsabilidades y logros principales...',
  institution: 'Universidad Complutense de Madrid',
  degree: 'Licenciatura',
  field: 'Ingeniería Informática',
  summary: 'Profesional con experiencia en...'
};

export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un correo electrónico válido',
  phone: 'Ingresa un número de teléfono válido',
  minLength: (min) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max) => `Debe tener máximo ${max} caracteres`,
  invalidDate: 'Fecha inválida',
  endDateBeforeStart: 'La fecha de fin debe ser posterior a la de inicio'
};

export const BUTTON_LABELS = {
  next: 'Siguiente',
  previous: 'Anterior',
  save: 'Guardar',
  cancel: 'Cancelar',
  add: 'Añadir',
  remove: 'Eliminar',
  improveWithAI: 'Mejorar con IA',
  generateWithAI: 'Generar con IA',
  uploadPhoto: 'Subir Foto',
  removePhoto: 'Quitar Foto',
  preview: 'Vista Previa',
  exportPDF: 'Exportar PDF',
  finish: 'Finalizar'
};

export const TOAST_MESSAGES = {
  saved: 'Guardado correctamente',
  error: 'Ocurrió un error',
  uploading: 'Subiendo...',
  generating: 'Generando con IA...',
  success: 'Éxito',
  photoUploaded: 'Foto subida correctamente',
  photoRemoved: 'Foto eliminada',
  resumeCreated: 'Currículum creado',
  resumeUpdated: 'Currículum actualizado',
  resumeDeleted: 'Currículum eliminado'
};

export const HELP_TEXTS = {
  photo: 'Sube una foto profesional (opcional). Podrás recortarla a tu gusto. Formatos: JPG, PNG. Máximo 5MB.',
  location: 'Ciudad y país donde resides o buscas empleo',
  summary: 'Un breve párrafo que resuma tu experiencia profesional y objetivos',
  experience: 'Describe tus responsabilidades principales y logros medibles',
  skills: 'Agrupa tus habilidades por categorías (Técnicas, Idiomas, etc.)'
};

export const SKILL_CATEGORIES = [
  'Técnicas',
  'Idiomas',
  'Herramientas',
  'Blandas',
  'Certificaciones'
];

export const DATE_FORMAT = 'MMMM yyyy'; // enero 2023
export const DATE_LOCALE = 'es';
