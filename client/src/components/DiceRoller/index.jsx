import React, { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useLocation } from 'react-router-dom';
import './diceRoller.css';

const DiceRoller = ({ isOpen, onClose }) => {
  const [rolls, setRolls] = useState([]);
  const [customFormula, setCustomFormula] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [advantageMode, setAdvantageMode] = useState(0); // -1: disadvantage, 0: normal, 1: advantage
  const [quickModifier, setQuickModifier] = useState(0); // Global modifier for quick rolls
  
  const { emitDiceRoll, connected } = useSocket();
  const location = useLocation();

  // Extract campaign ID from URL if on campaign detail page
  const getCampaignId = () => {
    const match = location.pathname.match(/\/campaigns\/([a-f0-9]+)/);
    return match ? match[1] : null;
  };

  const diceTypes = [
    { sides: 4, color: '#ef4444' },
    { sides: 6, color: '#f59e0b' },
    { sides: 8, color: '#eab308' },
    { sides: 10, color: '#22c55e' },
    { sides: 12, color: '#3b82f6' },
    { sides: 20, color: '#8b5cf6' },
    { sides: 100, color: '#ec4899' },
  ];

  const rollDice = (sides, count = 1, modifier = 0, useAdvantage = false) => {
    setIsRolling(true);
    
    setTimeout(() => {
      let results = [];
      let total = 0;
      let allRolls = [];
      let keptRolls = [];
      let droppedRolls = [];
      
      // If advantage/disadvantage is active and we're rolling, add an extra die
      const actualCount = useAdvantage && advantageMode !== 0 ? count + 1 : count;
      
      for (let i = 0; i < actualCount; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        allRolls.push(roll);
      }
      
      // Apply advantage/disadvantage logic
      if (useAdvantage && advantageMode !== 0) {
        const sorted = [...allRolls].sort((a, b) => b - a);
        if (advantageMode === 1) {
          // Advantage: keep highest dice
          keptRolls = sorted.slice(0, count);
          droppedRolls = sorted.slice(count);
        } else {
          // Disadvantage: keep lowest dice
          keptRolls = sorted.slice(-count).sort((a, b) => b - a);
          droppedRolls = sorted.slice(0, actualCount - count);
        }
        results = keptRolls;
        total = keptRolls.reduce((sum, val) => sum + val, 0);
      } else {
        results = allRolls;
        total = allRolls.reduce((sum, val) => sum + val, 0);
      }
      
      total += modifier;
      
      const formulaText = useAdvantage && advantageMode !== 0
        ? `${actualCount}d${sides} ${advantageMode === 1 ? 'keep highest' : 'keep lowest'} ${count}${modifier > 0 ? '+' + modifier : modifier < 0 ? modifier : ''}`
        : `${count}d${sides}${modifier > 0 ? '+' + modifier : modifier < 0 ? modifier : ''}`;
      
      const newRoll = {
        id: Date.now(),
        formula: formulaText,
        results,
        rolls: allRolls.map((result, index) => ({ 
          result, 
          dropped: useAdvantage && advantageMode !== 0 && droppedRolls.includes(result) && index < droppedRolls.length 
        })),
        droppedRolls: useAdvantage && advantageMode !== 0 ? droppedRolls : [],
        modifier,
        total,
        timestamp: new Date().toISOString(),
        hasAdvantage: useAdvantage && advantageMode !== 0,
        username: localStorage.getItem('username') || 'Anonymous',
        characterName: localStorage.getItem('characterName') || null,
      };
      
      setRolls(prev => [newRoll, ...prev.slice(0, 9)]); // Keep last 10 rolls
      
      // Emit to Socket.io if in a campaign
      const campaignId = getCampaignId();
      if (campaignId && connected) {
        emitDiceRoll(campaignId, newRoll);
      }
      
      setIsRolling(false);
    }, 300);
  };

  const handleQuickRoll = (sides) => {
    rollDice(sides, 1, quickModifier, true);
  };

  const parseFormula = (formula) => {
    // Parse formulas like "2d6+3", "1d20-2", "3d8"
    const match = formula.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
    if (!match) return null;
    
    const count = parseInt(match[1] || '1');
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || '0');
    
    return { count, sides, modifier };
  };

  const handleCustomRoll = (e) => {
    e.preventDefault();
    const parsed = parseFormula(customFormula);
    
    if (parsed) {
      rollDice(parsed.sides, parsed.count, parsed.modifier, true);
      setCustomFormula('');
    }
  };

  const clearHistory = () => {
    setRolls([]);
  };

  if (!isOpen) return null;

  return (
    <div className="dice-roller-overlay" onClick={onClose}>
      <div className="dice-roller-container" onClick={(e) => e.stopPropagation()}>
        <div className="dice-roller-header">
          <h2>🎲 Dice Roller</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="dice-roller-content">
          {/* Advantage/Disadvantage Controls */}
          <div className="advantage-section">
            <h3>Roll Modifiers</h3>
            <div className="modifier-row">
              <div className="modifier-input-group">
                <label htmlFor="quick-modifier">Add to Roll:</label>
                <input
                  id="quick-modifier"
                  type="number"
                  value={quickModifier}
                  onChange={(e) => setQuickModifier(parseInt(e.target.value) || 0)}
                  className="modifier-input"
                  placeholder="0"
                  disabled={isRolling}
                />
                <button
                  className="btn-reset-modifier"
                  onClick={() => setQuickModifier(0)}
                  disabled={isRolling || quickModifier === 0}
                  title="Reset modifier"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="advantage-controls">
              <button
                className={`advantage-btn ${advantageMode === -1 ? 'active disadvantage' : ''}`}
                onClick={() => setAdvantageMode(advantageMode === -1 ? 0 : -1)}
                disabled={isRolling}
              >
                -1 Dice (Keep Lowest)
              </button>
              <button
                className={`advantage-btn normal ${advantageMode === 0 ? 'active' : ''}`}
                onClick={() => setAdvantageMode(0)}
                disabled={isRolling}
              >
                Normal
              </button>
              <button
                className={`advantage-btn ${advantageMode === 1 ? 'active advantage' : ''}`}
                onClick={() => setAdvantageMode(advantageMode === 1 ? 0 : 1)}
                disabled={isRolling}
              >
                +1 Dice (Keep Highest)
              </button>
            </div>
            <div className="modifier-status">
              {advantageMode === 1 && <span className="status-advantage">✓ Advantage: +1 die, keeping highest</span>}
              {advantageMode === -1 && <span className="status-disadvantage">✓ Disadvantage: +1 die, keeping lowest</span>}
              {advantageMode === 0 && <span className="status-normal">Standard rolls</span>}
              {quickModifier !== 0 && (
                <span className={`status-modifier ${quickModifier > 0 ? 'positive' : 'negative'}`}>
                  {quickModifier > 0 ? '+' : ''}{quickModifier} to all quick rolls
                </span>
              )}
            </div>
          </div>

          {/* Quick Roll Buttons */}
          <div className="quick-roll-section">
            <h3>Quick Roll</h3>
            <div className="dice-buttons">
              {diceTypes.map(({ sides, color }) => (
                <button
                  key={sides}
                  className="dice-button"
                  style={{ 
                    background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                    boxShadow: isRolling ? 'none' : `0 4px 12px ${color}44`
                  }}
                  onClick={() => handleQuickRoll(sides)}
                  disabled={isRolling}
                >
                  d{sides}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Formula */}
          <div className="custom-roll-section">
            <h3>Custom Roll</h3>
            <form onSubmit={handleCustomRoll} className="custom-form">
              <input
                type="text"
                value={customFormula}
                onChange={(e) => setCustomFormula(e.target.value)}
                placeholder="e.g. 2d6+3, 1d20, 3d8-2"
                className="formula-input"
                disabled={isRolling}
              />
              <button type="submit" className="roll-btn" disabled={isRolling}>
                Roll
              </button>
            </form>
            <p className="formula-help">
              Format: [count]d[sides][+/-modifier] (e.g., 2d6+3)
            </p>
          </div>

          {/* Roll History */}
          <div className="roll-history-section">
            <div className="history-header">
              <h3>Roll History</h3>
              {rolls.length > 0 && (
                <button className="clear-history-btn" onClick={clearHistory}>
                  Clear
                </button>
              )}
            </div>
            <div className="roll-history">
              {rolls.length === 0 ? (
                <p className="no-rolls">No rolls yet. Roll some dice!</p>
              ) : (
                rolls.map((roll) => (
                  <div key={roll.id} className="roll-item">
                    <div className="roll-formula">{roll.formula}</div>
                    <div className="roll-details">
                      <span className="roll-results">
                        [{roll.results.join(', ')}]
                        {roll.droppedRolls && roll.droppedRolls.length > 0 && (
                          <span className="dropped-results">
                            {' '}dropped: [{roll.droppedRolls.join(', ')}]
                          </span>
                        )}
                        {roll.modifier !== 0 && (
                          <span className="roll-modifier">
                            {roll.modifier > 0 ? ' +' : ' '}{roll.modifier}
                          </span>
                        )}
                      </span>
                      <span className="roll-total">= {roll.total}</span>
                    </div>
                    <span className="roll-time">{roll.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
