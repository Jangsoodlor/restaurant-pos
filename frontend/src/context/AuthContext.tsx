import React, { createContext, useState, useCallback, useEffect } from 'react';

export interface CurrentUser {
  id: number;
  name: string;
  role: 'cook' | 'waiter' | 'manager';
}

export interface AuthContextType {
  token: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decode JWT token and extract user data
 */
function parseJwt(token: string | null): CurrentUser | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1] || "";
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(decodeURIComponent(Array.prototype.map.call(atob(base64), function (c: string) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
    return {
      id: json.sub ? parseInt(json.sub, 10) : json.id,
      name: json.name,
      role: json.role,
    };
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState<CurrentUser | null>(() => {
    const storedToken = localStorage.getItem('auth_token');
    return parseJwt(storedToken);
  });

  useEffect(() => {
    // Restore user data on component mount if token exists
    const storedToken = localStorage.getItem('auth_token');
    setUser(parseJwt(storedToken));
  }, []);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    const decodedUser = parseJwt(newToken);
    setUser(decodedUser);
    localStorage.setItem('auth_token', newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  }, []);

  const value: AuthContextType = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
