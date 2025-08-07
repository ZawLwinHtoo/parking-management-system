import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  // Log token value to debug the issue
  console.log('PrivateRoute: token is', token);

  // If token is not available, redirect to login page
  return token ? children : <Navigate to="/login" />;
}
