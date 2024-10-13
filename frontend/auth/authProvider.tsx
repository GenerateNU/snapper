import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from './authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
