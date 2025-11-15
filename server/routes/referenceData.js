const express = require('express');
const router = express.Router();
const ReferenceData = require('../models/ReferenceData');

// Search across all reference data - MUST BE BEFORE /:type route
router.get('/search/query', async (req, res) => {
  try {
    const { q, limit = 15 } = req.query;
    console.log('[SEARCH API] Query received:', q);
    
    if (!q || q.length < 2) {
      console.log('[SEARCH API] Query too short, returning empty array');
      return res.json([]);
    }

    console.log('[SEARCH API] Executing MongoDB text search...');
    const results = await ReferenceData.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .lean();

    console.log(`[SEARCH API] Found ${results.length} results`);

    // Transform results for frontend
    const formattedResults = results.map(item => {
      // For items, use the original name without category suffix
      const title = item.type === 'item' && item.data.originalName 
        ? item.data.originalName 
        : item.name;
      
      // Map database types to actual page routes
      let page = 'rules'; // default
      let section = item.category || item.type;
      
      if (item.type === 'item') {
        page = 'items';
        section = item.category; // Keep the item category
      } else if (item.type === 'organization') {
        page = 'lore';
        section = 'organizations';
      } else if (item.type === 'monster') {
        page = 'rules';
        section = 'monsters';
      } else if (item.type === 'npc') {
        page = 'rules';
        section = 'npcs';
      } else if (item.type === 'class') {
        page = 'rules';
        section = 'classes';
      } else if (item.type === 'bloodline') {
        page = 'rules';
        section = 'bloodlines';
      } else if (item.type === 'background') {
        page = 'rules';
        section = 'backgrounds';
      } else if (item.type === 'talent' || item.type === 'competency') {
        page = 'rules';
        section = 'talents';
      } else if (item.type === 'boon') {
        page = 'rules';
        section = 'boons';
      } else if (item.type === 'info') {
        page = 'rules';
        section = item.category === 'attributes' ? 'attributes' : 'overview';
      }
      
      return {
        title,
        description: item.data.description || item.data.overview || item.data.effect || item.data.notes || item.data.price || '',
        page,
        section,
        type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
        _id: item._id
      };
    });

    console.log('[SEARCH API] Returning formatted results:', formattedResults.length);
    res.json(formattedResults);
  } catch (error) {
    console.error('[SEARCH API] Error searching reference data:', error);
    res.status(500).json({ error: 'Failed to search reference data' });
  }
});

// Get all reference data of a specific type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { category } = req.query;

    const query = { type };
    if (category) {
      query.category = category;
    }

    const data = await ReferenceData.find(query).select('-__v').lean();
    
    // Transform to match frontend expected structure
    const result = {};
    data.forEach(item => {
      if (category) {
        // For categorized data (competencies, boons, items)
        if (!result[item.category]) {
          result[item.category] = [];
        }
        if (type === 'competency') {
          if (!result[item.category]) result[item.category] = {};
          result[item.category][item.name] = item.data;
        } else {
          result[item.category].push({ ...item.data, _id: item._id });
        }
      } else {
        // For non-categorized data (classes, bloodlines, etc.)
        result[item.name] = { ...item.data, _id: item._id };
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching reference data:', error);
    res.status(500).json({ error: 'Failed to fetch reference data' });
  }
});

// Get all categories for a type
router.get('/:type/categories', async (req, res) => {
  try {
    const { type } = req.params;
    const categories = await ReferenceData.distinct('category', { type });
    res.json(categories.filter(Boolean));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single item by ID
router.get('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ReferenceData.findById(id).select('-__v').lean();
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Get all data for multiple types (bulk fetch)
router.post('/bulk', async (req, res) => {
  try {
    const { types } = req.body;
    
    if (!Array.isArray(types) || types.length === 0) {
      return res.status(400).json({ error: 'Types array is required' });
    }

    const data = await ReferenceData.find({ type: { $in: types } })
      .select('-__v')
      .lean();

    // Group by type
    const grouped = {};
    types.forEach(type => {
      grouped[type] = {};
    });

    data.forEach(item => {
      if (item.category) {
        if (!grouped[item.type][item.category]) {
          grouped[item.type][item.category] = item.type === 'competency' ? {} : [];
        }
        if (item.type === 'competency') {
          grouped[item.type][item.category][item.name] = item.data;
        } else {
          grouped[item.type][item.category].push({ ...item.data, _id: item._id });
        }
      } else {
        grouped[item.type][item.name] = { ...item.data, _id: item._id };
      }
    });

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching bulk data:', error);
    res.status(500).json({ error: 'Failed to fetch bulk data' });
  }
});

module.exports = router;
