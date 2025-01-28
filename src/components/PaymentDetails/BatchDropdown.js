import React, { useState, useEffect } from "react";
import CustomSelect from "../app/CustomSelect";
import { getAllBatch } from "../../utils/api";

const BatchDropdown = () => {
  const [batchOptions, setBatchOptions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(""); // State for selected batch

  // Fetch and transform batch data
  useEffect(() => {
    const fetchBatchData = async () => {
      const data = await getAllBatch();
      if (data) {
        // Transform data to { label, value } format
        const transformedOptions = data.map((batch) => ({
          label: batch.name, // Display name
          value: batch._id, // Unique ID
        }));
        setBatchOptions(transformedOptions);
      }
    };
    fetchBatchData();
  }, []);

  // Handle dropdown value change
  const handleBatchChange = (event) => {
    setSelectedBatch(event.target.value); // Update selected batch
    console.log("Selected Batch ID:", event.target.value); // Log selected batch ID
  };
  return (
    <div>
      <CustomSelect
        label="Batch"
        name="batch"
        value={selectedBatch} // Selected value
        options={batchOptions} // Transformed options
        onChange={handleBatchChange} // Handle value change
        renderValue={(selected) =>
          selected
            ? batchOptions.find((option) => option.value === selected)?.label
            : "Select Batch"
        } // Display the label for the selected value
      />
    </div>
  );
};

export default BatchDropdown;
