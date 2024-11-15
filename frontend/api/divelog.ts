import { FormFields } from '../app/(postcreation)/_layout';
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
