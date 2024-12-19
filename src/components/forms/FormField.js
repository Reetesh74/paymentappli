import React from "react";
import "../ProgressBar/ProgressBar";

function FormField({
  label,
  placeholder,
  name,
  value,
  onChange,
  fullWidth,
  type,
  options,
  error,
}) {
  const safeValue = value || "";

  return (
    <div className={`field ${fullWidth ? "full-width-field" : ""}`}>
      <label className="label">{label}</label>
      {type === "select" ? (
        <select
          name={name}
          value={safeValue}
          onChange={onChange}
          className={`input custom-select ${
            fullWidth ? "full-width-select" : ""
          } ${safeValue === "" ? "placeholder-active" : ""}`}
        >
          <option value="" hidden>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          name={name}
          value={safeValue}
          onChange={onChange}
          className="input"
        />
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default FormField;
