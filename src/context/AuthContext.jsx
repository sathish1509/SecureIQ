import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('secureiq_token') || null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('secureiq_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const isLoggedIn = Boolean(token && user);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Login failed. Please check your credentials.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('secureiq_token', data.token);
    localStorage.setItem('secureiq_user', JSON.stringify(data.user));
    return data;
  };

  const register = async (email, password) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('secureiq_token', data.token);
    localStorage.setItem('secureiq_user', JSON.stringify(data.user));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('secureiq_token');
    localStorage.removeItem('secureiq_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return { token: null, user: null, isLoggedIn: false, login: async () => {}, register: async () => {}, logout: () => {} };
  }
  return context;
}
