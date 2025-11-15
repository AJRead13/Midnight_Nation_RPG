const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
    maxlength: [100, 'Campaign name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  startingLevel: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  },
  gameMaster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    character: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  maxPlayers: {
    type: Number,
    default: 6,
    min: 2,
    max: 20
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on-hold'],
    default: 'planning'
  },
  sessions: [{
    date: Date,
    duration: Number, // in minutes
    summary: String,
    notes: String
  }],
  worldInfo: {
    type: String,
    maxlength: [5000, 'World info cannot exceed 5000 characters']
  },
  rules: {
    type: String,
    maxlength: [3000, 'Rules cannot exceed 3000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
campaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate a random invite code
campaignSchema.methods.generateInviteCode = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  this.inviteCode = code;
  return code;
};

module.exports = mongoose.model('Campaign', campaignSchema);
