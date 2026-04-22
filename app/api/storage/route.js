// Storage API — usa Vercel KV para persistir datos compartidos
// entre vos y el equipo. Si KV no está configurado, retorna 503
// y el frontend usa localStorage como fallback.

export const runtime = 'edge';

async function getKV() {
  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  const kv = await getKV();
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV no configurado' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) {
    return new Response(JSON.stringify({ error: 'key requerida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (key === '__ping') {
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const value = await kv.get(key);
    return new Response(JSON.stringify({ value }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  const kv = await getKV();
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV no configurado' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { key, value } = await request.json();
    if (!key) {
      return new Response(JSON.stringify({ error: 'key requerida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await kv.set(key, value);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  const kv = await getKV();
  if (!kv) {
    return new Response(JSON.stringify({ error: 'KV no configurado' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) {
    return new Response(JSON.stringify({ error: 'key requerida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await kv.del(key);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
