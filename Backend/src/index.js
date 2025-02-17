const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express();
dbConnect();

// Middleware 
// Middleware to parse JSON
app.use(express.json()); 
// Allow requests from frontend
app.use(cors({
  origin: "http://localhost:5173", // Replace with frontend URL in production
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));


// Routes

//Auth Routes
app.use("/api/auth", authRoutes);

//role based routes
app.use("/api/users", userRoutes);
// Default Route
app.get("/", (req, res) => {
  res.send("MongoDB Connected to Express!");
});

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
