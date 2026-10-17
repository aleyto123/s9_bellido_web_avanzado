import 'server-only';
import axios from 'axios';
import type { Movie, SearchResponse } from './omdb';
export async function omdb(params: Record<string, string>) {
  const key = process.env.OMDB_API_KEY;
  if (!key) throw new Error('Configura OMDB_API_KEY en el archivo .env.local.');
  const { data } = await axios.get<SearchResponse & Movie>('https://www.omdbapi.com/', {
    params: { apikey: key, ...params }, timeout: 12000,
  });
  if (data.Response === 'False') {
    if (data.Error === 'Movie not found!') return { ...data, Search: [], totalResults: '0' };
    throw new Error(data.Error || 'OMDb no pudo completar la consulta.');
  }
  return data;
}
