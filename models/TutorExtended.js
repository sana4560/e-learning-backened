const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorExtendedSchema = new Schema({
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },
    bio: { type: String, default: '' },
    skillSet: { type: [String], default: [] },
    profilePicture: { type: String, default: '' },
    about: { type: String, default: '' },
    availability: { type: String, default: '' },
    priceRange: { type: String, default: '' },
    averageReviews: { type: Number, default: null },
    likes: { type: Number, default: null }
}, { timestamps: true });

const TutorExtended = mongoose.model('TutorExtended', tutorExtendedSchema, 'tutorextended');

module.exports = TutorExtended;
