import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/PaymentStatus.css";
import ProgressBar from "./ProgressBar/ProgressBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormControl, TextField } from "@mui/material";
import {
  getAllPaymentByNumber,
  mapPaymentIdEnrollment,
  confirmEnrollment,
} from "../utils/api";

const PaymentStatus = () => {
  const location = useLocation();
  const { enrollmentId, mobile } = location.state || {};
  const [paymentEntries, setPaymentEntries] = useState([
    { paymentMethod: "", paymentId: "" },
  ]);

  const [paymentIds, setPaymentIds] = useState([]);
  const navigate = useNavigate();

  const steps = [
    "Enrollment Details",
    "Payments Verification",
    "Confirm Order",
  ];

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchPaymentIds = async () => {
      try {
        const response = await getAllPaymentByNumber(mobile);
        const ids = response.orders.map((order) => ({
          paymentMethod: "",
          paymentId: order.paymentId,
          prefilled: true,
        }));
        setPaymentIds(ids);
        setPaymentEntries(ids);
      } catch (error) {
        console.error("Error fetching payment IDs by number:", error);
      }
    };

    fetchPaymentIds();
  }, []);

  const handlePaymentMethodChange = (index, event) => {
    const newPaymentEntries = [...paymentEntries];
    newPaymentEntries[index].paymentMethod = event.target.value;
    setPaymentEntries(newPaymentEntries);
  };

  const handlePaymentIdChange = async (index, event) => {
    const newPaymentEntries = [...paymentEntries];
    const selectedPaymentId = event.target.value;
    newPaymentEntries[index].paymentId = selectedPaymentId;
    setPaymentEntries(newPaymentEntries);
    try {
      if (enrollmentId && selectedPaymentId) {
        const payload = {
          enrollmentId,
          paymentId: selectedPaymentId,
        };
        await mapPaymentIdEnrollment(payload);
      }
    } catch (error) {
      console.error("Error mapping Payment ID:", error);
    }
  };

  const handleAddPayment = () => {
    setPaymentEntries([
      ...paymentEntries,
      { paymentMethod: "", paymentId: "", prefilled: false },
    ]);
  };

  const handleRemovePayment = (index) => {
    const newPaymentEntries = paymentEntries.filter((_, i) => i !== index);
    setPaymentEntries(newPaymentEntries);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      navigate("/details-payment");
    }
  };

  const handleNext = async () => {
    if (!enrollmentId) {
      alert("Enrollment ID is required.");
      return;
    }

    try {
      for (const entry of paymentEntries) {
        if (entry.paymentId) {
          const payload = {
            enrollmentId,
            paymentId: entry.paymentId,
          };
          await mapPaymentIdEnrollment(payload);
          if (enrollmentId) {
            await confirmEnrollment(enrollmentId);
          }
        }
      }
      navigate("/success-page", { state: { enrollmentId, mobile } });
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Bad Request.";
        } else {
          errorMessage = error.response.statusText || errorMessage;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="outer-background">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="payment-verification-container">
        <div className="header-section">
          <div className="page-name">
            <span>Payment Details</span>
            <img
              src="/icons/cross-icon.svg"
              alt="Enrollment Icon"
              className="enrollmentIcon"
            />
          </div>
          <div className="subtitle-details">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do."
          </div>
        </div>
        <div className="progressbar">
          <ProgressBar currentStep={currentStep} />
        </div>
        <div className="payment-section">
          {paymentEntries.map((entry, index) => (
            <div key={index} className="payment-entry">
              <div
                className="payment"
                style={{
                  backgroundColor: index % 2 === 0 ? "#E4EDFA" : "#FBE8FF",
                }}
              >
                <div className="payment-tag">Payment</div>
                <button
                  className="close-button"
                  onClick={() => handleRemovePayment(index)}
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "16px",
                    color: "#ff0000",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  <img
                    src="/icons/close-icon.svg"
                    alt="Close Icon"
                    className="enrollmentIcon"
                  />
                </button>
              </div>
              <div className="method-id-payment">
                <div className="form-control" style={{ width: "420px" }}>
                  <label>Payment ID</label>
                  <FormControl sx={{ width: "100%", marginTop: "0px" }}>
                    <TextField
                      value={entry.paymentId || ""}
                      onChange={(event) => {
                        if (!entry.prefilled) {
                          handlePaymentIdChange(index, event);
                        }
                      }}
                      placeholder="Enter Your Id"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        readOnly: !!entry.prefilled,
                      }}
                      sx={{
                        height: "40px",
                        margin: "8px 0",
                        borderRadius: "8px",
                        border: "1px solid #94A3B8",
                      }}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="button-container">
          <button className="button-id" onClick={handleAddPayment}>
            <img src="/icons/add-icon.svg" alt="Enrollment Icon" />
          </button>
        </div>
      </div>
      <div className="button-section-verification">
        <button
          className="back-button"
          onClick={handleBack}
          style={{ color: "#64748B", background: "#F8FAFC" }}
        >
          Back
        </button>
        <button
          className="next-button"
          onClick={handleNext}
          style={{ color: "#FFFFFF", background: "#184574" }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;
