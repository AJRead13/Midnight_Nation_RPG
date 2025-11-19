const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const moduleService = {
  // Get all modules with optional filters
  async getAllModules(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.difficulty && filters.difficulty !== 'all') {
        queryParams.append('difficulty', filters.difficulty);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        queryParams.append('tags', filters.tags.join(','));
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const url = `${API_URL}/api/modules${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching modules:', error);
      throw error;
    }
  },

  // Get single module by ID
  async getModuleById(moduleId) {
    try {
      const response = await fetch(`${API_URL}/api/modules/${moduleId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch module');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching module:', error);
      throw error;
    }
  },

  // Download module (requires authentication)
  async downloadModule(moduleId, fileName) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required to download modules');
      }
      
      const response = await fetch(`${API_URL}/api/modules/${moduleId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to download modules');
        }
        throw new Error('Failed to download module');
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `module-${moduleId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading module:', error);
      throw error;
    }
  },

  // Create new module (admin only)
  async createModule(moduleData) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/api/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(moduleData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create module');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  },

  // Update module (admin only)
  async updateModule(moduleId, moduleData) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(moduleData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update module');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  },

  // Delete module (admin only)
  async deleteModule(moduleId) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}/api/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete module');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  }
};

export default moduleService;
