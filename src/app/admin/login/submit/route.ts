import type { NextRequest } from 'next/server';
import {
  clearPreAuthCsrf,
  clearLoginAttempts,
  constantTimeEqualStrings,
  createSession,
  recordLoginAttempt,
  setSessionCookie,
  verifyPassword,
  verifyPreAuthCsrf,
} from '@/server/admin/auth';
import { adminRedirect, audit, readClientIp } from '@/server/admin/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  const ip = readClientIp(request.headers);

  const limit = recordLoginAttempt(ip);
  if (!limit.allowed) {
    audit({ kind: 'login.ratelimit', ip });
    return adminRedirect('/admin/login?error=ratelimit');
  }

  const form = await request.formData();
  const submittedCsrf = String(form.get('_csrf') ?? '');
  const username = String(form.get('username') ?? '').trim();
  const password = String(form.get('password') ?? '');

  if (!(await verifyPreAuthCsrf(submittedCsrf))) {
    audit({ kind: 'login.failure', username, ip, reason: 'csrf' });
    return adminRedirect('/admin/login?error=invalid');
  }

  const expectedUsername = process.env.ADMIN_USERNAME ?? '';
  const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? '';

  const userOk = constantTimeEqualStrings(username, expectedUsername);
  const passOk = verifyPassword(password, passwordHash);

  if (!userOk || !passOk) {
    audit({ kind: 'login.failure', username, ip, reason: userOk ? 'password' : 'username' });
    return adminRedirect('/admin/login?error=invalid');
  }

  clearLoginAttempts(ip);
  await clearPreAuthCsrf();

  const session = createSession(username);
  await setSessionCookie(session.id);
  audit({ kind: 'login.success', username, ip });

  return adminRedirect('/admin/dashboard');
}
