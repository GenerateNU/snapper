import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { LoginRequestBody, RegisterRequestBody } from '../types/auth';
import { getSession, login, logout, register } from '../api/auth';

interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
  expirationTime: number | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;

  login: (userData: LoginRequestBody) => Promise<void>;
  register: (userData: RegisterRequestBody) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expirationTime: null,
      isAuthenticated: false,
      error: null,
      loading: false,

      login: async (userData: LoginRequestBody) => {
        set({ loading: true, error: null });
        try {
          const response = await login(userData);
          const session = await getSession();

          if (session) {
            set({
              user: session.user,
              token: session.access_token,
              refreshToken: session.refresh_token,
              expirationTime: Date.now() + session.expires_in * 1000,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          }
        } catch (error: any) {
          console.log(error);
          set({ loading: false, error: error.message || 'Login failed' });
        }
      },

      register: async (userData: RegisterRequestBody) => {
        set({ loading: true, error: null });
        try {
          const response = await register(userData);
          const session = await getSession();

          if (session) {
            set({
              user: session.user,
              token: session.access_token,
              refreshToken: session.refresh_token,
              expirationTime: Date.now() + session.expires_in * 1000,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          }
        } catch (error: any) {
          set({ loading: false, error: error.message || 'Signup failed' });
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          await logout();
          set({ user: null, token: null, refreshToken: null, expirationTime: null, isAuthenticated: false, error: null });
        } catch (error: any) {
          set({ loading: false, error: error.message || 'Logout failed' });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
    }
  )
);
