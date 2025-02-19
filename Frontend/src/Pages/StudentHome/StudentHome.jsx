import React from 'react'
import styles from "./StudentHome.module.css"
import StudentHero from '../../Components/StudentPageComponents/StudentHero/StudentHero'

const StudentHome = () => {
  return (
    <div>
        <Navbar></Navbar>
        <StudentHero></StudentHero>
    </div>
  )
}

export default StudentHome