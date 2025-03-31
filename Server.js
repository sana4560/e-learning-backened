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
  origin: ['http://localhost:3000', 'http://localhost:3001'], // List all allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // List all allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow Content-Type and Authorization headers
  credentials: true // Enable credentials if you need to send cookies or authorization headers
}));

// Connect to MongoDB


// MongoDB connection URI
const mongoURI = 'mongodb://127.0.0.1:27017/tutors';

// Connect to MongoDB with Mongoose
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);  // Exit process with failure
  });

// Event listeners for connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});
// Use routes
app.use('/api/tutors', (req, res, next) => {
  console.log('Tutors route accessed');
  next();
}, tutorRoutes);

app.use('/api/students', (req, res, next) => {
  console.log('Students route accessed');
  next();
}, studentRoutes);

app.use('/api/login', (req, res, next) => {
  console.log('Login route accessed');
  next();
}, loginRoutes);

app.use('/api/courses', (req, res, next) => {
  console.log('Courses route accessed');
  next();
}, courseRoutes);

app.use('/api/tutors_extended', (req, res, next) => {
  console.log('tutors_extended route accessed');
  next();
}, TutorExtendedRoutes);

app.use('/api/tutorposts', (req, res, next) => {
  console.log('tutor posts route accessed');
  next();
}, TutorPostsRoutes );

app.use('/api/request', (req, res, next) => {
  console.log('RegistrationRequest route accessed');
  next();
}, RegistrationRequest);

app.use('/api/chat', (req, res, next) => {
  console.log('Chat route accessed');
  next();
}, chatRoutes);
app.use('/api/search', (req, res, next) => {
  console.log('searchquery route accessed');
  next();
}, searchRoutes);

app.use('/api/chatlist', (req, res, next) => {
  console.log('chatlist routes are accessed');
  next();
}, chatlistRoutes);





// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).send('Something went wrong!');
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
