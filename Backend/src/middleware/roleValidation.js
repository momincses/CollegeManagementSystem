const validateCoordinatorRegistration = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    
    if (role === 'student-coordinator') {
      // Add your validation logic here
      // For example:
      // - Check if the user is in their third or fourth year
      // - Check if they have maintained a certain GPA
      // - Check if there's an existing coordinator for their department
      
      const emailDomain = email.split('@')[1];
      if (emailDomain !== 'sggs.ac.in') {
        return res.status(400).json({
          message: "Coordinator registration requires a valid college email"
        });
      }
      
      // You could add more checks here
    }
    
    next();
  } catch (error) {
    console.error('Role validation error:', error);
    res.status(500).json({ message: "Error validating role requirements" });
  }
};

module.exports = validateCoordinatorRegistration; 