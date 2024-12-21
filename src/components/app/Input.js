import React from "react";
import { TextField } from "@mui/material";

const Input = ({
  value,
  onChange,
  placeholder,
  inputStyle,
  rootStyle,
  name,
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) =>
        onChange({
          target: {
            name,
            value: e.target.value,
          },
        })
      }
      placeholder={placeholder || "Enter text"}
      name={name} // Pass name to the input for accessibility
      variant="outlined"
      size="small"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          ...rootStyle, // Apply dynamic root styles
        },
        "& .MuiOutlinedInput-input": {
          ...inputStyle, // Apply input-specific styles
        },
      }}
    />
  );
};

export default Input;
