const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('./User');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Received data:', { username, email, password }); // Log received data

    // Validate input (add more validation as needed)

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Ensure the password is provided
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error); // Log the error
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
