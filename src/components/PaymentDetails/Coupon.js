import React, { useState } from "react";
import Input from "../app/Input";
import { applyCoupon } from "../../utils/api";

const Coupon = ({orderAmount}) => {
  const [formValues, setFormValues] = useState({
    coupon: "",
    finalPrice: 0,
  });
  const [error, setError] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const totalAmount = { max: 1000 };

  const handleApplyCoupon = async () => {
    try {
      console.log(formValues.coupon)
      const couponDetails = {
        couponCode: formValues.coupon,
        orderAmount: orderAmount,
        course: "",
      };

      
      const response = await applyCoupon(couponDetails);

      if (response.success) {
        const discountedPrice = totalAmount.max - response.discountAmount;
        setFormValues((prev) => ({
          ...prev,
          finalPrice: discountedPrice > 0 ? discountedPrice : 0,
        }));
        setError(null); 
      } else {
        setError(response.message || "Failed to apply coupon");
      }
    } catch (err) {
      setError("An error occurred while applying the coupon.");
    }
  };

  return (
    <div>
      <div className="form-control">
        <label>Coupon</label>
        <Input
          value={formValues.coupon}
          name="coupon"
          onChange={handleChange}
          placeholder="Enter Coupon Code"
          rootStyle={{
            borderRadius: "8px",
            width: "13vw",
          }}
          inputStyle={{
            height: "18px",
            color: "#64748B",
          }}
        />
        <button
          className="next-button"
          style={{
            color: "#FFFFFF",
            background: "#8E198F",
            padding: "9px 12px",
            cursor: "pointer",
          }}
          onClick={handleApplyCoupon}
        >
          Apply
        </button>
      </div>
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
     
    </div>
  );
};

export default Coupon;
