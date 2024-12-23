import React, { useState, useEffect } from "react";
import Table from "../components/app/Table";
import { getEnrollStudentTableData } from "../utils/api";

const EnrollStudentTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        const enrollMentData = await getEnrollStudentTableData();
        const filteredData = enrollMentData.data.map((item) => ({
          Student: item.studentName || "N/A",
          Father: item.parentName || "N/A",
          "Phone Number": item.mobile,
          Status: item.status || "N/A",
          Created: item.createdAt || "N/A",
        }));
        setTableData(filteredData);
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
      }
    };
    fetchEnrollmentData();
  }, []);

  const headers = ["Student", "Father", "Phone Number", "Status", "Created"];

  return (
    <div>
      <h2>Enrollment Table</h2>
      <Table headers={headers} data={tableData} headerBgColor="blue" />
    </div>
  );
};

export default EnrollStudentTable;
