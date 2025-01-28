import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import "../styles/PaymentDetails.css";
import Year from "../components/PaymentDetails/Year";
import Month from "../components/PaymentDetails/Month";
import { Modal } from "@mui/material";
import ModalContent from "../components/PaymentDetails/ModalContent";
import CustomSelect from "../components/app/CustomSelect";
import Input from "../components/app/Input";
import SkillDropdown from "../components/PaymentDetails/SkillDropdown";
import BatchDropdown from "../components/PaymentDetails/BatchDropdown";
import SelectedSubjects from "../components/PaymentDetails/SelectedSubjects";
import FixPlan from "../components/PaymentDetails/FixPlan";
import Coupon from "../components/PaymentDetails/Coupon";
import {
  getClassData,
  getCourseData,
  createOrUpdatePlan,
  mapPlanEnrollment,
  getBoardData,
  getPlansByCourseId,
  getSubjectById,
  getSubjectData,
  getAdminPlansByCourseId,
} from "../utils/api";

const PaymentDetails = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { enrollmentId, mobile } = location.state || {};
  const [classes, setClasses] = useState([]);
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
  const [totalAmount, setTotalAmount] = useState({ min: 0, max: 0 });
  const [subjecTotalMin, setsubjecTotalMin] = useState(0);
  const [subjecTotalMax, setsubjecTotalMax] = useState(0);
  const [resultClass, setShowClass] = useState(false);
  const [allSubjectsarray, setAllSubjects] = useState([]);
  const [productCourseIds, setProductCourseIds] = useState([]);
  const [allSubject, setAllSubject] = useState([]);
  const [amounts, setAmounts] = useState({ minAmount: 0, maxAmount: 0 });
  const [adminData, setAdminData] = useState([]);
  const [fixPlan, setFixPlan] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
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
    planType: "salesPanel",
  });
  const handleSubjectSelection = (subjectIds) => {
    console.log("Selected Subject IDs:", subjectIds);
    setSelectedSubjects(subjectIds);
  };

  const handleAmount = (amountMaxMin) => {
    console.log("maxamount", amountMaxMin.maxAmount);
    console.log("minAmount", amountMaxMin.minAmount);
    setTotalAmount({
      max: amountMaxMin.maxAmount,
      min: amountMaxMin.minAmount,
    });
    console.log("max ans min amount ", amountMaxMin);
  };

  const handleProductIdsChange = (newProductIds) => {
    setProductIdsSkill(newProductIds);
  };

  const checkSubjectsForClass = (normalizedSubjects, subjects) => {
    console.log("subjects", subjects);
    for (let normalized of normalizedSubjects) {
      const matchedSubject = subjects.find(
        (subject) => subject._id === normalized._id
      );

      if (matchedSubject) {
        if (
          matchedSubject.allowedStandards &&
          matchedSubject.allowedStandards.length > 0
        ) {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (courseid) {
          const adminplans = await getAdminPlansByCourseId();
          setAdminData(adminplans);
          const subjectDataById = await getSubjectById(courseid);
          const subjectData = await getSubjectData();
          // debugger;
          setAllSubject(subjectData);
          if (subjectDataById && Array.isArray(subjectDataById.subjects)) {
            const normalizedSubjects = subjectDataById.subjects.map(
              (subject) => ({
                _id: subject._id || Date.now(),
                name: subject.name || "Unnamed Subject",
                minAmount: subject.minAmount,
                maxAmount: subject.maxAmount,
              })
            );
            // console.log("normalizedSubjects", normalizedSubjects);
            const result = checkSubjectsForClass(
              normalizedSubjects,
              subjectData
            );
            // console.log("result class for the new subject", result);
            setShowClass(result);
            if (result) {
              const matchingStandards = subjectData.filter((subject) =>
                subject.allowedStandards.some((standardId) =>
                  formValues.standards.includes(standardId)
                )
              );
              console.log();
              setSubjects(matchingStandards);
            } else {
              setSubjects(normalizedSubjects);
            }
          } else {
            console.error("Subject data not found or malformed response");
          }
        } else {
          const [courseData, classData, boardData] = await Promise.all([
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
  }, [courseid, formValues.standards]);

  const handleYearChange = (data) => {
    // setProductCourseIds([]);
    setIntervalData(data);
  };

  const handleChange = async (event) => {
    if (!event || !event.target) return;
    const { name, value } = event.target;

    setFormValues((prev) => {
      if (name === "coupon") {
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

        // calculateTotalAmount(selectedIds);
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
    }
  };

  // const fetchPlans = useCallback(
  //   async (courseId, intervalidss) => {
  //     try {
  //       const plans = await getPlansByCourseId(courseId);
  //       console.log("plans yearly:== ", plans);
  //       const yearlyPlans = plans.filter(
  //         (plan) =>
  //           plan.period === "yearly" &&
  //           plan.interval === intervalidss &&
  //           plan.planType === "adminPanel"
  //       );

  //       setAmounts({
  //         maxAmount: yearlyPlans[0]?.maxAmount,
  //         minAmount: yearlyPlans[0]?.minAmount,
  //       });

  //       const productIdsArray = yearlyPlans[0]?.productIds || [];

  //       setProductCourseIds(productIdsArray);
  //     } catch (error) {
  //       console.error("Error fetching plans:", error);
  //       setTotalAmount({ min: 0, max: 0 });
  //     }
  //   },
  //   [
  //     subjects,
  //     periodPlan,
  //     subjecTotalMin,
  //     subjecTotalMax,
  //     setProductCourseIds,
  //     setTotalAmount,
  //     setMinAmountPlan,
  //     setMaxAmountPlan,
  //     getPlansByCourseId,
  //     intervalData,
  //   ]
  // );
  // useEffect(() => {
  //   if (courseid && periodPlan && intervalData) {
  //     fetchPlans(courseid, intervalData);
  //   }
  // }, [fetchPlans]);

  useEffect(() => {
    try {
      console.log("adminplans", adminData);

      const filteredPlans = adminData.filter((plan) => {
        const matchesCourseType = plan.courseType === formValues.courseType; // Check courseType match
        console.log(
          "Filtered by courseType (inside filter):",
          matchesCourseType
        );

        return matchesCourseType;
      });

      console.log("Filtered Admin Plans (by courseType):", filteredPlans);

      let finalFilteredPlans = filteredPlans;

      if (formValues.period) {
        finalFilteredPlans = finalFilteredPlans.filter(
          (plan) => plan.period === formValues.period
        );
        console.log("Filtered by period:", finalFilteredPlans);
      }

      if (formValues.period && intervalData) {
        finalFilteredPlans = finalFilteredPlans.filter(
          (plan) => plan.interval === intervalData
        );
        console.log("Filtered by intervalData:", finalFilteredPlans);
      }
      console.log(
        "formValues.standasssssssssssssssssssrds",
        formValues.standards
      );

      if (
        formValues.standards.length > 0 &&
        Array.isArray(formValues.standards)
      ) {
        finalFilteredPlans = finalFilteredPlans.filter((plan) =>
          plan.standards?.some((standard) =>
            formValues.standards.includes(standard)
          )
        );
        console.log("Filtered by standards:", finalFilteredPlans);
      }

      if (formValues.board) {
        finalFilteredPlans = finalFilteredPlans.filter(
          (plan) => plan.board === formValues.board
        );
        console.log("Filtered by intervalData:", finalFilteredPlans);
      }

      setFixPlan(finalFilteredPlans);
      console.log(
        "Fffffffffffffffffinal Filtered Admin Plans:",
        finalFilteredPlans
      );
    } catch (error) {
      console.error("Error fetching admin plans:", error);
    }
  }, [
    adminData,
    intervalData,
    formValues.courseType,
    formValues.standards,
    formValues.period,
    formValues.board,
  ]);

  const handleNext = async () => {
    setShowModal(true);
  };

  const handleBack = async () => {
    navigate("/");
  };

  const computeAllSubjects = useCallback(() => {
    console.log("productIdsSkillproductIdsSkill", productIdsSkill);
    console.log(
      "formValues.productIdsformValues.productIds",
      formValues.productIds
    );
    if (productIdsSkill.length > 0 || formValues.productIds.length > 0) {
      // console.log("this is best practices");
      // debugger;
      setSelectedSubjects([]);
      const skillSubjectIds = productIdsSkill.map((subject) => subject._id);
      const allSubjects = formValues.productIds.concat(skillSubjectIds);
      const filteredSubjects = allSubject.filter((subject) =>
        allSubjects.includes(subject._id)
      );
      const totalAmounts = filteredSubjects.reduce(
        (totals, subject) => {
          totals.minAmount += subject.minAmount || 0;
          totals.maxAmount += subject.maxAmount || 0;
          return totals;
        },
        { minAmount: 0, maxAmount: 0 }
      );
      setTotalAmount({
        min: totalAmounts.minAmount,
        max: totalAmounts.maxAmount,
      });
      setAllSubjects(allSubjects);
      return allSubjects;
    } else {
      return selectedSubjects;
    }
  }, [
    formValues.productIds,
    subjects,
    productIdsSkill,
    setAllSubjects,
    productCourseIds,
    selectedSubjects,
  ]);

  useEffect(() => {
    computeAllSubjects();
  }, [computeAllSubjects]);

  const handleConfirm = async () => {
    setShowModal(false);

    try {
      const expiryDate = moment().add(intervalData * 12, "months");
      const formattedExpiryDate = expiryDate.toISOString();

      const allsubject = computeAllSubjects();
      console.log("allsubject allsuvject", allSubject);
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
        expiryDate: formattedExpiryDate,
        name: "PLAN-SUB-3",
        planType: "salesPanel",
      };

      const rawResponse = await createOrUpdatePlan(requestData);

      if (rawResponse.ok) {
        const { _id } = rawResponse.data;
        const requestMap = {
          enrollmentId,
          plan: _id,
        };
        // const requestMap = {
        //   enrollmentId: "675d2d15e634ac2056eea723", // Correctly name the key
        //   plan: "plan_PW7clIAo5hX52a",
        // };
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

  const handleMonthChange = (data) => {
    setIntervalData(data);
  };

  const handleRemoveSubject = (subjectId) => {
    setFormValues((prevValues) => {
      const updatedProductIds = prevValues.productIds.filter(
        (id) => id !== subjectId
      );
      // calculateTotalAmount(updatedProductIds);

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
        <div className="row3">
          <div className="form-control subjectshow">
            <CustomSelect
              label="Select Course"
              name="courseType"
              value={formValues.courseType || ""}
              options={courses}
              onChange={handleChange}
              renderValue={(selected) => {
                const selectedOption = courses.find(
                  (course) => course.value === selected
                );
                return selectedOption ? selectedOption.label : "Select Course";
              }}
            />
            {!(
              productIdsSkill.length > 0 || formValues.productIds.length > 0
            ) && (
              <FixPlan
                fixPlan={fixPlan}
                onSubjectSelect={handleSubjectSelection}
                onAmountsChange={handleAmount}
              />
            )}
            <SelectedSubjects
              subjects={subjects.length > 0 ? subjects : allSubject}
              productIds={
                formValues.productIds.length > 0
                  ? formValues.productIds
                  : productCourseIds
              }
              onRemoveSubject={handleRemoveSubject}
              period={formValues.period}
            />
          </div>
        </div>

        <div className="row1">
          <div className="form-control">
            <BatchDropdown />
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
              // disabled={!formValues.courseType}
            />
          </div>
          <div className="subjectshow">
            {formValues.period === "yearly" ? (
              <Year
                onYearChange={handleYearChange}
                // disabled={!formValues.period}
              />
            ) : (
              <Month
                onMonthChange={handleMonthChange}
                // disabled={!formValues.period}
              />
            )}
          </div>
          <div className="form-control">
            <div className="form-control">
              <CustomSelect
                label="Class"
                name="class"
                value={formValues.class || ""}
                options={classes.map((classItem, index) => ({
                  value: classItem.name || `Class ${index}`,
                  label: classItem.name || `Class ${index}`,
                  key: classItem.id || `class-${index}`,
                }))}
                onChange={handleChange}
                // disabled={!resultClass}
              />
            </div>
          </div>
        </div>

        <div className="row2">
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
              // disabled={!intervalData}
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
              // disabled={!formValues.board}
            />
          </div>
          <div>
            <SkillDropdown
              // disabled={!intervalData}
              onProductIdsChange={handleProductIdsChange}
            />
          </div>
        </div>

        <div className="coupon-finalprice-section">
          <div className="form-control">
            <Coupon orderAmount={totalAmount.min} />
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
            courses={courses}
            skillSubject={productIdsSkill}
            allSubjects={allSubjectsarray}
            onConfirm={handleConfirm}
            onClose={handleClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default PaymentDetails;
