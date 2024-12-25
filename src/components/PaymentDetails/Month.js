import React, { useState, useEffect } from "react";
import CustomSelect from "../app/CustomSelect";

const Month = ({ disabled, onMonthChange }) => {
  const [monthData, setMonthData] = useState([
    { value: 1, label: "Weekly" },
    { value: 2, label: "Monthly" },
  ]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (selectedMonth !== null) {
      onMonthChange(selectedMonth);
    }
  }, [selectedMonth, onMonthChange]);

  const handleMonthChange = (event) => {
    const selectedValue = Number(event.target.value);
    setSelectedMonth(selectedValue);
  };

  return (
    <div>
      <CustomSelect
        label="Subscription Plan"
        name="month"
        value={selectedMonth || ""}
        options={monthData}
        onChange={handleMonthChange}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        displayEmpty={true}
        renderValue={(selected) => {
          return selected
            ? monthData.find((item) => item.value === selected)?.label ||
                "Select"
            : "Select";
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default Month;
