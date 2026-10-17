import type { Metadata } from 'next';
import { connection } from 'next/server';
import { omdb } from './lib/omdb-server';
import type { Movie } from './lib/omdb';
import Cinema from './Cinema';
import './cinema.css';
export const metadata: Metadata = { title: 'FRAME — Películas y series', description: 'Descubre tu próxima gran historia. Explora películas y series con FRAME.' };
export default async function Home() {
  await connection();
  const ids = ['tt1375666','tt0816692','tt0468569','tt0111161','tt0133093','tt1853728','tt6751668','tt0110912'];
  const responses = await Promise.allSettled(ids.map(i => omdb({ i, plot: 'full' })));
  const movies: Movie[] = responses.flatMap(r => r.status === 'fulfilled' ? [r.value] : []);
  return <Cinema initialMovies={movies} initialError={movies.length ? '' : 'No pudimos cargar la selección. Revisa la conexión y la clave de OMDb.'} />;
}
