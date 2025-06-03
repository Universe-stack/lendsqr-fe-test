import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomDateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const calendarSvg = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.25" y="4.5" width="13.5" height="11.25" rx="2" stroke="#213F7D" strokeWidth="1.5"/>
    <path d="M6 2.25V5.25" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 2.25V5.25" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.25 8.25H15.75" stroke="#213F7D" strokeWidth="1.5"/>
  </svg>
);

const CustomDateInput: React.FC<CustomDateInputProps> = ({ value, onChange, placeholder = 'Select date', style = {} }) => {
  // Convert value to Date or null
  const dateValue = value ? new Date(value) : null;

  return (
    <div style={{
      position: 'relative',
      ...style,
      cursor: 'pointer',
      background: '#fff',
      border: '1px solid #213F7D33',
      borderRadius: 8,
      padding: 0,
      outline: 'none',
    }}>
      <DatePicker
        selected={dateValue}
        onChange={(date: Date | null) => onChange(date ? date.toISOString().slice(0, 10) : '')}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        popperPlacement="bottom"
        className="custom-date-input"
        wrapperClassName="custom-date-input-wrapper"
      />
      <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>{calendarSvg}</span>
      <style>{`
        .custom-date-input {
          width: 100%;
          font-size: 14px;
          color: #213F7D;
          padding: 12px 32px 12px 20px;
          border: none;
          outline: none;
          background: transparent;
        }
        .custom-date-input::placeholder {
          color: #545F7D;
        }
      `}</style>
    </div>
  );
};

export default CustomDateInput; 