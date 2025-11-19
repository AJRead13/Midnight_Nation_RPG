import { useState, useEffect } from 'react';
import './modules.css';

function Modules() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Placeholder data - will be replaced with API call
    const placeholderModules = [
      {
        id: 1,
        title: "The Awakening",
        description: "A mysterious force begins to stir in the city, awakening dormant powers and ancient threats.",
        difficulty: "beginner",
        playerCount: "3-5",
        estimatedLength: "4-6 sessions",
        tags: ["mystery", "urban", "supernatural"],
        thumbnail: "/modules/awakening.jpg"
      },
      {
        id: 2,
        title: "Shadow Protocol",
        description: "Corporate espionage meets supernatural horror in this thrilling adventure through the underbelly of Midnight Nation.",
        difficulty: "intermediate",
        playerCount: "4-6",
        estimatedLength: "6-8 sessions",
        tags: ["intrigue", "corporate", "action"],
        thumbnail: "/modules/shadow-protocol.jpg"
      },
      {
        id: 3,
        title: "Blood Moon Rising",
        description: "When the blood moon appears, ancient vampire clans emerge from hiding to claim their dominion over the city.",
        difficulty: "advanced",
        playerCount: "3-6",
        estimatedLength: "8-10 sessions",
        tags: ["horror", "vampires", "epic"],
        thumbnail: "/modules/blood-moon.jpg"
      }
    ];
    
    setModules(placeholderModules);
  }, []);

  const filteredModules = filter === 'all' 
    ? modules 
    : modules.filter(module => module.difficulty === filter);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return 'var(--tertiary)';
      case 'intermediate': return 'var(--secondary)';
      case 'advanced': return 'var(--primary)';
      default: return 'var(--alpha)';
    }
  };

  return (
    <div className="modules-container">
      <h2>Campaign Modules</h2>
      <p className="modules-intro">
        Pre-written campaign modules for Midnight Nation. Each module includes complete storylines, 
        NPCs, encounters, and everything you need to run an engaging campaign.
      </p>

      <div className="modules-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Modules
        </button>
        <button 
          className={`filter-btn ${filter === 'beginner' ? 'active' : ''}`}
          onClick={() => setFilter('beginner')}
        >
          Beginner
        </button>
        <button 
          className={`filter-btn ${filter === 'intermediate' ? 'active' : ''}`}
          onClick={() => setFilter('intermediate')}
        >
          Intermediate
        </button>
        <button 
          className={`filter-btn ${filter === 'advanced' ? 'active' : ''}`}
          onClick={() => setFilter('advanced')}
        >
          Advanced
        </button>
      </div>

      <div className="modules-grid">
        {filteredModules.map(module => (
          <div 
            key={module.id} 
            className="module-card"
            onClick={() => setSelectedModule(module)}
          >
            <div className="module-thumbnail">
              <span className="module-placeholder">📖</span>
            </div>
            <div className="module-content">
              <h3>{module.title}</h3>
              <p className="module-description">{module.description}</p>
              
              <div className="module-meta">
                <span 
                  className="module-difficulty"
                  style={{ color: getDifficultyColor(module.difficulty) }}
                >
                  {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                </span>
                <span className="module-players">👥 {module.playerCount}</span>
                <span className="module-length">⏱️ {module.estimatedLength}</span>
              </div>
              
              <div className="module-tags">
                {module.tags.map(tag => (
                  <span key={tag} className="module-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="no-modules">
          <p>No modules found for this difficulty level.</p>
        </div>
      )}

      {selectedModule && (
        <div className="module-modal" onClick={() => setSelectedModule(null)}>
          <div className="module-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedModule(null)}>×</button>
            
            <h2>{selectedModule.title}</h2>
            
            <div className="modal-meta">
              <span 
                className="module-difficulty"
                style={{ color: getDifficultyColor(selectedModule.difficulty) }}
              >
                Difficulty: {selectedModule.difficulty.charAt(0).toUpperCase() + selectedModule.difficulty.slice(1)}
              </span>
              <span>Players: {selectedModule.playerCount}</span>
              <span>Length: {selectedModule.estimatedLength}</span>
            </div>

            <div className="module-tags">
              {selectedModule.tags.map(tag => (
                <span key={tag} className="module-tag">{tag}</span>
              ))}
            </div>

            <div className="module-full-description">
              <h3>Overview</h3>
              <p>{selectedModule.description}</p>
              
              <h3>What's Included</h3>
              <ul>
                <li>Complete campaign storyline with multiple plot threads</li>
                <li>Detailed NPC descriptions and motivations</li>
                <li>Pre-built encounters and challenges</li>
                <li>Maps and location descriptions</li>
                <li>Handouts and player resources</li>
                <li>GM tips and advice for running the module</li>
              </ul>

              <div className="module-actions">
                <button className="btn-primary">Download Module</button>
                <button className="btn-secondary">View Sample</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modules;
