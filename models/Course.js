// models/course.js
const mongoose = require('mongoose');

// Define the schema for the course
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

// Create the model and specify the collection name
const Course = mongoose.model('Course', courseSchema, 'courses');

module.exports = Course;
