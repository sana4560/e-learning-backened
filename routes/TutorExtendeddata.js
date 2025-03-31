const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');


const TutorExtended = require('../models/TutorExtended');




// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists and is accessible
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Update profile route
router.put('/update/:id', upload.single('profilePicture'), async (req, res) => {
    const { bio, skillSet, about, priceRange, averageReviews, availability } = req.body;
    const tutorId = req.params.id;

    console.log('Update route accessed with ID:', tutorId);
    console.log('Request body:', req.body);
    console.log('File:', req.file); // Debug file upload

    try {
        if (!tutorId) {
            return res.status(400).json({ error: 'Tutor ID is required' });
        }

        const updateData = {};
        if (bio !== undefined) updateData.bio = bio;
        if (req.file) {
            updateData.profilePicture = req.file.path; // Save file path
            console.log('Profile picture path:', req.file.path); // Debug file path
        }
        if (skillSet !== undefined) updateData.skillSet = skillSet;
        if (about !== undefined) updateData.about = about;
        if (priceRange !== undefined) updateData.priceRange = priceRange;
        if (availability !== undefined) updateData.availability = availability;
        if (averageReviews !== undefined) updateData.averageReviews = averageReviews;

        // Convert tutorId to ObjectId
        const tutorObjectId = new mongoose.Types.ObjectId(tutorId);

        const updatedProfile = await TutorExtended.findOneAndUpdate(
            { tutorId: tutorObjectId },
            updateData,
            { new: true, upsert: true }
        );

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating tutor extended profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Route to get extended data for a tutor
router.get('/:tutorId', async (req, res) => {
    console.log('Fetching extended data for tutor ID:', req.params.tutorId);

    try {
        const { tutorId } = req.params;

        // Convert tutorId to ObjectId using `new`
        const tutorObjectId = new mongoose.Types.ObjectId(tutorId);

        const tutorExtended = await TutorExtended.findOne({ tutorId: tutorObjectId });

        if (!tutorExtended) {
            return res.status(404).json({ message: 'Tutor extended profile not found.' });
        }

        res.json(tutorExtended);
    } catch (error) {
        console.error('Error fetching extended tutor data:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
