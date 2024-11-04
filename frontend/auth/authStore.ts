import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware';
import { LoginRequestBody, RegisterRequestBody } from '../types/auth';
import { getSession, login, logout, register } from '../api/auth';
import { getUserById } from '../api/user';

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
  logout: () => Promise<void>;
  clearError: () => void;
  clearStorage: () => Promise<void>;
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

      clearStorage: async () => {
        try {
          // Clear all auth-related items from AsyncStorage
          await AsyncStorage.multiRemove([
            'auth-storage',
            'supabase.auth.token',
            'supabase.auth.refreshToken',
            '@supabase.auth.token',
            '@supabase.auth.refreshToken',
          ]);
        } catch (error) {
          console.error('Error clearing storage:', error);
        }
      },

      login: async (userData: LoginRequestBody) => {
        set({ loading: true, error: null });
        try {
          await get().clearStorage();

          const response = await login(userData);
          const session = await getSession();
          const userMe = await getUserById(response.user.id);

          if (session && userMe) {
            set({
              user: userMe.user,
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
          await get().clearStorage();

          const response = await register(userData);
          const session = await getSession();
          const userMe = await getUserById(response.user.id);

          if (session && userMe) {
            set({
              user: userMe.user,
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
          await get().clearStorage();

          set({
            user: null,
            token: null,
            refreshToken: null,
            expirationTime: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            supabaseId: null,
            mongoDBId: null,
          });
        } catch (error: any) {
          set({ loading: false, error: error.message || 'Logout failed' });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
