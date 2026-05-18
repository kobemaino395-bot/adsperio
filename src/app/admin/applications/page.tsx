import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';
import ApplicationsTable from './ApplicationsTable';
import LocalTime from '@/components/admin/LocalTime';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/applications' });

  const sheet = await getSheetData();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <div className="text-xs text-zinc-500">
          Source: {sheet.source} · fetched <LocalTime iso={new Date(sheet.fetchedAt).toISOString()} />
        </div>
      </header>

      {sheet.error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Sheet unreachable; showing local JSONL fallback. Some columns may be missing. Reason: {esc(sheet.error)}
        </div>
      )}

      {sheet.rows.length === 0 ? (
        <p className="rounded-md border border-zinc-200 bg-white p-6 text-sm text-zinc-500">No applications yet.</p>
      ) : (
        <ApplicationsTable headers={sheet.headers} rows={sheet.rows} />
      )}
    </div>
  );
}
