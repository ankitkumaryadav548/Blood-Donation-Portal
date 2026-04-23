# SETUP GUIDE - Blood Donation Portal

Complete step-by-step setup instructions for the MERN Blood Donation Portal.

## Prerequisites

Before you begin, make sure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - Either:
  - Local installation: [Download](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Verify Installations

Open terminal/command prompt and run:

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check MongoDB (if installed locally)
mongod --version
```

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create database user with username and password
5. Whitelist your IP address
6. Get connection string
7. Format: `mongodb+srv://username:password@cluster.mongodb.net/blood-donation?retryWrites=true&w=majority`

### Option 2: Local MongoDB

1. Install MongoDB Community Server
2. Start MongoDB service:
   - **Windows**: `mongod`
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Connection string: `mongodb://localhost:27017/blood-donation`

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- nodemon (dev dependency)

### Step 3: Configure Environment Variables

Create `.env` file in backend directory:

```bash
# Windows
type nul > .env

# Mac/Linux
touch .env
```

Add the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blood-donation
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
NODE_ENV=development
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blood-donation?retryWrites=true&w=majority
```

### Step 4: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

**Expected Output:**
```
MongoDB Connected: localhost:27017
Server running on port 5000
```

### Step 5: Test Backend

Open browser or Postman:
```
GET http://localhost:5000/api/health
```

Should return: `{ "status": "Server is running" }`

## Frontend Setup

### Step 1: Navigate to Frontend Directory

In a **new terminal** window:

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- react-scripts

### Step 3: Configure Environment Variables

Create `.env` file in frontend directory:

```bash
# Windows
type nul > .env

# Mac/Linux
touch .env
```

Add:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend Server

```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view blood-donation-frontend in the browser.

Local:            http://localhost:3000
```

The app should automatically open in your browser. If not, open [http://localhost:3000](http://localhost:3000).

## Test the Application

### Create Test Accounts

1. **Donor Account:**
   - Go to http://localhost:3000/register
   - Name: John Donor
   - Email: donor@test.com
   - Phone: 1234567890
   - Password: password123
   - Role: Donor
   - Click Register

2. **Recipient Account:**
   - Register Name: Jane Recipient
   - Email: recipient@test.com
   - Phone: 9876543210
   - Password: password123
   - Role: Recipient

3. **Admin Account:**
   - Need to create manually in MongoDB:
   ```javascript
   db.users.insertOne({
     name: "Admin User",
     email: "admin@test.com",
     phoneNo: "1111111111",
     password: "$2a$10$...", // bcrypt hashed password
     role: "admin",
     createdAt: new Date()
   })
   ```

### Test Features

**As Donor:**
1. Login with donor account
2. Go to Donor Dashboard
3. Create donor profile (blood group, age, location)
4. Toggle availability status
5. View matching blood requests

**As Recipient:**
1. Login with recipient account
2. Go to Recipient Dashboard
3. Create a blood request
4. View donors list
5. Track request status

**As Admin:**
1. Login with admin account
2. Go to Admin Dashboard
3. View analytics
4. Manage users
5. Manage requests

## Common Issues & Solutions

### MongoDB Connection Failed

**Error:** `MongooseError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. For Atlas: Verify IP whitelist

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Issues

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Ensure backend CORS is configured (it is by default)
- Check frontend API URL in `.env`
- Restart both servers

### Node Modules Issues

**Error:** `Cannot find module`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### JWT Token Expired

**Error:** `Invalid token` after 7 days

**Solution:**
- Login again to get new token
- Token is stored in localStorage

## Project File Tree

```
MERN_PROJECT/
├── backend/
│   ├── models/                  # Database schemas
│   ├── routes/                  # API routes
│   ├── controllers/             # Business logic
│   ├── middleware/              # Auth & error handling
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── server.js               # Entry point
│   ├── package.json            # Dependencies
│   ├── .env                    # Environment variables
│   ├── .gitignore
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # React context
│   │   ├── utils/              # API utilities
│   │   ├── styles/             # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env
│   ├── .gitignore
│   └── README.md
│
├── README.md                   # Main documentation
├── SETUP_GUIDE.md             # This file
└── .gitignore
```

## Environment Variables Reference

### Backend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | Database connection | mongodb://localhost:27017/blood-donation |
| JWT_SECRET | JWT signing key | secret_key_here |
| JWT_EXPIRE | Token expiration | 7d |
| BCRYPT_ROUNDS | Password hashing rounds | 10 |
| NODE_ENV | Environment mode | development/production |

### Frontend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

## Building for Production

### Backend
1. Update `.env` with production values:
   ```
   NODE_ENV=production
   JWT_SECRET=<strong_secret_key>
   MONGODB_URI=<production_db_uri>
   ```

2. Deploy to service like:
   - Heroku
   - AWS
   - DigitalOcean
   - Railway

### Frontend
1. Build:
   ```bash
   npm run build
   ```

2. Deploy to service like:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3

## Testing Tools

- **API Testing:** Postman or Insomnia
- **Database:** MongoDB Compass
- **Browser DevTools:** Chrome DevTools

## Useful Commands

```bash
# Backend
cd backend
npm run dev          # Development
npm start           # Production
npm install         # Install dependencies

# Frontend
cd frontend
npm start           # Development
npm run build       # Production build
npm test            # Run tests
npm install         # Install dependencies

# Git
git init            # Initialize repository
git add .           # Stage changes
git commit -m ""    # Commit changes
git push            # Push to remote
```

## Next Steps

1. Explore the codebase
2. Customize the UI/styling
3. Add additional features:
   - Email notifications
   - SMS notifications
   - Maps integration
   - Real-time updates with Socket.io
4. Deploy to production
5. Share with users

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB University](https://university.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)

## Need Help?

- Check README.md files in backend/ and frontend/
- Review API documentation
- Check browser console for errors
- Review server logs

## License

MIT License - Feel free to use this project

---

**Happy Coding! 🎉**
