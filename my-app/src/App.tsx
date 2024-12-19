import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StudentsTable from "./components/studentTable";
import StudentDetails from "./components/studentDetails";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentsTable />} />
        <Route path="/students/:id" element={<StudentDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
