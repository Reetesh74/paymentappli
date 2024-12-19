import React from "react";
import "./ProgressBar.css";

const steps = [
  {
    id: 1,
    label: "Enrollment Details",
    icon: <img src="/icons/status-icon.svg" alt="Enrollment Icon" />,
  },
  {
    id: 2,
    label: "Payments Verification",
    icon: <img src="/icons/verification-icon.svg" alt="Verification Icon" />,
  },
  {
    id: 3,
    label: "Confirm Order",
    icon: <img src="/icons/confirm-icon.svg" alt="Confirm Order Icon" />,
  },
];

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="progress-container">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="progress-step">
            <div className={`circle ${currentStep >= step.id ? "active" : ""}`}>
              {step.icon}
            </div>
            <p
              className={`step-label ${
                currentStep === step.id || step.id === 1 ? "active" : ""
              }`}
            >
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`progress-line ${
                currentStep > step.id - 1 ? "active" : ""
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
