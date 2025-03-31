const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Ensure hashing is done correctly when saving the user
AdminSchema.pre('save', function(next) {
  const admin = this;
  if (admin.isModified('password') && !admin.skipHashing) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(admin.password, salt, function(err, hash) {
        if (err) return next(err);
        admin.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


AdminSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const Admin = mongoose.model('Admin', AdminSchema, 'admins');
const ViceAdmin = mongoose.model('ViceAdmin', AdminSchema, 'viceadmins');

module.exports = {
  Admin,
  ViceAdmin
};
