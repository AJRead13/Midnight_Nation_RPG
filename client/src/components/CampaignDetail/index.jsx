import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCampaignById, updateCampaign, leaveCampaign, addSession, removePlayer } from '../../utils/campaignService';
import { fetchCharacters } from '../../utils/characterService';
import './campaignDetail.css';

function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isGM, setIsGM] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCharacters, setUserCharacters] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [removingPlayerId, setRemovingPlayerId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: 'planning',
    worldInfo: '',
    rules: ''
  });
  const [sessionForm, setSessionForm] = useState({
    date: '',
    duration: 180,
    summary: '',
    notes: ''
  });

  useEffect(() => {
    loadCampaignDetails();
  }, [id]);

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchCampaignById(id);
      setCampaign(data.campaign);
      setIsGM(data.isGM);
      
      // Populate edit form
      setEditForm({
        name: data.campaign.name,
        description: data.campaign.description || '',
        status: data.campaign.status || 'planning',
        worldInfo: data.campaign.worldInfo || '',
        rules: data.campaign.rules || ''
      });
      
      // Fetch user characters
      const chars = await fetchCharacters();
      setUserCharacters(chars);
    } catch (err) {
      setError(err.message);
      console.error('Error loading campaign:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await updateCampaign(id, editForm);
      setCampaign(updated);
      setShowEditModal(false);
      alert('Campaign updated successfully!');
    } catch (err) {
      alert(`Failed to update campaign: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    setIsAddingSession(true);
    try {
      const updated = await addSession(id, sessionForm);
      setCampaign(updated);
      setShowAddSessionModal(false);
      setSessionForm({ date: '', duration: 180, summary: '', notes: '' });
      alert('Session added successfully!');
    } catch (err) {
      alert(`Failed to add session: ${err.message}`);
    } finally {
      setIsAddingSession(false);
    }
  };

  const handleLeaveCampaign = async () => {
    if (!confirm('Are you sure you want to leave this campaign?')) return;
    
    setIsLeaving(true);
    try {
      await leaveCampaign(id);
      navigate('/campaigns');
    } catch (err) {
      alert(`Failed to leave campaign: ${err.message}`);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleRemovePlayer = async (userId) => {
    if (!confirm('Are you sure you want to remove this player?')) return;
    
    setRemovingPlayerId(userId);
    try {
      const updated = await removePlayer(id, userId);
      setCampaign(updated);
      alert('Player removed successfully!');
    } catch (err) {
      alert(`Failed to remove player: ${err.message}`);
    } finally {
      setRemovingPlayerId(null);
    }
  };
      alert('Player removed successfully!');
    } catch (err) {
      alert(`Failed to remove player: ${err.message}`);
    }
  };

  const copyInviteCode = () => {
    if (campaign?.inviteCode) {
      navigator.clipboard.writeText(campaign.inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)._id : null;
  };

  const getUserCharacter = () => {
    const userId = getCurrentUserId();
    const player = campaign?.players?.find(p => p.user?._id === userId);
    return player?.character;
  };

  if (loading) {
    return (
      <div className="campaign-detail-container">
        <div className="loading">Loading campaign...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaign-detail-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/campaigns')}>Back to Campaigns</button>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="campaign-detail-container">
        <p>Campaign not found</p>
      </div>
    );
  }

  const userCharacter = getUserCharacter();

  return (
    <div className="campaign-detail-container">
      {/* Header */}
      <div className="campaign-detail-header">
        <button onClick={() => navigate('/campaigns')} className="btn-back">
          ← Back to Campaigns
        </button>
        <div className="header-content">
          <div>
            <h1>{campaign.name}</h1>
            <span className={`role-badge ${isGM ? 'gm' : 'player'}`}>
              {isGM ? '👑 Game Master' : '🎭 Player'}
            </span>
          </div>
          <div className="header-actions">
            {isGM && (
              <>
                <button className="btn-edit" onClick={() => setShowEditModal(true)}>
                  Edit Campaign
                </button>
                <button className="btn-invite" onClick={() => setShowInviteModal(true)}>
                  Share Invite
                </button>
                <button className="btn-add-session" onClick={() => setShowAddSessionModal(true)}>
                  + Add Session
                </button>
              </>
            )}
            {!isGM && (
              <button className="btn-leave" onClick={handleLeaveCampaign} disabled={isLeaving}>
                {isLeaving ? 'Leaving...' : 'Leave Campaign'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="campaign-content-grid">
        {/* Left Column - Info Cards */}
        <div className="left-column">
          {/* Campaign Info Card */}
          <div className="info-card">
            <h3>Campaign Info</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Status</span>
                <span className={`value status-badge status-${campaign.status}`}>
                  {campaign.status}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Starting Level</span>
                <span className="value">{campaign.startingLevel}</span>
              </div>
              <div className="info-item">
                <span className="label">Players</span>
                <span className="value">
                  {campaign.players?.length || 0} / {campaign.maxPlayers}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Sessions</span>
                <span className="value">{campaign.sessions?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          {campaign.description && (
            <div className="info-card">
              <h3>Description</h3>
              <p className="card-text">{campaign.description}</p>
            </div>
          )}

          {/* World Info Card */}
          {campaign.worldInfo && (
            <div className="info-card">
              <h3>World Information</h3>
              <p className="card-text">{campaign.worldInfo}</p>
            </div>
          )}

          {/* House Rules Card */}
          {campaign.rules && (
            <div className="info-card">
              <h3>House Rules</h3>
              <p className="card-text">{campaign.rules}</p>
            </div>
          )}

          {/* Your Character Card (for players) */}
          {!isGM && userCharacter && (
            <div className="info-card character-card">
              <h3>Your Character</h3>
              <div className="character-info">
                <h4>{userCharacter.name}</h4>
                <div className="character-details">
                  <span>Level {userCharacter.level}</span>
                  {userCharacter.class && <span> • {userCharacter.class}</span>}
                  {userCharacter.bloodline && <span> • {userCharacter.bloodline}</span>}
                </div>
                <button 
                  className="btn-view-character"
                  onClick={() => navigate(`/character-sheet/${userCharacter._id}`)}
                >
                  View Character Sheet
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Players & Sessions */}
        <div className="right-column">
          {/* Game Master Card */}
          <div className="participants-section">
            <h3>Game Master</h3>
            <div className="gm-card">
              <span className="gm-icon">👑</span>
              <span className="gm-name">{campaign.gameMaster?.username || 'Unknown'}</span>
            </div>
          </div>

          {/* Players Section */}
          <div className="participants-section">
            <div className="section-title">
              <h3>Players ({campaign.players?.length || 0})</h3>
            </div>
            
            {campaign.players?.length === 0 ? (
              <p className="no-content">No players have joined yet.</p>
            ) : (
              <div className="players-list">
                {campaign.players.map((player) => (
                  <div key={player.user?._id} className="player-card-detail">
                    <div className="player-main">
                      <div className="player-info-detail">
                        <span className="player-name">{player.user?.username || 'Unknown'}</span>
                        {player.character ? (
                          <span className="character-name">
                            {player.character.name} • Lvl {player.character.level}
                          </span>
                        ) : (
                          <span className="no-character">No character assigned</span>
                        )}
                      </div>
                      {isGM && (
                        <button 
                          className="btn-remove-player"
                          onClick={() => handleRemovePlayer(player.user._id)}
                          disabled={removingPlayerId === player.user._id}
                          title="Remove player"
                        >
                          {removingPlayerId === player.user._id ? '...' : '×'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sessions Section */}
          <div className="sessions-section">
            <div className="section-title">
              <h3>Sessions ({campaign.sessions?.length || 0})</h3>
            </div>
            
            {campaign.sessions?.length === 0 ? (
              <p className="no-content">No sessions scheduled yet.</p>
            ) : (
              <div className="sessions-list">
                {[...campaign.sessions].reverse().map((session, index) => (
                  <div key={index} className="session-card-detail">
                    <div className="session-header">
                      <span className="session-date">
                        {formatDate(session.date)}
                      </span>
                      {session.duration && (
                        <span className="session-duration">
                          {session.duration} min
                        </span>
                      )}
                    </div>
                    {session.summary && (
                      <p className="session-summary">{session.summary}</p>
                    )}
                    {session.notes && (
                      <p className="session-notes">{session.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Campaign Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Campaign</h3>
            <form onSubmit={handleUpdateCampaign}>
              <div className="form-group">
                <label>Campaign Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>World Information</label>
                <textarea
                  value={editForm.worldInfo}
                  onChange={(e) => setEditForm({ ...editForm, worldInfo: e.target.value })}
                  rows="4"
                  placeholder="Describe your campaign world..."
                />
              </div>
              <div className="form-group">
                <label>House Rules</label>
                <textarea
                  value={editForm.rules}
                  onChange={(e) => setEditForm({ ...editForm, rules: e.target.value })}
                  rows="4"
                  placeholder="Any special rules for this campaign..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)} disabled={isUpdating}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showAddSessionModal && (
        <div className="modal-overlay" onClick={() => setShowAddSessionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Session</h3>
            <form onSubmit={handleAddSession}>
              <div className="form-group">
                <label>Session Date & Time</label>
                <input
                  type="datetime-local"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={sessionForm.duration}
                  onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) })}
                  min="30"
                  step="30"
                />
              </div>
              <div className="form-group">
                <label>Summary</label>
                <input
                  type="text"
                  value={sessionForm.summary}
                  onChange={(e) => setSessionForm({ ...sessionForm, summary: e.target.value })}
                  placeholder="What's planned for this session?"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                  rows="3"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddSessionModal(false)} disabled={isAddingSession}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm" disabled={isAddingSession}>
                  {isAddingSession ? 'Adding...' : 'Add Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Code Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content invite-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Campaign Invite Code</h3>
            <p>Share this code with players to join your campaign:</p>
            <div className="invite-code-display">
              <code className="invite-code-large">{campaign.inviteCode}</code>
              <button 
                className={`btn-copy ${copiedCode ? 'copied' : ''}`}
                onClick={copyInviteCode}
              >
                {copiedCode ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
            <p className="invite-instructions">
              Players can join by going to the Campaigns page and clicking "Join Campaign"
            </p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={() => setShowInviteModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignDetail;
