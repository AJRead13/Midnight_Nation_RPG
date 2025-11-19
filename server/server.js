require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');
const campaignRoutes = require('./routes/campaigns');
const referenceDataRoutes = require('./routes/referenceData');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      if (origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production',
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// CORS Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // In production, check against CLIENT_URL
    if (origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/reference', referenceDataRoutes);

// Serve static files in production (only if dist folder exists - for single-server deployment)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  
  // Only serve static files if the dist folder exists
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // Handle React routing, return all requests to React app
    app.use((req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      // Send index.html for all other routes (React Router handles client-side routing)
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Midnight Nation RPG API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      characters: '/api/characters',
      campaigns: '/api/campaigns',
      reference: '/api/reference'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Socket.io event handlers
const initiativeStates = new Map(); // Store initiative state per campaign

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a campaign room
  socket.on('join-campaign', (campaignId) => {
    socket.join(`campaign-${campaignId}`);
    console.log(`Socket ${socket.id} joined campaign-${campaignId}`);
  });

  // Leave a campaign room
  socket.on('leave-campaign', (campaignId) => {
    socket.leave(`campaign-${campaignId}`);
    console.log(`Socket ${socket.id} left campaign-${campaignId}`);
  });

  // Handle dice roll events
  socket.on('dice-roll', (data) => {
    const { campaignId, roll } = data;
    
    // Broadcast to all users in the campaign room (except sender)
    socket.to(`campaign-${campaignId}`).emit('dice-roll', roll);
    
    console.log(`Dice roll in campaign-${campaignId}:`, roll);
  });

  // Request current initiative state
  socket.on('request-initiative', (campaignId) => {
    const state = initiativeStates.get(campaignId) || {
      combatants: [],
      currentTurn: 0,
      isActive: false
    };
    socket.emit('initiative-update', state);
  });

  // Update initiative state (from GM)
  socket.on('update-initiative', (data) => {
    const { campaignId, combatants, currentTurn, isActive } = data;
    
    const state = { combatants, currentTurn, isActive };
    initiativeStates.set(campaignId, state);
    
    // Broadcast to all users in the campaign room (including sender)
    io.to(`campaign-${campaignId}`).emit('initiative-update', state);
    
    console.log(`Initiative updated in campaign-${campaignId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});