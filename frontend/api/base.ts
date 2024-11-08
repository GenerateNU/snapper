import { apiConfig } from './apiContext';

const API_BASE_URL = apiConfig;

export async function fetchData(
  endpoint: string,
  message: string,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || message);
  }
  return await response.json();
}
