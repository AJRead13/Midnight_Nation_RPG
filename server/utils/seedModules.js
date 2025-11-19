require('dotenv').config();
const mongoose = require('mongoose');
const Module = require('../models/Module');

const sampleModules = [
  {
    moduleId: "the-awakening",
    title: "The Awakening",
    description: "A mysterious force begins to stir in the city, awakening dormant powers and ancient threats.",
    fullDescription: "When a series of unexplained phenomena begin occurring across the city, your characters are drawn into an investigation that reveals a terrible truth: ancient powers long dormant are beginning to awaken. This introductory module is perfect for new Game Masters and players, providing a straightforward mystery with supernatural elements that introduces the core themes of Midnight Nation.",
    difficulty: "beginner",
    playerCount: "3-5",
    estimatedLength: "4-6 sessions",
    tags: ["mystery", "urban", "supernatural", "investigation"],
    fileUrl: "/modules/the-awakening.pdf",
    fileName: "the-awakening.pdf",
    fileSize: 2500000,
    featured: true,
    active: true
  },
  {
    // NO moduleId - this will trigger classified styling
    title: "Shadow Protocol",
    description: "Corporate espionage meets supernatural horror in this thrilling adventure through the underbelly of Midnight Nation.",
    fullDescription: "A powerful corporation has been experimenting with occult forces, and the results are about to be unleashed on an unsuspecting city. Your characters must navigate corporate intrigue, underground networks, and supernatural dangers to stop a catastrophe. This module features multiple paths to success, moral dilemmas, and a ticking clock that keeps the pressure on.",
    difficulty: "intermediate",
    playerCount: "4-6",
    estimatedLength: "6-8 sessions",
    tags: ["intrigue", "corporate", "action", "conspiracy"],
    fileUrl: "/modules/shadow-protocol.pdf",
    fileName: "shadow-protocol.pdf",
    fileSize: 3200000,
    featured: true,
    active: true
  },
  {
    // NO moduleId - this will trigger classified styling
    title: "Blood Moon Rising",
    description: "When the blood moon appears, ancient vampire clans emerge from hiding to claim their dominion over the city.",
    fullDescription: "An ancient prophecy comes to pass as the blood moon rises over the city. Vampire clans that have hidden in the shadows for centuries make their move to claim power, and only your characters stand between them and total domination. This epic campaign features complex political intrigue, intense combat encounters, and world-shaking consequences. Recommended for experienced groups.",
    difficulty: "advanced",
    playerCount: "3-6",
    estimatedLength: "8-10 sessions",
    tags: ["horror", "vampires", "epic", "political"],
    fileUrl: "/modules/blood-moon-rising.pdf",
    fileName: "blood-moon-rising.pdf",
    fileSize: 4100000,
    featured: false,
    active: true
  }
];

async function seedModules() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing modules
    await Module.deleteMany({});
    console.log('Cleared existing modules');

    // Insert sample modules
    const modules = await Module.insertMany(sampleModules);
    console.log(`Successfully seeded ${modules.length} modules:`);
    modules.forEach(module => {
      console.log(`  - ${module.title} (${module.difficulty})`);
    });

    console.log('\nModule seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding modules:', error);
    process.exit(1);
  }
}

seedModules();
