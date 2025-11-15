const mongoose = require('mongoose');

// Single flexible schema for all reference data types
const ReferenceDataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['class', 'bloodline', 'background', 'talent', 'competency', 'boon', 'item', 'monster', 'npc', 'organization', 'info'],
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  searchableText: {
    type: String,
    index: 'text'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
ReferenceDataSchema.index({ type: 1, name: 1 }, { unique: true });

// Pre-save hook to generate searchable text
ReferenceDataSchema.pre('save', function(next) {
  const buildSearchableText = (obj, texts = []) => {
    if (typeof obj === 'string') {
      texts.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(item => buildSearchableText(item, texts));
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(value => buildSearchableText(value, texts));
    }
    return texts;
  };

  const texts = [this.name];
  if (this.category) texts.push(this.category);
  texts.push(...buildSearchableText(this.data));
  
  this.searchableText = texts.join(' ').toLowerCase();
  next();
});

module.exports = mongoose.model('ReferenceData', ReferenceDataSchema);
