import { NextRequest, NextResponse } from 'next/server';
import { omdb } from '../../lib/omdb-server';
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const id = q.get('id');
  const search = (q.get('q') || '').trim();
  if (id && !/^tt\d{7,10}$/.test(id)) return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 });
  if (!id && search.length < 2) return NextResponse.json({ Search: [], totalResults: '0' });
  const params: Record<string,string> = id ? { i: id, plot: 'full' } : { s: search, page: String(Math.min(100, Math.max(1, Number(q.get('page')) || 1))) };
  if (['movie','series'].includes(q.get('type') || '')) params.type = q.get('type')!;
  if (/^\d{4}$/.test(q.get('year') || '')) params.y = q.get('year')!;
  try { return NextResponse.json(await omdb(params)); }
  catch { return NextResponse.json({ error: 'No pudimos consultar OMDb. Revisa la conexión o la cuota de tu clave e inténtalo nuevamente.' }, { status: 502 }); }
}
