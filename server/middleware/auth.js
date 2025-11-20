const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, token invalid' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Admin-only middleware
const adminOnly = async (req, res, next) => {
  try {
    // First run auth middleware to get user
    await authMiddleware(req, res, () => {});
    
    // Check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.',
        error: 'FORBIDDEN'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error in admin authorization' });
  }
};

module.exports = authMiddleware;
module.exports.adminOnly = adminOnly;
