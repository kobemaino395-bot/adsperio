import type { NextRequest } from 'next/server';
import {
  clearSessionCookie,
  destroySession,
  readSessionFromCookies,
  verifySessionCsrf,
} from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  const ip = readClientIp(request.headers);
  const session = await readSessionFromCookies();
  if (!session) return adminRedirect('/admin/login');

  const form = await request.formData();
  const submittedCsrf = String(form.get('_csrf') ?? '');
  if (!verifySessionCsrf(session, submittedCsrf)) {
    return adminRedirect('/admin/dashboard');
  }

  destroySession(session.id);
  await clearSessionCookie();
  audit({ kind: 'logout', username: session.username, ip });
  return adminRedirect('/admin/login');
}
