// Textos y constantes en español para la aplicación

export const WIZARD_STEPS = [
  { id: 1, name: 'Contacto', path: '/editor/contacto' },
  { id: 2, name: 'Experiencia', path: '/editor/experiencia' },
  { id: 3, name: 'Educación', path: '/editor/educacion' },
  { id: 4, name: 'Habilidades', path: '/editor/habilidades' },
  { id: 5, name: 'Resumen', path: '/editor/resumen' },
  { id: 6, name: 'Plantilla', path: '/editor/plantilla' },
  { id: 7, name: 'Preview', path: '/editor/preview' },
  { id: 8, name: 'Pago', path: '/editor/pago' },
  { id: 9, name: 'Exportación', path: '/editor/exportacion' }
];

export const FORM_LABELS = {
  // Contacto
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'Correo Electrónico',
  phone: 'Teléfono',
  location: 'Ubicación',
  linkedin: 'LinkedIn (Opcional)',
  website: 'Sitio Web / Portfolio (Opcional)',
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
  linkedin: 'linkedin.com/in/juanperez',
  website: 'juanperez.dev',
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
  downloadPDF: 'Descargar PDF',
  finish: 'Finalizar',
  backToDashboard: 'Volver al Dashboard'
};

export const TOAST_MESSAGES = {
  saved: 'Guardado correctamente',
  error: 'Ocurrió un error',
  uploading: 'Subiendo...',
  generating: 'Generando con IA...',
  success: 'Éxito',
  photoUploaded: 'Foto subida correctamente',
  photoRemoved: 'Foto eliminada',
  resumeCreated: 'Currículum creado exitosamente',
  resumeUpdated: 'Currículum actualizado',
  resumeDeleted: 'Currículum eliminado',
  paymentSuccess: 'Pago procesado correctamente',
  paymentError: 'Error al procesar el pago',
  pdfGenerating: 'Generando PDF...',
  pdfReady: 'PDF listo para descargar',
  pdfError: 'Error al generar el PDF'
};

export const HELP_TEXTS = {
  photo: 'Sube una foto profesional (opcional). Podrás recortarla a tu gusto. Formatos: JPG, PNG. Máximo 5MB.',
  location: 'Ciudad y país donde resides o buscas empleo',
  linkedin: 'Añade tu perfil de LinkedIn para que los reclutadores te contacten',
  website: 'Tu portfolio, blog personal o página profesional',
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

// Supported languages for AI resume translation
export const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'en', name: 'Inglés', nativeName: 'English' },
  { code: 'fr', name: 'Francés', nativeName: 'Français' },
  { code: 'de', name: 'Alemán', nativeName: 'Deutsch' },
  { code: 'pt', name: 'Portugués', nativeName: 'Português' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano' },
  { code: 'nl', name: 'Neerlandés', nativeName: 'Nederlands' },
  { code: 'zh', name: 'Chino', nativeName: '中文' },
  { code: 'ja', name: 'Japonés', nativeName: '日本語' },
  { code: 'ko', name: 'Coreano', nativeName: '한국어' }
];

// Section title translations (static, no AI needed)
export const SECTION_TITLES_BY_LANGUAGE = {
  es: { experience: 'EXPERIENCIA PROFESIONAL', education: 'EDUCACIÓN', skills: 'HABILIDADES', summary: 'RESUMEN PROFESIONAL', projects: 'PROYECTOS', certifications: 'CERTIFICACIONES', coursework: 'CURSOS', involvement: 'PARTICIPACIÓN', academic: 'LOGROS ACADÉMICOS', references: 'REFERENCIAS' },
  en: { experience: 'PROFESSIONAL EXPERIENCE', education: 'EDUCATION', skills: 'SKILLS', summary: 'PROFESSIONAL SUMMARY', projects: 'PROJECTS', certifications: 'CERTIFICATIONS', coursework: 'COURSES', involvement: 'INVOLVEMENT', academic: 'ACADEMIC ACHIEVEMENTS', references: 'REFERENCES' },
  fr: { experience: 'EXPÉRIENCE PROFESSIONNELLE', education: 'FORMATION', skills: 'COMPÉTENCES', summary: 'PROFIL PROFESSIONNEL', projects: 'PROJETS', certifications: 'CERTIFICATIONS', coursework: 'COURS', involvement: 'ENGAGEMENT', academic: 'RÉALISATIONS ACADÉMIQUES', references: 'RÉFÉRENCES' },
  de: { experience: 'BERUFSERFAHRUNG', education: 'AUSBILDUNG', skills: 'KENNTNISSE', summary: 'BERUFSPROFIL', projects: 'PROJEKTE', certifications: 'ZERTIFIZIERUNGEN', coursework: 'KURSE', involvement: 'ENGAGEMENT', academic: 'AKADEMISCHE LEISTUNGEN', references: 'REFERENZEN' },
  pt: { experience: 'EXPERIÊNCIA PROFISSIONAL', education: 'FORMAÇÃO', skills: 'COMPETÊNCIAS', summary: 'RESUMO PROFISSIONAL', projects: 'PROJETOS', certifications: 'CERTIFICAÇÕES', coursework: 'CURSOS', involvement: 'PARTICIPAÇÃO', academic: 'CONQUISTAS ACADÊMICAS', references: 'REFERÊNCIAS' },
  it: { experience: 'ESPERIENZA PROFESSIONALE', education: 'FORMAZIONE', skills: 'COMPETENZE', summary: 'PROFILO PROFESSIONALE', projects: 'PROGETTI', certifications: 'CERTIFICAZIONI', coursework: 'CORSI', involvement: 'COINVOLGIMENTO', academic: 'RISULTATI ACCADEMICI', references: 'REFERENZE' },
  nl: { experience: 'WERKERVARING', education: 'OPLEIDING', skills: 'VAARDIGHEDEN', summary: 'PROFESSIONEEL PROFIEL', projects: 'PROJECTEN', certifications: 'CERTIFICERINGEN', coursework: 'CURSUSSEN', involvement: 'BETROKKENHEID', academic: 'ACADEMISCHE PRESTATIES', references: 'REFERENTIES' },
  zh: { experience: '工作经历', education: '教育背景', skills: '专业技能', summary: '职业概述', projects: '项目经历', certifications: '资格认证', coursework: '课程培训', involvement: '社会参与', academic: '学术成就', references: '推荐人' },
  ja: { experience: '職務経歴', education: '学歴', skills: 'スキル', summary: '職務要約', projects: 'プロジェクト', certifications: '資格', coursework: '研修', involvement: '活動', academic: '学術実績', references: '推薦者' },
  ko: { experience: '경력사항', education: '학력', skills: '기술', summary: '경력요약', projects: '프로젝트', certifications: '자격증', coursework: '교육이수', involvement: '활동사항', academic: '학업성과', references: '추천인' }
};

// Date-related string translations
export const DATE_STRINGS_BY_LANGUAGE = {
  es: { present: 'Presente', current: 'Actual' },
  en: { present: 'Present', current: 'Current' },
  fr: { present: 'Présent', current: 'Actuel' },
  de: { present: 'Gegenwart', current: 'Aktuell' },
  pt: { present: 'Presente', current: 'Atual' },
  it: { present: 'Presente', current: 'Attuale' },
  nl: { present: 'Heden', current: 'Huidig' },
  zh: { present: '至今', current: '在职' },
  ja: { present: '現在', current: '在職中' },
  ko: { present: '현재', current: '재직중' }
};
