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
 * Fetch all campaigns (user's own and joined)
 */
export const fetchCampaigns = async () => {
  try {
    const response = await fetch(`${API_URL}/campaigns`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
    }

    const data = await response.json();
    return data.campaigns || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

/**
 * Fetch all public campaigns
 */
export const fetchPublicCampaigns = async () => {
  try {
    const response = await fetch(`${API_URL}/campaigns/public`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch public campaigns: ${response.statusText}`);
    }

    const data = await response.json();
    return data.campaigns || [];
  } catch (error) {
    console.error('Error fetching public campaigns:', error);
    throw error;
  }
};

/**
 * Fetch a single campaign by ID
 */
export const fetchCampaignById = async (campaignId) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Campaign not found');
      }
      if (response.status === 403) {
        throw new Error('Not authorized to view this campaign');
      }
      throw new Error(`Failed to fetch campaign: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
};

/**
 * Create a new campaign
 */
export const createCampaign = async (campaignData) => {
  try {
    const response = await fetch(`${API_URL}/campaigns`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(campaignData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new Error('Not authenticated');
      }
      if (response.status === 400) {
        throw new Error(errorData.errors?.[0]?.msg || 'Validation failed');
      }
      throw new Error(errorData.message || 'Failed to create campaign');
    }

    const data = await response.json();
    return data.campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
};

/**
 * Update an existing campaign
 */
export const updateCampaign = async (campaignId, campaignData) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(campaignData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 403) {
        throw new Error('Only the GM can update this campaign');
      }
      if (response.status === 404) {
        throw new Error('Campaign not found');
      }
      throw new Error(errorData.message || 'Failed to update campaign');
    }

    const data = await response.json();
    return data.campaign;
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (campaignId) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 403) {
        throw new Error('Only the GM can delete this campaign');
      }
      if (response.status === 404) {
        throw new Error('Campaign not found');
      }
      throw new Error(errorData.message || 'Failed to delete campaign');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
};

/**
 * Join a campaign using invite code
 */
export const joinCampaign = async (inviteCode, characterId) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ inviteCode, characterId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 404) {
        throw new Error('Invalid invite code');
      }
      if (response.status === 400) {
        throw new Error(errorData.message || 'Cannot join campaign');
      }
      throw new Error(errorData.message || 'Failed to join campaign');
    }

    const data = await response.json();
    return data.campaign;
  } catch (error) {
    console.error('Error joining campaign:', error);
    throw error;
  }
};

/**
 * Leave a campaign
 */
export const leaveCampaign = async (campaignId) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/leave`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to leave campaign');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error leaving campaign:', error);
    throw error;
  }
};

/**
 * Add a session to a campaign
 */
export const addSession = async (campaignId, sessionData) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add session');
    }

    const data = await response.json();
    return data.campaign;
  } catch (error) {
    console.error('Error adding session:', error);
    throw error;
  }
};

/**
 * Remove a player from a campaign (GM only)
 */
export const removePlayer = async (campaignId, userId) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${campaignId}/players/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove player');
    }

    const data = await response.json();
    return data.campaign;
  } catch (error) {
    console.error('Error removing player:', error);
    throw error;
  }
};

export default {
  fetchCampaigns,
  fetchPublicCampaigns,
  fetchCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  leaveCampaign,
  addSession,
  removePlayer
};
