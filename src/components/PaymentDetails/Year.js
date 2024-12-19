import React, { useState, useEffect } from "react";
import CustomSelect from "../app/CustomSelect";
import { getYearData } from "../../utils/api";

const Year = ({ onYearChange }) => {
  const [yearData, setYearData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const data = await getYearData();
        const options = data
          .map((item) => item.content)
          .flat()
          .filter((item) => item.isActive)
          .map((item) => ({
            id: item.value,
            value: Number(item.value),
            label: item.name,
            isActive: item.isActive,
          }));
        setYearData(options);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);

  useEffect(() => {
    if (selectedYear !== null) {
      onYearChange(selectedYear);
    }
  }, [selectedYear, onYearChange]);

  const handleYearChange = (event) => {
    const selectedValue = Number(event.target.value);
    setSelectedYear(selectedValue);
  };

  return (
    <div>
      <CustomSelect
        label="Yearly Plan"
        name="year"
        value={selectedYear || ""}
        options={yearData}
        onChange={handleYearChange}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        displayEmpty={true}
        renderValue={(selected) => {
          return selected
            ? yearData.find((item) => item.value === selected)?.label ||
                "Select Year"
            : "Select Year";
        }}
      />
    </div>
  );
};

export default Year;
