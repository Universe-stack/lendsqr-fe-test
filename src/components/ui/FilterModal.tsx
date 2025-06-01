import React, { useState, CSSProperties } from 'react';
import CustomSelect from './CustomSelect';
import CustomDateInput from './CustomDateInput';

export interface FilterValues {
  organization: string;
  username: string;
  email: string;
  date: string;
  phoneNumber: string;
  status: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (values: FilterValues) => void;
  onReset: () => void;
  initialValues?: FilterValues;
  organizations?: string[];
  className?: string;
  style?: CSSProperties;
}

const statusOptions = [
  '', 'Active', 'Inactive', 'Pending', 'Blacklisted'
];

const inputStyle = {
  width: '100%',
  fontSize: 14,
  marginTop: 2,
  border: '1px solid #213F7D33',
  borderRadius: '8px',
  paddingTop: '12px',
  paddingBottom: '12px',
  paddingLeft: '20px',
  paddingRight: '13px',
  color: '#213F7D'
};

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onFilter,
  onReset,
  initialValues = {
    organization: '',
    username: '',
    email: '',
    date: '',
    phoneNumber: '',
    status: '',
  },
  organizations = [],
  className = '',
  style = {},
}) => {
  const [values, setValues] = useState<FilterValues>(initialValues);

  React.useEffect(() => {
    setValues(initialValues);
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={className} style={style}>
      <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, border: 'none', background: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
      <form
        onSubmit={e => {
          e.preventDefault();
          onFilter(values);
          onClose();
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <div style={{fontSize:'14px', color:'#545F7D', marginBottom:"8px", fontWeight:'500'}}>Organization</div>
            <CustomSelect
              value={values.organization}
              onChange={val => setValues(v => ({ ...v, organization: val }))}
              options={[{ value: '', label: 'Select' }, ...organizations.map(org => ({ value: org, label: org }))]}
              placeholder="Select"
              style={{ marginTop: 2, marginBottom: 0 }}
            />
          </label>
          <label>
          <div style={{fontSize:'14px', color:'#545F7D', marginBottom:"8px", fontWeight:'500'}}>Username</div>
            <input
              type="text"
              value={values.username}
              onChange={e => setValues(v => ({ ...v, username: e.target.value }))}
              placeholder="User"
              style={inputStyle}
            />
          </label>
          <label>
          <div style={{fontSize:'14px', color:'#545F7D', marginBottom:"8px", fontWeight:'500'}}>Email</div>
            <input
              type="email"
              value={values.email}
              onChange={e => setValues(v => ({ ...v, email: e.target.value }))}
              placeholder="Email"
              style={inputStyle}
            />
          </label>
          <label>
          <div style={{fontSize:'14px', color:'#545F7D', marginBottom:"8px", fontWeight:'500'}}>Date</div>
            <CustomDateInput
              value={values.date}
              onChange={val => setValues(v => ({ ...v, date: val }))}
              placeholder="Select date"
              style={{ marginTop: 2, marginBottom: 0 }}
            />
          </label>
          <label>
          <div style={{fontSize:'14px', color:'#545F7D', marginBottom:"8px", fontWeight:'500'}}>Phone number</div>
            <input
              type="text"
              value={values.phoneNumber}
              onChange={e => setValues(v => ({ ...v, phoneNumber: e.target.value }))}
              placeholder="Phone Number"
              style={inputStyle}
            />
          </label>
          <label>
          <div style={{fontSize:'14px', color:'#545F7D', marginBottom:"8px", fontWeight:'500'}}>Status</div>
            <CustomSelect
              value={values.status}
              onChange={val => setValues(v => ({ ...v, status: val }))}
              options={[{ value: '', label: 'Select' }, ...statusOptions.filter(Boolean).map(status => ({ value: status, label: status }))]}
              placeholder="Select"
              style={{ marginTop: 2, marginBottom: 0 }}
            />
          </label>
          <div style={{ display: 'flex', gap: 14, marginTop: 30 }}>
            <button
              type="button"
              onClick={() => { setValues(initialValues); onReset(); }}
              style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'11px 30px', flex:'1', fontWeight:'500', fontSize:'14px', border: '1px solid #545F7D', background: '#fff', borderRadius: 8, cursor: 'pointer' }}
            >
              <span style={{color:'#545F7D', fontSize:'14px', fontWeight:'600' }}>Reset</span>
            </button>
            <button
              type="submit"
              style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'11px 30px', flex:'1', background: '#39CDCC', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
            >
               <span style={{color:'#FFFFFF', fontSize:'14px', fontWeight:'600' }}>Filter</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterModal; 