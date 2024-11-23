import { FormFields } from '../app/(app)/(tabs)/post/_layout';
import { apiConfig } from './apiContext';
import { fetchData } from './base';

export async function getDiveLogById(id: string): Promise<any> {
  return await fetchData(`/divelog/${id}`, 'Failed to fetch divelog');
}

export async function createDiveLog(data: FormFields) {
  const response = await fetch(`${apiConfig}/divelog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function getNearbyDivelogs(
  lat: number,
  lng: number,
  page: number,
  limit: number = 10,
): Promise<any> {
  const data = await fetchData(
    `/divelogs?lat=${lat}&lng=${lng}&page=${page}&limit=${limit}`,
    'Failed to fetch user notifications',
  );
  return data;
}
