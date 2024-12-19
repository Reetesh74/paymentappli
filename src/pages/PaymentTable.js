import React, { useState, useEffect } from "react";
import "../styles/PaymentTable.css";
import { getPaymentData } from "../utils/api";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Paid: "status-paid",
    Pending: "status-pending",
    Failed: "status-failed",
  };

  return (
    <span className={`status-badge ${statusStyles[status]}`}>{status}</span>
  );
};

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPaymentData();
        setPayments(data.orders);
      } catch (error) {
        console.error("Error fetching payments data:", error);
      }
    };
    fetchPayments();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 1000);
      })
      .catch((error) => {
        console.error("Copy failed!", error);
      });
  };

  const getPaymentStatus = (payment) => {
    if (payment.isPaid) {
      return "Paid";
    }
    if (payment.orderData.status === "failed") {
      return "Failed";
    }
    return "Pending";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const timeCounter = {};

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const timeKey = `${year}${month}${day}${hours}${minutes}`;

    if (!timeCounter[timeKey]) {
      timeCounter[timeKey] = 1;
    } else {
      timeCounter[timeKey] += 1;
    }

    const orderNumber = String(timeCounter[timeKey]).padStart(3, "0");

    return `${day}${month}${year}${hours}${minutes}${orderNumber}`;
  };

  return (
    <div className="center-payment-container">
      <div className="payment-container">
        <table className="payment-table">
          <thead className="payment-table-head">
            <tr style={{ fontSize: "calc(0.8vw + 0.5vh)" }}>
              <th>Created</th>
              <th style={{ textAlign: "center" }}>Payment Mode</th>
              <th style={{ paddingRight: "43px" }}>Payment ID</th>
              <th style={{ textAlign: "center" }}>Amount</th>
              <th style={{ textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "calc(0.7vw + 0.4vh)" }}>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{formatDate(payment.orderDate)}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {payment.paymentMode}
                  </td>
                  <td style={{ display: "flex", alignItems: "center" }}>
                    {formatDateTime(payment.orderDate)}
                    <img
                      src="/icons/copy-icon.svg"
                      alt="Copy Icon"
                      className="copy-icon"
                      onClick={() =>
                        handleCopy(formatDateTime(payment.orderDate))
                      }
                      style={{ marginLeft: "5px", cursor: "pointer" }}
                    />
                    {copiedId === formatDateTime(payment.orderDate) && (
                      <span className="copied-message">Copied!</span>
                    )}
                  </td>
                  <td>{`${payment.amount} ${payment.currency}`}</td>
                  <td>
                    <StatusBadge status={getPaymentStatus(payment)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
