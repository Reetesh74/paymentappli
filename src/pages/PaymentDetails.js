import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import "../styles/PaymentDetails.css";
import Year from "../components/PaymentDetails/Year";
import Month from "../components/PaymentDetails/Month";
import { Modal } from "@mui/material";
import ModalContent from "../components/PaymentDetails/ModalContent";
import CustomSelect from "../components/app/CustomSelect";
import Input from "../components/app/Input";

import {
  getClassData,
  getCourseData,
  getStateData,
  getSubjectData,
  createOrUpdatePlan,
  mapPlanEnrollment,
  getBoardData,
  getPlansByCourseId,
} from "../utils/api";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const { enrollmentId, mobile } = location.state || {};
  const [classes, setClasses] = useState([]);
  const [states, setStates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [price, setPrice] = useState(null);
  const [courseid, setCourseid] = useState(null);
  const [minAmountPlan, setMinAmountPlan] = useState(0);
  const [maxAmountPlan, setMaxAmountPlan] = useState(0);
  const [formValues, setFormValues] = useState({
    amount: 0,
    name: "",
    courseType: "",
    period: "",
    currency: "INR",
    interval: 0,
    board: "",
    state: "",
    city: "",
    standards: [],
    productIds: [],
    coupon: "",
    expiryDate: "",
  });

  console.log("final price :");
  // calculation part---------------------------------
  const [totalAmount, setTotalAmount] = useState({ min: 0, max: 0 });
  const calculateTotalAmount = (selectedIds) => {
    const selectedSubjects = subjects.filter((subject) =>
      selectedIds.includes(subject._id)
    );

    const min = selectedSubjects.reduce(
      (sum, subject) => sum + (subject.minAmount || 0),
      0
    );

    const max = selectedSubjects.reduce(
      (sum, subject) => sum + (subject.maxAmount || 0),
      0
    );

    setTotalAmount({ min: minAmountPlan + min, max: maxAmountPlan + max });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stateData, courseData, subjectData, classData, boardData] =
          await Promise.all([
            getStateData("IN"),
            getCourseData(),
            getSubjectData(),
            getClassData(),
            getBoardData(),
          ]);

        setStates(Object.keys(stateData || {}));
        setCourses(
          courseData.courses.map((course) => ({
            label: course.courseName || "Unnamed Course",
            value: course.courseId,
          }))
        );
        setSubjects(subjectData || []);
        setClasses(
          classData.map((classItem) => ({
            name: classItem.name,
            id: classItem._id,
          }))
        );
        setBoards(
          boardData.boards.map((board, index) => ({
            boardName: board.boardName || `Unnamed Course ${index}`,
            key: board._id || `course-${index}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [couponValue, setCouponValue] = useState(0);
  const [periodPlan, setPeriodPlan] = useState(null);
  console.log("course: ", courses);
  const handleChange = async (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => {
      if (name === "coupon") {
        const parsedCoupon = parseInt(value, 10) || 0;
        const discountedPrice = totalAmount.max - parsedCoupon;

        setCouponValue(parsedCoupon);
        return {
          ...prev,
          [name]: value,
          finalPrice: discountedPrice > 0 ? discountedPrice : 0,
        };
      }

      if (name === "productIds") {
        const selectedIds = value;

        calculateTotalAmount(selectedIds);
        return {
          ...prev,
          [name]: selectedIds,
        };
      }

      if (name === "class") {
        const selectedClass = classes.find(
          (classItem) => classItem.name === value
        );
        const classId = selectedClass ? selectedClass.id : null;

        return {
          ...prev,
          [name]: value,
          standards: classId ? [classId] : [],
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    if (name === "courseType") {
      setCourseid(value);
    }

    if (name === "period") {
      console.log("valuegggggggggggg: ", value);
      setPeriodPlan(value);
      fetchPlans(courseid);
    }
  };

  useEffect(() => {
    if (courseid && periodPlan) {
      console.log("fffffffffffffffff ", periodPlan);
      fetchPlans(courseid);
    }
  }, [periodPlan, courseid]);

  const fetchPlans = async (courseId) => {
    try {
      // debugger;
      const plans = await getPlansByCourseId(courseId);
      const yearlyPlans = plans.filter((plan) => plan.period === "yearly");

      console.log("periodPlan ", periodPlan);
      if (yearlyPlans.length > 0 && periodPlan === "yearly") {
        const maxAmount = Math.max(
          ...yearlyPlans.map((plan) => plan.maxAmount || 0)
        );
        const minAmount = Math.min(
          ...yearlyPlans.map((plan) => plan.minAmount || 0)
        );
        setTotalAmount({ min: minAmount, max: maxAmount });
        setMinAmountPlan(minAmount);
        setMaxAmountPlan(maxAmount);
      } else {
        setTotalAmount({ min: 0, max: 0 });
        setMinAmountPlan(0);
        setMaxAmountPlan(0);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setTotalAmount({ min: 0, max: 0 });
    }
  };

  const handleNext = async () => {
    setShowModal(true);
  };

  const handleBack = async () => {
    navigate("/");
  };

  const handleConfirm = async () => {
    setShowModal(false);

    try {
      const requestData = {
        amount: Number(price),
        period: formValues.period,
        courseType: formValues.courseType,
        subjects: formValues.subjects,
        board: formValues.board,
        state: formValues.state,
        interval: intervalData,
        coupon: formValues.coupon,
        standards: formValues.standards,
        productIds: formValues.productIds,
        currency: formValues.currency,
        expiryDate: formValues.expiryDate,
        name: "PLAN-SUB-3",
      };

      const rawResponse = await createOrUpdatePlan(requestData);

      if (rawResponse.ok) {
        const { _id, courseType } = rawResponse.data;
        const requestMap = {
          courseType: formValues.courseType,
          enrollmentId,
          plan: _id,
        };
        await mapPlanEnrollment(requestMap);
        navigate("/payment-status", { state: { enrollmentId, mobile } });
      } else {
        const errorData = await rawResponse.json();
        console.error("Error creating payment:", errorData);
      }
    } catch (error) {}
  };

  const handleClose = () => {
    setShowModal(false);
  };

  // -----------------------------------for year-------------------------------------------------
  const [intervalData, setIntervalData] = useState(null);
  const [monthInterval, setMOnthIntervalData] = useState(null);
  const handleYearChange = (data) => {
    setIntervalData(data);
    console.log("Updated Year Data:", data);
  };
  const handleMonthChange = (data) => {
    setIntervalData(data);
    console.log("Updated month Data:", data);
  };

  const handleRemoveSubject = (subjectId) => {
    // Remove the subjectId from the productIds array
    setFormValues((prevValues) => {
      const updatedProductIds = prevValues.productIds.filter(
        (id) => id !== subjectId
      );
      calculateTotalAmount(updatedProductIds); // Recalculate with updated IDs
      return {
        ...prevValues,
        productIds: updatedProductIds,
      };
    });
  };

  return (
    <div className="outer-background">
      <div className="payment-details-container">
        <div className="header-section">
          <div className="page-name">
            <span>Student Details</span>
            <img src="/icons/cross-icon.svg" alt="Enrollment Icon" />
          </div>
        </div>
        <div className="progressbar">
          <ProgressBar />
        </div>
        {formValues.period === "yearly" ? (
          <Year onYearChange={handleYearChange} />
        ) : (
          <Month onMonthChange={handleMonthChange} />
        )}
        <div className="row1">
          <div className="form-control">
            <CustomSelect
              label="Select Course"
              name="courseType"
              value={formValues.courseType}
              options={courses}
              onChange={handleChange}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              renderValue={(selected) => {
                const selectedOption = courses.find(
                  (course) => course.value === selected
                );
                return selectedOption ? selectedOption.label : "Select Course";
              }}
            />
          </div>

          <div className="form-control">
            <CustomSelect
              label="Tenure"
              name="period"
              value={formValues.period}
              options={[
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
              ]}
              onChange={handleChange}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </div>

          <div className="form-control">
            <div className="form-control">
              <div className="selected-subjects">
                {formValues.productIds.length > 0 && (
                  <div>
                    <ul className="subject-list">
                      {formValues.productIds.map((productId) => {
                        const subject = subjects.find(
                          (subject) => subject._id === productId
                        );
                        return subject ? (
                          <li key={subject._id} className="subject-item">
                            {subject.name}
                            <button
                              onClick={() => handleRemoveSubject(productId)}
                            >
                              <img src="/icons/cross-icon.svg" alt="Remove" />
                            </button>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <CustomSelect
              label="Subjects"
              name="productIds"
              value={formValues.productIds}
              options={subjects.map((subject, index) => ({
                value: subject._id || `subject-${index}`,
                label: subject.name || `Unnamed Subject ${index}`,
                key: subject._id || `key-subject-${index}`,
              }))}
              onChange={handleChange}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
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
        </div>

        <div className="row2">
          <div className="form-control">
            <CustomSelect
              label="Class"
              name="class"
              value={formValues.class}
              options={classes.map((classItem, index) => ({
                value: classItem.name || `Class ${index}`,
                label: classItem.name || `Class ${index}`,
                key: classItem.id || `class-${index}`, // Use unique key
              }))}
              onChange={handleChange}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </div>

          <div className="form-control">
            <CustomSelect
              label="Select Board"
              name="board"
              value={formValues.board}
              options={boards.map((board, index) => ({
                value: board.boardName || `Unnamed Course ${index}`,
                label: board.boardName || `Unnamed Course ${index}`,
                key: board.key || `course-${index}`,
              }))}
              onChange={handleChange}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </div>

          <div className="form-control">
            <CustomSelect
              label="State"
              name="state"
              value={formValues.state}
              options={states.map((state, index) => ({
                value: state || `State ${index}`,
                label: state || `State ${index}`,
                key: state || `state-${index}`,
              }))}
              onChange={handleChange}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
          </div>
        </div>

        <div className="coupon-finalprice-section">
          <div className="form-control">
            <label>Coupon</label>
            <input
              type="text"
              name="coupon"
              value={formValues.coupon}
              onChange={handleChange}
              style={{
                width: "22vh",
                borderRadius: "8px 0 0 8px",
                borderRight: "none",
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
              onClick={() => {
                const discountedPrice = totalAmount.max - couponValue;
                setFormValues((prev) => ({
                  ...prev,
                  finalPrice: discountedPrice > 0 ? discountedPrice : 0,
                }));
              }}
            >
              Apply
            </button>
          </div>

          <div className="coupon-finalprice-section-box">
            <div className="price-section-control">
              <div className="form-control">
                <label>Final Price</label>
                <Input
                  value={price}
                  onChange={setPrice}
                  placeholder="Fix Amount"
                />
              </div>
              <div>
                <span className="min" style={{ color: "green" }}>
                  min {totalAmount.min}
                </span>
                <span>-</span>
                <span className="max" style={{ color: "red" }}>
                  max {totalAmount.max}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="button-section-details">
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
          Next
        </button>
      </div>

      {showModal && (
        <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <ModalContent
            formValues={formValues}
            subjects={subjects}
            onConfirm={handleConfirm}
            onClose={handleClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default PaymentDetails;
