import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have it, redirect based on user role
  if (requiredRole && currentUser?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (currentUser?.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      case 'store_owner':
        return <Navigate to="/store-owner" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

