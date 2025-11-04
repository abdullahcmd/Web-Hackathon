# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Environment
Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agriculture-market
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

## 3. Start MongoDB
Make sure MongoDB is running:
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
```

## 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 5. Test the API
The server will run on `http://localhost:5000`

### Register an Admin:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Register a Farmer:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Farmer",
    "email": "farmer@test.com",
    "password": "farmer123",
    "role": "farmer",
    "region": "Lahore"
  }'
```

## API Base URL
```
http://localhost:5000/api
```

## All Endpoints
See `README.md` for complete API documentation with all endpoints.

