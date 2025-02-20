import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/StudentPageComponents/Navbar/Navbar";
import StudentHome from "../Pages/StudentHome/StudentHome";
import ElectionRoutes from "./ElectionRoutes";

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="/student" element={<StudentHome />} />
        <Route path="election/*" element={<ElectionRoutes />} />
        {/* 🔥 Add more routes here as needed */}
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
