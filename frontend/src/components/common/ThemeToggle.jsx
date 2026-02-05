import { HugeiconsIcon } from '@hugeicons/react';
import { MoonIcon, SunIcon } from '@hugeicons/core-free-icons';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label="Cambiar tema"
    >
      {isDark ? <HugeiconsIcon icon={SunIcon} size={20} /> : <HugeiconsIcon icon={MoonIcon} size={20} />}
    </button>
  );
};

export default ThemeToggle;
