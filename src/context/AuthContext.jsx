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
    role: 'user'
  });

  const login = (role = 'user') => {
    setIsLoggedIn(true);
    setUser((prev) => ({ ...prev, role }));
    localStorage.setItem('secureiq_is_logged_in', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('secureiq_is_logged_in', 'false');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
