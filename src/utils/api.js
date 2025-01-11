const BASE_URL =
  "https://intelliclick-server-dev-1082184296521.us-central1.run.app/api";

const getToken = () => localStorage.getItem("authToken");

const fetchWithAuth = async (endpoint, options = {}) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzNmM2MyMTYwMjgzMmQ1ZDU5NmM4NmEiLCJyb2xlIjoiQkRBIiwibW9kZXJhdG9yIjpmYWxzZSwiZW1haWwiOiJ0ZXN0LnN0dWRlbnRAZ21haWwuY29tIiwibmFtZSI6IlRlc3QgQkRBIiwiaWF0IjoxNzMzNTQ3MTcyfQ.8Gf3kxncGGyP-tUlt4fq_eXr3vemaSBWWiBVl_iSZUI";
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
    Authorization: token,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
  };
};

const handleResponse = (response, errorMessage) => {
  if (!response.ok) {
    const error = response.data?.message || "Unknown error";
    throw new Error(`${errorMessage}: ${error}`);
  }
  return response.data;
};

export const createOrUpdatePayment = async (paymentDetails) => {
  const endpoint = `/payment/write/create-order`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(paymentDetails),
  });
  return response;
};

export const getPaymentData = async () => {
  const endpoint = `/payment/read/get-all-payment-orders`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch class data");
};

export const createOrUpdateEnrollment = async (enrollmentDetails) => {
  const endpoint = `/enrollment/write/create-or-update`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(enrollmentDetails),
  });
  return response;
};

export const getAllPlans = async (planType) => {
  const endpoint = `/plan/read/get-all-plans?planType=${planType}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch plans");
};

export const getStateData = async (countryCode) => {
  const endpoint = `/user/read/get-state-data?country=${countryCode}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch state data");
};

export const getClassData = async () => {
  const endpoint = `/standard/read/get-all`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch class data");
};

export const getSubjectData = async () => {
  const endpoint = `/subject/read/get-all-subjects`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch subject data");
};

export const createOrUpdatePlan = async (planDetails) => {
  const endpoint = `/plan/write/create-or-update`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(planDetails),
  });
  return response;
};

export const getAllPaymentByNumber = async (number) => {
  if (!number) {
    throw new Error("Number parameter is required");
  }

  const endpoint = `/payment/read/get-all-payment-orders?phone=${number}`;
  try {
    const response = await fetchWithAuth(endpoint);
    return handleResponse(response, "Failed to fetch payment data");
  } catch (error) {
    throw error;
  }
};

export const mapPaymentIdEnrollment = async (mapPaymentIdEnrollment) => {
  const endpoint = `/enrollment/write/map-paymentId-enrollment`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(mapPaymentIdEnrollment),
  });
  return handleResponse(response, "Failed to create or update plan");
};

export const getCourseData = async () => {
  const endpoint = `/course/read/get-all-courses-dropdown`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch subject data");
};

export const createCourse = async (mapPaymentIdEnrollment) => {
  const endpoint = `/course/write/create-or-update`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(mapPaymentIdEnrollment),
  });
  return handleResponse(response, "Failed to create or update plan");
};

export const confirmEnrollment = async (confirmEnrollment) => {
  const endpoint = `/enrollment/write/confirm-enrollment`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(confirmEnrollment),
  });
  return handleResponse(response, "Failed to create or update plan");
};

export const mapPlanEnrollment = async (PlanEnrollment) => {
  const endpoint = `/enrollment/write/map-plan-enrollment`;
  const response = await fetchWithAuth(endpoint, {
    method: "POST",
    body: JSON.stringify(PlanEnrollment),
  });
  return handleResponse(response, "Failed to create or update plan");
};

export const getBoardData = async () => {
  const endpoint = `/board/read/get-all-boards-dropdown`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch class data");
};

export const getYearData = async () => {
  const endpoint = `/constant/read/get?constantType=yearCrud`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch Subscription data");
};

export const getPlansByCourseId = async (courseId) => {
  const endpoint = `/plan/read/get-all-plans?courseType=${courseId}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch plan data");
};

export const getSubjectById = async (courseId) => {
  const endpoint = `/course/read/get?courseId=${courseId}`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch Subscription data");
};

export const getEnrollStudentTableData = async () => {
  const endpoint = `/enrollment/read/get-all`;
  const response = await fetchWithAuth(endpoint);
  return handleResponse(response, "Failed to fetch subject data");
};

// ----------------------------------this is admin section---------------------------------------

const BASE_URL_LOCAL = "http://localhost:8080/api";

// const getToken = () => localStorage.getItem("authToken");
// localStorage.setItem("authToken", userToken);

const fetchWithAuthLocal = async (endpoint, options = {}) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzNmM2MyMTYwMjgzMmQ1ZDU5NmM4NmEiLCJyb2xlIjoiQkRBIiwibW9kZXJhdG9yIjpmYWxzZSwiZW1haWwiOiJ0ZXN0LnN0dWRlbnRAZ21haWwuY29tIiwibmFtZSI6IlRlc3QgQkRBIiwiaWF0IjoxNzM1OTg0OTE1fQ.t0bASH6S4Yl0v_K1irlF_91SOzTRGnHDRX9wB066dyk",
  };

  console.log("Making request to:", `${BASE_URL_LOCAL}${endpoint}`);
  console.log("With headers:", headers);

  try {
    const response = await fetch(`${BASE_URL_LOCAL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const data = await response.json();
    console.log("Response data:", data);

    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw new Error("Network error");
  }
};

const handleResponseLocal = (response, errorMessage) => {
  if (!response.ok) {
    const error = response.data?.message || "Unknown error";
    throw new Error(`${errorMessage}: ${error}`);
  }
  return response.data;
};

export const getAllCoupons = async (pageNum, pageSize) => {
  const endpoint = `/coupon/read/get-all?pageNum=${pageNum}&pageSize=${pageSize}`;
  const response = await fetchWithAuthLocal(endpoint);
  return handleResponseLocal(response, "Failed to fetch Subscription data");
};

export const applyCoupon = async (couponDetails) => {
  const endpoint = `/plan/coupon/apply-coupon`;
  const response = await fetchWithAuthLocal(endpoint, {
    method: "POST",
    body: JSON.stringify(couponDetails),
  });
  return response;
};
