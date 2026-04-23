# Blood Donation Portal - MERN Stack

A full-stack web application that connects blood donors with recipients efficiently. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Core Features
- ✅ User registration and login with JWT authentication
- ✅ Role-based access (Donor, Recipient, Admin)
- ✅ Donor registration and profile management
- ✅ Blood request creation and management
- ✅ Donor-recipient matching based on blood group and location
- ✅ Admin dashboard with analytics
- ✅ Secure password storage using bcrypt
- ✅ Real-time blood request status updates

### Key Pages
1. **Home Page** - Information and statistics about blood donation
2. **Login/Register** - User authentication with role selection
3. **Donor Dashboard** - Manage donor profile and view blood requests
4. **Recipient Dashboard** - Create and manage blood requests
5. **Admin Dashboard** - Manage users, requests, and view analytics
6. **Donors List** - Browse available donors with filters
7. **Requests List** - View all active blood requests

## Project Structure

```
MERN_PROJECT/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Donor.js
│   │   └── Request.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── requestRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── donorController.js
│   │   ├── requestController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── Alert.js
│   │   │   └── Loading.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── DonorDashboard.js
│   │   │   ├── RecipientDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── DonorsList.js
│   │   │   └── RequestsList.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── Header.css
│   │   │   ├── Footer.css
│   │   │   ├── Home.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── List.css
│   │   │   ├── Alert.css
│   │   │   ├── Loading.css
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env
└── README.md
```

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling
- **Context API** - State management

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blood-donation
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=10
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   App runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Donors
- `GET /api/donors` - Get all donors with filters
- `POST /api/donors` - Create donor profile
- `GET /api/donors/profile` - Get donor profile
- `PUT /api/donors/profile` - Update donor profile
- `PUT /api/donors/availability` - Update availability status
- `GET /api/donors/history` - Get donation history

### Blood Requests
- `GET /api/requests` - Get all requests with filters
- `POST /api/requests` - Create blood request
- `GET /api/requests/:id` - Get specific request
- `GET /api/requests/user/my-requests` - Get user's requests
- `PUT /api/requests/:id/status` - Update request status
- `GET /api/requests/search/donors` - Search matching donors
- `DELETE /api/requests/:id` - Delete request

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/toggle-block` - Block/unblock user
- `GET /api/admin/analytics` - Get system analytics
- `PUT /api/admin/requests/:requestId` - Manage request

## Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  phoneNo: String,
  password: String (hashed),
  role: String (donor/recipient/admin),
  createdAt: Date
}
```

### Donor Schema
```javascript
{
  userId: ObjectId (ref: User),
  bloodGroup: String (O+, O-, A+, A-, B+, B-, AB+, AB-),
  age: Number,
  location: String,
  latitude: Number,
  longitude: Number,
  availability: String (available/not-available),
  lastDonationDate: Date,
  totalDonations: Number,
  createdAt: Date
}
```

### Request Schema
```javascript
{
  userId: ObjectId (ref: User),
  bloodGroupNeeded: String,
  hospitalName: String,
  location: String,
  latitude: Number,
  longitude: Number,
  urgencyLevel: String (low/medium/high),
  unitsRequired: Number,
  status: String (pending/fulfilled/cancelled),
  matchedDonors: [ObjectId],
  description: String,
  createdAt: Date
}
```

## Donor-Recipient Matching Logic

The system matches donors with recipients based on:
1. **Blood Group Compatibility** - Exact match on blood group
2. **Availability Status** - Donor must be marked as available
3. **Location Proximity** - Optionally filters by location
4. **Urgency Consideration** - High urgency requests get priority

### Blood Group Compatibility Chart
- O+ can give to: O+, A+, B+, AB+
- O- can give to: All
- A+ can give to: A+, AB+
- A- can give to: A+, A-, AB+, AB-
- B+ can give to: B+, AB+
- B- can give to: B+, B-, AB+, AB-
- AB+ can give to: AB+
- AB- can give to: AB+, AB-

## User Roles & Permissions

### Donor
- Create/update donor profile
- Update availability status
- View blood requests matching their blood group
- View donation history

### Recipient
- Create blood requests
- View their requests
- Update request status
- Search for donors

### Admin
- View all users
- Delete users
- Manage blood requests
- View system analytics
- Access user activity logs

## Features & Functionality

### User Registration
- Email validation
- Password strength requirements
- Role selection during signup
- JWT token generation

### Donor Features
- Blood group selection
- Location-based registration
- Availability toggle
- Donation history tracking
- Age and eligibility verification

### Recipient Features
- Blood request creation
- Specify blood group, location, urgency
- Track request status
- Search available donors
- Request modification/cancellation

### Admin Features
- Dashboard analytics
- User management
- Request management
- Blood group distribution stats
- System monitoring

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Protected API routes with middleware
- ✅ Role-based access control
- ✅ Input validation
- ✅ CORS protection
- ✅ Secure token storage in localStorage

## Future Enhancements

- Socket.io for real-time notifications
- Google Maps integration for location tracking
- Email notifications (NodeMailer)
- SMS notifications (Twilio)
- Blood inventory management
- Donation history analytics
- Mobile app (React Native)
- Payment integration for blood bank services
- Video consultation feature
- Multi-language support

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify MongoDB credentials

### CORS Issues
- Check CORS configuration in backend
- Ensure frontend URL is whitelisted

### Authentication Errors
- Verify JWT_SECRET is set in `.env`
- Check token expiration time
- Clear browser localStorage and retry

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Kill process on port 3000 or use different port

## License

MIT License - feel free to use this project

## Support

For issues and questions, please create an issue in the repository.

---

**Happy Donating! 🩸**
