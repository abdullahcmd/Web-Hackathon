# Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/agriculture-market

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

## MongoDB Setup

### Local MongoDB
If you have MongoDB installed locally, the default connection string will work:
```
mongodb://localhost:27017/agriculture-market
```

### MongoDB Atlas (Cloud)
If you're using MongoDB Atlas, use your connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/agriculture-market?retryWrites=true&w=majority
```

## Security Notes

- **JWT_SECRET**: Use a strong, random string in production. You can generate one using:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **JWT_EXPIRE**: Token expiration time (e.g., 30d, 7d, 24h)

