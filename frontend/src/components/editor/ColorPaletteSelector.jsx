import { HugeiconsIcon } from '@hugeicons/react';
import { TickIcon } from '@hugeicons/core-free-icons';
import { COLOR_PALETTES, getTemplateSupportsColorPalette, DEFAULT_PALETTE_BY_TEMPLATE } from '../../utils/colorPalettes';
import './ColorPaletteSelector.css';

const ColorPaletteSelector = ({ selectedPalette, onSelectPalette, templateId }) => {
  if (!getTemplateSupportsColorPalette(templateId)) {
    return null;
  }

  const effectivePalette = selectedPalette || DEFAULT_PALETTE_BY_TEMPLATE[templateId] || 'purple-indigo';

  return (
    <div className="color-palette-selector">
      <div className="palette-swatches">
        {Object.values(COLOR_PALETTES).map((palette) => (
          <button
            key={palette.id}
            className={`palette-swatch ${effectivePalette === palette.id ? 'selected' : ''}`}
            onClick={() => onSelectPalette(palette.id)}
            title={palette.name}
            style={{
              background: `linear-gradient(135deg, ${palette.colors['--cv-primary']} 0%, ${palette.colors['--cv-secondary']} 100%)`
            }}
          >
            {effectivePalette === palette.id && (
              <HugeiconsIcon icon={TickIcon} size={12} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteSelector;
