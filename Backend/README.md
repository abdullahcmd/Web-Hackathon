# Smart Agriculture Market Tracker - Backend API

A comprehensive Node.js backend API for managing agricultural market data, weather information, and farmer interactions.

## 🚀 Features

- **Authentication System**: Secure JWT-based authentication with role-based access control (Admin & Farmer)
- **Admin Dashboard**: Complete CRUD operations for market items and weather data
- **Farmer Dashboard**: View market prices, weather updates, and price trends
- **Price Trends**: 7-day price history with automatic generation
- **Weather Management**: Region-specific weather data management
- **Statistics**: Dashboard statistics for admins

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/agriculture-market
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

4. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Project Structure

```
WebCompetition/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js   # Admin CRUD operations
│   │   ├── authController.js    # Authentication logic
│   │   ├── farmerController.js  # Farmer data access
│   │   └── weatherController.js # Weather management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication & authorization
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── MarketItem.js        # Market item schema
│   │   ├── User.js              # User schema
│   │   └── Weather.js           # Weather schema
│   ├── routes/
│   │   ├── adminRoutes.js       # Admin routes
│   │   ├── authRoutes.js        # Auth routes
│   │   └── farmerRoutes.js      # Farmer routes
│   ├── utils/
│   │   ├── generateToken.js     # JWT token generation
│   │   └── generatePriceHistory.js # Price history generator
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user (Admin or Farmer).

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer", // "admin" or "farmer"
  "region": "Lahore" // optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "farmer",
      "region": "Lahore"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

---

### 2. Login User

**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "farmer",
      "region": "Lahore"
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

---

### 3. Get Current User

**GET** `/auth/me`

Get currently authenticated user information.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "farmer",
      "region": "Lahore"
    }
  }
}
```

---

## 👨‍💼 Admin Endpoints

All admin endpoints require authentication and admin role.

**Headers:**

```
Authorization: Bearer <admin_token>
```

---

### Market Items Management

### 4. Create Market Item

**POST** `/admin/market-items`

Create a new market item (vegetable/fruit) with automatic 7-day price history.

**Request Body:**

```json
{
  "name": "Tomato",
  "category": "vegetable", // "vegetable" or "fruit"
  "region": "Lahore",
  "currentPrice": 150,
  "unit": "per kg" // optional, defaults to "per kg"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "item_id",
    "name": "tomato",
    "category": "vegetable",
    "region": "Lahore",
    "currentPrice": 150,
    "unit": "per kg",
    "priceHistory": [
      {
        "price": 145.5,
        "date": "2024-01-01T00:00:00.000Z"
      }
      // ... 6 more days
    ],
    "createdBy": "admin_id",
    "createdAt": "2024-01-07T00:00:00.000Z",
    "updatedAt": "2024-01-07T00:00:00.000Z"
  },
  "message": "Market item created successfully"
}
```

---

### 5. Get All Market Items

**GET** `/admin/market-items`

Get all market items with optional filtering.

**Query Parameters:**

- `category` (optional): Filter by category (`vegetable` or `fruit`)
- `region` (optional): Filter by region
- `search` (optional): Search by name

**Example:**

```
GET /admin/market-items?category=vegetable&region=Lahore
GET /admin/market-items?search=Tomato
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "item_id",
      "name": "tomato",
      "category": "vegetable",
      "region": "Lahore",
      "currentPrice": 150,
      "unit": "per kg",
      "priceHistory": [...],
      "createdBy": {
        "_id": "admin_id",
        "name": "Admin Name",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-07T00:00:00.000Z"
    }
    // ... more items
  ]
}
```

---

### 6. Get Single Market Item

**GET** `/admin/market-items/:id`

Get a specific market item by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "item_id",
    "name": "tomato",
    "category": "vegetable",
    "region": "Lahore",
    "currentPrice": 150,
    "unit": "per kg",
    "priceHistory": [...],
    "createdBy": {
      "_id": "admin_id",
      "name": "Admin Name",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-07T00:00:00.000Z"
  }
}
```

---

### 7. Update Market Item

**PUT** `/admin/market-items/:id`

Update a market item. If price is changed, price history is regenerated.

**Request Body:**

```json
{
  "name": "Tomato",
  "category": "vegetable",
  "region": "Lahore",
  "currentPrice": 160,
  "unit": "per kg"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "item_id",
    "name": "tomato",
    "category": "vegetable",
    "region": "Lahore",
    "currentPrice": 160,
    "unit": "per kg",
    "priceHistory": [...],  // Updated with new price
    "updatedAt": "2024-01-07T12:00:00.000Z"
  },
  "message": "Market item updated successfully"
}
```

---

### 8. Delete Market Item

**DELETE** `/admin/market-items/:id`

Delete a market item.

**Response:**

```json
{
  "success": true,
  "message": "Market item deleted successfully"
}
```

---

### Weather Management

### 9. Create or Update Weather

**POST** `/admin/weather`

Create or update weather data for a region (upsert operation).

**Request Body:**

```json
{
  "region": "Lahore",
  "temperature": 25,
  "humidity": 60,
  "condition": "sunny", // "sunny", "cloudy", "rainy", "stormy", "foggy"
  "windSpeed": 10, // optional
  "description": "Clear skies with light breeze" // optional
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "weather_id",
    "region": "lahore",
    "temperature": 25,
    "humidity": 60,
    "condition": "sunny",
    "windSpeed": 10,
    "description": "Clear skies with light breeze",
    "createdAt": "2024-01-07T00:00:00.000Z",
    "updatedAt": "2024-01-07T00:00:00.000Z"
  },
  "message": "Weather data updated successfully"
}
```

---

### 10. Get All Weather Data

**GET** `/admin/weather`

Get all weather data for all regions.

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "weather_id",
      "region": "lahore",
      "temperature": 25,
      "humidity": 60,
      "condition": "sunny",
      "windSpeed": 10,
      "description": "Clear skies",
      "updatedAt": "2024-01-07T00:00:00.000Z"
    }
    // ... more regions
  ]
}
```

---

### 11. Get Single Weather Data

**GET** `/admin/weather/:id`

Get weather data by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "weather_id",
    "region": "lahore",
    "temperature": 25,
    "humidity": 60,
    "condition": "sunny",
    "windSpeed": 10,
    "description": "Clear skies",
    "updatedAt": "2024-01-07T00:00:00.000Z"
  }
}
```

---

### 12. Update Weather Data

**PUT** `/admin/weather/:id`

Update existing weather data.

**Request Body:**

```json
{
  "temperature": 28,
  "humidity": 65,
  "condition": "cloudy",
  "windSpeed": 15,
  "description": "Partly cloudy"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "weather_id",
    "region": "lahore",
    "temperature": 28,
    "humidity": 65,
    "condition": "cloudy",
    "windSpeed": 15,
    "description": "Partly cloudy",
    "updatedAt": "2024-01-07T12:00:00.000Z"
  },
  "message": "Weather data updated successfully"
}
```

---

### 13. Delete Weather Data

**DELETE** `/admin/weather/:id`

Delete weather data for a region.

**Response:**

```json
{
  "success": true,
  "message": "Weather data deleted successfully"
}
```

---

### Statistics

### 14. Get Admin Dashboard Statistics

**GET** `/admin/stats`

Get summary statistics for admin dashboard.

**Response:**

```json
{
  "success": true,
  "data": {
    "totalItems": 50,
    "totalVegetables": 30,
    "totalFruits": 20,
    "averagePrice": 125.5,
    "totalRegions": 5,
    "regions": ["Lahore", "Karachi", "Islamabad", "Peshawar", "Quetta"]
  }
}
```

---

## 👨‍🌾 Farmer Endpoints

All farmer endpoints require authentication. Both farmers and admins can access these endpoints.

**Headers:**

```
Authorization: Bearer <token>
```

---

### Market Items Access

### 15. Get All Market Items

**GET** `/farmer/market-items`

Get all market items with prices (searchable and filterable).

**Query Parameters:**

- `category` (optional): Filter by category (`vegetable` or `fruit`)
- `region` (optional): Filter by region
- `search` (optional): Search by name or region

**Example:**

```
GET /farmer/market-items?category=vegetable&region=Lahore
GET /farmer/market-items?search=Tomato
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "item_id",
      "name": "tomato",
      "category": "vegetable",
      "region": "Lahore",
      "currentPrice": 150,
      "unit": "per kg",
      "priceHistory": [
        {
          "price": 145.5,
          "date": "2024-01-01T00:00:00.000Z"
        }
        // ... 6 more days
      ],
      "createdAt": "2024-01-07T00:00:00.000Z"
    }
    // ... more items
  ]
}
```

---

### 16. Get Single Market Item with Price Trend

**GET** `/farmer/market-items/:id`

Get a specific market item with formatted price trend data (ready for chart visualization).

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "item_id",
    "name": "tomato",
    "category": "vegetable",
    "region": "Lahore",
    "currentPrice": 150,
    "unit": "per kg",
    "priceHistory": [...],
    "priceTrend": [
      {
        "date": "2024-01-01",
        "price": 145.50
      },
      {
        "date": "2024-01-02",
        "price": 147.25
      },
      // ... 5 more days (sorted by date)
    ],
    "createdAt": "2024-01-07T00:00:00.000Z"
  }
}
```

---

### Weather Access

### 17. Get All Weather Data

**GET** `/farmer/weather`

Get weather data for all regions.

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "weather_id",
      "region": "lahore",
      "temperature": 25,
      "humidity": 60,
      "condition": "sunny",
      "windSpeed": 10,
      "description": "Clear skies",
      "updatedAt": "2024-01-07T00:00:00.000Z"
    }
    // ... more regions
  ]
}
```

---

### 18. Get Weather by Region

**GET** `/farmer/weather/:region`

Get weather data for a specific region.

**Example:**

```
GET /farmer/weather/Lahore
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "weather_id",
    "region": "lahore",
    "temperature": 25,
    "humidity": 60,
    "condition": "sunny",
    "windSpeed": 10,
    "description": "Clear skies",
    "updatedAt": "2024-01-07T00:00:00.000Z"
  }
}
```

---

### Price Trends

### 19. Get All Price Trends

**GET** `/farmer/price-trends`

Get price trends for all market items (formatted for chart visualization).

**Query Parameters:**

- `region` (optional): Filter by region
- `category` (optional): Filter by category

**Example:**

```
GET /farmer/price-trends?region=Lahore&category=vegetable
```

**Response:**

```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "item_id",
      "name": "tomato",
      "category": "vegetable",
      "region": "Lahore",
      "currentPrice": 150,
      "trend": [
        {
          "date": "2024-01-01",
          "price": 145.5
        },
        {
          "date": "2024-01-02",
          "price": 147.25
        }
        // ... 5 more days
      ]
    }
    // ... more items
  ]
}
```

---

## 🏥 Health Check

### 20. Health Check

**GET** `/api/health`

Check if the server is running.

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-07T12:00:00.000Z"
}
```

---

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained by:

1. Registering a new user (`POST /api/auth/register`)
2. Logging in (`POST /api/auth/login`)

Token expires in 30 days (configurable via `JWT_EXPIRE` in `.env`).

---

## 🎯 Role-Based Access Control

- **Admin**: Can access all admin endpoints for managing market items and weather data
- **Farmer**: Can access farmer endpoints to view market prices, weather, and trends
- Both roles can access farmer endpoints (read-only access for admins)

---

## 📊 Data Models

### User Model

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: Enum ['admin', 'farmer'] (required)
- `region`: String (optional)

### MarketItem Model

- `name`: String (required)
- `category`: Enum ['vegetable', 'fruit'] (required)
- `region`: String (required)
- `currentPrice`: Number (required)
- `unit`: String (default: 'per kg')
- `priceHistory`: Array of {price, date} (7 days)
- `createdBy`: ObjectId (ref: User)

### Weather Model

- `region`: String (required, unique)
- `temperature`: Number (required)
- `humidity`: Number (required, 0-100)
- `condition`: Enum ['sunny', 'cloudy', 'rainy', 'stormy', 'foggy'] (required)
- `windSpeed`: Number (default: 0)
- `description`: String (optional)

---

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Helmet.js for security headers
- CORS enabled
- Input validation
- Error handling middleware

---

## 🧪 Testing the API

### Example: Register an Admin

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Example: Create Market Item (as Admin)

```bash
curl -X POST http://localhost:5000/api/admin/market-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Tomato",
    "category": "vegetable",
    "region": "Lahore",
    "currentPrice": 150,
    "unit": "per kg"
  }'
```

### Example: Get Market Items (as Farmer)

```bash
curl -X GET http://localhost:5000/api/farmer/market-items \
  -H "Authorization: Bearer <farmer_token>"
```

---

## 📝 Notes

- Price history is automatically generated for the last 7 days when creating a market item
- Price history is regenerated when updating the price of a market item
- Weather data uses upsert (create or update) operation
- All prices are stored in PKR (Pakistani Rupees)
- Date format: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

---

## 🚀 Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a secure `JWT_SECRET`
3. Update `MONGODB_URI` to your production MongoDB instance
4. Configure proper CORS origins
5. Use a process manager like PM2

---

## 📄 License

ISC

---

## 👥 Author

Smart Agriculture Market Tracker - Backend API
