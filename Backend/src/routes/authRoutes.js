const express = require("express");
const { register, login, requestOtp, verifyOtp } = require("../controllers/authController")
const validateCoordinatorRegistration = require("../middleware/roleValidation");
const router = express.Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", validateCoordinatorRegistration, register);
router.post("/login", login);

module.exports = router;