import { fetchData } from './base';
import { Location, FormFields, PostDiveLogResponse } from '../types/divelog';
import { apiConfig } from './apiContext';
import { useAuthStore } from '../auth/authStore';
const API_BASE_URL = apiConfig


export async function getDiveLogById(id: string): Promise<any> {
  return await fetchData(`/divelog/${id}`, 'Failed to fetch divelog');
}

export async function postDiveLog(postData: FormFields): Promise<PostDiveLogResponse> {
  
  const mongoDBId = useAuthStore.getState().mongoDBId;
  if (mongoDBId) {
    postData.user = mongoDBId;
  }
  const response = await fetch(`${API_BASE_URL}/divelog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Post failed');
  }
  const data = await response.json()
  return data;
}
