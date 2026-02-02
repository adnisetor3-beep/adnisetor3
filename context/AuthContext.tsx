import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { useData } from './DataContext';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isCommon: boolean;
  isViewer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { users } = useData();

  // Check for existing session in local storage (simple implementation)
  useEffect(() => {
    const storedUserId = localStorage.getItem('eventflow_auth_user_id');
    if (storedUserId && users.length > 0) {
      const foundUser = users.find(u => u.id === storedUserId);
      if (foundUser && foundUser.active) {
        setCurrentUser(foundUser);
      } else {
        localStorage.removeItem('eventflow_auth_user_id');
      }
    }
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (!user.active) {
        alert("Usuário desativado. Contate o administrador.");
        return false;
      }
      setCurrentUser(user);
      localStorage.setItem('eventflow_auth_user_id', user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eventflow_auth_user_id');
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isCommon = currentUser?.role === UserRole.COMMON;
  const isViewer = currentUser?.role === UserRole.VIEWER;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin, isCommon, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};