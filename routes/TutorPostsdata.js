const express = require('express');
const authenticateToken = require('../Auths/authenticateToken');
const Message = require('../models/Message');
const TutorPost = require('../models/TutorPosts');
const StudentModel = require('../models/Student');
const TutorModel = require('../models/Tutor');
const TutorExtended = require('../models/TutorExtended');
const router = express.Router();
router.post('/post-to-website', async (req, res) => {
    try {
      const { tutorId, title, availability, bio, email, about, skillSet, priceRange, imageUrl } = req.body;
  
      // Use findOneAndUpdate to update the existing document or create a new one if it does not exist
      const updatedPost = await TutorPost.findOneAndUpdate(
        { tutorId }, // Query to find the document
        {
          title,
          availability,
          bio,
          email,
          about,
          skillSet,
          priceRange,
          imageUrl
        }, // Fields to update
        { 
          new: true, // Return the updated document
          upsert: true, // Create a new document if no document matches the query
          runValidators: true // Validate the update
        }
      );
  
      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create or update post' });
    }
  });
  
// Route to get all tutor posts
router.get('/tutorposts', async (req, res) => {
    try {
      // Fetch all posts from the tutorposts collection
      const posts = await TutorPost.find();
  
      // Send the fetched posts as a response
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching tutor posts:', error);
      res.status(500).json({ error: 'Failed to fetch tutor posts' });
    }
  });
  


// Route to handle liking a post
router.post('/likes/:postId', async (req, res) => {
    try {
      const postId = req.params.postId;
  
      // Find the post by ID
      const post = await TutorPost.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Increment the likes count
      post.likes = (post.likes || 0) + 1;
      await post.save();
  
      res.status(200).json(post);
    } catch (error) {
      console.error('Error updating like:', error);
      res.status(500).json({ message: 'Failed to update like' });
    }
  });



  router.post('/send-message/:postId', authenticateToken, async (req, res) => {
    try {
      const { postId } = req.params;
      const { message } = req.body;
      const { user } = req;
  
      // Find the tutor (receiver) for the given postId
      const tutor = await TutorPost.findById(postId);
      if (!tutor) {
        return res.status(404).send('Tutor not found');
      }
  
      // Create a new message
      const newMessage = new Message({
        sender: user._id,
        receiver: tutor.tutorId,
        content: message,
        senderModel: user.role.charAt(0).toUpperCase() + user.role.slice(1), // 'Tutor' or 'Student'
      });
  
      await newMessage.save();
      res.status(200).send({ success: true, message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).send('An unexpected error occurred');
    }
  });

// Fetch messages for the authenticated user (receiver)
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Get authenticated user's ID from the token (the receiver)
    console.log(`Fetching messages for user ID: ${userId}`);

    // Find messages where the authenticated user is the receiver
    const messages = await Message.find({ receiver: userId }).sort({ createdAt: -1 });
    console.log(`Found ${messages.length} messages for user ID: ${userId}`);

    // Transform messages to include detailed sender information
    const detailedMessages = await Promise.all(messages.map(async (message) => {
      console.log(`Processing message ID: ${message._id}`);
      let senderDetails;

      // Determine if the sender is a student
      const studentSender = await StudentModel.findById(message.sender);
      if (studentSender) {
        console.log(`Sender is a student with ID: ${message.sender}`);
        senderDetails = {
          profilePicture: studentSender.profilePicture, // Assuming StudentModel has a profilePicture field
          name: studentSender.fullName,
          
        };
      } else {
        console.log(`Sender is not a student, checking for tutor with ID: ${message.sender}`);
        // If not a student, the sender must be a tutor
        const tutorSender = await TutorModel.findById(message.sender);
        if (tutorSender) {
          console.log(`Sender is a tutor with ID: ${message.sender}`);
          const tutorExtendedSender = await TutorExtended.findOne({ tutorId: tutorSender._id });
          console.log(`Tutor extended profile found: ${!!tutorExtendedSender}`);
          senderDetails = {
            profilePicture: tutorExtendedSender ? tutorExtendedSender.profilePicture : null, // Fetch profile picture from TutorExtended
            name: tutorSender.fullName,
            
          };
        } else {
          console.log(`No sender found with ID: ${message.sender}`);
        }
      }

      return {
        ...message.toObject(),
        sender: senderDetails || null, // Include sender details in the response
      };
    }));

    console.log('Detailed messages fetched successfully:', detailedMessages);
    res.status(200).json(detailedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('An unexpected error occurred');
  }
});


module.exports = router;
