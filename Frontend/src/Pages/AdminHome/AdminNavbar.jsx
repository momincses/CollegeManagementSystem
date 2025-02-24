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
  Button,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    { text: "Elections", path: "/admin/election/dashboard" },
    { text: "Facility Booking", path: "/admin/facility-dashboard" },
    { text: "Event Requests", path: "/admin/event/dashboard" },
    { text: "Complaints", path: "/admin/public-complaints" },
    { text: "Budget Tracker", path: "/admin/expenditure/list" },
    { text: "Cheater Records", path: "/admin/cheaters-records" },
    { text: "Public Complaints", path: "/admin/public-complaints" },
    { text: "Admin Invite", path: "/admin/invite" },
    { text: "Logout", path: "/admin/logout" },
  ];

  const filteredMenuItems = menuItems;

  const drawerContent = (
    <Box sx={{ width: sidebarOpen ? drawerWidth : 70 }}>
      <IconButton onClick={toggleSidebar}>
        <ChevronLeftIcon />
      </IconButton>
      <Divider />
      <List>
        {menuItems.map(({ text, path }) => (
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
      {/* 🖥️ Sidebar */}
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

      {/* 📱 Top Navbar */}
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
              Admin Dashboard
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

      {/* 📱 Mobile Drawer */}
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

      {/* 📝 Main Content - Dynamic via Outlet */}
      <Box
  component="main"
  sx={{
    flexGrow: 1,
    mt: 8,
    p: { xs: 1, sm: 2, md: 2 }, // Increased padding
    maxWidth: "100%",
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
