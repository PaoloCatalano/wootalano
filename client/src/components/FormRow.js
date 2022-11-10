import React from "react";

export default function FormRow({
  name,
  type,
  value,
  handleChange,
  labelText,
  disabled = false,
}) {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={handleChange}
        className="form-input"
        disabled={disabled}
        min={0}
      />
    </div>
  );
}
