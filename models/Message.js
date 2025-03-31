const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver (tutor)
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports =Message;
