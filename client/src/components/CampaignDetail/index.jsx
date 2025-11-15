import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isGM, setIsGM] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userCharacters, setUserCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [showAssignCharacter, setShowAssignCharacter] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/campaigns/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch campaign');
      }

      setCampaign(data.campaign);
      setIsGM(data.isGM);
      setLoading(false);

      // Fetch user's characters if they're a player
      if (!data.isGM) {
        fetchUserCharacters();
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchUserCharacters = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3001/api/characters', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserCharacters(Array.isArray(data.characters) ? data.characters : []);
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const handleAssignCharacter = async () => {
    if (!selectedCharacter) {
      alert('Please select a character');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3001/api/campaigns/${id}/assign-character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ characterId: selectedCharacter })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign character');
      }

      alert('Character assigned successfully!');
      setShowAssignCharacter(false);
      fetchCampaignDetails();
    } catch (error) {
      alert(error.message);
    }
  };

  const getPlayerCharacter = (player) => {
    const currentUserPlayer = campaign?.players?.find(
      p => p.user?._id === currentUser?._id
    );
    return currentUserPlayer?.character;
  };

  if (loading) {
    return <div className="campaign-detail-container"><p>Loading campaign...</p></div>;
  }

  if (error) {
    return (
      <div className="campaign-detail-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/')} className="btn-back">Back to Home</button>
      </div>
    );
  }

  if (!campaign) {
    return <div className="campaign-detail-container"><p>Campaign not found</p></div>;
  }

  const currentUserPlayer = campaign.players?.find(
    p => p.user?._id === currentUser?._id
  );
  const hasAssignedCharacter = currentUserPlayer?.character;

  return (
    <div className="campaign-detail-container">
      <div className="campaign-header">
        <button onClick={() => navigate('/')} className="btn-back">← Back</button>
        <h1>{campaign.name}</h1>
        <span className={`role-badge ${isGM ? 'gm' : 'player'}`}>
          {isGM ? 'Game Master' : 'Player'}
        </span>
      </div>

      <div className="campaign-info-grid">
        <div className="info-card">
          <h3>Campaign Details</h3>
          <div className="info-row">
            <span className="label">Starting Level:</span>
            <span className="value">{campaign.startingLevel || 1}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className="value status">{campaign.status || 'planning'}</span>
          </div>
          <div className="info-row">
            <span className="label">Players:</span>
            <span className="value">{campaign.players?.length || 0} / {campaign.maxPlayers || 6}</span>
          </div>
          {isGM && (
            <div className="info-row">
              <span className="label">Invite Code:</span>
              <span className="value invite-code">{campaign.inviteCode}</span>
            </div>
          )}
        </div>

        {campaign.description && (
          <div className="info-card description-card">
            <h3>Description</h3>
            <p>{campaign.description}</p>
          </div>
        )}
      </div>

      <div className="participants-section">
        <div className="section-header">
          <h2>Game Master</h2>
        </div>
        <div className="gm-card">
          <span className="gm-name">{campaign.gameMaster?.username || 'Unknown'}</span>
        </div>
      </div>

      <div className="participants-section">
        <div className="section-header">
          <h2>Players</h2>
          {!isGM && !hasAssignedCharacter && (
            <button 
              onClick={() => setShowAssignCharacter(true)} 
              className="btn-assign-character"
            >
              Assign Character
            </button>
          )}
        </div>
        
        {campaign.players?.length === 0 ? (
          <p className="no-players">No players have joined yet.</p>
        ) : (
          <div className="players-grid">
            {campaign.players.map((player, index) => (
              <div key={index} className="player-card">
                <div className="player-info">
                  <span className="player-name">{player.user?.username || 'Unknown Player'}</span>
                  {player.character ? (
                    <span className="character-name">
                      {player.character.name} (Level {player.character.level || 1})
                    </span>
                  ) : (
                    <span className="no-character">No character assigned</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {campaign.sessions?.length > 0 && (
        <div className="sessions-section">
          <h2>Scheduled Sessions</h2>
          <div className="sessions-list">
            {campaign.sessions.map((session, index) => (
              <div key={index} className="session-card">
                <span className="session-date">
                  {new Date(session.date).toLocaleString()}
                </span>
                {session.summary && <p className="session-summary">{session.summary}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Character Modal */}
      {showAssignCharacter && (
        <div className="modal-overlay" onClick={() => setShowAssignCharacter(false)}>
          <div className="modal-content assign-character-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAssignCharacter(false)}>×</button>
            <h3>Assign Character to Campaign</h3>
            
            <div className="assign-character-form">
              {userCharacters.length === 0 ? (
                <p>You don't have any characters yet. Create one first!</p>
              ) : (
                <>
                  <label htmlFor="characterSelect">Select a character:</label>
                  <select
                    id="characterSelect"
                    value={selectedCharacter}
                    onChange={(e) => setSelectedCharacter(e.target.value)}
                    className="character-select"
                  >
                    <option value="">-- Choose Character --</option>
                    {userCharacters
                      .filter(char => !char.campaign) // Only show characters not in a campaign
                      .map((character) => (
                        <option key={character._id} value={character._id}>
                          {character.name} (Level {character.level || 1}) - {character.class || 'No Class'}
                        </option>
                      ))}
                  </select>
                  
                  <button onClick={handleAssignCharacter} className="btn-submit">
                    Assign Character
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignDetail;
