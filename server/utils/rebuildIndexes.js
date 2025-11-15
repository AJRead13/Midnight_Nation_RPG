const mongoose = require('mongoose');
const ReferenceData = require('../models/ReferenceData');

async function rebuildIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/midnight_nation_rpg');
    console.log('Connected to MongoDB');

    console.log('Dropping existing indexes...');
    await ReferenceData.collection.dropIndexes();
    
    console.log('Creating new indexes...');
    await ReferenceData.createIndexes();
    
    console.log('Verifying indexes...');
    const indexes = await ReferenceData.collection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));
    
    // Check if text index exists
    const hasTextIndex = Object.values(indexes).some(index => 
      index.some && index.some(field => field[1] === 'text')
    );
    
    if (!hasTextIndex) {
      console.log('Text index not found, creating manually...');
      await ReferenceData.collection.createIndex({ searchableText: 'text' });
    }
    
    console.log('✅ Indexes rebuilt successfully');
    
    // Test search
    console.log('\nTesting search...');
    const testResults = await ReferenceData.find(
      { $text: { $search: 'vampire' } },
      { score: { $meta: 'textScore' } }
    ).limit(5);
    console.log(`Found ${testResults.length} results for "vampire"`);
    if (testResults.length > 0) {
      console.log('Sample result:', testResults[0].name);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  const dbConfig = require('../config/db');
  rebuildIndexes();
}

module.exports = rebuildIndexes;
