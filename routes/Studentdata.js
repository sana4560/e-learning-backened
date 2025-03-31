// routes/studentRoutes.js
const express = require('express');
const StudentModel = require('../models/Student');
const router = express.Router(); // Create a new router

// Student Registration Route
router.post('/student-register', async (req, res) => {
  const { fullName, email, password, education, otherEducation, profilePicture } = req.body;

  try {
    const newStudent = new StudentModel({
      fullName,
      email,
      password,
      education,
      otherEducation: education === 'Others' ? otherEducation : undefined,
      profilePicture: profilePicture || null, // Set to null if not provided
    });

    await newStudent.save();
    console.log('Student registered successfully:', newStudent);
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ error: 'Failed to register student' });
  }
});

// Endpoint to Fetch Students
router.get('/students', async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

//website profile if he or she is a student fetch data
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find student by ID
    const student = await StudentModel.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Return student data
    res.status(200).json({
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      password: student.password, // Consider security implications for returning passwords
      // Add any other relevant student fields here
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Fetch student by ID for request
router.get('request/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find student by ID
    const student = await StudentModel.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Return student data
    res.status(200).json({
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      profilePicture: student.profilePicture, // Include profile picture
      education: student.education,
      otherEducation: student.otherEducation // Return other relevant fields as needed
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/website/:id', async (req, res) => {
  const { id } = req.params;

  console.log('Received request to fetch Student with ID:', id); // Log received ID

  try {
    // Find tutor by ID
    const student = await StudentModel.findById(id);
    
    console.log('Student found:', student); // Log the found tutor object or null

    if (!student) {
      console.log('Student not found, returning 404'); // Log if tutor is not found
      return res.status(404).json({ error: 'Student not found' });
    }

    // Log the tutor data being returned
    console.log('Returning student data:', {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      password: student.password, // Consider security implications for returning passwords
    });

    // Return tutor data
    res.status(200).json({
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      password: student.password,  // Consider security implications for returning passwords
      // Add any other relevant tutor fields here
    });
  } catch (error) {
    console.error('Error fetching tutor data:', error); // Log the error if there is an exception
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router; // Export the router
