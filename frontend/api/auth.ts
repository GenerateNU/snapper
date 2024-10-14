import { AuthResponse, LoginRequestBody, RegisterRequestBody } from '../types/auth';

export async function login(userData: LoginRequestBody): Promise<AuthResponse> {
  const response = await fetch('http://192.168.1.154:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data = await response.json();
  return {
    user: data.data.user,
    session: {
      access_token: data.data.session.access_token,
      token_type: data.data.session.token_type,
      expires_in: data.data.session.expires_in,
      expires_at: data.data.session.expires_at,
      refresh_token: data.data.session.refresh_token,
      user: data.data.session.user,
    },
  };
}

export async function register(userData: RegisterRequestBody): Promise<AuthResponse> {
  const requestBody = JSON.stringify(userData);
  const response = await fetch('http://192.168.1.154:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create user.');
  }

  const data = await response.json();
  return {
    user: data.data.user,
    session: {
      access_token: data.data.session.access_token,
      token_type: data.data.session.token_type,
      expires_in: data.data.session.expires_in,
      expires_at: data.data.session.expires_at,
      refresh_token: data.data.session.refresh_token,
      user: data.data.session.user,
    },
  };
}

export async function logout(): Promise<void> {
  const response = await fetch('http://192.168.1.154:3000/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create user.');
  }
}