import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';
import i18n from '../i18n';

const AuthContext = createContext(null);

const stored = () => {
  try {
    return JSON.parse(localStorage.getItem('agri_user'));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(stored());

  const persist = useCallback((token, u) => {
    localStorage.setItem('agri_token', token);
    localStorage.setItem('agri_user', JSON.stringify(u));
    setUser(u);
    if (u.language) i18n.changeLanguage(u.language);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  };

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    persist(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
