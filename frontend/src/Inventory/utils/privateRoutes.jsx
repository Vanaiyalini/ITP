import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
  const isAuthenticated = true; // Replace with actual authentication logic

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoutes;