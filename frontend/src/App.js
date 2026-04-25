import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorsList from './pages/DonorsList';
import RequestsList from './pages/RequestsList';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import RequestDetails from './pages/RequestDetails';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, user, initializing } = useContext(AuthContext);

  if (initializing) {
    return <Loading />;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppContent() {
  const { initializing } = useContext(AuthContext);

  if (initializing) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/donors" element={<DonorsList />} />
            <Route path="/requests" element={<RequestsList />} />
            <Route path="/requests/:id" element={<RequestDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />

            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute requiredRole="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recipient-dashboard"
              element={
                <ProtectedRoute requiredRole="recipient">
                  <RecipientDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
