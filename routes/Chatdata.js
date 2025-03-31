const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET all messages between two users
router.get('/messages', async (req, res) => {
  const { senderId, receiverId } = req.query;

  // Check if both senderId and receiverId are provided
  if (!senderId || !receiverId) {
    const errorMsg = 'Sender and receiver IDs are required';
    console.error(errorMsg);
    return res.status(400).json({ error: errorMsg });
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId } // Messages sent by the receiver
      ]
    }).sort({ createdAt: 1 }); // Sort messages by creation date (oldest first)

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages between users:', error.message);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// POST a new message
// POST a new message
router.post('/messages/send', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  console.log('Request body:', req.body);

  console.log('Received data:', { senderId, receiverId, content }); // Log the received data

  // Validate required fields
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'Sender ID, receiver ID, and content are required' });
  }

  try {
    const newMessage = new Message({
      content,
      sender: senderId,
      receiver: receiverId,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
});




router.get('/messages/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log('Fetching messages for:', userId);

  // Validate userId
  if (!userId) {
    const errorMsg = 'User ID is required';
    console.error(errorMsg);
    return res.status(400).json({ error: errorMsg });
  }

  try {
    // Fetch messages for the user and include 'content' for message content
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
    .sort({ createdAt: 1 }) // Sort by creation time
    .select('content sender receiver createdAt'); // Select 'content' to include message content

    console.log(`Fetching messages for user ID: ${userId}`);
    console.log(`Messages retrieved: ${JSON.stringify(messages)}`); // Log the retrieved messages

    res.status(200).json(messages); // Send the retrieved messages
  } catch (error) {
    console.error('Error fetching messages for user:', error.message);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// routes/messages.js


// Delete messages associated with a specific profile (receiverId)
router.delete('/messages/delete', async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    await Message.deleteMany({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }, // Optional: delete messages in both directions
      ],
    });

    res.status(200).json({ message: 'Messages deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting messages' });
  }
});

module.exports = router;



module.exports = router;


