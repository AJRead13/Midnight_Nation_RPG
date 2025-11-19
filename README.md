# Midnight Nation RPG [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MIDNIGHT NATION — OFFICIAL LICENSE (v1.0)

Copyright © 2025 Midnight Nation / Andrew Read. All Rights Reserved.

Midnight Nation is an original tabletop role-playing system, including but not limited to its mechanics, setting, rules text, artwork, terminology, world design, factions, creatures, bloodlines, supernatural systems, and related narrative content.

By using, reproducing, distributing, or creating content derived from Midnight Nation, you agree to the following terms:

## Description
A full-stack tabletop RPG website featuring a React frontend and Express/MongoDB backend for character management, campaign tracking, and user authentication. Set in post-WWII America (1947-1955) where heaven and hell are real, and secret organizations fight supernatural threats.

## Project Structure

```
Midnight_Nation_RPG/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # React components and pages
│   ├── index.html         # Entry HTML file
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend Express application
│   ├── config/           # Database configuration
│   ├── middleware/       # Authentication middleware
│   ├── models/           # MongoDB schemas (User, Character, Campaign)
│   ├── routes/           # API routes
│   ├── utils/            # JWT utilities
│   ├── server.js         # Express server entry point
│   └── package.json      # Backend dependencies
│
├── info.json             # Game rules and mechanics data
├── items.json            # Equipment and pricing data
└── package.json          # Root package for running both apps
```

## Features

### Frontend (React + Vite)
- **Lore Page**: World setting, organizations, and narrative
- **Rules Page**: Complete game mechanics with subdivided sections
- **Character Sheet**: Interactive character creation and management with save/load
- **Items Database**: Weapons, armor, equipment, and vehicles with prices
- **Responsive Design**: Mobile-friendly dark theme

### Backend (Express + MongoDB)
- **User Authentication**: JWT-based secure authentication
- **Character Management**: CRUD operations for player characters
- **Campaign System**: Create, join, and manage campaigns
- **RESTful API**: Well-structured endpoints for all operations

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [License](#license)

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/AJRead13/Midnight_Nation_RPG.git
cd Midnight_Nation_RPG
```

2. Install all dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

## Usage

### Development Mode (runs both client and server)
```bash
npm run dev
```

### Run Client Only
```bash
npm run client
```
Frontend will be available at `http://localhost:5173`

### Run Server Only
```bash
npm run server
```
Backend API will be available at `http://localhost:5000`

### Build for Production
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Characters
- `GET /api/characters` - Get all user's characters (protected)
- `GET /api/characters/:id` - Get specific character (protected)
- `POST /api/characters` - Create character (protected)
- `PUT /api/characters/:id` - Update character (protected)
- `DELETE /api/characters/:id` - Delete character (protected)

### Campaigns
- `GET /api/campaigns` - Get all campaigns (protected)
- `GET /api/campaigns/public` - Get public campaigns (protected)
- `GET /api/campaigns/:id` - Get specific campaign (protected)
- `POST /api/campaigns` - Create campaign (protected)
- `PUT /api/campaigns/:id` - Update campaign (GM only, protected)
- `DELETE /api/campaigns/:id` - Delete campaign (GM only, protected)
- `POST /api/campaigns/:id/join` - Join campaign (protected)
- `POST /api/campaigns/:id/leave` - Leave campaign (protected)

## Technologies

### Frontend
- React 18
- React Router DOM
- Vite
- CSS3 (custom styling)

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS for cross-origin requests

## Game System

**Midnight Nation** is a pulp noir tabletop RPG set in post-WWII America (1947-1955).

- **Dice System**: 2d6 with stacking dice mechanics
- **Attributes**: Mind, Body, Soul (D100 scale)
- **Wounds**: Location-based damage system
- **Classes**: Brawler, Gunner, Hunter, Warlock, Priest, Thief, Witch, Empath, Telekine
- **Bloodlines**: Celestial, Lycanthrope, Vampire, and Cryptid variants

## Credits
Game system and content by Andrew Read

## License
Copyright 2025 Andrew Read

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Badges
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## How to Contribute
Please email me or contact me with suggestions and feedback.

## Questions
- Email: aj.read13@gmail.com    
- GitHub: https://www.github.com/AJRead13 