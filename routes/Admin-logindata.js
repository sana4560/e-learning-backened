const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin, ViceAdmin } = require('../models/Admin');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const SALT_WORK_FACTOR = 10;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Helper functions
const authenticate = async (email, password) => {
  let user = await Admin.findOne({ email }) || await ViceAdmin.findOne({ email });
  if (!user) return { error: 'Invalid credentials' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: 'Invalid credentials' };

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  return { token };
};

// Routes
router.post('/admin', async (req, res) => {
  const { email, password } = req.body;
  const result = await authenticate(email, password);
  result.error ? res.status(401).json(result) : res.json(result);
});

router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find();
    if (admins.length === 0) {
      return res.status(404).json({ message: 'No super admin found' });
    }
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/confirm-account', async (req, res) => {
  const { email, password } = req.body;
  const result = await authenticate(email, password);
  result.error ? res.status(401).json(result) : res.json(result);
});

router.post('/updateAdmin', async (req, res) => {
  const { email, password } = req.body;
  if (password && !passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must meet the criteria.' });
  }

  try {
    const admin = await Admin.findOne({});
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    admin.email = email;
    if (password) admin.password = await bcrypt.hash(password, SALT_WORK_FACTOR);
    await admin.save();

    res.status(200).json({ message: 'Admin updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/CreateAccount', async (req, res) => {
  const { email, password } = req.body;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password must meet the criteria.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_WORK_FACTOR);

    const newViceAdmin = new ViceAdmin({ email, password: hashedPassword });
    await newViceAdmin.save();

    res.status(201).json({ message: 'Vice admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/profile-email', async (req, res) => {
  try {
    const adminEmails = await Admin.find({}, 'email');
    const viceAdminEmails = await ViceAdmin.find({}, 'email');
    const allEmails = adminEmails.concat(viceAdminEmails);

    res.json({ emails: allEmails });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
