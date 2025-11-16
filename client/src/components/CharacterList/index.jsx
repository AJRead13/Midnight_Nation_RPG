import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCharacters, deleteCharacter } from '../../utils/characterService';
import './characterList.css';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCharacters();
      setCharacters(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading characters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCharacter = () => {
    navigate('/character-sheet');
  };

  const handleEditCharacter = (characterId) => {
    navigate(`/character-sheet/${characterId}`);
  };

  const handleDeleteClick = (character) => {
    setDeleteConfirm(character);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await deleteCharacter(deleteConfirm._id);
      setCharacters(characters.filter(c => c._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(`Failed to delete character: ${err.message}`);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="character-list-container">
        <div className="loading">Loading characters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="character-list-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={loadCharacters}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="character-list-container">
      <div className="character-list-header">
        <h1>My Characters</h1>
        <button className="btn-new-character" onClick={handleNewCharacter}>
          + Create New Character
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="no-characters">
          <p>You haven't created any characters yet.</p>
          <button onClick={handleNewCharacter}>Create Your First Character</button>
        </div>
      ) : (
        <div className="character-grid">
          {characters.map((character) => (
            <div key={character._id} className="character-card">
              <div className="character-card-header">
                <h2>{character.name}</h2>
                <div className="character-level">Level {character.level}</div>
              </div>
              
              <div className="character-card-body">
                <div className="character-info">
                  {character.class && (
                    <div className="info-row">
                      <span className="label">Class:</span>
                      <span className="value">{character.class}</span>
                    </div>
                  )}
                  {character.bloodline && (
                    <div className="info-row">
                      <span className="label">Bloodline:</span>
                      <span className="value">
                        {character.bloodline}
                        {character.bloodlineBranch && ` (${character.bloodlineBranch})`}
                      </span>
                    </div>
                  )}
                  {character.background && (
                    <div className="info-row">
                      <span className="label">Background:</span>
                      <span className="value">{character.background}</span>
                    </div>
                  )}
                  
                  <div className="character-attributes">
                    <div className="attribute">
                      <span className="attr-label">Mind</span>
                      <span className="attr-value">{character.attributes?.Mind || 40}</span>
                    </div>
                    <div className="attribute">
                      <span className="attr-label">Body</span>
                      <span className="attr-value">{character.attributes?.Body || 40}</span>
                    </div>
                    <div className="attribute">
                      <span className="attr-label">Soul</span>
                      <span className="attr-value">{character.attributes?.Soul || 40}</span>
                    </div>
                  </div>
                </div>

                <div className="character-meta">
                  <small>Last updated: {formatDate(character.updatedAt)}</small>
                </div>
              </div>

              <div className="character-card-footer">
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditCharacter(character._id)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteClick(character)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Character</h3>
            <p>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
              <br />
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleDeleteCancel}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterList;
