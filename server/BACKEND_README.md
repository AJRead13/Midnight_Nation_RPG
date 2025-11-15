# Midnight Nation RPG - Backend API

This backend provides MongoDB integration for user authentication, character management, and campaign functionality.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory by copying `.env.example`:
```bash
cp .env.example .env
```

Then update the following variables in your `.env` file:

- **MONGODB_URI**: Your MongoDB connection string
  - Local: `mongodb://localhost:27017/midnight_nation_rpg`
  - Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/midnight_nation_rpg`
- **JWT_SECRET**: A secure random string for JWT token generation
- **PORT**: Server port (default: 5000)
- **CLIENT_URL**: Your frontend URL for CORS (default: http://localhost:5173)

### 3. Start MongoDB
If using local MongoDB:
```bash
# macOS/Linux with Homebrew
brew services start mongodb-community

# Windows
net start MongoDB
```

Or use MongoDB Atlas for cloud hosting.

### 4. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Characters (`/api/characters`)
- `GET /api/characters` - Get all user's characters (requires auth)
- `GET /api/characters/:id` - Get specific character (requires auth)
- `POST /api/characters` - Create new character (requires auth)
- `PUT /api/characters/:id` - Update character (requires auth)
- `DELETE /api/characters/:id` - Delete character (requires auth)

### Campaigns (`/api/campaigns`)
- `GET /api/campaigns` - Get all campaigns (user's own and joined) (requires auth)
- `GET /api/campaigns/public` - Get public campaigns (requires auth)
- `GET /api/campaigns/:id` - Get specific campaign (requires auth)
- `POST /api/campaigns` - Create new campaign (requires auth)
- `PUT /api/campaigns/:id` - Update campaign (GM only) (requires auth)
- `DELETE /api/campaigns/:id` - Delete campaign (GM only) (requires auth)
- `POST /api/campaigns/:id/join` - Join a campaign (requires auth)
- `POST /api/campaigns/:id/leave` - Leave a campaign (requires auth)
- `POST /api/campaigns/:id/regenerate-code` - Regenerate invite code (GM only) (requires auth)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Database Models

### User
- username, email, password (hashed)
- References to characters and campaigns

### Character
- name, owner, attributes (strength, dexterity, etc.)
- race, class, level, experience
- health, equipment, skills, abilities
- background, notes
- campaign association

### Campaign
- name, description, game master
- players (users and their characters)
- invite code, public/private status
- max players, status
- sessions, world info, rules

## Project Structure
```
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Character.js         # Character model
│   └── Campaign.js          # Campaign model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── characters.js        # Character routes
│   └── campaigns.js         # Campaign routes
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── utils/
│   └── jwt.js               # JWT utility functions
├── server.js                # Main server file
└── .env.example             # Environment variables template
```

## Technologies Used
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration
