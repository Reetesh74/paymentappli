import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentStatus from "./components/PaymentStatus";
import StudentEnrollment from "./pages/StudentEnrollment";
import PaymentTable from "./pages/PaymentTable";
import HomePage from "./pages/HomePage";
import Year from "./components/PaymentDetails/Year";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details-payment" element={<PaymentDetails />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/student-enrollemnt" element={<StudentEnrollment />} />
        <Route path="/payment-details" element={<PaymentTable />} />
        <Route path="/year" element={<Year />} />
      </Routes>
    </Router>
  );
}

export default App;
