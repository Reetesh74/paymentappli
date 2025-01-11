import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentStatus from "./components/PaymentStatus";
import StudentEnrollment from "./pages/StudentEnrollment";
import PaymentTable from "./pages/PaymentTable";
import HomePage from "./pages/HomePage";
import SkillDropdown from "./components/PaymentDetails/SkillDropdown";
import Coupon from "./components/PaymentDetails/Coupon";
import EnrollMentTable from "./pages/EnrollStudentTable"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details-payment" element={<PaymentDetails />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/student-enrollemnt" element={<StudentEnrollment />} />
        <Route path="/payment-details" element={<PaymentTable />} />
        <Route path="/skill" element={<SkillDropdown />} />
        <Route path="/enroll-ment" element={<EnrollMentTable />} />
        <Route path="/Coupon" element={<Coupon />} />
      </Routes>
    </Router>
  );
}

export default App;
