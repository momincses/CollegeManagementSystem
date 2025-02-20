import React from "react";
import Navbar from "../../Components/StudentPageComponents/Navbar/Navbar";
import StudentHero from "../../Components/StudentPageComponents/StudentHero/StudentHero"
import styles from "./StudentHome.module.css"
const StudentHome = () => {
  return (
    <>
      <Navbar />
    <div className={styles.StudentHome}>
      <StudentHero></StudentHero>
    </div>
    </>
  );
};

export default StudentHome;
