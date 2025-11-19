const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs').promises;

// Get all modules with optional filtering
router.get('/', async (req, res) => {
  try {
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
    
    const modules = await Module.find(query).sort({ featured: -1, createdAt: -1 });
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
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
