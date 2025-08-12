import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ContactPage from './pages/ContactPage';
import PrivateRoute from './components/PrivateRoute';
import ActiveStatusPage from './pages/ActiveStatusPage';
import HistoryPage from './pages/HistoryPage';
import KeyEntry from './pages/KeyEntry';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/key-entry" element={
          <PrivateRoute>
            <KeyEntry />
          </PrivateRoute>
        } />

        {/* Protected Routes (requires login) */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/active" element={
          <PrivateRoute>
            <ActiveStatusPage />
          </PrivateRoute>
        } />

        <Route path="/history" element={
          <PrivateRoute>
            <HistoryPage />
          </PrivateRoute>
        } />

        <Route path="/contact" element={
          <PrivateRoute>
            <ContactPage />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />

        {/* Redirect to login if no matching route */}
        <Route path="*" element={
          localStorage.getItem('token')
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        } />

      </Routes>
    </BrowserRouter>
  );
}
