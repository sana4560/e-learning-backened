require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

// Import routes
const tutorRoutes = require('./routes/index');
const studentRoutes = require('./routes/Studentdata');
const loginRoutes = require('./routes/Admin-logindata');
const courseRoutes = require('./routes/Addcourse');
const TutorExtendedRoutes = require('./routes/TutorExtendeddata');
const TutorPostsRoutes = require('./routes/TutorPostsdata');
const RegistrationRequest = require('./routes/Registration-RequestData');
const chatRoutes = require('./routes/Chatdata');
const searchRoutes = require('./routes/Searching');
const chatlistRoutes = require('./routes/ChatList');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/tutors';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

mongoose.connection.on('connected', () => console.log('Mongoose connected to MongoDB'));
mongoose.connection.on('error', err => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected from MongoDB'));

// Use Routes
app.use('/api/tutors', tutorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tutors_extended', TutorExtendedRoutes);
app.use('/api/tutorposts', TutorPostsRoutes);
app.use('/api/request', RegistrationRequest);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/chatlist', chatlistRoutes);

// Default route to check server health
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Export the app for Vercel
module.exports = app;
