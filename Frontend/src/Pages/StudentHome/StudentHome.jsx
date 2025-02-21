import React from "react";
import StudentHero from "../../Components/StudentPageComponents/StudentHero/StudentHero"
import styles from "./StudentHome.module.css"
import ExploreSection from "../../Components/StudentPageComponents/ExploreSection/ExploreSection";
const StudentHome = () => {
  return (
    <>
    <div className={styles.StudentHome}>
      <StudentHero></StudentHero>
      <ExploreSection></ExploreSection>
    </div>
    </>
  );
};

export default StudentHome;
