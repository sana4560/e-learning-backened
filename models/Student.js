// models/student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  education: {
    type: String,
    required: true,
    enum: [
      'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
      'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
      'O-Levels', 'A-Levels', '1 Year', '2 Years', 'Others'
    ],
  },
  otherEducation: {
    type: String,
    // Optional field, only used if education is 'Others'
  },
  profilePicture: {
    type: String,
    default: null, // Set default value to null for new students
  }
}, { collection: 'students' }); // Specify the collection name

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;
