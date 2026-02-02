import { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomDatePicker.css';

registerLocale('es', es);

const CustomInput = forwardRef(({ value, onClick, placeholder, disabled }, ref) => (
  <div className={`custom-date-input ${disabled ? 'disabled' : ''}`} onClick={onClick} ref={ref}>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly
      disabled={disabled}
    />
    <Calendar size={18} className="calendar-icon" />
  </div>
));

CustomInput.displayName = 'CustomInput';

const CustomDatePicker = ({ selected, onChange, placeholderText, disabled, minDate, maxDate }) => {
  const { isDark } = useTheme();

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      locale="es"
      placeholderText={placeholderText || 'Selecciona una fecha'}
      customInput={<CustomInput />}
      disabled={disabled}
      minDate={minDate}
      maxDate={maxDate}
      calendarClassName={isDark ? 'dark-calendar' : 'light-calendar'}
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      yearDropdownItemNumber={50}
      scrollableYearDropdown
    />
  );
};

export default CustomDatePicker;
