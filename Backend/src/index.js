const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const electionRoutes = require("./routes/electionRoutes");
const eventRoutes = require("./routes/eventRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const coordinatorRoutes = require("../src/routes/coordinatorRoutes")
const http = require('http');
const setupSocket = require('./socket/electionSocket');
const misconductRoutes = require("./routes/misconductRoutes");


//Sick leave routes
const sickLeaveRoutes = require("../src/routes/sickLeaveRoutes")



const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
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


// app.use(cors());
// app.options('*', cors()); // Enable preflight for all routes



// Routes

//Auth Routes
app.use("/api/auth", authRoutes);

//role based routes
app.use("/api/users", userRoutes);

// Add election routes
app.use("/api/election", electionRoutes);

// Add event management routes
app.use("/api/events", eventRoutes);

// Add event management routes
app.use("/api/complaints", complaintRoutes);

//sick Leave routes
app.use("/api/", sickLeaveRoutes);

// Coordinator Auth Routes
app.use("/api/coordinator", coordinatorRoutes);

// 🔗 Route Linking
app.use('/api/facility', facilityRoutes);

// Add misconduct routes
app.use("/api/misconduct", misconductRoutes);

// Add after other routes
app.get("/api/test", (req, res) => {
    res.json({ 
        status: "success",
        message: "Backend API is working",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        auth: "working"
    });
});

// Default Route
app.get("/", (req, res) => {
  res.send("MongoDB Connected to Express!");
});



// After dbConnect();
console.log("Testing database connection...");
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB successfully connected');
});

mongoose.connection.on('error', (err) => {
    console.log('❌ MongoDB connection error:', err);
});

// Start Server
const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
