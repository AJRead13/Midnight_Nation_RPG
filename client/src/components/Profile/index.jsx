import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../Toast';
import { updateProfile, changePassword } from '../../utils/authService';
import './profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    bio: '',
    avatar: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (profileForm.displayName && profileForm.displayName.length > 50) {
      newErrors.displayName = 'Display name cannot exceed 50 characters';
    }

    if (profileForm.bio && profileForm.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfile()) {
      return;
    }

    setLoading(true);

    try {
      const response = await updateProfile(profileForm);
      updateUser(response.user);
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Profile update failed:', error);
      addToast(error.message || 'Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      addToast('Password changed successfully!', 'success');
    } catch (error) {
      console.error('Password change failed:', error);
      addToast(error.message || 'Failed to change password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.displayName || user.username} />
            ) : (
              <div className="avatar-placeholder">
                {(user.displayName || user.username).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user.displayName || user.username}</h1>
            <p className="username">@{user.username}</p>
            {user.isGM && <span className="gm-badge">Game Master</span>}
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <h2>Edit Profile</h2>

              <div className="form-group">
                <label htmlFor="displayName">Display Name</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={profileForm.displayName}
                  onChange={handleProfileChange}
                  className={errors.displayName ? 'error' : ''}
                  disabled={loading}
                  placeholder={user.username}
                />
                {errors.displayName && <span className="error-message">{errors.displayName}</span>}
                <small>{profileForm.displayName.length}/50 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={profileForm.avatar}
                  onChange={handleProfileChange}
                  disabled={loading}
                  placeholder="https://example.com/avatar.jpg"
                />
                <small>Enter a URL to an image</small>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  className={errors.bio ? 'error' : ''}
                  disabled={loading}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && <span className="error-message">{errors.bio}</span>}
                <small>{profileForm.bio.length}/500 characters</small>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="security-form">
              <h2>Change Password</h2>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={errors.currentPassword ? 'error' : ''}
                  disabled={loading}
                  autoComplete="current-password"
                />
                {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={errors.newPassword ? 'error' : ''}
                  disabled={loading}
                  autoComplete="new-password"
                />
                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <h2>Account Statistics</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{user.characters?.length || 0}</div>
                  <div className="stat-label">Characters</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{user.campaigns?.length || 0}</div>
                  <div className="stat-label">Campaigns</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="stat-label">Member Since</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{user.isGM ? 'Yes' : 'No'}</div>
                  <div className="stat-label">Game Master</div>
                </div>
              </div>

              <div className="account-info">
                <h3>Account Information</h3>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Username:</span>
                  <span className="info-value">{user.username}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
