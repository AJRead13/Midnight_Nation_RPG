const mongoose = require('mongoose');
const ReferenceData = require('../models/ReferenceData');

async function testSearch() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/midnight_nation_rpg');
    console.log('Connected to MongoDB');

    // Check total documents
    const total = await ReferenceData.countDocuments();
    console.log(`\nTotal documents in database: ${total}`);

    // Check if searchableText is populated
    const sample = await ReferenceData.findOne().lean();
    console.log('\nSample document:');
    console.log('- Name:', sample.name);
    console.log('- Type:', sample.type);
    console.log('- SearchableText length:', sample.searchableText?.length || 0);
    console.log('- SearchableText preview:', sample.searchableText?.substring(0, 100));

    // Test text search
    console.log('\n--- Testing text search ---');
    const queries = ['vampire', 'bloodline', 'weapon', 'knife', 'combat'];
    
    for (const query of queries) {
      const results = await ReferenceData.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      ).limit(3).lean();
      console.log(`\nQuery "${query}": ${results.length} results`);
      if (results.length > 0) {
        console.log('  Sample:', results[0].name);
      }
    }

    // Try regex search as fallback
    console.log('\n--- Testing regex search ---');
    const regexResults = await ReferenceData.find({
      searchableText: { $regex: 'vampire', $options: 'i' }
    }).limit(3).lean();
    console.log(`Regex search for "vampire": ${regexResults.length} results`);
    if (regexResults.length > 0) {
      console.log('  Sample:', regexResults[0].name);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  const dbConfig = require('../config/db');
  testSearch();
}

module.exports = testSearch;
