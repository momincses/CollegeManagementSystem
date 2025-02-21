const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/Email"); // Adjust path if needed

// Generate Invitation Link & Send Email
exports.generateInvitationLink = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role)
    return res.status(400).json({ message: "Email and role are required" });

  try {
    const token = jwt.sign(
      { email, role },
      process.env.INVITATION_SECRET,
      { expiresIn: "2d" } // Link expires in 2 days
    );

    const invitationLink = `${process.env.CLIENT_URL}/coordinator/signup/${token}`;
    const subject = "You're Invited to Register as a Coordinator";
    const text = `Hello,\n\nYou have been invited to register as a ${role.replace("-", " ")}.\n\nClick the link below to complete your signup:\n${invitationLink}\n\nThis link will expire in 2 days.\n\nBest regards,\nTeam`;

    // Send the invitation email
    await sendEmail(email, subject, text);

    res.status(200).json({ message: "Invitation link sent successfully!", invitationLink });
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ message: "Failed to send invitation link." });
  }
};
