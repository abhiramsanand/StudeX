import React, { useState } from "react";

const StudentForm: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [className, setClassName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName || !age || !className) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(Number(age)) || Number(age) <= 0) {
      setError("Age must be a valid positive number.");
      return;
    }

    setError(null);

    const studentData = {
      student_name: studentName,
      age: Number(age),
      class_name: className,
    };

    try {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit student data.");
      }

      setSuccess("Student data submitted successfully.");
      setStudentName("");
      setAge("");
      setClassName("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  };

  const titleStyle = {
    textAlign: "center" as const,
    fontSize: "20px",
    marginBottom: "20px",
    color: "#333",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold" as const,
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const errorStyle = {
    color: "red",
    marginBottom: "15px",
    textAlign: "center" as const,
  };

  const successStyle = {
    color: "green",
    marginBottom: "15px",
    textAlign: "center" as const,
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <div style={formGroupStyle}>
          <label htmlFor="student_name" style={labelStyle}>Student Name</label>
          <input
            type="text"
            id="student_name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={inputStyle}
            placeholder="Enter student name"
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="age" style={labelStyle}>Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={inputStyle}
            placeholder="Enter age"
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="class_name" style={labelStyle}>Class Name</label>
          <input
            type="text"
            id="class_name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            style={inputStyle}
            placeholder="Enter class name"
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default StudentForm;