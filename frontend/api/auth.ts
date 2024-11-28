import {
  AuthResponse,
  LoginRequestBody,
  RegisterRequestBody,
  SessionResponse,
} from '../types/auth';
import { apiConfig } from './apiContext';
import { fetchData } from './base';

const API_BASE_URL = apiConfig;

export async function getUserBySupabaseId(id: string): Promise<any> {
  return await fetchData(
    `/user/${id}/supabase`,
    'Failed to fetch user with id',
  );
}

export async function login(userData: LoginRequestBody): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  return data;
}

export async function register(
  userData: RegisterRequestBody,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create user.');
  }

  const data: AuthResponse = await response.json();
  return data;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to log out.');
  }
}

export async function getSession(): Promise<SessionResponse | null> {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to retrieve session.');
  }

  const data = await response.json();

  const sessionResponse: SessionResponse = {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
  };

  return sessionResponse;
}

export async function refreshSession(
  refreshToken: string,
): Promise<SessionResponse | null> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to refresh session.');
  }

  const data = await response.json();

  const sessionResponse: SessionResponse = {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
  };

  return sessionResponse;
}
