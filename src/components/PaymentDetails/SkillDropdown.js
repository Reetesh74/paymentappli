import React, { useState, useEffect } from "react";
import { getSubjectById, getCourseData } from "../../utils/api";
import CustomSelect from "../app/CustomSelect";

const SkillDropdown = ({ disabled, onProductIdsChange }) => {
  const [subjects, setSubjects] = useState([]);
  const [formValues, setFormValues] = useState({ productIds: [] });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const getSkillId = (data, courseName) => {
    const course = data.courses.find(
      (course) => course.courseName === courseName
    );
    return course ? course.courseId : null;
  };
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // debugger
        const response = await getCourseData();
        console.log("response", response);

        const skillId = getSkillId(response, "Skill");
        console.log("Fetching course data...", skillId);

        const subjectDataById = await getSubjectById(skillId);
        console.log("subjectDataById", subjectDataById);
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
        disabled={disabled}
      />
    </div>
  );
};

export default SkillDropdown;
