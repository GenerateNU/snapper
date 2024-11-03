import { API_BASE_URL } from '../consts/onboarding';
import { fetchData } from './base';

export async function getMe(): Promise<any> {
  return await fetchData('/user/me', 'Failed to fetch this user data');
}

export async function getUserById(id: string): Promise<any> {
  return await fetchData(`/user/${id}`, 'Failed to fetch user with id');
}

export async function getUserDiveLogs(): Promise<any> {
  const data = await fetchData(
    '/user/items/divelogs',
    "Failed to fetch user's divelogs",
  );
  return data.divelogs;
}

export async function getUserFishById(id: string): Promise<any> {
  const data = await fetchData(
    `/user/${id}/fish`,
    "Failed to fetch user's fish",
  );
  return data.fish;
}

export async function getUserDiveLogsById(id: string): Promise<any> {
  const data = await fetchData(
    `/user/${id}/divelogs`,
    "Failed to fetch user's divelogs",
  );
  return data.divelogs;
}

export async function getUserFish(): Promise<any> {
  const data = await fetchData(
    '/user/items/fish',
    "Failed to fetch user's fish",
  );
  return data.fish;
}

export async function getUserBadges(): Promise<any> {
  const data = await fetchData(
    '/user/items/badges',
    "Failed to fetch user's badges",
  );
  return data.badges;
}

export async function followUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/user/actions/follow/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to follow user');
  }
}