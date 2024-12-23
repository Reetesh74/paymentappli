import React from "react";

const SelectedSubjects = ({
  subjects,
  productIds,
  onRemoveSubject,
  period,
}) => {
  console.log("subjects== ", subjects);
  console.log("periodsssss =", period);
  if (period === "yearly") {
    productIds = subjects.map((subject) => subject._id);
  }
  console.log("after productIds== ", productIds);
  return (
    <div className="subject-control">
      <div className="selected-subjects">
        {productIds.length > 0 && (
          <div>
            <ul className="subject-list">
              {productIds.map((productId) => {
                const subject = subjects.find(
                  (subject) => subject._id === productId
                );
                return subject ? (
                  <li key={subject._id} className="subject-item">
                    {subject.name}
                    {period !== "yearly" && ( 
                      <button onClick={() => onRemoveSubject(subject._id)}>
                        <img src="/icons/cross-icon.svg" alt="Remove" />
                      </button>
                    )}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedSubjects;
