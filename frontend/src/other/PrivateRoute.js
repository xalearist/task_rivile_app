import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../other/AuthContext';  

const PrivateRoute = () => {
  const { auth } = useAuth();
  return auth.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
