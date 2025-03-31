const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (token == null) return res.status(401).send('Access Denied');

  try {
    const userPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userPayload.id; // Extract user ID from token

    // Determine user type based on user ID
    const student = await Student.findById(req.userId);
    if (student) {
      req.user = { ...student.toObject(), role: 'student' };
      return next();
    }

    const tutor = await Tutor.findById(req.userId);
    if (tutor) {
      req.user = { ...tutor.toObject(), role: 'tutor' };
      return next();
    }

    res.status(404).send('User not found');
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).send('Invalid or expired token');
  }
};

module.exports = authenticateToken;
