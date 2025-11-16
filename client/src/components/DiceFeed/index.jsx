import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import './diceFeed.css';

const DiceFeed = ({ campaignId }) => {
  const [rolls, setRolls] = useState([]);
  const { socket, joinCampaign, leaveCampaign } = useSocket();
  const feedRef = useRef(null);

  useEffect(() => {
    if (!campaignId || !socket) return;

    // Join the campaign room
    joinCampaign(campaignId);

    // Listen for dice rolls
    const handleDiceRoll = (roll) => {
      setRolls((prevRolls) => {
        const newRolls = [roll, ...prevRolls];
        // Keep only the last 50 rolls
        return newRolls.slice(0, 50);
      });
    };

    socket.on('dice-roll', handleDiceRoll);

    // Cleanup
    return () => {
      socket.off('dice-roll', handleDiceRoll);
      leaveCampaign(campaignId);
    };
  }, [campaignId, socket, joinCampaign, leaveCampaign]);

  // Auto-scroll to top when new roll arrives
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [rolls]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (!campaignId) {
    return null;
  }

  return (
    <div className="dice-feed">
      <div className="dice-feed-header">
        <h3>Live Dice Feed</h3>
        <span className="roll-count">{rolls.length} rolls</span>
      </div>
      
      <div className="dice-feed-list" ref={feedRef}>
        {rolls.length === 0 ? (
          <div className="no-rolls">No dice rolls yet. Roll some dice to see them here!</div>
        ) : (
          rolls.map((roll, index) => (
            <div key={`${roll.timestamp}-${index}`} className="dice-feed-item">
              <div className="dice-feed-header-row">
                <span className="roller-name">{roll.characterName || roll.username || 'Anonymous'}</span>
                <span className="roll-timestamp">{formatTimestamp(roll.timestamp)}</span>
              </div>
              <div className="dice-feed-formula">{roll.formula}</div>
              <div className="dice-feed-results">
                {roll.rolls && roll.rolls.map((die, dieIndex) => (
                  <span 
                    key={dieIndex} 
                    className={`die-result ${die.dropped ? 'dropped' : ''}`}
                    title={die.dropped ? 'Dropped (not counted)' : ''}
                  >
                    {die.result}
                  </span>
                ))}
              </div>
              <div className="dice-feed-total">
                Total: <strong>{roll.total}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiceFeed;
