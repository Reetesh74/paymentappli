import React, { useState } from "react";
import { Select, MenuItem, FormControl } from "@mui/material";

const CustomSelect = ({
  label,
  name,
  value,
  options,
  onChange,
  isDropdownOpen,
  setIsDropdownOpen,
  multiple = false,
  renderValue = (selected) => (!selected ? "Select" : selected),
  displayEmpty = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="form-control">
      {label && <label>{label}</label>}
      <FormControl sx={{ width: "100%", marginTop: "0px" }}>
        <Select
          name={name}
          value={value}
          onChange={onChange}
          multiple={multiple}
          IconComponent={() => (
            <img
              src={
                isOpen
                  ? "/icons/select-uparrow-icon.svg"
                  : "/icons/select-downarrow-icon.svg"
              }
              alt="Dropdown Icon"
              className="select-icon"
            />
          )}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          displayEmpty={displayEmpty}
          renderValue={renderValue}
          sx={{
            height: "40px",
            width: "16.4vw",
            margin: "8px 0",
            borderRadius: "8px",
            background: "#F8FAFC",
            color: "#64748B",
          }}
          {...props}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option.id || option.value || index}
              value={option.value || option}
            >
              {option.label || option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CustomSelect;
