import { promises as fs } from 'node:fs';
import { readSessionFromCookies } from '@/server/admin/auth';
import { adminRedirect, applyAdminHeaders } from '@/server/admin/security';
import { fileMeta, readTakeHomeMeta, takeHomePath } from '@/server/storage';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const path = takeHomePath();
  const meta = await fileMeta(path);
  if (!meta) {
    const headers = new Headers({ 'Content-Type': 'text/plain; charset=utf-8' });
    applyAdminHeaders(headers);
    return new Response('No file uploaded.', { status: 404, headers });
  }

  const stored = await readTakeHomeMeta();
  const filename = stored?.filename ?? 'ads-manager-test.zip';
  const contentType = stored?.contentType || 'application/octet-stream';

  const data = await fs.readFile(path);
  const body = new Uint8Array(data);
  const headers = new Headers({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': String(meta.size),
  });
  applyAdminHeaders(headers);
  return new Response(body, { status: 200, headers });
}
