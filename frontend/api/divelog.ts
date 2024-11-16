import { apiConfig } from './apiContext';
import { fetchData } from './base';
import { FormFields, PostDiveLogResponse } from '../types/divelog';
import { useAuthStore } from '../auth/authStore';
const API_BASE_URL = apiConfig


export async function getDiveLogById(id: string): Promise<any> {
  return await fetchData(`/divelog/${id}`, 'Failed to fetch divelog');
}

export async function postDiveLog(postData: FormFields): Promise<any> {
  const mongoDBId = useAuthStore.getState().mongoDBId;
    if (mongoDBId) {
      postData.user = mongoDBId;
    }

    let fishID = []
    for(let i: number = 0; i < postData.tagData?.length; i++){
      fishID.push(postData.tagData[i].id);
    }
    postData.speciesTags = fishID;
    postData.date = new Date();
    return await fetch(`${API_BASE_URL}/divelog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
}
