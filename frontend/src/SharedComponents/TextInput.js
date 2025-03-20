import React from 'react';
import '../index.css';

const TextInput = ({ id, label, type, value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};


export default TextInput;