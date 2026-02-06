import { useState, useRef, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { TickIcon } from '@hugeicons/core-free-icons';
import { COLOR_PALETTES, getTemplateSupportsColorPalette, DEFAULT_PALETTE_BY_TEMPLATE, isCustomPalette, getCustomPaletteHex } from '../../utils/colorPalettes';
import './ColorPaletteSelector.css';

const ColorPaletteSelector = ({ selectedPalette, onSelectPalette, templateId }) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#667eea');
  const [hexInput, setHexInput] = useState('667eea');
  const pickerRef = useRef(null);

  const isCustom = isCustomPalette(selectedPalette);

  // Sync customColor when a custom palette is already selected
  useEffect(() => {
    const hex = getCustomPaletteHex(selectedPalette);
    if (hex) {
      setCustomColor(hex);
      setHexInput(hex.slice(1));
    }
  }, [selectedPalette]);

  // Close picker on outside click
  useEffect(() => {
    if (!showCustomPicker) return;
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowCustomPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCustomPicker]);

  if (!getTemplateSupportsColorPalette(templateId)) {
    return null;
  }

  const effectivePalette = selectedPalette || DEFAULT_PALETTE_BY_TEMPLATE[templateId] || 'purple-indigo';

  const handleColorPickerChange = (e) => {
    const hex = e.target.value;
    setCustomColor(hex);
    setHexInput(hex.slice(1));
    onSelectPalette(`custom:${hex}`);
  };

  const handleHexInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setHexInput(val);
    if (val.length === 6) {
      const hex = `#${val}`;
      setCustomColor(hex);
      onSelectPalette(`custom:${hex}`);
    }
  };

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

        {/* Custom color picker */}
        <div className="custom-picker-wrapper" ref={pickerRef}>
          <button
            className={`palette-swatch custom-swatch ${isCustom ? 'selected' : ''}`}
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            title="Color personalizado"
            style={isCustom ? { background: customColor } : {}}
          >
            {isCustom ? (
              <HugeiconsIcon icon={TickIcon} size={12} />
            ) : (
              <span className="custom-swatch-plus">+</span>
            )}
          </button>

          {showCustomPicker && (
            <div className="custom-picker-dropdown">
              <input
                type="color"
                value={customColor}
                onChange={handleColorPickerChange}
                className="custom-color-input"
              />
              <div className="custom-hex-row">
                <span className="hex-label">#</span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  maxLength={6}
                  className="custom-hex-input"
                  placeholder="667eea"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteSelector;
