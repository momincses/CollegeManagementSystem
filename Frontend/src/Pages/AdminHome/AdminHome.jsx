import React from 'react'
import styles from "./AdminHome.module.css"
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

const AdminHome = () => {
  return (
    <div>
      <Button>
        <Link to="/coordinator/admin-invite">admin invite</Link>
        <Link to="/admin/facilities-panel">admin facility</Link>
      </Button>
    </div>
  )
}

export default AdminHome;