const express = require('express');
const router = express.Router();
const ChattedProfile = require('../models/ChatList'); // Ensure this is the correct model path

// Route to add a chatted profile
router.post('/chatted', async (req, res) => {
  const { profileId, fullName, lastMessage, profilePicture } = req.body; // Removed avatarUrl
  console.log('Data from front end:', req.body); // Log the data received from the frontend

  try {
    const newProfile = new ChattedProfile({
      profileId,
      fullName,
      lastMessage,
      profilePicture: profilePicture || null, // Set to null if not provided
    });

    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error adding chatted profile:', error); // Log the error details
    res.status(500).json({ message: 'Error adding chatted profile', error });
  }
}); 

// Route to get all chatted profiles
router.get('/chattedprofiles', async (req, res) => {
  try {
    const profiles = await ChattedProfile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chatted profiles', error });
  }
});
router.delete('/chattedprofiles/:id', async (req, res) => {
    const { id } = req.params; // Extract profile ID from the URL
  
    try {
      // Find the profile by ID and delete it
      const deletedProfile = await ChattedProfile.findByIdAndDelete(id);
  
      if (!deletedProfile) {
        return res.status(404).json({ message: 'Profile not found' }); // If no profile found
      }
  
      res.status(200).json({ message: 'Profile deleted successfully' }); // Success response
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ message: 'Error deleting profile' }); // Error response
    }
  });

// DELETE endpoint to remove a chatted profile
router.delete('/chattedprofiles/:id', async (req, res) => {
  const { id } = req.params; // Extract profile ID from the URL

  try {
    // Find the profile by ID and delete it
    const deletedProfile = await ChattedProfile.findByIdAndDelete(id);

    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' }); // If no profile found
    }

    res.status(200).json({ message: 'Profile deleted successfully' }); // Success response
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: 'Error deleting profile' }); // Error response
  }
});



module.exports = router;
