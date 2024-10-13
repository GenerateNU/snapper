import create from 'zustand';
import { LoginRequestBody, RegisterRequestBody } from '../types/auth';
import { login, register } from '../api/auth'; 

interface AuthState {
  user: any;                
  token: string | null;   
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
  isAuthenticated: false,
  error: null,
  loading: false,

  login: async (userData: LoginRequestBody) => {
    set({ loading: true, error: null });
    try {
      const response = await login(userData);
      const { user, token } = response; 

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      localStorage.setItem('token', token);
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Login failed' });
    }
  },

  register: async (userData: RegisterRequestBody) => {
    set({ loading: true, error: null });
    try {
      const response = await register(userData);
      const { user, token } = response;

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      localStorage.setItem('token', token);
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Registration failed' });
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });

    localStorage.removeItem('token');
  },
}));
