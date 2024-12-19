import React from "react";
import "../styles/PaymentStatus.css"; // Create a CSS file for styling if needed.

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;