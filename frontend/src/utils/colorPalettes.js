/**
 * Color palette definitions for CV templates
 */
export const COLOR_PALETTES = {
  // Reds
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
  'burgundy': {
    id: 'burgundy',
    name: 'Borgoña',
    colors: {
      '--cv-primary': '#9f1239',
      '--cv-secondary': '#881337',
      '--cv-primary-light': 'rgba(159, 18, 57, 0.1)',
    }
  },
  // Oranges
  'coral': {
    id: 'coral',
    name: 'Coral',
    colors: {
      '--cv-primary': '#f97316',
      '--cv-secondary': '#ea580c',
      '--cv-primary-light': 'rgba(249, 115, 22, 0.1)',
    }
  },
  'amber': {
    id: 'amber',
    name: 'Ámbar',
    colors: {
      '--cv-primary': '#d97706',
      '--cv-secondary': '#b45309',
      '--cv-primary-light': 'rgba(217, 119, 6, 0.1)',
    }
  },
  'gold': {
    id: 'gold',
    name: 'Dorado',
    colors: {
      '--cv-primary': '#ca8a04',
      '--cv-secondary': '#a16207',
      '--cv-primary-light': 'rgba(202, 138, 4, 0.1)',
    }
  },
  'bronze': {
    id: 'bronze',
    name: 'Bronce',
    colors: {
      '--cv-primary': '#92400e',
      '--cv-secondary': '#78350f',
      '--cv-primary-light': 'rgba(146, 64, 14, 0.1)',
    }
  },
  // Greens
  'lime': {
    id: 'lime',
    name: 'Lima',
    colors: {
      '--cv-primary': '#65a30d',
      '--cv-secondary': '#4d7c0f',
      '--cv-primary-light': 'rgba(101, 163, 13, 0.1)',
    }
  },
  'forest': {
    id: 'forest',
    name: 'Bosque',
    colors: {
      '--cv-primary': '#15803d',
      '--cv-secondary': '#166534',
      '--cv-primary-light': 'rgba(21, 128, 61, 0.1)',
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
  // Blues
  'sky-blue': {
    id: 'sky-blue',
    name: 'Azul Cielo',
    colors: {
      '--cv-primary': '#0ea5e9',
      '--cv-secondary': '#0284c7',
      '--cv-primary-light': 'rgba(14, 165, 233, 0.1)',
    }
  },
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Azul Océano',
    colors: {
      '--cv-primary': '#2563eb',
      '--cv-secondary': '#1e40af',
      '--cv-primary-light': 'rgba(37, 99, 235, 0.1)',
    }
  },
  'navy': {
    id: 'navy',
    name: 'Azul Marino',
    colors: {
      '--cv-primary': '#1e3a5f',
      '--cv-secondary': '#0f2744',
      '--cv-primary-light': 'rgba(30, 58, 95, 0.1)',
    }
  },
  // Purples
  'purple-indigo': {
    id: 'purple-indigo',
    name: 'Violeta',
    colors: {
      '--cv-primary': '#667eea',
      '--cv-secondary': '#764ba2',
      '--cv-primary-light': 'rgba(102, 126, 234, 0.1)',
    }
  },
  'lavender': {
    id: 'lavender',
    name: 'Lavanda',
    colors: {
      '--cv-primary': '#8b5cf6',
      '--cv-secondary': '#7c3aed',
      '--cv-primary-light': 'rgba(139, 92, 246, 0.1)',
    }
  },
  'plum': {
    id: 'plum',
    name: 'Ciruela',
    colors: {
      '--cv-primary': '#7e22ce',
      '--cv-secondary': '#6b21a8',
      '--cv-primary-light': 'rgba(126, 34, 206, 0.1)',
    }
  },
  'pink': {
    id: 'pink',
    name: 'Fucsia',
    colors: {
      '--cv-primary': '#d946ef',
      '--cv-secondary': '#a21caf',
      '--cv-primary-light': 'rgba(217, 70, 239, 0.1)',
    }
  },
  // Neutrals
  'slate': {
    id: 'slate',
    name: 'Pizarra',
    colors: {
      '--cv-primary': '#475569',
      '--cv-secondary': '#334155',
      '--cv-primary-light': 'rgba(71, 85, 105, 0.1)',
    }
  },
  'charcoal': {
    id: 'charcoal',
    name: 'Carbón',
    colors: {
      '--cv-primary': '#374151',
      '--cv-secondary': '#1f2937',
      '--cv-primary-light': 'rgba(55, 65, 81, 0.1)',
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
 * Custom color helpers - derive secondary/light from a hex color.
 */
const darkenHex = (hex, amount = 0.2) => {
  const r = Math.round(parseInt(hex.slice(1, 3), 16) * (1 - amount));
  const g = Math.round(parseInt(hex.slice(3, 5), 16) * (1 - amount));
  const b = Math.round(parseInt(hex.slice(5, 7), 16) * (1 - amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getCustomPaletteStyle = (hexColor) => ({
  '--cv-primary': hexColor,
  '--cv-secondary': darkenHex(hexColor),
  '--cv-primary-light': hexToRgba(hexColor, 0.1),
});

export const isCustomPalette = (paletteId) =>
  paletteId && paletteId.startsWith('custom:');

export const getCustomPaletteHex = (paletteId) =>
  isCustomPalette(paletteId) ? paletteId.slice(7) : null;

/**
 * Returns CSS variable style object for a given palette + template combo.
 * Falls back to the template's default palette if none selected.
 * Supports custom palettes with the format "custom:#hexcode".
 */
export const getPaletteStyle = (paletteId, templateId) => {
  if (isCustomPalette(paletteId)) {
    return getCustomPaletteStyle(paletteId.slice(7));
  }

  const effectivePaletteId = paletteId
    || DEFAULT_PALETTE_BY_TEMPLATE[templateId]
    || DEFAULT_PALETTE;

  const palette = COLOR_PALETTES[effectivePaletteId];
  if (!palette) return {};

  return palette.colors;
};
