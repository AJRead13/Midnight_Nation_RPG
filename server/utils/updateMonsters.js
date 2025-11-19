require('dotenv').config();
const mongoose = require('mongoose');
const ReferenceData = require('../models/ReferenceData');
const monstersData = require('../../data/monsters.json');

/**
 * Incremental update script for adding new monsters without clearing existing data
 * Only adds monsters that don't already exist in the database
 */

async function updateMonsters() {
  try {
    console.log('Starting incremental monster update...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all existing monsters from database
    const existingMonsters = await ReferenceData.find({ type: 'monster' });
    const existingMonsterNames = new Set(existingMonsters.map(m => m.name));
    
    console.log(`Found ${existingMonsters.length} existing monsters in database`);

    // Prepare new monsters that don't exist yet
    const newMonsters = [];
    
    if (monstersData.monsters && Array.isArray(monstersData.monsters)) {
      monstersData.monsters.forEach((monster) => {
        if (!existingMonsterNames.has(monster.name)) {
          // Build searchable text for new monster
          const searchableText = [
            monster.name,
            monster.category,
            monster.threatTier,
            monster.origin,
            ...(monster.competencies || []),
            ...(monster.abilities?.map(a => a.name) || []),
            ...(monster.weaknesses || []),
            ...(monster.attacks?.map(a => a.name) || []),
            monster.tactics,
            monster.storyHooks
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          newMonsters.push({
            type: 'monster',
            name: monster.name,
            data: monster,
            searchableText
          });
        }
      });
    }

    if (newMonsters.length === 0) {
      console.log('✓ No new monsters to add - database is up to date!');
      process.exit(0);
    }

    console.log(`\nFound ${newMonsters.length} new monsters to add:`);
    newMonsters.forEach(m => console.log(`  - ${m.name}`));

    // Insert new monsters
    const result = await ReferenceData.insertMany(newMonsters);
    console.log(`\n✓ Successfully added ${result.length} new monsters!`);

    // Show updated totals
    const totalMonsters = await ReferenceData.countDocuments({ type: 'monster' });
    console.log(`\nTotal monsters in database: ${totalMonsters}`);

    process.exit(0);
  } catch (error) {
    console.error('Error updating monsters:', error);
    process.exit(1);
  }
}

updateMonsters();
