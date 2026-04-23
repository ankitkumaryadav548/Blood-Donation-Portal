# Frontend - Blood Donation Portal React App

React frontend for the Blood Donation Portal application.

## Quick Start

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env` file with:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Run Development Server

```bash
npm start
```

App will open at `http://localhost:3000`

## Features

### Pages
- **Home** - Landing page with information
- **Login** - User authentication
- **Register** - New user registration
- **Donors List** - Browse available donors
- **Requests List** - View blood requests
- **Donor Dashboard** - Donor profile and requests
- **Recipient Dashboard** - Create and manage requests
- **Admin Dashboard** - System management

### Components
- **Header** - Navigation bar
- **Footer** - Footer information
- **Alert** - Notification component
- **Loading** - Loading spinner

## Project Structure

```
src/
├── components/
│   ├── Header.js
│   ├── Footer.js
│   ├── Alert.js
│   └── Loading.js
├── pages/
│   ├── Home.js
│   ├── Login.js
│   ├── Register.js
│   ├── DonorDashboard.js
│   ├── RecipientDashboard.js
│   ├── AdminDashboard.js
│   ├── DonorsList.js
│   └── RequestsList.js
├── context/
│   └── AuthContext.js
├── utils/
│   └── api.js
├── styles/
│   ├── index.css
│   ├── App.css
│   ├── Header.css
│   ├── Footer.css
│   ├── Home.css
│   ├── Auth.css
│   ├── Dashboard.css
│   ├── List.css
│   ├── Alert.css
│   └── Loading.css
├── App.js
└── index.js
```

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject (one-way operation)
npm eject
```

## Components Details

### Header
- Navigation menu
- Logo
- User profile section
- Logout button
- Responsive design

### Footer
- Company information
- Quick links
- Contact details
- Copyright

### Alert
- Success/Error notifications
- Auto-dismiss after 3 seconds
- Customizable message

### Loading
- Spinner animation
- Center aligned
- Used during data fetching

## Styling

All components use custom CSS with:
- Responsive design
- Modern gradients
- Smooth transitions
- Mobile-friendly layout
- Blood donation theme colors

### Color Scheme
- Primary: #dc143c (Crimson Red)
- Secondary: #b22834 (Dark Red)
- Success: #28a745 (Green)
- Warning: #ffc107 (Yellow)
- Danger: #dc3545 (Red)

## State Management

Uses React Context API for authentication state:
- User information
- Authentication token
- Login/Logout functions
- Loading state

Token stored in localStorage for persistence.

## API Integration

All API calls go through `utils/api.js`:
- Axios instance with interceptors
- Automatic token attachment
- Centralized error handling
- Base URL configuration

## User Flows

### Donor Flow
1. Register as Donor
2. Create Donor Profile
3. Update Availability
4. View Blood Requests
5. View Donation History

### Recipient Flow
1. Register as Recipient
2. Create Blood Request
3. View Active Requests
4. Browse Available Donors
5. Update Request Status

### Admin Flow
1. Login as Admin
2. View Analytics
3. Manage Users
4. Manage Requests
5. View Blood Group Distribution

## Error Handling

- Try-catch blocks in all async functions
- User-friendly error messages
- Alert notifications for errors
- Graceful fallbacks

## Responsive Design

- Mobile-first approach
- Breakpoints at 768px
- Flexible grid layouts
- Touch-friendly buttons
- Adaptive navigation

## Security

- JWT token in Authorization header
- Protected routes with role checking
- Password validation
- HTTPS recommended for production

## Performance

- Code splitting with React Router
- Lazy loading of images
- CSS optimization
- Minimized bundle size

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- react: UI library
- react-dom: DOM rendering
- react-router-dom: Navigation
- axios: HTTP client

## Future Enhancements

- Real-time notifications with Socket.io
- Map integration for location
- Advanced filtering
- User profile customization
- Dark mode theme
- Internationalization (i18n)
- Service Worker for offline support

## Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `build/` folder.

### Deploy Options
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## License

MIT
