import create from 'zustand';
import { LoginRequestBody, RegisterRequestBody } from '../types/auth';
import { login, logout, register } from '../api/auth';

interface AuthState {
  user: any; // TODO: figure out user type
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

export const useAuthStore = create<AuthState>((set) => ({
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

      set({
        // user,
        // token: session.access_token,
        // refreshToken: session.refresh_token,
        // expirationTime: Date.now() + session.expires_in * 1000,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // localStorage.setItem('token', session.access_token);
      // localStorage.setItem('refreshToken', session.refresh_token);
      // localStorage.setItem('expirationTime', (Date.now() + session.expires_in * 1000).toString());
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Login failed' });
    }
  },

  register: async (userData: RegisterRequestBody) => {
    set({ loading: true, error: null });
    try {
      const response = await register(userData);

      set({
        // user,
        // token: session.access_token,
        // refreshToken: session.refresh_token,
        // expirationTime: Date.now() + session.expires_in * 1000,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      // localStorage.setItem('token', session.access_token);
      // localStorage.setItem('refreshToken', session.refresh_token);
      // localStorage.setItem('expirationTime', (Date.now() + session.expires_in * 1000).toString());
    } catch (error: any) {
      console.log(error);
      set({ loading: false, error: error.message || 'Registration failed' });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await logout();
      set({ user: null, token: null, refreshToken: null, expirationTime: null, isAuthenticated: false, error: null });
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expirationTime');
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Logout failed' });
    } finally {
      set({ loading: false });
    }
  },
}));
