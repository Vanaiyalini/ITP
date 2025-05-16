import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ role, allowedRoles, children }) => {
  if (allowedRoles.includes(role)) {
    return children;
  } else {
    return <Navigate to="/inventoryDashboard" />;
  }
};

export default RoleBasedRoute;