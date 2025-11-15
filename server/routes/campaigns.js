const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Campaign = require('../models/Campaign');
const Character = require('../models/Character');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/campaigns
// @desc    Get all campaigns (user's own and joined)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      $or: [
        { gameMaster: req.user._id },
        { 'players.user': req.user._id }
      ]
    })
      .populate('gameMaster', 'username')
      .populate('players.user', 'username')
      .populate('players.character', 'name')
      .sort({ createdAt: -1 });

    res.json({ campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/campaigns/public
// @desc    Get all public campaigns
// @access  Private
router.get('/public', authMiddleware, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isPublic: true })
      .populate('gameMaster', 'username')
      .select('-inviteCode')
      .sort({ createdAt: -1 });

    res.json({ campaigns });
  } catch (error) {
    console.error('Get public campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Get a specific campaign by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('gameMaster', 'username email')
      .populate('players.user', 'username')
      .populate('players.character', 'name level class race');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user has access to this campaign
    const isGM = campaign.gameMaster._id.toString() === req.user._id.toString();
    const isPlayer = campaign.players.some(
      p => p.user._id.toString() === req.user._id.toString()
    );

    if (!isGM && !isPlayer && !campaign.isPublic) {
      return res.status(403).json({ message: 'Not authorized to view this campaign' });
    }

    res.json({ campaign, isGM });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Campaign name is required')
      .isLength({ max: 100 })
      .withMessage('Campaign name cannot exceed 100 characters')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const campaign = new Campaign({
        name: req.body.name,
        description: req.body.description,
        startingLevel: req.body.startingLevel || 1,
        gameMaster: req.user._id
      });

      // Add first session date if provided
      if (req.body.sessionDate) {
        campaign.sessions.push({
          date: new Date(req.body.sessionDate),
          summary: 'First session',
          notes: ''
        });
      }

      // Generate invite code if not public
      if (!campaign.isPublic) {
        campaign.generateInviteCode();
      }

      await campaign.save();

      // Add campaign to user's campaign list
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { campaigns: campaign._id } }
      );

      res.status(201).json({
        message: 'Campaign created successfully',
        campaign
      });
    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
// @access  Private (GM only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is the game master
    if (campaign.gameMaster.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the game master can update this campaign' });
    }

    // Update campaign
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('gameMaster', 'username')
      .populate('players.user', 'username')
      .populate('players.character', 'name');

    res.json({
      message: 'Campaign updated successfully',
      campaign: updatedCampaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/campaigns/:id
// @desc    Delete a campaign
// @access  Private (GM only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is the game master
    if (campaign.gameMaster.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the game master can delete this campaign' });
    }

    // Remove campaign from all characters
    await Character.updateMany(
      { campaign: campaign._id },
      { $set: { campaign: null } }
    );

    // Remove campaign from all users
    await User.updateMany(
      { campaigns: campaign._id },
      { $pull: { campaigns: campaign._id } }
    );

    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns/join
// @desc    Join a campaign using invite code
// @access  Private
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { inviteCode, characterId } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    // Find campaign by invite code
    const campaign = await Campaign.findOne({ inviteCode: inviteCode.toUpperCase() });

    if (!campaign) {
      return res.status(404).json({ message: 'Invalid invite code' });
    }

    // Check if campaign is full
    if (campaign.players.length >= campaign.maxPlayers) {
      return res.status(400).json({ message: 'Campaign is full' });
    }

    // Check if user is already in the campaign
    const alreadyInCampaign = campaign.players.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyInCampaign) {
      return res.status(400).json({ message: 'You are already in this campaign' });
    }

    // Check if user is the game master
    if (campaign.gameMaster.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You are the Game Master of this campaign' });
    }

    // If character ID provided, validate it
    if (characterId) {
      const character = await Character.findById(characterId);

      if (!character) {
        return res.status(404).json({ message: 'Character not found' });
      }

      if (character.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not own this character' });
      }

      if (character.campaign) {
        return res.status(400).json({ message: 'Character is already in another campaign' });
      }

      // Update character's campaign
      character.campaign = campaign._id;
      await character.save();
    }

    // Add player to campaign
    campaign.players.push({
      user: req.user._id,
      character: characterId || null
    });

    await campaign.save();

    // Add campaign to user's campaign list
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { campaigns: campaign._id } }
    );

    await campaign.populate('gameMaster', 'username');

    res.json({
      message: 'Successfully joined campaign',
      campaign
    });
  } catch (error) {
    console.error('Join campaign by code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/assign-character
// @desc    Assign a character to the campaign for current user
// @access  Private
router.post('/:id/assign-character', authMiddleware, async (req, res) => {
  try {
    const { characterId } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is in the campaign
    const playerIndex = campaign.players.findIndex(
      p => p.user.toString() === req.user._id.toString()
    );

    if (playerIndex === -1) {
      return res.status(403).json({ message: 'You are not a member of this campaign' });
    }

    // Verify character exists and belongs to user
    const character = await Character.findById(characterId);

    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    if (character.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this character' });
    }

    if (character.campaign && character.campaign.toString() !== campaign._id.toString()) {
      return res.status(400).json({ message: 'Character is already in another campaign' });
    }

    // Update character's campaign
    character.campaign = campaign._id;
    await character.save();

    // Update player's character in campaign
    campaign.players[playerIndex].character = characterId;
    await campaign.save();

    await campaign.populate([
      { path: 'gameMaster', select: 'username' },
      { path: 'players.user', select: 'username' },
      { path: 'players.character', select: 'name level class' }
    ]);

    res.json({
      message: 'Character assigned successfully',
      campaign
    });
  } catch (error) {
    console.error('Assign character error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/join
// @desc    Join a campaign with an invite code or if public
// @access  Private
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const { characterId, inviteCode } = req.body;
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign is full
    if (campaign.players.length >= campaign.maxPlayers) {
      return res.status(400).json({ message: 'Campaign is full' });
    }

    // Check if user is already in the campaign
    const alreadyJoined = campaign.players.some(
      p => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'You have already joined this campaign' });
    }

    // Verify invite code if campaign is not public
    if (!campaign.isPublic && campaign.inviteCode !== inviteCode) {
      return res.status(403).json({ message: 'Invalid invite code' });
    }

    // Verify character exists and belongs to user
    if (characterId) {
      const character = await Character.findById(characterId);
      
      if (!character) {
        return res.status(404).json({ message: 'Character not found' });
      }

      if (character.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not own this character' });
      }

      if (character.campaign) {
        return res.status(400).json({ message: 'Character is already in another campaign' });
      }

      // Update character's campaign
      character.campaign = campaign._id;
      await character.save();
    }

    // Add player to campaign
    campaign.players.push({
      user: req.user._id,
      character: characterId || null
    });

    await campaign.save();

    // Add campaign to user's campaign list
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { campaigns: campaign._id } }
    );

    res.json({
      message: 'Successfully joined campaign',
      campaign
    });
  } catch (error) {
    console.error('Join campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/leave
// @desc    Leave a campaign
// @access  Private
router.post('/:id/leave', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is the game master
    if (campaign.gameMaster.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Game master cannot leave. Delete the campaign instead.' });
    }

    // Find and remove player
    const playerIndex = campaign.players.findIndex(
      p => p.user.toString() === req.user._id.toString()
    );

    if (playerIndex === -1) {
      return res.status(400).json({ message: 'You are not in this campaign' });
    }

    const characterId = campaign.players[playerIndex].character;

    // Remove player from campaign
    campaign.players.splice(playerIndex, 1);
    await campaign.save();

    // Remove campaign from character if associated
    if (characterId) {
      await Character.findByIdAndUpdate(
        characterId,
        { $set: { campaign: null } }
      );
    }

    // Remove campaign from user's campaign list
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { campaigns: campaign._id } }
    );

    res.json({ message: 'Successfully left campaign' });
  } catch (error) {
    console.error('Leave campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/regenerate-code
// @desc    Regenerate invite code for campaign
// @access  Private (GM only)
router.post('/:id/regenerate-code', authMiddleware, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if user is the game master
    if (campaign.gameMaster.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the game master can regenerate the invite code' });
    }

    campaign.generateInviteCode();
    await campaign.save();

    res.json({
      message: 'Invite code regenerated successfully',
      inviteCode: campaign.inviteCode
    });
  } catch (error) {
    console.error('Regenerate code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
