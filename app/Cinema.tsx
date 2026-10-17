"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import type { Movie, SearchResponse } from './lib/omdb';

function Icon({ name, className = '' }: { name: 'search' | 'arrow' | 'close' | 'film'; className?: string }) {
  const paths = { search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>, arrow: <><path d="M4 12h16m-6-6 6 6-6 6"/></>, close: <path d="m6 6 12 12M6 18 18 6"/>, film: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 4v16M17 4v16M3 9h4m-4 6h4M17 9h4m-4 6h4"/></> };
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function Poster({ movie, className = '' }: { movie: Movie; className?: string }) {
  const [failed, setFailed] = useState(false);
  return movie.Poster && movie.Poster !== 'N/A' && !failed ? <img className={className} src={movie.Poster} alt={`Póster de ${movie.Title}`} onError={() => setFailed(true)} /> : <div className={`poster-placeholder ${className}`}><Icon name="film"/><span>{movie.Title}</span></div>;
}
export default function Cinema({ initialMovies, initialError }: { initialMovies: Movie[]; initialError: string }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Movie | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [retry, setRetry] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searching = query.trim().length >= 2;
  const hero = initialMovies[0];
  const selectedId = selected?.imdbID;
  useEffect(() => {
    if (!searching) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true); setError('');
      try {
        const { data } = await axios.get<SearchResponse>('/api/movies', { params: { q: query.trim(), type, year, page }, signal: controller.signal });
        setResults(data.Search || []); setTotal(Number(data.totalResults || 0));
      } catch (e) { if (!controller.signal.aborted) { setResults([]); setError(axios.isAxiosError(e) ? e.response?.data?.error || 'No se pudo conectar. Inténtalo otra vez.' : 'Ocurrió un error.'); } }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 450);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, type, year, page, searching, retry]);
  useEffect(() => {
    if (!selectedId) return;
    const controller = new AbortController();
    async function load() {
      try { const { data } = await axios.get<Movie>('/api/movies', { params: { id: selectedId }, signal: controller.signal }); setSelected(data); }
      catch { if (!controller.signal.aborted) setDetailError('No pudimos cargar los detalles. Cierra y vuelve a intentarlo.'); }
      finally { if (!controller.signal.aborted) setDetailLoading(false); }
    }
    void load();
    return () => controller.abort();
  }, [selectedId]);
  function open(movie: Movie) { setDetailLoading(true); setDetailError(''); setSelected(movie); dialogRef.current?.showModal(); }
  function close() { dialogRef.current?.close(); setSelected(null); }
  function updateQuery(value: string) { setQuery(value); setPage(1); setError(''); setLoading(value.trim().length >= 2); }
  const visible = searching ? results : initialMovies.filter(m => (!type || m.Type === type) && (!year || m.Year.startsWith(year)));
  return <main className="cinema min-h-screen bg-[#101210] text-[#f0f1e8]">
    <header className="frame-nav mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-12">
      <Link className="brand flex items-center gap-3" href="/" aria-label="FRAME inicio"><span className="brand-mark"><Icon name="film"/></span>FRAME<span className="brand-dot">.</span></Link>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal"><a className="nav-active" href="#explorar">Explorar</a><button onClick={() => { setType('movie'); setPage(1); document.getElementById('explorar')?.scrollIntoView({ behavior: 'smooth' }); }}>Películas</button><button onClick={() => { setType('series'); updateQuery('Sherlock'); document.getElementById('explorar')?.scrollIntoView({ behavior: 'smooth' }); }}>Series</button></nav>
      <button className="nav-search flex items-center gap-2" onClick={() => { searchRef.current?.focus(); document.getElementById('explorar')?.scrollIntoView({ behavior: 'smooth' }); }}><Icon name="search"/><span className="hidden sm:inline">Buscar una historia</span></button>
    </header>
    <section className="hero mx-auto grid max-w-[1440px] gap-8 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-12" aria-labelledby="hero-title">
      <div className="hero-copy relative z-10 self-center">
        <p className="eyebrow"><span/> PARA LOS QUE AMAN LAS BUENAS HISTORIAS</p>
        <h1 id="hero-title">Tu próxima<br/>gran <em>historia.</em></h1>
        <p className="hero-description">Hay mundos que merecen ser descubiertos.<br className="hidden sm:block"/> Encuentra películas y series que se quedan contigo.</p>
        <a className="primary-button inline-flex items-center gap-8" href="#explorar">Explorar el catálogo <Icon name="arrow"/></a>
        <div className="hero-note flex items-center gap-3"><span className="tiny-stars">✦</span> Grandes clásicos. Nuevas obsesiones.</div>
      </div>
      <div className="hero-art" aria-label="Selección de películas destacadas">
        <div className="art-orbit"/>
        {initialMovies.slice(0,3).map((m,i) => <button key={m.imdbID} className={`hero-poster hero-poster-${i}`} onClick={() => open(m)} aria-label={`Ver detalles de ${m.Title}`}><Poster movie={m}/></button>)}
        {hero && <button className="feature-label" onClick={() => open(hero)}><span className="feature-star">★</span><span><small>LA ELECCIÓN DE FRAME</small><strong>{hero.Title}</strong><span className="feature-meta">{hero.Year} · {hero.Genre?.split(',').slice(0,2).join(' /')} · {hero.imdbRating} IMDb</span></span><Icon name="arrow"/></button>}
      </div>
    </section>
    <div className="editorial-strip"><span>UNA BUENA HISTORIA LO CAMBIA TODO</span><span>✦</span><span>CINE QUE SE QUEDA CONTIGO</span><span>✦</span><span>ENCUENTRA TU PRÓXIMA FAVORITA</span><span>✦</span></div>
    <section id="explorar" className="catalog mx-auto max-w-[1440px] px-6 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker">TU PRÓXIMO PLAN EMPIEZA AQUÍ</p><h2>{searching ? 'Historias que encontraste' : 'Una selección imperdible'}<span className="brand-dot">.</span></h2></div><span className="catalog-caption">{searching ? `${total} resultados` : 'Películas populares · Selección editorial'}</span></div>
      <div className="search-toolbar mt-7 flex flex-wrap items-center gap-3">
        <label className="search-field flex min-w-[200px] flex-1 items-center gap-3"><Icon name="search"/><input ref={searchRef} aria-label="Buscar películas o series" placeholder="¿Qué historia tienes en mente?" value={query} onChange={e => updateQuery(e.target.value)}/>{query && <button aria-label="Limpiar búsqueda" onClick={() => updateQuery('')}><Icon name="close"/></button>}</label>
        <label className="filter-field"><span className="sr-only">Tipo de contenido</span><select value={type} onChange={e => { setType(e.target.value); setPage(1); }}><option value="">Todos los títulos</option><option value="movie">Películas</option><option value="series">Series</option></select></label>
        <label className="filter-field year-field"><span className="sr-only">Año de estreno</span><input aria-label="Año de estreno" placeholder="Año" inputMode="numeric" maxLength={4} value={year} onChange={e => { setYear(e.target.value.replace(/\D/g,'')); setPage(1); }}/></label>
      </div>
      <div className="catalog-tabs flex items-center gap-2"><button className={!type ? 'active' : ''} onClick={() => { setType(''); setPage(1); }}>Todo</button><button className={type === 'movie' ? 'active' : ''} onClick={() => { setType('movie'); setPage(1); }}>Películas</button><button className={type === 'series' ? 'active' : ''} onClick={() => { setType('series'); updateQuery(query || 'Sherlock'); }}>Series</button><span className="ml-auto hidden text-xs text-[#858b80] sm:block">{searching ? 'Resultados de OMDb' : 'Elegidas para ti'}</span></div>
      <div aria-live="polite" aria-busy={loading}>
        {query.length === 1 && <p className="mb-5 text-sm text-[#b9c0b0]">Escribe al menos 2 letras para buscar.</p>}
        {(error || (!searching && initialError)) && <div className="empty-state"><h3>No pudimos cargar las historias</h3><p>{error || initialError}</p><button className="secondary-button" onClick={() => searching ? setRetry(n => n+1) : window.location.reload()}>Intentar de nuevo</button></div>}
        {loading ? <div className="movie-grid">{Array.from({length: 8},(_,i) => <div key={i} className="animate-pulse"><div className="aspect-[2/3] rounded-xl bg-[#242a22]"/><div className="mt-4 h-4 w-3/4 rounded bg-[#242a22]"/></div>)}</div> : !error && <><div className="movie-grid">{visible.map((m,i) => <button className="movie-card text-left" key={m.imdbID} onClick={() => open(m)}><div className="poster-wrap"><Poster movie={m}/><span className="card-type">{m.Type === 'series' ? 'SERIE' : 'PELÍCULA'}</span><span className="card-open"><Icon name="arrow"/></span>{m.imdbRating && m.imdbRating !== 'N/A' && <span className="card-rating">★ {m.imdbRating}</span>}</div><div className="card-info"><span className="card-number">{String((page-1)*10+i+1).padStart(2,'0')}</span><div><h3>{m.Title}</h3><p>{m.Year}<span>·</span>{m.Genre?.split(',')[0] || (m.Type === 'series' ? 'Serie' : 'Película')}</p></div></div></button>)}</div>{!visible.length && !initialError && <div className="empty-state"><Icon name="search"/><h3>No encontramos ese título</h3><p>Prueba otro nombre o cambia los filtros.</p><button className="secondary-button" onClick={() => { updateQuery(''); setType(''); setYear(''); }}>Limpiar filtros</button></div>}</>}
      </div>
      {searching && !loading && !error && total > 10 && <div className="pagination"><button disabled={page===1} onClick={() => setPage(p=>p-1)}>← Anterior</button><span>Página {page} de {Math.min(100,Math.ceil(total/10))}</span><button disabled={page>=Math.min(100,Math.ceil(total/10))} onClick={() => setPage(p=>p+1)}>Siguiente →</button></div>}
    </section>
    <footer className="frame-footer mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-6 lg:px-12"><Link className="brand" href="/">FRAME<span className="brand-dot">.</span></Link><p>Para quienes siempre quieren ver una historia más.</p><a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">Datos y pósters de OMDb ↗</a></footer>
    <dialog ref={dialogRef} className="movie-dialog" onCancel={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-labelledby="detail-title">
      <button autoFocus className="dialog-close" onClick={close} aria-label="Cerrar detalles"><Icon name="close"/></button>
      {selected && <div className="detail-layout"><div className="detail-poster"><Poster movie={selected}/></div><div className="detail-copy"><p className="section-kicker">{selected.Type === 'series' ? 'SERIE' : 'PELÍCULA'} · {selected.Year}</p><h2 id="detail-title">{selected.Title}</h2>{detailLoading ? <p className="mt-6 animate-pulse" role="status">Cargando la historia…</p> : detailError ? <p className="mt-6" role="alert">{detailError}</p> : <><div className="detail-badges"><span>★ {selected.imdbRating || 'N/A'} IMDb</span><span>{selected.Runtime}</span><span>{selected.Rated}</span></div><p className="detail-genre">{selected.Genre}</p><h3>La historia</h3><p className="plot">{selected.Plot === 'N/A' ? 'Sin sinopsis disponible.' : selected.Plot}</p><dl className="detail-facts">{[['Dirección',selected.Director],['Guion',selected.Writer],['Reparto',selected.Actors],['Estreno',selected.Released],['País',selected.Country],['Idioma',selected.Language],['Premios',selected.Awards],['Votos IMDb',selected.imdbVotes],['Taquilla',selected.BoxOffice],['Temporadas',selected.totalSeasons]].filter(([,v])=>v && v!=='N/A').map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{!!selected.Ratings?.length && <div className="ratings">{selected.Ratings.map(r=><div key={r.Source}><strong>{r.Value}</strong><span>{r.Source}</span></div>)}</div>}<a className="secondary-button inline-flex items-center gap-4" href={`https://www.imdb.com/title/${selected.imdbID}/`} target="_blank" rel="noreferrer">Ver en IMDb <Icon name="arrow"/></a><p className="detail-source">Información en el idioma original de OMDb.</p></>}</div></div>}
    </dialog>
  </main>;
}
