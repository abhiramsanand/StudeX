/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Course {
  course_name: string;
}

interface Student {
  _id: string;
  student_name: string;
  class: {
    class_name: string;
    courses: Course[];
  };
}

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch student details from the API
  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/students/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch student details.");
      }
      const result = await response.json();
      setStudent(result.data); // Ensure the API response's "data" key is used
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  // Inline styles
  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    textAlign: "center" as const,
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const errorStyle = { color: "red", textAlign: "center" as const };

  const listStyle = {
    listStyleType: "disc",
    paddingLeft: "20px",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={errorStyle}>{error}</p>
      ) : student ? (
        <div>
          <h1 style={titleStyle}>Student Details</h1>
          <p>
            <strong>Name:</strong> {student.student_name}
          </p>
          <p>
            <strong>Class:</strong> {student.class.class_name}
          </p>
          <div>
            <strong>Courses:</strong>
            <ul style={listStyle}>
              {student.class.courses.map((course, index) => (
                <li key={index}>{course.course_name}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p style={errorStyle}>Student not found.</p>
      )}
    </div>
  );
};

export default StudentDetails;
