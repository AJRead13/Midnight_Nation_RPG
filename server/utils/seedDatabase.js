const mongoose = require('mongoose');
const ReferenceData = require('../models/ReferenceData');
const path = require('path');
const fs = require('fs');

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
const infoData = require('../../data/info.json');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing reference data
    await ReferenceData.deleteMany({});
    console.log('Cleared existing reference data');

    const documents = [];

    // Seed Classes
    if (classesData.classes) {
      Object.entries(classesData.classes).forEach(([name, data]) => {
        documents.push({
          type: 'class',
          name,
          data
        });
      });
    }
    console.log(`Prepared ${Object.keys(classesData.classes || {}).length} classes`);

    // Seed Bloodlines
    if (bloodlinesData.bloodlines) {
      Object.entries(bloodlinesData.bloodlines).forEach(([name, data]) => {
        documents.push({
          type: 'bloodline',
          name,
          data
        });
      });
    }
    console.log(`Prepared ${Object.keys(bloodlinesData.bloodlines || {}).length} bloodlines`);

    // Seed Backgrounds
    if (backgroundsData.backgrounds) {
      Object.entries(backgroundsData.backgrounds).forEach(([name, data]) => {
        documents.push({
          type: 'background',
          name,
          data
        });
      });
    }
    console.log(`Prepared ${Object.keys(backgroundsData.backgrounds || {}).length} backgrounds`);

    // Seed Talents
    if (talentsData.talents) {
      Object.entries(talentsData.talents).forEach(([name, data]) => {
        documents.push({
          type: 'talent',
          name,
          data
        });
      });
    }
    console.log(`Prepared ${Object.keys(talentsData.talents || {}).length} talents`);

    // Seed Competencies
    if (competenciesData.competencies) {
      Object.entries(competenciesData.competencies).forEach(([category, compList]) => {
        Object.entries(compList).forEach(([name, data]) => {
          documents.push({
            type: 'competency',
            name,
            category,
            data
          });
        });
      });
    }
    console.log(`Prepared competencies`);

    // Seed Boons
    if (boonsData.boons) {
      Object.entries(boonsData.boons).forEach(([category, boonList]) => {
        boonList.forEach((boon) => {
          documents.push({
            type: 'boon',
            name: boon.name,
            category,
            data: boon
          });
        });
      });
    }
    console.log(`Prepared boons`);

    // Seed Items
    if (itemsData.prices) {
      Object.entries(itemsData.prices).forEach(([category, itemList]) => {
        itemList.forEach((item, index) => {
          documents.push({
            type: 'item',
            name: `${item.item} (${category})`, // Make name unique by including category
            category,
            data: { ...item, originalName: item.item }
          });
        });
      });
    }
    console.log(`Prepared items`);

    // Seed Monsters
    if (monstersData.monsters) {
      monstersData.monsters.forEach((monster) => {
        documents.push({
          type: 'monster',
          name: monster.name,
          data: monster
        });
      });
    }
    console.log(`Prepared ${monstersData.monsters?.length || 0} monsters`);

    // Seed NPCs
    if (npcsData.npcs) {
      npcsData.npcs.forEach((npc) => {
        documents.push({
          type: 'npc',
          name: npc.name,
          data: npc
        });
      });
    }
    console.log(`Prepared ${npcsData.npcs?.length || 0} NPCs`);

    // Seed Organizations
    if (organizationsData.organizations) {
      organizationsData.organizations.forEach((org) => {
        documents.push({
          type: 'organization',
          name: org.name,
          data: org
        });
      });
    }
    console.log(`Prepared ${organizationsData.organizations?.length || 0} organizations`);

    // Seed Info/Core Concepts
    if (infoData.coreConcepts) {
      Object.entries(infoData.coreConcepts).forEach(([name, data]) => {
        documents.push({
          type: 'info',
          name,
          category: 'coreConcepts',
          data
        });
      });
    }
    if (infoData.attributes) {
      Object.entries(infoData.attributes).forEach(([name, data]) => {
        documents.push({
          type: 'info',
          name,
          category: 'attributes',
          data
        });
      });
    }
    console.log(`Prepared info data`);

    // Insert documents individually to trigger pre-save hooks for searchableText
    console.log('Inserting documents...');
    let inserted = 0;
    for (const docData of documents) {
      const doc = new ReferenceData(docData);
      await doc.save();
      inserted++;
      if (inserted % 20 === 0) {
        console.log(`  Inserted ${inserted}/${documents.length} documents...`);
      }
    }
    console.log(`✅ Successfully seeded ${documents.length} reference data documents`);

    return documents.length;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Allow running this script directly
if (require.main === module) {
  const dbConfig = require('../config/db');
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/midnight_nation_rpg')
    .then(() => {
      console.log('Connected to MongoDB');
      return seedDatabase();
    })
    .then((count) => {
      console.log(`Database seeded with ${count} documents`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
