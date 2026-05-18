import type { NextRequest } from 'next/server';
import { recordApplication, validateIncoming } from '@/server/applications/intake';
import { readClientIp } from '@/server/admin/security';

export const dynamic = 'force-dynamic';

const MAX_JSON_BYTES = 30 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<Response> {
  const len = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(len) && len > MAX_JSON_BYTES) {
    return Response.json({ error: 'Payload too large' }, { status: 413 });
  }
  const ctype = request.headers.get('content-type') ?? '';
  if (!ctype.toLowerCase().includes('application/json')) {
    return Response.json({ error: 'Expected application/json' }, { status: 415 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const v = validateIncoming(raw);
  if (!v.ok) return Response.json({ error: v.error }, { status: 400 });

  try {
    const record = await recordApplication(v.value, {
      clientIp: readClientIp(request.headers),
      userAgent: request.headers.get('user-agent') ?? '',
    });
    return Response.json({ ok: true, id: record.id, forwarded: record.forwarded });
  } catch (err) {
    console.error('[applications] record failed', err);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
