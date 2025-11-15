const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Cache for reference data
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ReferenceDataService {
  async fetchReferenceData(type) {
    const cacheKey = `reference_${type}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`${API_URL}/reference/${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
      }
      const data = await response.json();
      
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }
  }

  async fetchBulkData(types) {
    const cacheKey = `bulk_${types.sort().join('_')}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`${API_URL}/reference/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ types }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bulk data');
      }
      
      const data = await response.json();
      
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('Error fetching bulk data:', error);
      throw error;
    }
  }

  async searchReferenceData(query, limit = 15) {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const url = `${API_URL}/reference/search/query?q=${encodeURIComponent(query)}&limit=${limit}`;
      console.log('Search URL:', url);
      
      const response = await fetch(url);
      console.log('Search response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search failed with response:', errorText);
        throw new Error('Search failed');
      }
      
      const results = await response.json();
      console.log('Search results:', results);
      return results;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  }

  async fetchItemById(id) {
    try {
      const response = await fetch(`${API_URL}/reference/item/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  clearCache() {
    cache.clear();
  }

  clearCacheForType(type) {
    cache.delete(`reference_${type}`);
  }
}

export default new ReferenceDataService();
