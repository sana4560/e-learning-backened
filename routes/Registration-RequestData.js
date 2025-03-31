const express = require('express');
const mongoose = require('mongoose');
const RegistrationRequestModel = require('../models/RegistrationRequest'); // Adjust the path accordingly
const TutorPost = require('../models/TutorPosts'); // Assuming you have a model for tutor posts
const router = express.Router();

// Send registration request
router.post('/send-request/:postId', async (req, res) => {
  const {
    studentId,
    courses,
    requestMeeting,
    meetingDetails,
    message, // Ensure to capture the general message here
  } = req.body;

  const { postId } = req.params;

  // Validate postId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ error: 'Invalid post ID format.' });
  }

  try {
    const tutorPost = await TutorPost.findById(postId);
    if (!tutorPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const tutorId = tutorPost.tutorId;

    // Ensure meetingDetails.message is provided if requestMeeting is true
    if (requestMeeting && (!meetingDetails || !meetingDetails.days.length)) {
      return res.status(400).json({ error: 'Meeting details days are required when requesting a meeting.' });
    }

    // Create a new registration request
    const newRequest = new RegistrationRequestModel({
      studentId,
      tutorId,
      courses,
      message, // Add the general message here
      meetingDetails: requestMeeting ? meetingDetails : undefined, // Include meetingDetails if requestMeeting is true
    });

    await newRequest.save();
    res.status(201).json({
      message: 'Registration request sent successfully!',
      data: newRequest,
    });
  } catch (error) {
    console.error('Error sending registration request:', error);
    res.status(500).json({ message: 'Error sending registration request.', error: error.message });
  }
});

// Fetch registration requests
router.get('/registrationrequests', async (req, res) => {
  try {
    console.log('Fetching registration requests...');

    const requests = await RegistrationRequestModel.find({}, 'tutorId studentId courses message meetingDetails createdAt')
      .populate('studentId', 'fullName email education profilePicture') // Populate student details
      .exec();

    console.log('Registration requests fetched successfully:', requests);

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching registration requests:', error);
    res.status(500).json({ error: 'Failed to fetch registration requests' });
  }
});

module.exports = router;
