import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from './authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  mongoDBId: string | null;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, mongoDBId, refreshSession } = useAuthStore();

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, mongoDBId, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
