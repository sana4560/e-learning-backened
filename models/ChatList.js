const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChattedProfileSchema = new Schema({
  profileId: {
    type: Schema.Types.ObjectId,  // Reference to the user you chatted with
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,  // Name of the person
    required: true,
  },
  lastMessage: {
    type: String,  // The last message exchanged with this person
    required: true,
  },
  profilePicture: {
    type: String,  // Profile picture of the chatted user, optional
    default: null, // Default is null if no picture is provided
  },
  updatedAt: {
    type: Date,   // When the last message was sent/received
    default: Date.now,
  },
});

const ChattedProfile = mongoose.model('ChattedProfile', ChattedProfileSchema);

module.exports = ChattedProfile;
