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
import SkillDropdown from "../components/PaymentDetails/SkillDropdown";
import SelectedSubjects from "../components/PaymentDetails/SelectedSubjects";

import {
  getClassData,
  getCourseData,
  getStateData,
  createOrUpdatePlan,
  mapPlanEnrollment,
  getBoardData,
  getPlansByCourseId,
  getSubjectById,
} from "../utils/api";
import { color, height } from "@mui/system";

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
  const [price, setPrice] = useState("");
  const [courseid, setCourseid] = useState(null);
  const [minAmountPlan, setMinAmountPlan] = useState(0);
  const [maxAmountPlan, setMaxAmountPlan] = useState(0);
  const [productIdsSkill, setProductIdsSkill] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [couponValue, setCouponValue] = useState(0);
  const [periodPlan, setPeriodPlan] = useState(null);
  const [intervalData, setIntervalData] = useState(null);
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

  const handleProductIdsChange = (newProductIds) => {
    console.log("handleProductIdsChange called with:", newProductIds);
    setProductIdsSkill(newProductIds);
  };

  useEffect(() => {
    const ids = productIdsSkill.map((subject) => subject._id);
    calculateTotalAmount(ids);
    console.log("productIdsSkill777777777777", ids);
  }, [productIdsSkill]);

  // calculation part---------------------------------
  const [totalAmount, setTotalAmount] = useState({ min: 0, max: 0 });
  const [subjecTotalMin, setsubjecTotalMin] = useState(0);
  const [subjecTotalMax, setsubjecTotalMax] = useState(0);
  const calculateTotalAmount = (selectedIds) => {
    const filteredData = subjects.filter((item) =>
      selectedIds.includes(item._id)
    );
    console.log("filteredData==== ", filteredData);
    const newsubjectarray = filteredData.concat(productIdsSkill);
    console.log("qqqqqqqqqqqqqqqqqqqq ", newsubjectarray);
    const total = newsubjectarray.reduce(
      (acc, item) => {
        acc.min += item.minAmount || 0;
        acc.max += item.maxAmount || 0;
        return acc;
      },
      { min: 0, max: 0 } // Initial values
    );
    setsubjecTotalMax(total.max);
    setsubjecTotalMin(total.min);
    setTotalAmount({
      min: minAmountPlan + total.min,
      max: maxAmountPlan + total.max,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (courseid) {
          const subjectDataById = await getSubjectById(courseid);

          if (subjectDataById && Array.isArray(subjectDataById.subjects)) {
            const normalizedSubjects = subjectDataById.subjects.map(
              (subject) => ({
                _id: subject._id || Date.now(),
                name: subject.name || "Unnamed Subject",
                minAmount: subject.minAmount,
                maxAmount: subject.maxAmount,
              })
            );
            setSubjects(normalizedSubjects);
          } else {
            console.error("Subject data not found or malformed response");
          }
        } else {
          const [stateData, courseData, classData, boardData] =
            await Promise.all([
              getStateData("IN"),
              getCourseData(),
              getClassData(),
              getBoardData(),
            ]);

          const normalizedSubjects = [
            {
              _id: "default",
              name: "First select course",
              minAmount: null,
              maxAmount: null,
            },
          ];
          setSubjects(normalizedSubjects);
          setStates(Object.keys(stateData || {}));
          setCourses(
            courseData.courses.map((course) => ({
              label: course.courseName || "Unnamed Course",
              value: course.courseId,
            }))
          );
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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [courseid]);

  const handleYearChange = (data) => {
    setIntervalData(data);
  };
  const handleChange = async (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => {
      if (name === "coupon") {
        // const parsedCoupon = parseInt(value, 10) || 0;

        setCouponValue(value);
        return {
          ...prev,
          [name]: value,
        };
      }
      if (name === "amount") {
        setPrice(value);
        return {
          ...prev,
          [name]: value,
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
      setPeriodPlan(value);
      // fetchPlans(courseid);
    }
  };

  useEffect(() => {
    if (courseid && periodPlan && intervalData) {
      fetchPlans(courseid, intervalData);
    }
  }, [periodPlan, courseid, intervalData]);

  const fetchPlans = async (courseId, intervalidss) => {
    try {
      const plans = await getPlansByCourseId(courseId);
      const yearlyPlans = plans.filter(
        (plan) => plan.period === "yearly" && plan.interval === intervalidss
      );

      console.log("yearlyPlans== ", yearlyPlans);
      if (yearlyPlans.length > 0 && periodPlan === "yearly") {
        const maxAmount = Math.max(
          ...yearlyPlans.map((plan) => plan.maxAmount || 0)
        );
        const minAmount = Math.min(
          ...yearlyPlans.map((plan) => plan.minAmount || 0)
        );
        setTotalAmount({
          min: minAmount + subjecTotalMin,
          max: maxAmount + subjecTotalMax,
        });
        setMinAmountPlan(minAmount);
        setMaxAmountPlan(maxAmount);
      } else {
        setTotalAmount({ min: subjecTotalMin, max: subjecTotalMax });
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
      const allsubject = formValues.productIds.concat(productIdsSkill);

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
        productIds: allsubject,
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

  const handleMonthChange = (data) => {
    setIntervalData(data);
    console.log("Updated month Data:", data);
  };

  const handleRemoveSubject = (subjectId) => {
    setFormValues((prevValues) => {
      console.log("prevValues", prevValues);
      const updatedProductIds = prevValues.productIds.filter(
        (id) => id !== subjectId
      );
      console.log("updatedProductIds", updatedProductIds);
      calculateTotalAmount(updatedProductIds);

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
        <div className="subjectshow">
          {formValues.period === "yearly" ? (
            <Year onYearChange={handleYearChange} />
          ) : (
            <Month onMonthChange={handleMonthChange} />
          )}
          <SelectedSubjects
            subjects={subjects}
            productIds={formValues.productIds}
            onRemoveSubject={handleRemoveSubject}
            period={formValues.period}
          />
        </div>

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
                if (!selected || selected.length === 0) {
                  return formValues.period === "yearly"
                    ? "All Subject"
                    : "Select";
                }
                const selectedLabels = subjects
                  .filter((subject) => selected.includes(subject._id))
                  .map((subject) => subject.name);
                return selectedLabels.join(", ");
              }}
              disabled={formValues.period === "yearly"}
            />
            <SkillDropdown onProductIdsChange={handleProductIdsChange} />
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
                key: classItem.id || `class-${index}`,
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
                  onChange={handleChange}
                  name="amount"
                  placeholder="Fix Amount"
                  rootStyle={{
                    borderRadius: "8px",
                  }}
                  inputStyle={{
                    height: "18px",
                    color: "#64748B",
                  }}
                />
              </div>
              <div>
                <span className="min" style={{ color: "green" }}>
                  Min {totalAmount.min}
                </span>
                <span>&nbsp;-&nbsp;</span>
                <span className="max" style={{ color: "red" }}>
                  Max {totalAmount.max}
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
