/**
 * Color palette definitions for CV templates
 */
export const COLOR_PALETTES = {
  'purple-indigo': {
    id: 'purple-indigo',
    name: 'Violeta',
    colors: {
      '--cv-primary': '#667eea',
      '--cv-secondary': '#764ba2',
      '--cv-primary-light': 'rgba(102, 126, 234, 0.1)',
    }
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Azul',
    colors: {
      '--cv-primary': '#2563eb',
      '--cv-secondary': '#1e40af',
      '--cv-primary-light': 'rgba(37, 99, 235, 0.1)',
    }
  },
  'emerald': {
    id: 'emerald',
    name: 'Esmeralda',
    colors: {
      '--cv-primary': '#059669',
      '--cv-secondary': '#047857',
      '--cv-primary-light': 'rgba(5, 150, 105, 0.1)',
    }
  },
  'teal': {
    id: 'teal',
    name: 'Verde Azulado',
    colors: {
      '--cv-primary': '#0f766e',
      '--cv-secondary': '#115e59',
      '--cv-primary-light': 'rgba(15, 118, 110, 0.1)',
    }
  },
  'crimson': {
    id: 'crimson',
    name: 'Rojo',
    colors: {
      '--cv-primary': '#dc2626',
      '--cv-secondary': '#991b1b',
      '--cv-primary-light': 'rgba(220, 38, 38, 0.1)',
    }
  },
  'rose': {
    id: 'rose',
    name: 'Rosa',
    colors: {
      '--cv-primary': '#e11d48',
      '--cv-secondary': '#be123c',
      '--cv-primary-light': 'rgba(225, 29, 72, 0.1)',
    }
  },
  'amber': {
    id: 'amber',
    name: 'Ambar',
    colors: {
      '--cv-primary': '#d97706',
      '--cv-secondary': '#b45309',
      '--cv-primary-light': 'rgba(217, 119, 6, 0.1)',
    }
  },
  'slate': {
    id: 'slate',
    name: 'Pizarra',
    colors: {
      '--cv-primary': '#475569',
      '--cv-secondary': '#334155',
      '--cv-primary-light': 'rgba(71, 85, 105, 0.1)',
    }
  },
  'dark': {
    id: 'dark',
    name: 'Oscuro',
    colors: {
      '--cv-primary': '#1f2937',
      '--cv-secondary': '#111827',
      '--cv-primary-light': 'rgba(31, 41, 55, 0.1)',
    }
  },
};

export const DEFAULT_PALETTE = 'purple-indigo';

export const DEFAULT_PALETTE_BY_TEMPLATE = {
  'modern': 'purple-indigo',
  'classic': 'dark',
  'creative': 'purple-indigo',
  'executive': 'teal',
  'minimal': 'slate',
  'modern-text': 'purple-indigo',
  'classic-text': 'dark',
};

export const TEMPLATES_WITH_PALETTE_SUPPORT = [
  'modern', 'classic', 'creative', 'executive',
  'minimal', 'modern-text', 'classic-text'
];

export const getTemplateSupportsColorPalette = (templateId) => {
  return TEMPLATES_WITH_PALETTE_SUPPORT.includes(templateId);
};

/**
 * Returns CSS variable style object for a given palette + template combo.
 * Falls back to the template's default palette if none selected.
 */
export const getPaletteStyle = (paletteId, templateId) => {
  const effectivePaletteId = paletteId
    || DEFAULT_PALETTE_BY_TEMPLATE[templateId]
    || DEFAULT_PALETTE;

  const palette = COLOR_PALETTES[effectivePaletteId];
  if (!palette) return {};

  return palette.colors;
};
