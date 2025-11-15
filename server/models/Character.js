const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Character name is required'],
    trim: true,
    maxlength: [50, 'Character name cannot exceed 50 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Core attributes - Midnight Nation RPG uses Mind, Body, Soul
  attributes: {
    Mind: { type: Number, default: 40, min: 1, max: 100 },
    Body: { type: Number, default: 40, min: 1, max: 100 },
    Soul: { type: Number, default: 40, min: 1, max: 100 }
  },
  // Character details
  background: {
    type: String,
    trim: true
  },
  bloodline: {
    type: String,
    trim: true
  },
  bloodlineBranch: {
    type: String,
    trim: true
  },
  class: {
    type: String,
    trim: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  fatePool: {
    type: Number,
    default: 1,
    min: 0
  },
  // Wounds system
  wounds: {
    head: {
      direct: { type: Boolean, default: false },
      devastating: { type: Boolean, default: false },
      critical: { type: Boolean, default: false }
    },
    torso: {
      direct: { type: Boolean, default: false },
      devastating: { type: Boolean, default: false },
      critical: { type: Boolean, default: false }
    },
    leftArm: {
      direct: { type: Boolean, default: false },
      devastating: { type: Boolean, default: false },
      critical: { type: Boolean, default: false }
    },
    rightArm: {
      direct: { type: Boolean, default: false },
      devastating: { type: Boolean, default: false },
      critical: { type: Boolean, default: false }
    },
    leftLeg: {
      direct: { type: Boolean, default: false },
      devastating: { type: Boolean, default: false },
      critical: { type: Boolean, default: false }
    },
    rightLeg: {
      direct: { type: Boolean, default: false },
      devastating: { type: Boolean, default: false },
      critical: { type: Boolean, default: false }
    }
  },
  // Competencies
  competencies: [{
    name: String,
    description: String,
    effect: String,
    category: String
  }],
  // Talents
  talents: [{
    name: String,
    category: String,
    subTalent: String,
    applied: { type: Boolean, default: false },
    description: String,
    effects: [String]
  }],
  // Boons
  boons: [{
    name: String,
    category: String,
    effect: String
  }],
  // Equipment and inventory
  equipment: [{
    name: String,
    category: String,
    description: String,
    price: String
  }],
  // Notes
  notes: {
    type: String,
    maxlength: [5000, 'Notes cannot exceed 5000 characters']
  },
  // Campaign association
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    default: null
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
characterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Character', characterSchema);
