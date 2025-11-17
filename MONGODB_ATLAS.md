# MongoDB Atlas Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Account & Cluster
1. Visit https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub or email
3. Choose **FREE** shared cluster (M0 Sandbox - 512MB)
4. Select provider: AWS, Google Cloud, or Azure
5. Choose region closest to you (e.g., us-west-2)
6. Cluster name: `midnight-nation-cluster`
7. Click **Create Cluster** (takes ~3-5 minutes)

### Step 2: Create Database User
1. Security → Database Access → **Add New Database User**
2. Authentication Method: **Password**
3. Username: `midnight_admin` (or your choice)
4. Password: Click **Autogenerate Secure Password** and save it securely!
5. Database User Privileges: **Atlas Admin** or **Read and write to any database**
6. Click **Add User**

### Step 3: Allow Network Access
1. Security → Network Access → **Add IP Address**
2. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Required for cloud hosting (Render, Railway, etc.)
   - For tighter security, add specific IP ranges later
3. Click **Confirm**

### Step 4: Get Connection String
1. Deployment → Database → **Connect** button on your cluster
2. Choose **Connect your application**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Format Connection String
Replace placeholders with your actual values:

**Before:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://midnight_admin:YOUR_ACTUAL_PASSWORD@cluster0.xxxxx.mongodb.net/midnight_nation_rpg?retryWrites=true&w=majority
```

**Important:**
- Replace `<username>` with your database username
- Replace `<password>` with your actual password
- Add `/midnight_nation_rpg` before the `?` to specify database name
- If password contains special characters (@, :, /, ?, #, [, ], @), URL encode them:
  - @ → %40
  - : → %3A
  - / → %2F
  - ? → %3F
  - # → %23
  - [ → %5B
  - ] → %5D

### Step 6: Test Connection Locally

**Option A: Update your local .env file**
```bash
cd server
# Edit .env file
MONGODB_URI=mongodb+srv://midnight_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/midnight_nation_rpg?retryWrites=true&w=majority
```

**Option B: Test with Node.js**
```javascript
// test-connection.js
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  });
```

Run: `node test-connection.js`

### Step 7: Seed Database with Game Data
Once connected, populate the database:

```bash
cd server
npm run seed
```

This will create all the reference data:
- ✅ Classes (10 classes)
- ✅ Backgrounds (12 backgrounds)
- ✅ Talents (100+ talents)
- ✅ Items (weapons, armor, gear)
- ✅ Monsters (10 creatures)
- ✅ And more!

---

## Production Deployment

### For Render.com
1. Go to your service settings
2. Environment → Add variable:
   - Key: `MONGODB_URI`
   - Value: Your full connection string
3. Save changes
4. Trigger manual deploy or push to GitHub

### For Railway.app
1. Select your service
2. Variables tab → New Variable:
   - Name: `MONGODB_URI`
   - Value: Your full connection string
3. Deploy

### For Vercel/Netlify Functions
Add to environment variables in project settings

---

## Monitoring & Management

### View Database
1. Atlas Dashboard → Browse Collections
2. Select `midnight_nation_rpg` database
3. View collections:
   - users
   - characters
   - campaigns
   - referencedatas (game content)

### Create Indexes (Optional for Performance)
```javascript
// In MongoDB Atlas → Browse Collections → Create Index
// Users collection:
{ "email": 1 }
{ "username": 1 }

// Characters collection:
{ "owner": 1 }
{ "name": "text" }

// Campaigns collection:
{ "gameMaster": 1 }
{ "players": 1 }
```

### Backup Configuration
**Free Tier (M0):**
- No manual backups
- Consider periodic exports

**Paid Tier (M2+):**
- Automatic daily backups
- Point-in-time recovery
- Backup frequency configuration

---

## Troubleshooting

### Error: "Bad auth: Authentication failed"
- ✅ Check username and password are correct
- ✅ Verify user has proper privileges
- ✅ Check password special characters are URL encoded

### Error: "connect ETIMEDOUT"
- ✅ Verify IP address is whitelisted (0.0.0.0/0)
- ✅ Check firewall isn't blocking MongoDB ports
- ✅ Ensure connection string format is correct

### Error: "MongooseServerSelectionError"
- ✅ Verify cluster is active (not paused)
- ✅ Check network access settings
- ✅ Ensure connection string includes database name

### Database is empty after deployment
- ✅ Run seed script: `npm run seed`
- ✅ Check logs for seed errors
- ✅ Verify MONGODB_URI is set correctly

---

## Security Best Practices

### ✅ Use Strong Passwords
- Minimum 16 characters
- Mix of letters, numbers, symbols
- Use password generator

### ✅ Limit Network Access (Optional)
Instead of 0.0.0.0/0, add specific IPs:
- Render.com: Contact support for IP ranges
- Railway.app: Dynamic IPs (use 0.0.0.0/0)
- Your office/home IP for admin access

### ✅ Separate Users by Environment
```
Development: dev_user (read/write to dev database)
Production: prod_user (read/write to prod database)
Admin: admin_user (full access for maintenance)
```

### ✅ Enable Audit Logs (Paid Tier)
- Track all database operations
- Monitor for suspicious activity
- Compliance requirements

---

## Cost Breakdown

### Free Tier (M0 Sandbox)
- Storage: 512 MB
- RAM: Shared
- vCPU: Shared
- Connections: 500 concurrent
- Backups: None
- Cost: **$0/month**
- **Perfect for development and small games!**

### Paid Tier (M2 - Recommended for Production)
- Storage: 2 GB
- RAM: 2 GB
- vCPU: Shared
- Connections: 500 concurrent
- Backups: Daily
- Cost: **~$9/month**

### When to Upgrade
- ✅ Need more than 512MB storage
- ✅ Need automated backups
- ✅ More than 50 active players
- ✅ Production deployment

---

## Next Steps
1. ✅ Create cluster and user
2. ✅ Get connection string
3. ✅ Test connection locally
4. ✅ Seed database
5. ✅ Add to deployment platform
6. 🎮 Start playing!
