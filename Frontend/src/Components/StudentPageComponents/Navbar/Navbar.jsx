import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from '../../../contexts/AuthContext';

// Drawer width for desktop view
const drawerWidth = 240;

const Navbar = () => {
  // State and hooks
  const [mobileOpen, setMobileOpen] = useState(false);  // Mobile drawer state
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop sidebar state
  const navigate = useNavigate();
  const { user } = useAuth();

  // Toggle handlers
  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Navigation menu items with role-based access
  const menuItems = [
    { text: "Dashboard", path: "/student" },
    { text: "Elections", path: "/student/election/candidates" },
    { 
      text: "Event Management", 
      path: "/student/event-request",
      roles: ["student-coordinator"] 
    },
    { 
      text: "My Event Requests", 
      path: "/student/my-events",
      roles: ["student-coordinator"] 
    },
    { 
      text: "View Events", 
      path: "/student/events",
      roles: ["student", "student-coordinator", "admin"] 
    },
    { text: "Event Request", path: "/student/event-request" },
    { text: "Sick Leave", path: "/student/sick-leave" },
    { text: "Facility Booking", path: "/student/facility-booking" },
    { text: "Event Requests", path: "/student/event-requests" },
    { text: "Complaints", path: "/student/complaints" },
    { text: "Budget Tracker", path: "/student/budget-tracking" },
    { text: "Cheater Records", path: "/student/cheaters-records" },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  // Drawer content component
  const drawerContent = (
    <Box sx={{ width: sidebarOpen ? drawerWidth : 70 }}>
      <IconButton onClick={toggleSidebar}>
        <ChevronLeftIcon />
      </IconButton>
      <Divider />
      <List>
        {filteredMenuItems.map(({ text, path }) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={path}
            sx={{
              "&:hover": { bgcolor: "#f0f0f0", color: "#333" },
              borderRadius: 2,
              mx: 1,
            }}
          >
            <ListItemText primary={sidebarOpen ? text : ""} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? drawerWidth : 70,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidth : 70,
            transition: "width 0.3s",
            overflowX: "hidden",
            bgcolor: "#fafafa",
            color: "#555",
            borderRight: "1px solid #e0e0e0",
          },
          display: { xs: "none", md: "block" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Top App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${sidebarOpen ? drawerWidth : 70}px)` },
          ml: { md: `${sidebarOpen ? drawerWidth : 70}px` },
          bgcolor: "#ffffff",
          color: "#555",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side - Title and mobile menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ display: { md: "none" }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Campus Management
            </Typography>
          </Box>

          {/* Right side - Action Buttons */}
          {user?.role === 'student-coordinator' && (
            <Button 
              color="primary"
              variant="contained"
              onClick={() => navigate('/student/event-request')}
              startIcon={<AddIcon />}
              sx={{ ml: 2 }}
            >
              New Event Request
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleMobileDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#fafafa",
            color: "#555",
          },
        }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: mobileOpen ? 0 : "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {drawerContent}
        </motion.div>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          p: { xs: 1, sm: 2, md: 2 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          borderRadius: 2,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Navbar;
