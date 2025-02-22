const validateCoordinatorRegistration = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const allowedRoles = ["student-coordinator", "board-member"];

    if (allowedRoles.includes(role)) {
      const emailDomain = email.split("@")[1];
      if (emailDomain !== "sggs.ac.in") {
        return res.status(400).json({
          message: "Registration requires a valid college email",
        });
      }

      // Additional role-based validation logic can be added here
    }

    next();
  } catch (error) {
    console.error("Role validation error:", error);
    res.status(500).json({ message: "Error validating role requirements" });
  }
};

module.exports = validateCoordinatorRegistration;
