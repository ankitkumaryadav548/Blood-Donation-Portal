# API Documentation - Blood Donation Portal

Complete API reference for the Blood Donation Portal backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained from login/register endpoints and stored in localStorage on the client.

---

## Endpoints

### 1. AUTHENTICATION ENDPOINTS

#### 1.1 Register User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNo": "1234567890",
  "password": "securePassword123",
  "role": "donor"  // Options: "donor", "recipient", "admin"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}

Error Response (409):
{
  "message": "Email already registered"
}
```

#### 1.2 Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "donor"
  }
}

Error Response (401):
{
  "message": "Invalid email or password"
}
```

#### 1.3 Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNo": "1234567890",
    "role": "donor",
    "createdAt": "2024-04-18T10:00:00.000Z"
  }
}
```

---

### 2. DONOR ENDPOINTS

#### 2.1 Get All Donors (Public)
```
GET /donors?bloodGroup=O+&location=New%20York&availability=available

Query Parameters:
- bloodGroup: O+, O-, A+, A-, B+, B-, AB+, AB- (optional)
- location: String - search by location (optional)
- availability: available, not-available (optional)

Response (200):
{
  "success": true,
  "count": 3,
  "donors": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Jane Smith",
        "phoneNo": "9876543210",
        "email": "jane@example.com"
      },
      "bloodGroup": "O+",
      "age": 28,
      "location": "New York",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "availability": "available",
      "lastDonationDate": "2024-03-15T00:00:00.000Z",
      "totalDonations": 5,
      "createdAt": "2024-01-10T08:30:00.000Z"
    }
  ]
}
```

#### 2.2 Create Donor Profile
```
POST /donors
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "bloodGroup": "O+",
  "age": 25,
  "location": "New York",
  "latitude": 40.7128,
  "longitude": -74.0060
}

Response (201):
{
  "success": true,
  "message": "Donor profile created successfully",
  "donor": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "bloodGroup": "O+",
    "age": 25,
    "location": "New York",
    "availability": "available",
    "totalDonations": 0,
    "createdAt": "2024-04-18T10:00:00.000Z"
  }
}

Error (409):
{
  "message": "Donor profile already exists"
}
```

#### 2.3 Get Donor Profile
```
GET /donors/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "donor": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Jane Smith",
      "phoneNo": "9876543210",
      "email": "jane@example.com"
    },
    "bloodGroup": "O+",
    "age": 28,
    "location": "New York",
    "availability": "available",
    "totalDonations": 5
  }
}
```

#### 2.4 Update Donor Profile
```
PUT /donors/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "bloodGroup": "O+",
  "age": 26,
  "location": "Los Angeles",
  "latitude": 34.0522,
  "longitude": -118.2437
}

Response (200):
{
  "success": true,
  "message": "Donor profile updated successfully",
  "donor": { ... }
}
```

#### 2.5 Update Availability
```
PUT /donors/availability
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "availability": "available"  // or "not-available"
}

Response (200):
{
  "success": true,
  "message": "Availability updated successfully",
  "donor": {
    ...
    "availability": "available"
  }
}
```

#### 2.6 Get Donation History
```
GET /donors/history
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "totalDonations": 5,
  "lastDonationDate": "2024-03-15T00:00:00.000Z",
  "bloodGroup": "O+"
}
```

---

### 3. BLOOD REQUEST ENDPOINTS

#### 3.1 Create Blood Request
```
POST /requests
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "bloodGroupNeeded": "O+",
  "hospitalName": "City Medical Center",
  "location": "New York",
  "urgencyLevel": "high",
  "unitsRequired": 2,
  "latitude": 40.7580,
  "longitude": -73.9855,
  "description": "Emergency surgery required"
}

Response (201):
{
  "success": true,
  "message": "Blood request created successfully",
  "request": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "bloodGroupNeeded": "O+",
    "hospitalName": "City Medical Center",
    "location": "New York",
    "urgencyLevel": "high",
    "unitsRequired": 2,
    "status": "pending",
    "matchedDonors": ["507f1f77bcf86cd799439012"],
    "description": "Emergency surgery required",
    "createdAt": "2024-04-18T10:00:00.000Z"
  }
}
```

#### 3.2 Get All Requests (Public)
```
GET /requests?status=pending&bloodGroup=O+&urgency=high

Query Parameters:
- status: pending, fulfilled, cancelled (optional)
- bloodGroup: Blood group (optional)
- urgency: low, medium, high (optional)

Response (200):
{
  "success": true,
  "count": 5,
  "requests": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "phoneNo": "1234567890",
        "email": "john@example.com"
      },
      "bloodGroupNeeded": "O+",
      "hospitalName": "City Medical Center",
      "location": "New York",
      "urgencyLevel": "high",
      "unitsRequired": 2,
      "status": "pending",
      "matchedDonors": [...],
      "description": "Emergency surgery",
      "createdAt": "2024-04-18T10:00:00.000Z"
    }
  ]
}
```

#### 3.3 Get Specific Request
```
GET /requests/:id

Parameters:
- id: Request ID (required)

Response (200):
{
  "success": true,
  "request": { ... }
}

Error (404):
{
  "message": "Request not found"
}
```

#### 3.4 Get User's Requests
```
GET /requests/user/my-requests
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "count": 2,
  "requests": [ ... ]
}
```

#### 3.5 Update Request Status
```
PUT /requests/:id/status
Authorization: Bearer <token>
Content-Type: application/json

Parameters:
- id: Request ID (required)

Request Body:
{
  "status": "fulfilled"  // Options: pending, fulfilled, cancelled
}

Response (200):
{
  "success": true,
  "message": "Request status updated successfully",
  "request": {
    ...
    "status": "fulfilled"
  }
}
```

#### 3.6 Search Matching Donors
```
GET /requests/search/donors?bloodGroup=O+&location=New%20York

Query Parameters:
- bloodGroup: Blood group (required)
- location: Location (optional)

Response (200):
{
  "success": true,
  "count": 3,
  "donors": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Jane Smith",
        "phoneNo": "9876543210",
        "email": "jane@example.com"
      },
      "bloodGroup": "O+",
      "availability": "available",
      "location": "New York"
    }
  ]
}
```

#### 3.7 Delete Request
```
DELETE /requests/:id
Authorization: Bearer <token>

Parameters:
- id: Request ID (required)

Response (200):
{
  "success": true,
  "message": "Request deleted successfully"
}

Error (403):
{
  "message": "Not authorized to delete this request"
}
```

---

### 4. ADMIN ENDPOINTS

#### 4.1 Get All Users
```
GET /admin/users
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "count": 10,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNo": "1234567890",
      "role": "donor",
      "createdAt": "2024-04-18T10:00:00.000Z"
    }
  ]
}

Error (403):
{
  "message": "Admin access required"
}
```

#### 4.2 Delete User
```
DELETE /admin/users/:id
Authorization: Bearer <admin_token>

Parameters:
- id: User ID (required)

Response (200):
{
  "success": true,
  "message": "User deleted successfully"
}

Error (404):
{
  "message": "User not found"
}
```

#### 4.3 Toggle User Block
```
PUT /admin/users/:id/toggle-block
Authorization: Bearer <admin_token>

Parameters:
- id: User ID (required)

Response (200):
{
  "success": true,
  "message": "User blocked successfully",
  "user": { ... }
}
```

#### 4.4 Get Analytics
```
GET /admin/analytics
Authorization: Bearer <admin_token>

Response (200):
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
      {
        "_id": "O+",
        "count": 10
      },
      {
        "_id": "A+",
        "count": 8
      },
      {
        "_id": "B+",
        "count": 7
      },
      {
        "_id": "AB+",
        "count": 5
      }
    ]
  }
}
```

#### 4.5 Manage Request (Update Status)
```
PUT /admin/requests/:requestId
Authorization: Bearer <admin_token>
Content-Type: application/json

Parameters:
- requestId: Request ID (required)

Request Body:
{
  "status": "fulfilled"
}

Response (200):
{
  "success": true,
  "message": "Request updated successfully",
  "request": { ... }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

## Error Response Format

```json
{
  "message": "Error description",
  "error": {
    // Additional error details in development
  }
}
```

## Common Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Donor profile not found"
}
```

---

## Data Types & Constraints

### Blood Group Options
- O+
- O-
- A+
- A-
- B+
- B-
- AB+
- AB-

### User Roles
- donor
- recipient
- admin

### Request Status
- pending
- fulfilled
- cancelled

### Urgency Levels
- low
- medium
- high

### Donor Availability
- available
- not-available

---

## Rate Limiting

No rate limiting implemented. Consider adding for production:
- Per-IP rate limiting
- Per-user rate limiting
- Per-endpoint rate limiting

## Pagination

No pagination implemented. Consider adding for large datasets:
- Limit and offset parameters
- Page and pageSize parameters

## Sorting

No sorting implemented. Consider adding:
- sortBy parameter
- order parameter (asc/desc)

---

## Testing Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNo": "1234567890",
    "password": "password123",
    "role": "donor"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get all donors (with token)
curl -X GET http://localhost:5000/api/donors \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import Base URL: `http://localhost:5000/api`
2. Set Authorization header for protected endpoints
3. Create requests for each endpoint
4. Save as collection for reuse

---

## WebSocket Events (Future)

Socket.io implementation for real-time updates:
- `request-created`
- `request-updated`
- `donor-online`
- `donor-offline`

---

## Rate Limiting (Future)

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

---

## Version History

- **v1.0.0** (April 18, 2024) - Initial release

## Support

For API support and issues, please create an issue in the repository.

---

**Last Updated:** April 18, 2024
