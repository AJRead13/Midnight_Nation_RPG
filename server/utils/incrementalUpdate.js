require('dotenv').config();
const mongoose = require('mongoose');
const ReferenceData = require('../models/ReferenceData');

// Import all JSON data files
const classesData = require('../../data/classes.json');
const bloodlinesData = require('../../data/bloodlines.json');
const backgroundsData = require('../../data/backgrounds.json');
const talentsData = require('../../data/talents.json');
const competenciesData = require('../../data/competencies.json');
const boonsData = require('../../data/boons.json');
const itemsData = require('../../data/items.json');
const monstersData = require('../../data/monsters.json');
const npcsData = require('../../data/npcs.json');
const organizationsData = require('../../data/organizations.json');

/**
 * Incremental database update script
 * Only adds new items that don't exist in the database
 * Does not delete or modify existing data
 */

async function incrementalUpdate() {
  try {
    console.log('Starting incremental database update...');
    console.log('This will only ADD new items, not modify or delete existing data.\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    let totalAdded = 0;
    const newDocuments = [];

    // Get existing data by type
    const existingData = await ReferenceData.find({});
    const existingByType = {};
    
    existingData.forEach(doc => {
      if (!existingByType[doc.type]) {
        existingByType[doc.type] = new Set();
      }
      existingByType[doc.type].add(doc.name);
    });

    console.log('Current database contents:');
    Object.entries(existingByType).forEach(([type, names]) => {
      console.log(`  ${type}: ${names.size} items`);
    });
    console.log('');

    // Helper function to check if item exists
    const itemExists = (type, name) => {
      return existingByType[type] && existingByType[type].has(name);
    };

    // Process Monsters
    if (monstersData.monsters && Array.isArray(monstersData.monsters)) {
      const newMonsters = monstersData.monsters.filter(m => !itemExists('monster', m.name));
      
      newMonsters.forEach(monster => {
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

        newDocuments.push({
          type: 'monster',
          name: monster.name,
          data: monster,
          searchableText
        });
      });

      if (newMonsters.length > 0) {
        console.log(`New monsters (${newMonsters.length}):`);
        newMonsters.forEach(m => console.log(`  + ${m.name}`));
        totalAdded += newMonsters.length;
      }
    }

    // Process NPCs
    if (npcsData.npcs && Array.isArray(npcsData.npcs)) {
      const newNPCs = npcsData.npcs.filter(n => !itemExists('npc', n.name));
      
      newNPCs.forEach(npc => {
        const searchableText = [
          npc.name,
          npc.role,
          npc.description,
          npc.background,
          npc.personality,
          ...(npc.hooks || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        newDocuments.push({
          type: 'npc',
          name: npc.name,
          data: npc,
          searchableText
        });
      });

      if (newNPCs.length > 0) {
        console.log(`\nNew NPCs (${newNPCs.length}):`);
        newNPCs.forEach(n => console.log(`  + ${n.name}`));
        totalAdded += newNPCs.length;
      }
    }

    // Process Organizations
    if (organizationsData.organizations && Array.isArray(organizationsData.organizations)) {
      const newOrgs = organizationsData.organizations.filter(o => !itemExists('organization', o.name));
      
      newOrgs.forEach(org => {
        const searchableText = [
          org.name,
          org.motto,
          org.description,
          org.structure,
          org.goals,
          org.secrets
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        newDocuments.push({
          type: 'organization',
          name: org.name,
          data: org,
          searchableText
        });
      });

      if (newOrgs.length > 0) {
        console.log(`\nNew organizations (${newOrgs.length}):`);
        newOrgs.forEach(o => console.log(`  + ${o.name}`));
        totalAdded += newOrgs.length;
      }
    }

    // Process Items
    if (itemsData.items && Array.isArray(itemsData.items)) {
      const newItems = itemsData.items.filter(i => !itemExists('item', i.name));
      
      newItems.forEach(item => {
        const searchableText = [
          item.name,
          item.category,
          item.description,
          ...(item.properties || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        newDocuments.push({
          type: 'item',
          name: item.name,
          data: item,
          searchableText
        });
      });

      if (newItems.length > 0) {
        console.log(`\nNew items (${newItems.length}):`);
        newItems.forEach(i => console.log(`  + ${i.name}`));
        totalAdded += newItems.length;
      }
    }

    // Insert all new documents
    if (newDocuments.length === 0) {
      console.log('\n✓ Database is up to date! No new items to add.');
      process.exit(0);
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Adding ${totalAdded} new items to database...`);
    
    const result = await ReferenceData.insertMany(newDocuments);
    console.log(`✓ Successfully added ${result.length} items!`);

    // Show updated totals
    console.log(`\n${'='.repeat(50)}`);
    console.log('Updated database totals:');
    const updatedCounts = await ReferenceData.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    updatedCounts.forEach(({ _id, count }) => {
      console.log(`  ${_id}: ${count} items`);
    });

    console.log('\n✓ Incremental update complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during incremental update:', error);
    process.exit(1);
  }
}

incrementalUpdate();
