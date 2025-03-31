const mongoose = require('mongoose');

// Define the schema
const RegistrationRequestSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  tutorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tutor', 
    required: true 
  },
  courses: [{
    courseName: { 
      type: String, 
      required: true 
    },
    coursePrice: { 
      type: Number, 
      required: true, 
      min: 0 
    },
  }],
  message: { 
    type: String, 
    required: false // Marked as optional
  },
  meetingDetails: {
   
    days: [{ type: String }],
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

});

// Create the model
const RegistrationRequestModel = mongoose.model('RegistrationRequest', RegistrationRequestSchema);

module.exports = RegistrationRequestModel;
