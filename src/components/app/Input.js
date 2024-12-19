import React from "react";
import { TextField } from "@mui/material";

const Input = ({ value, onChange, placeholder }) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Enter text"}
      variant="outlined"
      size="small"
    />
  );
};

export default Input;
