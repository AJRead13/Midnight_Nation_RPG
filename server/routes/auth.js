const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, displayName, isGM } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email
            ? 'Email already registered'
            : 'Username already taken'
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        displayName: displayName || username,
        isGM: isGM || false
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          isGM: user.isGM
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          isGM: user.isGM
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        displayName: req.user.displayName,
        avatar: req.user.avatar,
        bio: req.user.bio,
        isGM: req.user.isGM,
        notificationPreferences: req.user.notificationPreferences || {
          emailNotifications: true,
          sessionCreated: true,
          sessionUpdated: true,
          sessionReminder: true
        },
        characters: req.user.characters,
        campaigns: req.user.campaigns,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  [
    require('../middleware/auth'),
    body('displayName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Display name cannot exceed 50 characters'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('avatar')
      .optional()
      .trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { displayName, bio, avatar } = req.body;
      const updateFields = {};

      if (displayName !== undefined) updateFields.displayName = displayName;
      if (bio !== undefined) updateFields.bio = bio;
      if (avatar !== undefined) updateFields.avatar = avatar;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          isGM: user.isGM
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error updating profile' });
    }
  }
);

// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
router.put(
  '/password',
  [
    require('../middleware/auth'),
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error changing password' });
    }
  }
);

// @route   PUT /api/auth/notifications
// @desc    Update notification preferences
// @access  Private
router.put(
  '/notifications',
  require('../middleware/auth'),
  async (req, res) => {
    try {
      const { emailNotifications, sessionCreated, sessionUpdated, sessionReminder } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update notification preferences
      if (!user.notificationPreferences) {
        user.notificationPreferences = {};
      }

      if (emailNotifications !== undefined) {
        user.notificationPreferences.emailNotifications = emailNotifications;
      }
      if (sessionCreated !== undefined) {
        user.notificationPreferences.sessionCreated = sessionCreated;
      }
      if (sessionUpdated !== undefined) {
        user.notificationPreferences.sessionUpdated = sessionUpdated;
      }
      if (sessionReminder !== undefined) {
        user.notificationPreferences.sessionReminder = sessionReminder;
      }

      await user.save();

      res.json({
        message: 'Notification preferences updated successfully',
        notificationPreferences: user.notificationPreferences
      });
    } catch (error) {
      console.error('Update notification preferences error:', error);
      res.status(500).json({ message: 'Server error updating preferences' });
    }
  }
);

module.exports = router;
