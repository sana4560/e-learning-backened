const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // Adjust the path as necessary

// Add a new course
router.post('/courses', async (req, res) => {
  try {
    const course = new Course({
      name: req.body.name,
    });
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(400).send({ error: 'Failed to add course' });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.send(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send({ error: 'Failed to fetch courses' });
  }
});

// Update a course
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send(course);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(400).send({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }
    res.send(course);
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).send({ error: 'Failed to delete course' });
  }
});

module.exports = router;
