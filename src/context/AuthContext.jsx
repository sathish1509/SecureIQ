import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('secureiq_is_logged_in') === 'true';
  });

  const [user, setUser] = useState({
    name: 'Sathish Kumar',
    email: 'sathish@secureiq.io',
    avatar: 'SA',
    role: 'admin' // Set to 'admin' for enterprise admin, or 'user' for standard accounts
  });

  const isAdmin = isLoggedIn && user?.role === 'admin';

  const login = (role = 'admin') => {
    setIsLoggedIn(true);
    setUser((prev) => ({ ...prev, role }));
    localStorage.setItem('secureiq_is_logged_in', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('secureiq_is_logged_in', 'false');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
