const mongoose = require('mongoose');
const ReferenceData = require('../models/ReferenceData');

async function populateSearchableText() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/midnight_nation_rpg');
    console.log('Connected to MongoDB');

    console.log('Fetching all documents...');
    const allDocs = await ReferenceData.find();
    console.log(`Found ${allDocs.length} documents`);

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

    console.log('Updating searchableText for all documents...');
    let updated = 0;

    for (const doc of allDocs) {
      const texts = [doc.name];
      if (doc.category) texts.push(doc.category);
      texts.push(...buildSearchableText(doc.data));
      
      doc.searchableText = texts.join(' ').toLowerCase();
      await doc.save();
      updated++;
      
      if (updated % 20 === 0) {
        console.log(`  Updated ${updated}/${allDocs.length} documents...`);
      }
    }

    console.log(`✅ Successfully updated searchableText for ${updated} documents`);

    // Test a search
    console.log('\nTesting search...');
    const testResults = await ReferenceData.find(
      { $text: { $search: 'vampire' } },
      { score: { $meta: 'textScore' } }
    ).limit(5);
    console.log(`Found ${testResults.length} results for "vampire"`);
    if (testResults.length > 0) {
      console.log('Sample results:');
      testResults.forEach(r => console.log(`  - ${r.name} (${r.type})`));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  const dbConfig = require('../config/db');
  populateSearchableText();
}

module.exports = populateSearchableText;
