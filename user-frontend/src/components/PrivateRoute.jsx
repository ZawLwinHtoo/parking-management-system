import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  console.log('PrivateRoute: token is', token); // Debug token value

  // If token is not available, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, render the children components (protected route)
  return children;
}
