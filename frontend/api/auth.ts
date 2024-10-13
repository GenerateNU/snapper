import { LoginRequestBody, RegisterRequestBody } from '../types/auth';

interface AuthResponse {
  user: any; 
  token: string;
}

export async function register(userData: RegisterRequestBody): Promise<AuthResponse> {
  const requestBody = JSON.stringify(userData);
  try {
    const response = await fetch(`http://192.168.1.154:3000/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user.');
    }

    // Assuming `data` contains `{ user, token }`
    return {
      user: data.user,  // Replace with actual structure if different
      token: data.token,
    };
  } catch (error) {
    throw error;
  }
}

export async function login(userData: LoginRequestBody): Promise<AuthResponse> {
  const requestBody = JSON.stringify(userData);
  try {
    const response = await fetch('http://192.168.1.154:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        user: data.user,
        token: data.token,
      };
    } else {
      throw new Error(data.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    throw new Error('An unexpected error occurred.');
  }
}
