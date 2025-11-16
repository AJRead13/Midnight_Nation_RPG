import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../../utils/authService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    isGM: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 30) {
      newErrors.username = 'Username must be between 3 and 30 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await registerUser(registrationData);

      login(response.user);
      addToast('Registration successful! Welcome to Midnight Nation RPG.', 'success');
      navigate('/campaigns');
    } catch (error) {
      console.error('Registration failed:', error);
      addToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join the Midnight Nation RPG community</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              disabled={loading}
              autoComplete="username"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Display Name (optional)</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="How others will see you"
              disabled={loading}
              autoComplete="name"
            />
            <small>Leave blank to use your username</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              disabled={loading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isGM"
                checked={formData.isGM}
                onChange={handleChange}
                disabled={loading}
              />
              <span>I want to be a Game Master</span>
            </label>
            <small>You can create and manage campaigns as a GM</small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="register-footer">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
