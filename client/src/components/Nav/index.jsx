import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../utils/helpers';
import referenceDataService from '../../utils/referenceDataService';

function Nav({ currentPage }) {
  const pages = ['lore', 'rules', 'characters', 'character-sheet', 'items'];
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showJoinCampaign, setShowJoinCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    startingLevel: 1,
    sessionDate: '',
    description: ''
  });
  const [joinCode, setJoinCode] = useState('');
  const [campaignError, setCampaignError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const formatPageName = (page) => {
    if (page === 'character-sheet') return 'Character Sheet';
    if (page === 'characters') return 'My Characters';
    return capitalizeFirstLetter(page);
  };

  const searchContent = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await referenceDataService.searchReferenceData(query, 15);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  const handleAuthFormChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value
    });
    setAuthError('');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignUp 
        ? { username: authForm.username, email: authForm.email, password: authForm.password }
        : { email: authForm.email, password: authForm.password };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsLoggedIn(true);
      setCurrentUser(data.user);
      setShowAuthModal(false);
      setAuthForm({ username: '', email: '', password: '' });
      setShowPassword(false);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCampaignError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create campaign');
      }

      setInviteCode(data.campaign.inviteCode);
      setCampaignForm({ name: '', startingLevel: 1, sessionDate: '', description: '' });
      // Keep modal open to show invite code
    } catch (error) {
      setCampaignError(error.message);
    }
  };

  const handleJoinCampaign = async (e) => {
    e.preventDefault();
    setCampaignError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/campaigns/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ inviteCode: joinCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join campaign');
      }

      alert(`Successfully joined campaign: ${data.campaign.name}`);
      setShowJoinCampaign(false);
      setJoinCode('');
      fetchUserCampaigns(); // Refresh campaigns list
    } catch (error) {
      setCampaignError(error.message);
    }
  };

  const fetchUserCampaigns = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCampaigns([]);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCampaigns(Array.isArray(data.campaigns) ? data.campaigns : []);
      } else {
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    }
  };

  const handleViewCampaigns = () => {
    fetchUserCampaigns();
    setShowCampaigns(true);
  };

  const openAuthModal = (signUp) => {
    setIsSignUp(signUp);
    setShowAuthModal(true);
    setAuthError('');
    setAuthForm({ username: '', email: '', password: '' });
    setShowPassword(false);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchContent(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleResultClick = (result) => {
    // Navigate with state to tell the page which section to show
    navigate(`/${result.page}`, { 
      state: { 
        section: result.section,
        searchTerm: result.title,
        type: result.type
      } 
    });
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSearchBlur = () => {
    // Delay to allow click on results
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <nav>
      <ul className="flex-row">
        <li
          className={`mx-5 ${currentPage === '/' && 'navActive'}`}
          key="about"
        >
          <Link to="/">Home</Link>
        </li>
        {pages.map((Page) => (
          <li
            className={`mx-5 ${currentPage === `/${Page}` && 'navActive'}`}
            key={Page}
          >
            <Link to={`/${Page}`}>{formatPageName(Page)}</Link>
          </li>
        ))}
        <li className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            onBlur={handleSearchBlur}
          />
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  className="search-result-item"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="result-header">
                    <span className="result-title">{result.title}</span>
                    <span className="result-type">{result.type}</span>
                  </div>
                  <div className="result-description">{result.description}</div>
                </div>
              ))}
            </div>
          )}
          {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="search-results">
              <div className="search-result-item no-results">
                No results found for "{searchQuery}"
              </div>
            </div>
          )}
        </li>
        <li className="auth-container">
          {isLoggedIn ? (
            <div className="user-menu">
              <span className="username">{currentUser?.username}</span>
              <button onClick={handleViewCampaigns} className="btn-auth btn-campaign">Campaigns</button>
              <button onClick={() => setShowCreateCampaign(true)} className="btn-auth btn-campaign">Create Campaign</button>
              <button onClick={() => setShowJoinCampaign(true)} className="btn-auth btn-campaign">Join Campaign</button>
              <button onClick={handleLogout} className="btn-auth">Logout</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button onClick={() => openAuthModal(false)} className="btn-auth">Sign In</button>
              <button onClick={() => openAuthModal(true)} className="btn-auth btn-signup">Sign Up</button>
            </div>
          )}
        </li>
      </ul>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            <h3>{isSignUp ? 'Sign Up' : 'Sign In'}</h3>
            
            <form onSubmit={handleAuthSubmit} className="auth-form">
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={authForm.username}
                    onChange={handleAuthFormChange}
                    required={isSignUp}
                    autoComplete="username"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={authForm.email}
                  onChange={handleAuthFormChange}
                  required
                  autoComplete="email"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={authForm.password}
                    onChange={handleAuthFormChange}
                    required
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="auth-error">
                  {authError}
                </div>
              )}

              <button type="submit" className="btn-primary auth-submit">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              <div className="auth-toggle">
                <p>
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setAuthError('');
                      setAuthForm({ username: '', email: '', password: '' });
                    }}
                    className="btn-link"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="modal-overlay" onClick={() => { setShowCreateCampaign(false); setInviteCode(''); setCampaignError(''); }}>
          <div className="modal-content campaign-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowCreateCampaign(false); setInviteCode(''); setCampaignError(''); }}>×</button>
            <h3>Create Campaign</h3>
            
            {inviteCode ? (
              <div className="invite-code-display">
                <h4>Campaign Created Successfully!</h4>
                <p>Share this invite code with your players:</p>
                <div className="invite-code-box">
                  <span className="invite-code">{inviteCode}</span>
                  <button 
                    className="btn-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode);
                      alert('Invite code copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
                <button 
                  className="btn-submit"
                  onClick={() => {
                    setShowCreateCampaign(false);
                    setInviteCode('');
                    setCampaignForm({ name: '', startingLevel: 1, sessionDate: '', description: '' });
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateCampaign} className="campaign-form">
                <div className="form-group">
                  <label htmlFor="campaignName">Campaign Title</label>
                  <input
                    type="text"
                    id="campaignName"
                    name="name"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startingLevel">Starting Level</label>
                  <input
                    type="number"
                    id="startingLevel"
                    name="startingLevel"
                    value={campaignForm.startingLevel}
                    onChange={(e) => setCampaignForm({ ...campaignForm, startingLevel: parseInt(e.target.value) })}
                    min={1}
                    max={10}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sessionDate">First Session Date</label>
                  <input
                    type="datetime-local"
                    id="sessionDate"
                    name="sessionDate"
                    value={campaignForm.sessionDate}
                    onChange={(e) => setCampaignForm({ ...campaignForm, sessionDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="campaignDescription">Description</label>
                  <textarea
                    id="campaignDescription"
                    name="description"
                    value={campaignForm.description}
                    onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                    rows={5}
                    maxLength={2000}
                    placeholder="Brief description of your campaign..."
                  />
                </div>

                {campaignError && <div className="error-message">{campaignError}</div>}

                <button type="submit" className="btn-submit">Create Campaign</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Join Campaign Modal */}
      {showJoinCampaign && (
        <div className="modal-overlay" onClick={() => { setShowJoinCampaign(false); setJoinCode(''); setCampaignError(''); }}>
          <div className="modal-content campaign-modal join-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowJoinCampaign(false); setJoinCode(''); setCampaignError(''); }}>×</button>
            <h3>Join Campaign</h3>
            
            <form onSubmit={handleJoinCampaign} className="campaign-form">
              <div className="form-group">
                <label htmlFor="inviteCode">Enter Campaign Code</label>
                <input
                  type="text"
                  id="inviteCode"
                  name="inviteCode"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  required
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.2rem' }}
                />
              </div>

              {campaignError && <div className="error-message">{campaignError}</div>}

              <button type="submit" className="btn-submit">Join Campaign</button>
            </form>
          </div>
        </div>
      )}

      {/* Campaigns List Modal */}
      {showCampaigns && (
        <div className="modal-overlay" onClick={() => setShowCampaigns(false)}>
          <div className="modal-content campaigns-list-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCampaigns(false)}>×</button>
            <h3>Your Campaigns</h3>
            
            {campaigns.length === 0 ? (
              <p className="no-campaigns">You haven't joined any campaigns yet.</p>
            ) : (
              <div className="campaigns-list">
                {campaigns.map((campaign) => {
                  const isGM = campaign.gameMaster._id === currentUser?._id;
                  const role = isGM ? 'Game Master' : 'Player';
                  
                  return (
                    <button
                      key={campaign._id}
                      className="campaign-item"
                      onClick={() => {
                        navigate(`/campaign/${campaign._id}`);
                        setShowCampaigns(false);
                      }}
                    >
                      <div className="campaign-item-header">
                        <h4>{campaign.name}</h4>
                        <span className={`role-badge ${isGM ? 'gm' : 'player'}`}>{role}</span>
                      </div>
                      <div className="campaign-item-info">
                        <span>Level {campaign.startingLevel || 1}</span>
                        <span>•</span>
                        <span>{campaign.players?.length || 0} Players</span>
                        <span>•</span>
                        <span>{campaign.status || 'planning'}</span>
                      </div>
                      {campaign.description && (
                        <p className="campaign-item-description">{campaign.description}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
