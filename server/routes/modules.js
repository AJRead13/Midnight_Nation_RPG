const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs').promises;

// Get all modules with optional filtering
router.get('/', async (req, res) => {
  try {
    console.log('[modules.js] GET /api/modules - Request received');
    console.log('[modules.js] Query params:', req.query);
    
    const { difficulty, tags, search } = req.query;
    
    let query = { active: true };
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    console.log('[modules.js] Database query:', JSON.stringify(query));
    
    const modules = await Module.find(query).sort({ featured: -1, createdAt: -1 });
    console.log('[modules.js] Found modules:', modules.length);
    
    // Log each module's moduleId to debug classified styling
    modules.forEach(mod => {
      console.log(`[modules.js] Module: ${mod.title}, moduleId: ${mod.moduleId}, hasModuleId: ${!!mod.moduleId}`);
    });
    
    // Transform modules to ensure undefined/null moduleId is properly handled
    const transformedModules = modules.map(mod => {
      const obj = mod.toObject();
      // If moduleId is null, undefined, or empty string, delete it from the response
      if (!obj.moduleId) {
        delete obj.moduleId;
      }
      return obj;
    });
    
    // If no modules in database, return hardcoded modules as fallback
    if (transformedModules.length === 0) {
    if (modules.length === 0) {
      console.log('[modules.js] No modules in database, returning fallback data');
      const fallbackModules = [
        {
          _id: "fallback-the-awakening",
          moduleId: "the-awakening",
          title: "The Awakening",
          description: "A mysterious force begins to stir in the city, awakening dormant powers and ancient threats.",
          fullDescription: "When a series of unexplained phenomena begin occurring across the city, your characters are drawn into an investigation that reveals a terrible truth: ancient powers long dormant are beginning to awaken. This introductory module is perfect for new Game Masters and players, providing a straightforward mystery with supernatural elements that introduces the core themes of Midnight Nation.",
          difficulty: "beginner",
          playerCount: "3-5",
          estimatedLength: "4-6 sessions",
          tags: ["mystery", "urban", "supernatural", "investigation"],
          featured: true,
          active: true
        },
        {
          _id: "fallback-shadow-protocol",
          title: "Shadow Protocol",
          description: "Corporate espionage meets supernatural horror in this thrilling adventure through the underbelly of Midnight Nation.",
          fullDescription: "A powerful corporation has been experimenting with occult forces, and the results are about to be unleashed on an unsuspecting city. Your characters must navigate corporate intrigue, underground networks, and supernatural dangers to stop a catastrophe.",
          difficulty: "intermediate",
          playerCount: "4-6",
          estimatedLength: "6-8 sessions",
          tags: ["intrigue", "corporate", "action", "conspiracy"],
          featured: true,
          active: true
        },
        {
          _id: "fallback-blood-moon-rising",
          title: "Blood Moon Rising",
          description: "When the blood moon appears, ancient vampire clans emerge from hiding to claim their dominion over the city.",
          fullDescription: "An ancient prophecy comes to pass as the blood moon rises over the city. Vampire clans that have hidden in the shadows for centuries make their move to claim power, and only your characters stand between them and total domination.",
          difficulty: "advanced",
          playerCount: "3-6",
          estimatedLength: "8-10 sessions",
          tags: ["horror", "vampires", "epic", "political"],
          featured: false,
          active: true
        }
      ];
      return res.json(fallbackModules);
    }
    
    res.json(transformedModules);
  } catch (error) {
    console.error('[modules.js] Error fetching modules:', error);
    res.status(500).json({ message: 'Error fetching modules', error: error.message });
  }
});

// Get single module by ID
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ message: 'Error fetching module', error: error.message });
  }
});

// Download module (requires authentication)
router.get('/:id/download', auth, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Increment download count
    module.downloadCount += 1;
    await module.save();
    
    // Check if file exists
    const filePath = path.join(__dirname, '..', 'public', 'modules', module.fileName);
    
    try {
      await fs.access(filePath);
      
      // Set headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${module.fileName}"`);
      
      // Send file
      res.sendFile(filePath);
    } catch (fileError) {
      console.error('File not found:', filePath);
      return res.status(404).json({ message: 'Module file not found' });
    }
    
  } catch (error) {
    console.error('Error downloading module:', error);
    res.status(500).json({ message: 'Error downloading module', error: error.message });
  }
});

// Get download URL (for external storage like S3)
router.get('/:id/download-url', auth, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Increment download count
    module.downloadCount += 1;
    await module.save();
    
    // Return the file URL (useful if using cloud storage)
    res.json({ downloadUrl: module.fileUrl });
    
  } catch (error) {
    console.error('Error getting download URL:', error);
    res.status(500).json({ message: 'Error getting download URL', error: error.message });
  }
});

// Create new module (admin only - can add admin middleware later)
router.post('/', auth, async (req, res) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ message: 'Error creating module', error: error.message });
  }
});

// Update module (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json(module);
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ message: 'Error updating module', error: error.message });
  }
});

// Delete module (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: 'Error deleting module', error: error.message });
  }
});

module.exports = router;
