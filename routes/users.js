const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      return res.send({ message: 'User with this email already exists' });
    }

    const user = new User({
      email,
      password,
      isAdmin: isAdmin || false
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );

    res.status(201);
    res.send({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500);
    res.send({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      return res.send({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      return res.send({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRY }
    );

    res.send({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500);
    res.send({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;