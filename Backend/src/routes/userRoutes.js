const express = require("express");
const verifyToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware")
const router = express.Router();

//Only Admin can access this router
router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
    try{
    res.json({ message: "Welcome Admin" });
    }
    catch (err){
        console.log(err);
    }
});

//only doctor can access this router
router.get("/doctor", verifyToken, authorizeRoles("doctor", "admin"), (req, res) => {
    res.json({ message: "Welcome Doctor" })
});

//All can access this router 
router.get("/user", verifyToken, authorizeRoles("student", "admin", "doctor"), (req, res) => {
    res.json({ message: "Welcome user" })
});

module.exports = router;