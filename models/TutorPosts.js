const mongoose = require('mongoose');
const { Schema } = mongoose;

const tutorPostSchema = new Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor', // Reference to the Tutor model
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true
  },
  availability: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Ensure the email is stored in lowercase
    validate: {
      validator: function(v) {
        // Email validation pattern
        return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  about: {
    type: String,
    required: true
  },
  skillSet: {
    type: [String], // Array of strings
    required: true
  },
  priceRange: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  averageReviews: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
});

tutorPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const TutorPost = mongoose.model('TutorPost', tutorPostSchema);
module.exports = TutorPost;
