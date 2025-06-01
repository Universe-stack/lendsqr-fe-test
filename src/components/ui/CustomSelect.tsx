import React, { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  style?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
}

const arrowSvg = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 7.5L9 12L13.5 7.5" stroke="#213F7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select',
  style = {},
  dropdownStyle = {},
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      setOpen(o => !o);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div
      ref={ref}
      tabIndex={0}
      style={{
        position: 'relative',
        ...style,
        cursor: 'pointer',
        background: '#fff',
        border: '1px solid #213F7D33',
        borderRadius: 8,
        padding: 0,
        outline: 'none',
      }}
      onClick={() => setOpen(o => !o)}
      onKeyDown={handleKeyDown}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 32px 12px 20px',
        fontSize: 14,
        color: value ? '#213F7D' : '#545F7D',
        minHeight: 24,
        userSelect: 'none',
      }}>
        {selectedLabel || <span style={{ color: '#545F7D' }}>{placeholder}</span>}
        <span style={{ position: 'absolute', right: 13, pointerEvents: 'none' }}>{arrowSvg}</span>
      </div>
      {open && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            zIndex: 10,
            background: '#fff',
            border: '1px solid #213F7D33',
            borderRadius: 8,
            marginTop: 4,
            boxShadow: '0 4px 16px rgba(33, 63, 125, 0.08)',
            maxHeight: 220,
            overflowY: 'auto',
            ...dropdownStyle,
          }}
          role="listbox"
        >
          {options.map(opt => (
            <div
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              tabIndex={-1}
              onClick={e => { e.stopPropagation(); handleSelect(opt.value); }}
              style={{
                padding: '10px 20px',
                fontSize: 14,
                color: value === opt.value ? '#fff' : '#213F7D',
                background: value === opt.value ? '#213F7D' : '#fff',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                fontWeight: value === opt.value ? 600 : 400,
                borderRadius: value === opt.value ? 8 : 0,
                transition: 'background 0.15s',
              }}
              onMouseDown={e => e.preventDefault()}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 