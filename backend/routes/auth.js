const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      user = await User.create({
        firstName,
        lastName,
        email,
        password
      });
  
      const payload = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

      res.status(201).json({ token, msg: 'User registered', user: { firstName, lastName, email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
    res.json({ token, msg: 'User logged in successfully', user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;













/*// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
      user = new User({
        firstName,
        lastName,
        email,
        password
      });
  
      await user.save();

      const payload = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });


      res.status(201).json({ token, msg: 'User registered', user: { firstName, lastName, email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
    res.json({ token, msg: 'User logged in successfully', user });

    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;*/