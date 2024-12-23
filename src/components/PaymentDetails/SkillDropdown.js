import React, { useState, useEffect } from "react";
import { getSubjectById } from "../../utils/api";
import CustomSelect from "../app/CustomSelect";

const SkillDropdown = ({ onProductIdsChange }) => {
  const [subjects, setSubjects] = useState([]);
  const [formValues, setFormValues] = useState({ productIds: [] });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectDataById = await getSubjectById(
          "6766af828a3e986b1f1fa821"
        );

        if (subjectDataById && Array.isArray(subjectDataById.subjects)) {
          const normalizedSubjects = subjectDataById.subjects.map(
            (subject) => ({
              _id: subject._id || Date.now(),
              name: subject.name || "Unnamed Subject",
              minAmount: subject.minAmount,
              maxAmount: subject.maxAmount,
            })
          );
          setSubjects(normalizedSubjects);
        } else {
          console.error("Subject data not found or malformed response");
        }
      } catch (error) {
        console.error("Failed to fetch subjects", error);
      }
    };

    fetchSubjects();
  }, []);

  const handleChange = (event) => {
    const selectedIds = event.target.value;

    if (Array.isArray(selectedIds)) {
      // Get the full subject data for the selected IDs
      const selectedSubjects = subjects.filter((subject) =>
        selectedIds.includes(subject._id)
      );
      setFormValues((prev) => ({
        ...prev,
        productIds: selectedSubjects,
      }));
    } else {
      console.error("Unexpected selected value:", selectedIds);
    }
  };

  useEffect(() => {
    // Send the full selected subjects to the parent component
    // console.log("formValues.productIds", formValues.productIds);
    onProductIdsChange?.(formValues.productIds);
  }, [formValues.productIds, onProductIdsChange]);

  return (
    <div>
      <CustomSelect
        label="Skill"
        name="productIds"
        value={formValues.productIds.map((subject) => subject._id)} // Send only the ids to the select component
        options={subjects.map((subject, index) => ({
          value: subject._id || `subject-${index}`,
          label: subject.name || `Unnamed Subject ${index}`,
          key: subject._id || `key-subject-${index}`,
        }))}
        onChange={handleChange}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        multiple
        renderValue={(selected) => {
          const selectedArray = Array.isArray(selected) ? selected : [selected];

          if (selectedArray.length === 0) return "Select";

          const selectedLabels = subjects
            .filter((subject) => selectedArray.includes(subject._id))
            .map((subject) => subject.name);
          return selectedLabels.join(", ");
        }}
      />
    </div>
  );
};

export default SkillDropdown;
