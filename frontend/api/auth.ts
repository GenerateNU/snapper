import { AuthResponse, LoginRequestBody, RegisterRequestBody, SessionResponse } from '../types/auth';

const API_BASE_URL = "http://localhost:3000";

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

export async function register(userData: RegisterRequestBody): Promise<AuthResponse> {
  const requestBody = JSON.stringify(userData);
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  console.log(response);

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
    throw new Error(errorData.error || 'Failed to create user.');
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
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    user: data.user,
  };

  return sessionResponse;
}