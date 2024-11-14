import { apiConfig } from './apiContext';
import { fetchData } from './base';

const API_BASE_URL = apiConfig;

export async function getMe(): Promise<any> {
  return await fetchData('/user/me', 'Failed to fetch this user data');
}

export async function getUserById(id: string): Promise<any> {
  return await fetchData(`/user/${id}`, 'Failed to fetch user with id');
}

export async function getUserBySupabaseId(id: string): Promise<any> {
  return await fetchData(`/user/${id}/supabase`, 'Failed to fetch user with id');
}

export async function getUserDiveLogs(): Promise<any> {
  const data = await fetchData(
    '/user/items/divelogs',
    "Failed to fetch user's divelogs",
  );
  return data.divelogs;
}

export async function getUserNotifications(
  id: string,
  page: number,
  limit: number = 10,
): Promise<any> {
  const data = await fetchData(
    `/user/${id}/notifications?page=${page}&limit=${limit}`,
    'Failed to fetch user notifications',
  );
  return data;
}

export async function getUserSpeciesById(
  id: string,
  page: number,
  limit: number = 10,
): Promise<any> {
  const data = await fetchData(
    `/user/${id}/species?page=${page}&limit=${limit}`,
    "Failed to fetch user's species",
  );
  return data.species;
}

export async function getUserDiveLogsById(
  id: string,
  page: number,
  limit: number = 10,
): Promise<any> {
  const data = await fetchData(
    `/user/${id}/divelogs?page=${page}&limit=${limit}`,
    "Failed to fetch user's divelogs",
  );
  return data.divelogs;
}

export async function followUser(
  id: string,
  followUserId: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/user/${id}/follow/${followUserId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to follow user');
  }
}

export async function toggleLikeDivelog(
  id: string,
  divelogId: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/user/${id}/like/${divelogId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to like or unlike divelog');
  }
}
