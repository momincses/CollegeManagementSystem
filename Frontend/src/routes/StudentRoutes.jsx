import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/StudentPageComponents/Navbar/Navbar";
import StudentHome from "../Pages/StudentHome/StudentHome";
import ElectionRoutes from "./ElectionRoutes";
import StudentSickLeave from "../Components/SickLeave/Student/StudentSickLeave";

const StudentRoutes = () => { 
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<StudentHome />} />
        <Route path="/election/*" element={<ElectionRoutes />} />
        <Route path="/sick-leave" element={<StudentSickLeave />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
