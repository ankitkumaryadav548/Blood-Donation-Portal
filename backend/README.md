# Backend - Blood Donation Portal API

REST API for the Blood Donation Portal built with Node.js and Express.

## Quick Start

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` file with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blood-donation
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
NODE_ENV=development
```

### Run Server

```bash
# Development with nodemon
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNo": "1234567890",
  "password": "password123",
  "role": "recipient" // or "donor"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "recipient"
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "recipient"
  }
}
```

### Donor Endpoints

#### Get All Donors
```
GET /api/donors?bloodGroup=O+&location=New York&availability=available

Response:
{
  "success": true,
  "count": 5,
  "donors": [
    {
      "_id": "donor_id",
      "userId": {
        "_id": "user_id",
        "name": "Jane Smith",
        "phoneNo": "9876543210",
        "email": "jane@example.com"
      },
      "bloodGroup": "O+",
      "age": 28,
      "location": "New York",
      "availability": "available",
      "totalDonations": 3
    }
  ]
}
```

#### Create Donor Profile
```
POST /api/donors
Authorization: Bearer token
Content-Type: application/json

{
  "bloodGroup": "O+",
  "age": 25,
  "location": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}

Response:
{
  "success": true,
  "message": "Donor profile created successfully",
  "donor": { ... }
}
```

#### Update Availability
```
PUT /api/donors/availability
Authorization: Bearer token
Content-Type: application/json

{
  "availability": "available"
}

Response:
{
  "success": true,
  "message": "Availability updated successfully",
  "donor": { ... }
}
```

### Blood Request Endpoints

#### Create Request
```
POST /api/requests
Authorization: Bearer token
Content-Type: application/json

{
  "bloodGroupNeeded": "O+",
  "hospitalName": "City Hospital",
  "location": "New York",
  "urgencyLevel": "high",
  "unitsRequired": 2,
  "description": "Emergency surgery"
}

Response:
{
  "success": true,
  "message": "Blood request created successfully",
  "request": { ... }
}
```

#### Get All Requests
```
GET /api/requests?status=pending&bloodGroup=O+&urgency=high

Response:
{
  "success": true,
  "count": 3,
  "requests": [ ... ]
}
```

#### Get User's Requests
```
GET /api/requests/user/my-requests
Authorization: Bearer token

Response:
{
  "success": true,
  "count": 2,
  "requests": [ ... ]
}
```

#### Update Request Status
```
PUT /api/requests/:id/status
Authorization: Bearer token
Content-Type: application/json

{
  "status": "fulfilled"
}

Response:
{
  "success": true,
  "message": "Request status updated successfully",
  "request": { ... }
}
```

### Admin Endpoints

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer admin_token

Response:
{
  "success": true,
  "count": 10,
  "users": [ ... ]
}
```

#### Get Analytics
```
GET /api/admin/analytics
Authorization: Bearer admin_token

Response:
{
  "success": true,
  "analytics": {
    "totalUsers": 50,
    "totalDonors": 30,
    "activeDonors": 25,
    "totalRequests": 15,
    "pendingRequests": 8,
    "fulfilledRequests": 7,
    "bloodGroupDistribution": [
      { "_id": "O+", "count": 10 },
      { "_id": "A+", "count": 8 }
    ]
  }
}
```

#### Delete User
```
DELETE /api/admin/users/:id
Authorization: Bearer admin_token

Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "status": 400,
  "message": "Error message",
  "error": {}
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Server Error

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Testing

Use Postman or similar tools to test API endpoints. Import the API documentation into Postman for easy testing.

## Project Structure

- `server.js` - Main entry point
- `config/db.js` - Database connection
- `models/` - Mongoose schemas
- `controllers/` - Business logic
- `routes/` - API routes
- `middleware/` - Authentication and error handling

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- bcryptjs: Password hashing
- jsonwebtoken: JWT authentication
- cors: Cross-origin requests
- dotenv: Environment variables

## License

MIT
