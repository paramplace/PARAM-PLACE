const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const admin = await Admin.findOne({ username });
  if (!admin || !admin.validPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { adminId: admin._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});