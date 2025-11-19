import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast';
import * as moduleService from '../../utils/moduleService';
import './modules.css';

function Modules() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
  }, [filter]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await moduleService.getAllModules({ difficulty: filter });
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = modules;

  const handleDownload = async (module) => {
    if (!user) {
      toast.warning('Please log in to download modules');
      return;
    }

    try {
      setDownloading(true);
      await moduleService.downloadModule(module._id, module.fileName);
      toast.success(`Downloaded ${module.title}`);
    } catch (error) {
      console.error('Error downloading module:', error);
      toast.error(error.message || 'Failed to download module');
    } finally {
      setDownloading(false);
    }
  };

  const handleViewSample = (module) => {
    if (module.previewUrl) {
      window.open(module.previewUrl, '_blank');
    } else {
      toast.info('Sample not available for this module');
    }
  };

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
        {loading ? (
          <div className="loading-message">Loading modules...</div>
        ) : filteredModules.length > 0 ? (
          filteredModules.map(module => (
            <div 
              key={module._id} 
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
                
                {module.downloadCount > 0 && (
                  <div className="download-count">
                    ⬇️ {module.downloadCount} downloads
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-modules">
            <p>No modules available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {!loading && filteredModules.length === 0 && filter !== 'all' && (
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
              <p>{selectedModule.fullDescription || selectedModule.description}</p>
              
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
                <button 
                  className="btn-primary" 
                  onClick={() => navigate(`/modules/${selectedModule.moduleId || selectedModule._id}`)}
                >
                  View Online
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => handleDownload(selectedModule)}
                  disabled={downloading}
                >
                  {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
                {selectedModule.previewUrl && (
                  <button 
                    className="btn-secondary"
                    onClick={() => handleViewSample(selectedModule)}
                  >
                    View Sample
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modules;
