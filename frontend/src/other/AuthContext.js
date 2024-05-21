// frontend/other/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null });
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuth({ isLoggedIn: true, user: userData });
    startTokenCheck(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isLoggedIn: false, user: null });
  };

  const startTokenCheck = (token) => {
    const decodedToken = jwtDecode(token);
    const expirationTime = decodedToken.exp * 1000 - 60000; 

    const timeoutId = setTimeout(() => {
      logout();
    }, expirationTime - Date.now());

    return timeoutId;
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      const timeoutId = startTokenCheck(token);
      setAuth({ isLoggedIn: true, user: JSON.parse(user), timeoutId });
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
