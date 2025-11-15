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
  // Core attributes
  attributes: {
    strength: { type: Number, default: 10, min: 1, max: 20 },
    dexterity: { type: Number, default: 10, min: 1, max: 20 },
    constitution: { type: Number, default: 10, min: 1, max: 20 },
    intelligence: { type: Number, default: 10, min: 1, max: 20 },
    wisdom: { type: Number, default: 10, min: 1, max: 20 },
    charisma: { type: Number, default: 10, min: 1, max: 20 }
  },
  // Character details
  race: {
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
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  // Health and resources
  health: {
    current: { type: Number, default: 10 },
    max: { type: Number, default: 10 }
  },
  // Equipment and inventory
  equipment: [{
    name: String,
    type: String,
    description: String,
    quantity: { type: Number, default: 1 }
  }],
  // Skills and abilities
  skills: [{
    name: String,
    proficiency: Boolean,
    bonus: Number
  }],
  abilities: [{
    name: String,
    description: String,
    cost: String
  }],
  // Background and notes
  background: {
    type: String,
    maxlength: [2000, 'Background cannot exceed 2000 characters']
  },
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
