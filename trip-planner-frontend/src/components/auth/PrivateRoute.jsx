import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, loading, login, logout } = useContext(AuthContext);
  const isAuthenticated = user !== null
  
  if (!isAuthenticated) {
    // Redirect to home if the user is not authenticated
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;