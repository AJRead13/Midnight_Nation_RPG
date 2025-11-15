# Midnight Nation RPG - Frontend

A React-based website for the Midnight Nation tabletop RPG, featuring comprehensive rules, lore, character creation, and equipment databases.

## Features

### Pages

1. **Home (About)** - Introduction to Midnight Nation RPG
   - Game overview and setting
   - Core features and mechanics summary
   - Quick navigation guide

2. **Lore** - World building and narrative content
   - Setting and tone (Post-WWII America 1947-1955)
   - The Secret War explanation
   - Organizations (Ashwood Foundation, Covenant of St. Michael, Black Chamber)
   - Bloodlines overview
   - The Midnight Hour narrative

3. **Rules** - Complete game mechanics (subdivided)
   - **Core Concepts** - Primary attributes, dice mechanics, benchmarks
   - **Character Creation** - Step-by-step creation process
   - **Attributes** - Mind, Body, Soul with modifiers
   - **Dice Resolution** - 2d6 system with stacking mechanics
   - **Classes** - 9 character classes with archetypes and wound thresholds
   - **Bloodlines** - Supernatural heritage (Celestial, Lycanthrope, Vampire, Cryptid)
   - **Backgrounds** - 10 core backgrounds with progression
   - **Talents & Competencies** - Skill system with ranks and advancement
   - **Combat System** - Advanced combat actions and tactics
   - **Wounds & Damage** - Location-based wound tracking system
   - **Fate Pool** - Heroic point mechanics

4. **Character Sheet** - Interactive character creator
   - Basic information (name, background, bloodline, class, level)
   - Attribute tracking with auto-calculated modifiers
   - Location-based wound tracker (6 body parts × 3 severity levels)
   - Competencies and talents lists
   - Equipment inventory
   - Notes section
   - Save/Load character as JSON

5. **Items** - Equipment database (tabbed interface)
   - **Weapons** - Melee and ranged weapons with strength ratings
   - **Armor** - Protective gear with damage reduction effects
   - **Equipment** - Tools, occult items, medical supplies, explosives, vehicles
   - Quick reference tables for archetype thresholds

## Technology Stack

- **React** 18.2.0
- **React Router DOM** 6.11.1
- **Vite** - Build tool and dev server
- **CSS** - Custom styling with CSS variables

## Data Source

All game content is dynamically pulled from `info.json`, which contains:
- Complete rule system
- Character creation options
- Bloodline abilities
- Class definitions
- Background progressions
- Weapon and equipment stats
- Organization details

## Project Structure

```
src/
├── components/
│   ├── About/          # Home page with game introduction
│   ├── Lore/           # World building and narrative
│   ├── Rules/          # Comprehensive rules with subsections
│   ├── CharacterSheet/ # Interactive character creator
│   ├── Items/          # Equipment and weapons database
│   ├── Header/         # Site header
│   ├── Nav/            # Navigation menu
│   ├── Footer/         # Site footer
│   └── ...
├── assets/             # Images and media
├── utils/              # Helper functions
├── App.jsx             # Main app component
├── main.jsx            # Entry point with routing
└── index.css           # Global styles
info.json               # Complete game data
```

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features Detail

### Rules Navigation
- Sidebar navigation for quick section jumping
- Sticky sidebar on desktop
- Collapsible sections on mobile
- Dynamic content rendering based on selected section

### Character Sheet
- Form validation
- Auto-calculated attribute modifiers
- Interactive wound tracker with checkboxes
- Dynamic lists for competencies, talents, and equipment
- Export character to JSON
- Import character from JSON

### Items Database
- Tabbed interface (Weapons/Armor/Equipment)
- Filterable and organized by category
- Reference tables for combat mechanics
- Equipment effects clearly described

## Styling

The site uses a dark theme with:
- Primary color: Purple (#8c54ff)
- Secondary color: Dark gray (#31343D)
- Accent color: Red (#b12704)
- Responsive design with mobile breakpoints at 1300px and 900px

## Future Enhancements

- User authentication integration with backend
- Save characters to database
- Campaign management interface
- Digital dice roller
- GM tools and encounter builder
- Printable character sheets

## Backend Integration

The frontend is designed to integrate with the MongoDB backend for:
- User accounts and authentication
- Character persistence
- Campaign joining and management
- Session tracking

See `BACKEND_README.md` for API documentation.
