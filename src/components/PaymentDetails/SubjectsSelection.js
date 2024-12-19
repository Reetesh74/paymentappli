// Components/PaymentDetails/SubjectsSelection.js
import React from "react";
import CustomSelect from "../app/CustomSelect";

const SubjectsSelection = ({
  subjects,
  selectedSubjects,
  onSubjectChange,
  onRemoveSubject,
}) => {
  return (
    <div className="form-control">
      <div className="selected-subjects">
        {selectedSubjects.length > 0 && (
          <div>
            <ul className="subject-list">
              {selectedSubjects.map((productId) => {
                const subject = subjects.find(
                  (subject) => subject._id === productId
                );
                return subject ? (
                  <li key={subject._id} className="subject-item">
                    {subject.name}
                    <button onClick={() => onRemoveSubject(productId)}>
                      <img src="/icons/cross-icon.svg" alt="Remove" />
                    </button>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
      </div>

      <CustomSelect
        label="Subjects"
        name="productIds"
        value={selectedSubjects}
        options={subjects.map((subject, index) => ({
          value: subject._id || `subject-${index}`,
          label: subject.name || `Unnamed Subject ${index}`,
          key: subject._id || `key-subject-${index}`,
        }))}
        onChange={(e) => onSubjectChange(e.target.value)}
        multiple
        renderValue={(selected) => {
          if (!selected || selected.length === 0) return "Select";
          const selectedLabels = subjects
            .filter((subject) => selected.includes(subject._id))
            .map((subject) => subject.name);
          return selectedLabels.join(", ");
        }}
      />
    </div>
  );
};

export default SubjectsSelection;
