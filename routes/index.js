const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const TutorModel = require('../models/Tutor');
const TutorExtended=require('../models/TutorExtended');
const StudentModel = require('../models/Student');

const router = express.Router();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'sanawaqar4560@gmail.com',
    pass: 'zbsphmciphfadntw',
  },
});

const generateRandomPassword = (length = 8) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const sendAcceptanceEmail = async (email, fullName, password) => {
  const mailOptions = {
    from: 'no-reply@tutorfinder.com',
    to: email,
    subject: 'Registration Accepted',
    text: `Hello ${fullName},\n\nYour registration has been accepted. Your login password is: ${password}\n\nGo to the website and click on Sign In to log in to your dashboard with this password. You can change it after your first login.\n\nBest regards,\nThe Tutor Finder Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Acceptance email sent successfully');
  } catch (error) {
    console.error('Error sending acceptance email:', error);
  }
};



router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body;

  console.log(`Sign-in attempt for email: ${email}`);
  console.log(`Password being sent: ${password}`);

  try {
    // Attempt to find the user in the tutors collection first
    let tutor = await TutorModel.findOne({ email });

    if (tutor) {
      console.log(`Stored password for tutor: ${tutor.password}`);
      // Directly compare plaintext passwords
      if (password !== tutor.password) {
        return res.status(400).json({ error: 'Invalid password for tutor' });
      }

      // Fetch additional profile data from the tutorextended collection
      const extendedProfile = await TutorExtended.findOne({ tutorId: tutor._id });

      // Combine basic and extended tutor data
      const tutorData = {
        id: tutor._id,
        status: tutor.status,
        ...extendedProfile?._doc, // Merge extended profile data if available
      };

      const token = jwt.sign({ id: tutor._id, userType: 'tutor' }, process.env.JWT_SECRET);

      return res.status(200).json({
        message: 'Sign in successful',
        token,
        tutor: tutorData,
      });
    }

    // If not found in tutors, check in students collection
    const student = await StudentModel.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`Stored password for student: ${student.password}`);
    // Directly compare plaintext passwords
    if (password !== student.password) {
      return res.status(400).json({ error: 'Invalid password for student' });
    }

    // Prepare the student data to send
    const studentData = {
      id: student._id,
      // Add any other relevant student fields here
    };

    // Generate JWT token for the student
    const token = jwt.sign({ id: student._id, userType: 'student' }, process.env.JWT_SECRET);

    return res.status(200).json({
      message: 'Sign in successful',
      token,
      student: studentData,
    });

  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

//website profile fetching data
// Fetch tutor profile data by ID
router.get('/website/:id', async (req, res) => {
  const { id } = req.params;

  console.log('Received request to fetch tutor with ID:', id); // Log received ID

  try {
    // Find tutor by ID
    const tutor = await TutorModel.findById(id);
    
    console.log('Tutor found:', tutor); // Log the found tutor object or null

    if (!tutor) {
      console.log('Tutor not found, returning 404'); // Log if tutor is not found
      return res.status(404).json({ error: 'Tutor not found' });
    }

    // Log the tutor data being returned
    console.log('Returning tutor data:', {
      id: tutor._id,
      fullName: tutor.fullName,
      email: tutor.email,
      password: tutor.password, // Consider security implications for returning passwords
    });

    // Return tutor data
    res.status(200).json({
      id: tutor._id,
      fullName: tutor.fullName,
      email: tutor.email,
      password: tutor.password, // Consider security implications for returning passwords
      // Add any other relevant tutor fields here
    });
  } catch (error) {
    console.error('Error fetching tutor data:', error); // Log the error if there is an exception
    res.status(500).json({ error: 'Server error' });
  }
});


// fetch staus of tutor for tutor-dashboard login
router.get('/:id/status', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the tutor by ID and select only the status field
    const tutor = await TutorModel.findById(id).select('status');

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    // Return the status of the tutor
    res.json({ status: tutor.status });
  } catch (error) {
    console.error('Error fetching tutor status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



//tutor-dashboard basic profile phone and email fetch

// Fetch tutor by ID
router.get('/fetch/:id', async (req, res) => {
  try {
    const tutorId = req.params.id; // Directly use the ID from the request parameters

    console.log('Fetching tutor with ID:', tutorId);

    // Find tutor by ID and select specific fields
    const tutor = await TutorModel.findById(tutorId).select('education phoneNumber');
    console.log('Fetched tutor:', tutor);

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.json({
      education: tutor.education,
      phoneNumber: tutor.phoneNumber,
    });
  } catch (error) {
    console.error('Error fetching tutor data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


//this tutordashboard profile header fetching data 
// Route to get basic tutor data
router.get('/basic-data/:id', async (req, res) => {
  try {
    const tutor = await TutorModel.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    res.json({
      fullName: tutor.fullName,
      email: tutor.email,
      
    });
  } catch (error) {
    console.error('Error fetching tutor data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





// tutor-dashboard Route to partially update basic tutor data
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body; // Fields to be updated

    if (!id || typeof updateFields !== 'object') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Find the tutor and update the provided fields
    const updatedTutor = await TutorModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedTutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    res.json(updatedTutor);
  } catch (error) {
    console.error('Error updating tutor data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
 



router.post('/tutor-register', async (req, res) => {
  const { fullName, email, cnic, education, phoneNumber } = req.body;

  // Basic validation
  if (!fullName || !email || !cnic || !education || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const existingTutor = await TutorModel.findOne({ email });
    if (existingTutor) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const newTutor = new TutorModel({
      fullName,
      email,
      cnic,
      education,
      phoneNumber,
      status: 'pending',
    });

    await newTutor.save();
    console.log('Tutor registered successfully:', newTutor);

    res.status(201).json({ message: 'Tutor registered successfully' });
  } catch (error) {
    console.error('Error registering tutor:', error);
    res.status(500).json({ error: 'Failed to register tutor' });
  }
});

router.get('/tutors', async (req, res) => {
  try {
    const tutors = await TutorModel.find();
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

router.put('/tutors/:id', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const tutor = await TutorModel.findById(id);

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    tutor.status = status;

    if (status === 'accepted') {
      const password = generateRandomPassword();
      tutor.password = password; // Store the plain password in the database
      console.log('Generated password:', password);
      
      await sendAcceptanceEmail(tutor.email, tutor.fullName, password);
    }

    await tutor.save();
    res.json({ message: `Tutor status updated to ${status}` });
  } catch (error) {
    console.error('Error updating tutor status:', error);
    res.status(500).json({ error: 'Failed to update tutor status' });
  }
});



router.delete('/tutors/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTutor = await TutorModel.findByIdAndDelete(id);

    if (!deletedTutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    console.log('Tutor deleted successfully:', deletedTutor);
    res.json({ message: 'Tutor deleted successfully', deletedTutor });
  } catch (error) {
    console.error('Error deleting tutor:', error);
    res.status(500).json({ error: 'Failed to delete tutor' });
  }
});

router.get('/tutors/status/accepted', async (req, res) => {
  try {
    const acceptedTutors = await TutorModel.find({ status: 'accepted' }).select('email');
    res.json(acceptedTutors);
  } catch (error) {
    console.error('Error fetching accepted tutors:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
