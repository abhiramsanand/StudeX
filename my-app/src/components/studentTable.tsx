/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Student {
  _id: string;
  student_name: string;
  age: number;
}

const StudentsTable: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }
      const data = await response.json();
      setStudents(data.students);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  };
  const thTdStyle = {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left" as const,
  };
  const thStyle = { backgroundColor: "#f4f4f4", fontWeight: "bold" };
  const rowHoverStyle = { backgroundColor: "#f9f9f9" };
  const titleStyle = {
    textAlign: "center" as const,
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  };
  const errorStyle = { color: "red", textAlign: "center" as const };
  const loadingStyle = { textAlign: "center" as const, color: "#555" };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Students List</h1>
      {loading ? (
        <p style={loadingStyle}>Loading...</p>
      ) : error ? (
        <p style={errorStyle}>{error}</p>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "right", marginBottom: "20px"}}>
            <Link
              to={`/students/create`}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Create Student
            </Link>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...thTdStyle, ...thStyle }}>Name</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Age</th>
                <th style={{ ...thTdStyle, ...thStyle }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student._id}
                  style={
                    index % 2 === 0
                      ? rowHoverStyle
                      : { backgroundColor: "#ffffff" }
                  }
                >
                  <td style={thTdStyle}>
                    <Link
                      to={`/students/${student._id}`}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      {student.student_name}
                    </Link>
                  </td>
                  <td style={thTdStyle}>{student.age}</td>
                  <td style={thTdStyle}>
                    <Link
                      to={`/students/select/${student._id}`}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      Select Course
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default StudentsTable;
