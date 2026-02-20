import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const baseURL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || '/api');
const STORAGE_KEY = 'specforge_token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem(STORAGE_KEY, newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setTokenState(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleLogout = () => setToken(null);
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [setToken]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data?.data ?? data);
      } catch {
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token, setToken]);

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(`${baseURL}/auth/login`, { email, password });
    const payload = data?.data ?? data;
    setToken(payload.token);
    setUser(payload.user);
    return payload;
  }, [setToken]);

  const register = useCallback(async (name, email, password) => {
    const { data } = await axios.post(`${baseURL}/auth/register`, { name, email, password });
    const payload = data?.data ?? data;
    setToken(payload.token);
    setUser(payload.user);
    return payload;
  }, [setToken]);

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
