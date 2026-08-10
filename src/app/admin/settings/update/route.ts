import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp, readFormField, readSessionField, verifyNoPathTraversal } from '@/server/admin/security';
import { updateAppSettings, invalidateSettingsCache } from '@/server/app-settings';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<Response> {
  const session = await readSessionFromCookies();
  if (!session) return redirect('/admin/login');

  const h = await headers();
  const ip = readClientIp(h);

  const form = await request.formData();
  const csrf = readSessionField(form, '_csrf', session.csrf);
  if (!csrf.ok) {
    audit({ kind: 'admin.error.csrf', username: session.username, ip });
    return new Response(csrf.reason, { status: 403 });
  }

  const downloadRouteSlug = readFormField(form, 'downloadRouteSlug', { required: true, maxLen: 11 });
  if (!downloadRouteSlug.ok) {
    return new Response(`Invalid downloadRouteSlug: ${esc(downloadRouteSlug.reason)}`, { status: 400 });
  }

  verifyNoPathTraversal(downloadRouteSlug.value);

  const result = await updateAppSettings({
    downloadRouteSlug: downloadRouteSlug.value,
  });

  if (!result.ok) {
    audit({
      kind: 'admin.settings.update.failed',
      username: session.username,
      ip,
      reason: result.reason,
    });
    return new Response(`Failed to update settings: ${esc(result.reason)}`, { status: 400 });
  }

  invalidateSettingsCache();

  audit({
    kind: 'admin.settings.update',
    username: session.username,
    ip,
    downloadRouteSlug: result.settings.downloadRouteSlug,
  });

  redirect('/admin/settings');
}
