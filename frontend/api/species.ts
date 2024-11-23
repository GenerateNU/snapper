import { SpeciesContent } from '../types/species';
import { apiConfig } from './apiContext';
import { fetchData } from './base';

const API_BASE_URL = apiConfig;

export async function searchSpecies(searchQuery: string): Promise<any> {
  if (searchQuery == '') {
    searchQuery = '*';
  }
  return await fetch(`${API_BASE_URL}/species/search/${searchQuery}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
