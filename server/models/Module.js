const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    required: false,  // Optional - modules without this are classified
    unique: true,
    sparse: true,  // Allows multiple documents with undefined moduleId
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  playerCount: {
    type: String,
    required: true
  },
  estimatedLength: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  previewUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  releaseOrder: {
    type: Number,
    default: 999
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for searching
moduleSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
