import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchCampaigns, createCampaign, deleteCampaign, joinCampaign } from '../../utils/campaignService';
import { fetchCharacters } from '../../utils/characterService';
import './campaigns.css';

function Campaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    description: '',
    startingLevel: 1,
    sessionDate: '',
    maxPlayers: 6,
    isPublic: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [campaignsData, charactersData] = await Promise.all([
        fetchCampaigns(),
        fetchCharacters()
      ]);
      setCampaigns(campaignsData);
      setCharacters(charactersData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const newCampaign = await createCampaign(campaignForm);
      setCampaigns([newCampaign, ...campaigns]);
      setShowCreateModal(false);
      setCampaignForm({
        name: '',
        description: '',
        startingLevel: 1,
        sessionDate: '',
        maxPlayers: 6,
        isPublic: false
      });
      navigate(`/campaign/${newCampaign._id}`);
    } catch (err) {
      alert(`Failed to create campaign: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinCampaign = async (e) => {
    e.preventDefault();
    if (!selectedCharacter) {
      alert('Please select a character');
      return;
    }
    setIsJoining(true);
    try {
      const campaign = await joinCampaign(inviteCode, selectedCharacter);
      setCampaigns([...campaigns, campaign]);
      setShowJoinModal(false);
      setInviteCode('');
      setSelectedCharacter('');
      navigate(`/campaign/${campaign._id}`);
    } catch (err) {
      alert(`Failed to join campaign: ${err.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteClick = (campaign) => {
    setDeleteConfirm(campaign);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      await deleteCampaign(deleteConfirm._id);
      setCampaigns(campaigns.filter(c => c._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(`Failed to delete campaign: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isGM = (campaign, userId) => {
    return campaign.gameMaster?._id === userId || campaign.gameMaster === userId;
  };

  const getCurrentUserId = () => {
    return user?._id || null;
  };

  if (loading) {
    return (
      <div className="campaigns-container">
        <div className="loading">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaigns-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-container">
      <div className="campaigns-header">
        <h1>My Campaigns</h1>
        <div className="header-actions">
          <button className="btn-create-campaign" onClick={() => setShowCreateModal(true)}>
            + Create Campaign
          </button>
          <button className="btn-join-campaign" onClick={() => setShowJoinModal(true)}>
            Join Campaign
          </button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="no-campaigns">
          <p>You haven't created or joined any campaigns yet.</p>
          <button onClick={() => setShowCreateModal(true)}>Create Your First Campaign</button>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map((campaign) => {
            const userId = getCurrentUserId();
            const userIsGM = isGM(campaign, userId);
            
            return (
              <div key={campaign._id} className="campaign-card">
                <div className="campaign-card-header">
                  <div>
                    <h2>{campaign.name}</h2>
                    <span className="campaign-role">
                      {userIsGM ? '👑 Game Master' : '🎭 Player'}
                    </span>
                  </div>
                  <div className="campaign-status">
                    <span className={`status-badge status-${campaign.status}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
                
                <div className="campaign-card-body">
                  {campaign.description && (
                    <p className="campaign-description">{campaign.description}</p>
                  )}
                  
                  <div className="campaign-info">
                    <div className="info-item">
                      <span className="label">GM:</span>
                      <span className="value">
                        {campaign.gameMaster?.username || 'Unknown'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Players:</span>
                      <span className="value">
                        {campaign.players?.length || 0} / {campaign.maxPlayers}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Starting Level:</span>
                      <span className="value">{campaign.startingLevel}</span>
                    </div>
                    {campaign.sessions && campaign.sessions.length > 0 && (
                      <div className="info-item">
                        <span className="label">Sessions:</span>
                        <span className="value">{campaign.sessions.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="campaign-card-footer">
                  <button 
                    className="btn-view" 
                    onClick={() => navigate(`/campaign/${campaign._id}`)}
                  >
                    View Details
                  </button>
                  {userIsGM && (
                    <button 
                      className="btn-delete-campaign" 
                      onClick={() => handleDeleteClick(campaign)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content campaign-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Campaign</h3>
            <form onSubmit={handleCreateCampaign}>
              <div className="form-group">
                <label>Campaign Name *</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  required
                  placeholder="Enter campaign name"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                  placeholder="Describe your campaign world and adventure..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Starting Level</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={campaignForm.startingLevel}
                    onChange={(e) => setCampaignForm({ ...campaignForm, startingLevel: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Max Players</label>
                  <input
                    type="number"
                    min="2"
                    max="20"
                    value={campaignForm.maxPlayers}
                    onChange={(e) => setCampaignForm({ ...campaignForm, maxPlayers: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>First Session Date (Optional)</label>
                <input
                  type="date"
                  value={campaignForm.sessionDate}
                  onChange={(e) => setCampaignForm({ ...campaignForm, sessionDate: e.target.value })}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={campaignForm.isPublic}
                    onChange={(e) => setCampaignForm({ ...campaignForm, isPublic: e.target.checked })}
                  />
                  <span>Make this campaign public</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowJoinModal(false)} disabled={isJoining}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm" disabled={isJoining}>
                  {isJoining ? 'Joining...' : 'Join Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Campaign Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Join Campaign</h3>
            <form onSubmit={handleJoinCampaign}>
              <div className="form-group">
                <label>Invite Code *</label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="Enter 8-character code"
                  maxLength="8"
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Character *</label>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  required
                >
                  <option value="">Choose a character...</option>
                  {characters.map((char) => (
                    <option key={char._id} value={char._id}>
                      {char.name} (Level {char.level} {char.class || 'No Class'})
                    </option>
                  ))}
                </select>
                {characters.length === 0 && (
                  <small className="help-text">
                    You need to create a character first.{' '}
                    <a href="/character-sheet">Create one now</a>
                  </small>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowJoinModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm" disabled={characters.length === 0}>
                  Join Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Campaign</h3>
            <p>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              <br />
              This will remove all players and session data. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteConfirm(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleDeleteConfirm} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;
