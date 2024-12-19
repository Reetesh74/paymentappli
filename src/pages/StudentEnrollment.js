import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentEnrollment.css";
import FormField from "../components/forms/FormField";
import { createOrUpdateEnrollment } from "../utils/api";

function StudentEnrollment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentName: "",
    mobile: "",
    parentName: "",
    parentMobile: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.studentName)) {
      newErrors.studentName = "Name must only contain letters.";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Number must be 10 digits.";
    }
    if (!formData.parentName.trim()) {
      newErrors.parentName = "Name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.studentName)) {
      newErrors.studentName = "Name must only contain letters.";
    }
    if (!formData.parentMobile.trim()) {
      newErrors.parentMobile = "Number is required.";
    } else if (!/^\d{10}$/.test(formData.parentMobile)) {
      newErrors.parentMobile = "Nobile number must be 10 digits.";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const paymentData = {
        studentName: formData.studentName,
        mobile: formData.mobile,
        parentName: formData.parentName,
        parentMobile: formData.parentMobile,
        email: formData.email,
      };

      const response = await createOrUpdateEnrollment(paymentData);
      if (response.ok) {
        const { _id: enrollmentId, mobile } = response.data;

        navigate("/details-payment", { state: { enrollmentId, mobile } });
      } else {
        console.error(
          "Error creating enrollment:",
          response.data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error.response || error.message);
    }
  };
  return (
    <div className="center-payment-container">
      <div className="container-enrollment">
        <form onSubmit={handleSubmit} className="form">
          <div className="row">
            <FormField
              label="Customer Name"
              placeholder="Student Name"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              error={errors.studentName}
            />

            <FormField
              label="Phone Number"
              placeholder="Phone Number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
            />
          </div>
          <div className="row">
            <FormField
              label="Parent’s Name"
              placeholder="Parent’s Name"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              error={errors.parentName}
            />

            <FormField
              label="Parent’s Mobile Number"
              placeholder="Phone"
              name="parentMobile"
              value={formData.parentMobile}
              onChange={handleChange}
              error={errors.parentMobile}
            />
          </div>
          <div className="row">
            <FormField
              label="Email"
              placeholder="Email(optional)"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              error={errors.email}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="button">
              <span style={{marginRight:"8px"}}>Continue</span>
              <span>
                <img src="/icons/down-icon.svg" alt="Enrollment Icon" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentEnrollment;
