import { API_BASE_URL } from '../consts/onboarding';

export async function getMe(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/user/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get this user');
  }

  const data = await response.json();
  return data;
}

export async function getUserById(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get user with id');
  }

  const data = await response.json();
  return data;
}

export async function getUserDiveLogs(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/user/items/divelogs`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get this user's divelogs");
  }

  const data = await response.json();
  return data;
}

export async function getUserFish(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/user/items/fish`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get user's fish");
  }

  const data = await response.json();
  return data;
}

export async function getUserBadges(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/user/items/badges`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get user's badges");
  }

  const data = await response.json();
  return data;
}
