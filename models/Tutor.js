const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Tutor schema
const tutorSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    uppercase: true, // Ensure the name is stored in uppercase
    match: [/^[A-Z\s]+$/, 'Full Name must contain only uppercase alphabetic characters and spaces.']
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
  cnic: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        // CNIC validation pattern
        return /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(v);
      },
      message: props => `${props.value} is not a valid CNIC!`
    }
  },
  education: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]*$/, 'Education must contain only alphabetic characters and spaces.']
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Adjusted phone number validation pattern
        return /^\+92[-\s]?[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    default: null, // Password field can be null initially
  },
  status: {
    type: String,
    default: 'pending' // Default status is set to "pending"
  }
}, { timestamps: true });

// Create the model from the schema
const TutorModel = mongoose.model('Tutor', tutorSchema);

module.exports = TutorModel;
