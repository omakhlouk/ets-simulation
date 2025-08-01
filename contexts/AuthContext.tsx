'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  isFacilitator: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, isFacilitator: boolean) => Promise<boolean>;
  signup: (email: string, password: string, name: string, isFacilitator: boolean) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    const isFacilitator = localStorage.getItem('isFacilitator') === 'true';
    
    if (token && email && name) {
      setUser({ email, name, isFacilitator, token });
    }
  }, []);

  const login = async (identifier: string, password: string, isFacilitator: boolean): Promise<boolean> => {
    try {
      // Accept any email/username and password combination
      // Simulate successful authentication
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const token = `token-${Date.now()}`;
      
      // Extract name from identifier (use part before @ for emails, or full identifier for usernames)
      const name = identifier.includes('@') 
        ? identifier.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : identifier.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      const userData: User = {
        email: identifier.includes('@') ? identifier : `${identifier}@tradecraft.com`,
        name,
        isFacilitator,
        token
      };
      
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('name', userData.name);
      localStorage.setItem('isFacilitator', isFacilitator.toString());
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, isFacilitator: boolean): Promise<boolean> => {
    try {
      // Accept any signup details
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const token = `token-${Date.now()}`;
      
      const userData: User = {
        email,
        name,
        isFacilitator,
        token
      };
      
      setUser(userData);
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      localStorage.setItem('name', name);
      localStorage.setItem('isFacilitator', isFacilitator.toString());
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('isFacilitator');
    localStorage.removeItem('sessionId');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}