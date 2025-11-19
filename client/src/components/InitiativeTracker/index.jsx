import { useState, useEffect } from 'react';
import { useSocketContext } from '../../contexts/SocketContext';
import { useToast } from '../Toast';
import { fetchCharacters } from '../../utils/characterService';
import './initiativeTracker.css';

const InitiativeTracker = ({ campaignId, isGM }) => {
  const [combatants, setCombatants] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const { socket, connected } = useSocket();
  
  const [newCombatant, setNewCombatant] = useState({
    name: '',
    initiative: '',
    hp: '',
    maxHp: '',
    ac: '',
    type: 'pc' // pc, npc, monster
  });

  useEffect(() => {
    if (!socket || !campaignId) return;

    // Listen for initiative updates from server
    const handleInitiativeUpdate = (data) => {
      setCombatants(data.combatants);
      setCurrentTurn(data.currentTurn);
      setIsActive(data.isActive);
    };

    socket.on('initiative-update', handleInitiativeUpdate);

    // Request current initiative state
    socket.emit('request-initiative', campaignId);

    return () => {
      socket.off('initiative-update', handleInitiativeUpdate);
    };
  }, [socket, campaignId]);

  const rollInitiative = (modifier = 0) => {
    return Math.floor(Math.random() * 20) + 1 + modifier;
  };

  const addCombatant = () => {
    if (!newCombatant.name) {
      toast.warning('Please enter a name');
      return;
    }

    const initiative = newCombatant.initiative 
      ? parseInt(newCombatant.initiative) 
      : rollInitiative();

    const combatant = {
      id: Date.now(),
      name: newCombatant.name,
      initiative,
      hp: newCombatant.hp ? parseInt(newCombatant.hp) : null,
      maxHp: newCombatant.maxHp ? parseInt(newCombatant.maxHp) : null,
      ac: newCombatant.ac ? parseInt(newCombatant.ac) : null,
      type: newCombatant.type,
      conditions: []
    };

    const updated = [...combatants, combatant].sort((a, b) => b.initiative - a.initiative);
    updateInitiative(updated, currentTurn, isActive);

    setNewCombatant({
      name: '',
      initiative: '',
      hp: '',
      maxHp: '',
      ac: '',
      type: 'pc'
    });
    setShowAddModal(false);
  };

  const loadCharacters = async () => {
    setLoadingCharacters(true);
    try {
      const chars = await fetchCharacters();
      setAvailableCharacters(chars);
      setShowImportModal(true);
    } catch (err) {
      toast.error('Failed to load characters: ' + err.message);
    } finally {
      setLoadingCharacters(false);
    }
  };

  const importCharacter = (character) => {
    // Check if character is already in initiative
    if (combatants.some(c => c.characterId === character._id)) {
      toast.warning(`${character.name} is already in initiative`);
      return;
    }

    const combatant = {
      id: Date.now(),
      characterId: character._id,
      name: character.name,
      initiative: rollInitiative(),
      // Use Body attribute as a proxy for HP (Midnight Nation doesn't use traditional HP)
      hp: character.attributes?.Body || null,
      maxHp: character.attributes?.Body || null,
      // Store all attributes for display
      attributes: character.attributes,
      ac: null, // Midnight Nation doesn't use AC
      type: 'pc',
      conditions: []
    };

    const updated = [...combatants, combatant].sort((a, b) => b.initiative - a.initiative);
    updateInitiative(updated, currentTurn, isActive);
    
    setShowImportModal(false);
  };

  const removeCombatant = (id) => {
    const updated = combatants.filter(c => c.id !== id);
    const newTurn = currentTurn >= updated.length ? 0 : currentTurn;
    updateInitiative(updated, newTurn, updated.length > 0 ? isActive : false);
  };

  const rollAllInitiative = () => {
    const updated = combatants.map(c => ({
      ...c,
      initiative: rollInitiative()
    })).sort((a, b) => b.initiative - a.initiative);
    
    updateInitiative(updated, 0, true);
  };

  const nextTurn = () => {
    const newTurn = (currentTurn + 1) % combatants.length;
    updateInitiative(combatants, newTurn, true);
  };

  const previousTurn = () => {
    const newTurn = currentTurn === 0 ? combatants.length - 1 : currentTurn - 1;
    updateInitiative(combatants, newTurn, true);
  };

  const handleStartCombat = () => {
    if (combatants.length === 0) {
      toast.warning('Add combatants first');
      return;
    }
    updateInitiative(combatants, 0, true);
  };

  const endCombat = () => {
    updateInitiative(combatants, 0, false);
  };

  const resetCombat = () => {
    if (confirm('Clear all combatants and reset initiative?')) {
      updateInitiative([], 0, false);
    }
  };

  const updateHP = (id, newHp) => {
    const updated = combatants.map(c => 
      c.id === id ? { ...c, hp: Math.max(0, parseInt(newHp) || 0) } : c
    );
    updateInitiative(updated, currentTurn, isActive);
  };

  const addCondition = (id, condition) => {
    if (!condition) return;
    const updated = combatants.map(c => 
      c.id === id ? { ...c, conditions: [...c.conditions, condition] } : c
    );
    updateInitiative(updated, currentTurn, isActive);
  };

  const removeCondition = (id, condition) => {
    const updated = combatants.map(c => 
      c.id === id ? { ...c, conditions: c.conditions.filter(cond => cond !== condition) } : c
    );
    updateInitiative(updated, currentTurn, isActive);
  };

  const updateInitiative = (newCombatants, newTurn, active) => {
    setCombatants(newCombatants);
    setCurrentTurn(newTurn);
    setIsActive(active);

    // Emit to other players via Socket.io
    if (socket && campaignId && isGM) {
      socket.emit('update-initiative', {
        campaignId,
        combatants: newCombatants,
        currentTurn: newTurn,
        isActive: active
      });
    }
  };

  // Keyboard shortcut for next turn (Space)
  useEffect(() => {
    if (!isGM || !isActive) return;

    const handleKeyPress = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        nextTurn();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGM, isActive, currentTurn, combatants]);

  if (!campaignId) return null;

  return (
    <div className={`initiative-tracker ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="initiative-header">
        <div className="initiative-title">
          <h3>⚔️ Initiative Tracker</h3>
          {isActive && (
            <span className="combat-status active">Combat Active</span>
          )}
        </div>
        <div className="initiative-header-actions">
          {connected && <span className="connection-status">🟢</span>}
          <button 
            className="btn-collapse"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="initiative-content">
          {/* GM Controls */}
          {isGM && (
            <div className="initiative-controls">
              <button 
                className="btn-add"
                onClick={() => setShowAddModal(true)}
              >
                + Add Combatant
              </button>
              <button 
                className="btn-import"
                onClick={loadCharacters}
                disabled={loadingCharacters}
              >
                {loadingCharacters ? 'Loading...' : '📋 Import Character'}
              </button>
              <button 
                className="btn-roll"
                onClick={rollAllInitiative}
                disabled={combatants.length === 0}
              >
                🎲 Roll All
              </button>
              {!isActive ? (
                <button 
                  className="btn-start"
                  onClick={startCombat}
                  disabled={combatants.length === 0}
                >
                  ▶️ Start Combat
                </button>
              ) : (
                <>
                  <button className="btn-next" onClick={nextTurn}>
                    ⏭️ Next Turn
                  </button>
                  <button className="btn-end" onClick={endCombat}>
                    ⏹️ End Combat
                  </button>
                </>
              )}
              <button className="btn-reset" onClick={resetCombat}>
                🔄 Reset
              </button>
            </div>
          )}

          {/* Combatants List */}
          <div className="combatants-list">
            {combatants.length === 0 ? (
              <div className="no-combatants">
                {isGM 
                  ? 'No combatants. Add participants to start combat.' 
                  : 'No active combat.'}
              </div>
            ) : (
              combatants.map((combatant, index) => (
                <div 
                  key={combatant.id}
                  className={`combatant ${index === currentTurn && isActive ? 'current-turn' : ''} ${combatant.type}`}
                >
                  <div className="combatant-header">
                    <div className="combatant-info">
                      <span className="combatant-initiative">{combatant.initiative}</span>
                      <span className="combatant-name">{combatant.name}</span>
                      <span className={`combatant-type ${combatant.type}`}>
                        {combatant.type === 'pc' ? '🎭' : combatant.type === 'npc' ? '👤' : '👹'}
                      </span>
                    </div>
                    {isGM && (
                      <button 
                        className="btn-remove"
                        onClick={() => removeCombatant(combatant.id)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="combatant-stats">
                    {combatant.attributes ? (
                      // Midnight Nation RPG attributes
                      <div className="midnight-attributes">
                        <div className="stat-group">
                          <label title="Mind">🧠:</label>
                          <span>{combatant.attributes.Mind}</span>
                        </div>
                        <div className="stat-group">
                          <label title="Body">💪:</label>
                          {isGM ? (
                            <input 
                              type="number"
                              value={combatant.hp || combatant.attributes.Body}
                              onChange={(e) => updateHP(combatant.id, e.target.value)}
                              className="hp-input"
                              title="Body attribute (used as HP)"
                            />
                          ) : (
                            <span>{combatant.hp || combatant.attributes.Body}</span>
                          )}
                          {combatant.maxHp && <span>/ {combatant.maxHp}</span>}
                        </div>
                        <div className="stat-group">
                          <label title="Soul">✨:</label>
                          <span>{combatant.attributes.Soul}</span>
                        </div>
                      </div>
                    ) : (
                      // Standard HP/AC display
                      <>
                        {combatant.hp !== null && (
                          <div className="stat-group">
                            <label>HP:</label>
                            {isGM ? (
                              <input 
                                type="number"
                                value={combatant.hp}
                                onChange={(e) => updateHP(combatant.id, e.target.value)}
                                className="hp-input"
                              />
                            ) : (
                              <span>{combatant.hp}</span>
                            )}
                            {combatant.maxHp && <span>/ {combatant.maxHp}</span>}
                          </div>
                        )}
                        {combatant.ac !== null && (
                          <div className="stat-group">
                            <label>AC:</label>
                            <span>{combatant.ac}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {combatant.conditions && combatant.conditions.length > 0 && (
                    <div className="combatant-conditions">
                      {combatant.conditions.map((condition, i) => (
                        <span key={i} className="condition-badge">
                          {condition}
                          {isGM && (
                            <button 
                              onClick={() => removeCondition(combatant.id, condition)}
                              className="remove-condition"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {isActive && combatants.length > 0 && (
            <div className="round-info">
              Turn: {currentTurn + 1} / {combatants.length}
              {isGM && <span className="keyboard-hint"> (Press Space for next turn)</span>}
            </div>
          )}
        </div>
      )}

      {/* Add Combatant Modal */}
      {showAddModal && isGM && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Combatant</h3>
            <div className="form-group">
              <label>Name *</label>
              <input 
                type="text"
                value={newCombatant.name}
                onChange={(e) => setNewCombatant({...newCombatant, name: e.target.value})}
                placeholder="Combatant name"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select 
                value={newCombatant.type}
                onChange={(e) => setNewCombatant({...newCombatant, type: e.target.value})}
              >
                <option value="pc">Player Character</option>
                <option value="npc">NPC</option>
                <option value="monster">Monster</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Initiative (leave blank to roll)</label>
                <input 
                  type="number"
                  value={newCombatant.initiative}
                  onChange={(e) => setNewCombatant({...newCombatant, initiative: e.target.value})}
                  placeholder="Auto-roll"
                />
              </div>
              <div className="form-group">
                <label>AC</label>
                <input 
                  type="number"
                  value={newCombatant.ac}
                  onChange={(e) => setNewCombatant({...newCombatant, ac: e.target.value})}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Current HP</label>
                <input 
                  type="number"
                  value={newCombatant.hp}
                  onChange={(e) => setNewCombatant({...newCombatant, hp: e.target.value})}
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label>Max HP</label>
                <input 
                  type="number"
                  value={newCombatant.maxHp}
                  onChange={(e) => setNewCombatant({...newCombatant, maxHp: e.target.value})}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={addCombatant}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Character Modal */}
      {showImportModal && isGM && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Import Character</h3>
            <p className="modal-description">Select a character to add to initiative. Their stats will be automatically imported.</p>
            
            {availableCharacters.length === 0 ? (
              <div className="no-characters">
                <p>No characters found. Create a character first.</p>
              </div>
            ) : (
              <div className="character-list">
                {availableCharacters.map((character) => (
                  <div 
                    key={character._id} 
                    className={`character-item ${combatants.some(c => c.characterId === character._id) ? 'already-added' : ''}`}
                  >
                    <div className="character-info">
                      <h4>{character.name}</h4>
                      <div className="character-stats">
                        {character.class && <span className="char-class">🎭 {character.class}</span>}
                        {character.level && <span className="char-level">Lvl {character.level}</span>}
                        {character.attributes && (
                          <div className="char-attributes">
                            <span title="Mind">🧠 {character.attributes.Mind}</span>
                            <span title="Body">💪 {character.attributes.Body}</span>
                            <span title="Soul">✨ {character.attributes.Soul}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      className="btn-import-char"
                      onClick={() => importCharacter(character)}
                      disabled={combatants.some(c => c.characterId === character._id)}
                    >
                      {combatants.some(c => c.characterId === character._id) ? 'Already Added' : 'Import'}
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowImportModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitiativeTracker;
