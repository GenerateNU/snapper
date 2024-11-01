import { fetchData } from './base';

export async function getFishById(id: string): Promise<any> {
  return await fetchData(`/fish/${id}`, "Failed to fetch user's divelogs");
}
