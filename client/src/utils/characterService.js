const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Add auth header to requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Fetch all characters for the current user
 */
export const fetchCharacters = async () => {
  try {
    const response = await fetch(`${API_URL}/characters`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(`Failed to fetch characters: ${response.statusText}`);
    }

    const data = await response.json();
    return data.characters || [];
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
};

/**
 * Fetch a single character by ID
 */
export const fetchCharacterById = async (characterId) => {
  try {
    const response = await fetch(`${API_URL}/characters/${characterId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Character not found');
      }
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      if (response.status === 403) {
        throw new Error('Not authorized to view this character');
      }
      throw new Error(`Failed to fetch character: ${response.statusText}`);
    }

    const data = await response.json();
    return data.character;
  } catch (error) {
    console.error('Error fetching character:', error);
    throw error;
  }
};

/**
 * Create a new character
 */
export const createCharacter = async (characterData) => {
  try {
    const response = await fetch(`${API_URL}/characters`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(characterData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      if (response.status === 400) {
        throw new Error(errorData.errors?.[0]?.msg || 'Validation failed');
      }
      throw new Error(errorData.message || 'Failed to create character');
    }

    const data = await response.json();
    return data.character;
  } catch (error) {
    console.error('Error creating character:', error);
    throw error;
  }
};

/**
 * Update an existing character
 */
export const updateCharacter = async (characterId, characterData) => {
  try {
    const response = await fetch(`${API_URL}/characters/${characterId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(characterData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      if (response.status === 403) {
        throw new Error('Not authorized to update this character');
      }
      if (response.status === 404) {
        throw new Error('Character not found');
      }
      throw new Error(errorData.message || 'Failed to update character');
    }

    const data = await response.json();
    return data.character;
  } catch (error) {
    console.error('Error updating character:', error);
    throw error;
  }
};

/**
 * Delete a character
 */
export const deleteCharacter = async (characterId) => {
  try {
    const response = await fetch(`${API_URL}/characters/${characterId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      if (response.status === 403) {
        throw new Error('Not authorized to delete this character');
      }
      if (response.status === 404) {
        throw new Error('Character not found');
      }
      throw new Error(errorData.message || 'Failed to delete character');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting character:', error);
    throw error;
  }
};

/**
 * Auto-save character (debounced save)
 * Returns a debounced function that saves after a delay
 */
export const createAutoSave = (characterId, delay = 2000) => {
  let timeoutId;
  
  return (characterData) => {
    clearTimeout(timeoutId);
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await updateCharacter(characterId, characterData);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

export default {
  fetchCharacters,
  fetchCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  createAutoSave
};
