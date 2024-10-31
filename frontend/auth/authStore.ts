import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { LoginRequestBody, RegisterRequestBody } from '../types/auth';
import { getSession, login, logout, register } from '../api/auth';
import { getMe } from '../api/user';

interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
  expirationTime: number | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  supabaseId: string | null;
  mongoDBId: string | null;

  login: (userData: LoginRequestBody) => Promise<void>;
  register: (userData: RegisterRequestBody) => Promise<void>;
  logout: () => void;
  clearError: () => void;
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
      supabaseId: null,
      mongoDBId: null,

      login: async (userData: LoginRequestBody) => {
        set({ loading: true, error: null });
        try {
          const response = await login(userData);
          const session = await getSession();
          const userMe = await getMe();

          if (session && userMe) {
            set({
              user: session.user,
              token: session.access_token,
              refreshToken: session.refresh_token,
              expirationTime: Date.now() + session.expires_in * 1000,
              isAuthenticated: true,
              loading: false,
              error: null,
              supabaseId: response.user.id,
              mongoDBId: userMe.user._id,
            });
          }
        } catch (error: any) {
          set({ loading: false, error: error.message || 'Login failed' });
        }
      },

      register: async (userData: RegisterRequestBody) => {
        set({ loading: true, error: null });
        try {
          const response = await register(userData);
          const session = await getSession();
          const userMe = await getMe();

          if (session && userMe) {
            set({
              user: session.user,
              token: session.access_token,
              refreshToken: session.refresh_token,
              expirationTime: Date.now() + session.expires_in * 1000,
              isAuthenticated: true,
              loading: false,
              error: null,
              supabaseId: response.user.id,
              mongoDBId: userMe.user._id,
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
          set({
            user: null,
            token: null,
            refreshToken: null,
            expirationTime: null,
            isAuthenticated: false,
            error: null,
            supabaseId: null,
            mongoDBId: null,
          });
        } catch (error: any) {
          set({ loading: false, error: error.message || 'Logout failed' });
        } finally {
          set({ loading: false });
        }
      },

      clearError: async () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
