// 📁 controllers/facilityController.js
const Facility = require('../models/Facility');

// 🏫 Admin - Add Facility
exports.addFacility = async (req, res) => {
  try {
    const { name, description } = req.body;
    const facility = new Facility({ name, description });
    await facility.save();
    res.status(201).json({ success: true, facility });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🏫 Admin - Delete Facility
exports.deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;
    await Facility.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎓 Student/Admin - Get All Facilities with Booking Info
exports.getAllFacilities = async (req, res) => {
  try {
    console.log("in get all facilities")
    const facilities = await Facility.find().populate('bookings.student', 'name email');
    console.log("Facilities fetched:", facilities);

    res.status(200).json({ success: true, facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎓 Student - Book Facility
exports.bookFacility = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const { date } = req.body;
    const studentId = req.user.id;

    const facility = await Facility.findById(facilityId);
    const isDateBooked = facility.bookings.some(booking =>
      booking.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    if (isDateBooked) return res.status(400).json({ success: false, message: 'Date already booked.' });

    facility.bookings.push({ date, student: studentId });
    await facility.save();
    res.status(200).json({ success: true, message: 'Booking requested successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🏫 Admin - Approve/Reject Booking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { facilityId, bookingId } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status.' });

    const facility = await Facility.findById(facilityId);
    const booking = facility.bookings.id(bookingId);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    booking.status = status;
    await facility.save();
    res.status(200).json({ success: true, message: `Booking ${status} successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎓 Student - Track Booking Status
exports.trackBookingStatus = async (req, res) => {
  console.log("inside booking track controller");
  try {
    const studentId = req.user.id;
    const facilities = await Facility.find({ 'bookings.student': studentId }).select('name bookings');
    res.status(200).json({ success: true, facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🎯 Controller to fetch facility by facilityId
exports.getFacilityById = async (req, res) => {
  try {
    const { facilityId } = req.params;

    const facility = await Facility.findById(facilityId).populate('bookings.student', 'name email'); // Populating student details (name, email)
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    console.log('Facility Data:', facility); // 💡 Console log facility data
    res.status(200).json(facility);
  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
