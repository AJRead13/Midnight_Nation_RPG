const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Character = require('../models/Character');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/characters
// @desc    Get all characters for logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const characters = await Character.find({ owner: req.user._id })
      .populate('campaign', 'name')
      .sort({ createdAt: -1 });

    res.json({ characters });
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/characters/:id
// @desc    Get a specific character by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id)
      .populate('campaign', 'name gameMaster');

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // Check if user owns this character
    if (character.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this character' });
    }

    res.json({ character });
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/characters
// @desc    Create a new character
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Character name is required')
      .isLength({ max: 50 })
      .withMessage('Character name cannot exceed 50 characters')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const characterData = {
        ...req.body,
        owner: req.user._id
      };

      const character = new Character(characterData);
      await character.save();

      // Add character to user's character list
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { characters: character._id } }
      );

      res.status(201).json({
        message: 'Character created successfully',
        character
      });
    } catch (error) {
      console.error('Create character error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/characters/:id
// @desc    Update a character
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // Check if user owns this character
    if (character.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this character' });
    }

    // Update character
    const updatedCharacter = await Character.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Character updated successfully',
      character: updatedCharacter
    });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/characters/:id
// @desc    Delete a character
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // Check if user owns this character
    if (character.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this character' });
    }

    // Remove character from campaign if associated
    if (character.campaign) {
      await Campaign.findByIdAndUpdate(
        character.campaign,
        { $pull: { players: { character: character._id } } }
      );
    }

    // Remove character from user's character list
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { characters: character._id } }
    );

    await Character.findByIdAndDelete(req.params.id);

    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Delete character error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
