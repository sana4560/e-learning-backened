const express = require('express');
const router = express.Router();
const TutorModel = require('../models/Tutor');
const TutorExtended = require('../models/TutorExtended');
const StudentModel = require('../models/Student');

router.get('/profiles', async (req, res) => {
    const query = req.query.query;
    console.log('Received query:', query);

    // Validate that query is a string and not empty
    if (typeof query !== 'string' || query.trim() === '') {
        return res.status(400).send('Query must be a non-empty string.');
    }

    try {
        // Fetch profiles from Student collection
        const studentProfilesPromise = StudentModel.find({ fullName: { $regex: query, $options: 'i' } });
        
        // Fetch profiles from Tutor collection
        const tutorProfilesPromise = TutorModel.find({ fullName: { $regex: query, $options: 'i' } });

        const [studentProfiles, tutorProfiles] = await Promise.all([studentProfilesPromise, tutorProfilesPromise]);

        // Fetch extended tutor profiles with profile pictures
        const tutorIds = tutorProfiles.map(tutor => tutor._id);
        const extendedTutorProfiles = await TutorExtended.find({ tutorId: { $in: tutorIds } });

        // Create a mapping of tutor IDs to their profile pictures
        const tutorPicturesMap = extendedTutorProfiles.reduce((map, profile) => {
            map[profile.tutorId] = profile.profilePicture; // Adjust based on your actual model fields
            return map;
        }, {});

        // Combine results
        const combinedProfiles = [
            ...studentProfiles.map(profile => ({ ...profile.toObject(), type: 'student' })),
            ...tutorProfiles.map(profile => ({
                ...profile.toObject(),
                type: 'tutor',
                profilePicture: tutorPicturesMap[profile._id] || null // Add profile picture if exists
            })),
        ];

        console.log('Combined and sorted profiles:', combinedProfiles);
        res.json(combinedProfiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
