import { fetchData } from './base';

export async function getMe(): Promise<any> {
  return await fetchData('/user/me', "Failed to fetch this user data");
}

export async function getUserById(id: string): Promise<any> {
  return await fetchData(`/user/${id}`, "Failed to fetch user with id");
}

export async function getUserDiveLogs(): Promise<any> {
  return await fetchData('/user/items/divelogs', "Failed to fetch user's divelogs");
}

export async function getUserFish(): Promise<any> {
  return await fetchData('/user/items/fish', "Failed to fetch user's fish");
}

export async function getUserBadges(): Promise<any> {
  return await fetchData('/user/items/badges', "Failed to fetch user's badges");
}
