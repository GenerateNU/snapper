import { LoginRequestBody, RegisterRequestBody } from '../types/auth';

export async function register(userData: RegisterRequestBody): Promise<void> {
  const requestBody = JSON.stringify(userData);
  console.log(requestBody);
  try {
    const response = await fetch(`http://10.110.251.138:3000/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response data:', data);

    if (response.ok && data.id) {
      console.log('User created successfully:', data);
    } else {
      console.error('Failed to create user:', data);
    }
  } catch (error) {
    console.error('Error during user registration:', error);
  }
}

export async function login(userData: LoginRequestBody): Promise<void> {
  const requestBody = JSON.stringify(userData);
  console.log(requestBody);
  try {
    const response = await fetch('http://10.110.251.138:3000/auth/login', {
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
    } else {
      console.error('Login failed:', data);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}
