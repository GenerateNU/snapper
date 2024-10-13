import { LoginRequestBody, RegisterRequestBody } from '../types/auth';

export async function register(userData: RegisterRequestBody): Promise<void> {
  const requestBody = JSON.stringify(userData);
  console.log(requestBody);
  try {
    const response = await fetch(`http://192.168.1.154:3000/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response data:', data);
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user.');
    }
    console.log('User created successfully:', data);
  } catch (error) {
    console.error('Error during user registration:', error);
    throw error;
  }
}

export async function login(userData: LoginRequestBody): Promise<void> {
  const requestBody = JSON.stringify(userData);
  console.log(requestBody);
  try {
    const response = await fetch('http://192.168.1.154:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      console.log('User logged in successfully:', data);
      return;
    } else {
      throw new Error(data.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('An unexpected error occurred.');
  }
}
