import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';
import ApplicationsTable from './ApplicationsTable';
import LocalTime from '@/components/admin/LocalTime';
import { Notice } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/applications' });

  const sheet = await getSheetData();

  return (
    <div className="space-y-6">
      <header className="border-hairline flex flex-wrap items-baseline justify-between gap-3 border-b pb-5">
        <h1 className="display-3">Applications</h1>
        <div className="caption">
          Source: {sheet.source} · fetched{' '}
          <LocalTime iso={new Date(sheet.fetchedAt).toISOString()} />
        </div>
      </header>

      {sheet.error && (
        <Notice tone="warn" label="Fallback">
          Sheet unreachable; showing local JSONL fallback. Some columns may be missing. Reason:{' '}
          {esc(sheet.error)}
        </Notice>
      )}

      {sheet.rows.length === 0 ? (
        <p className="card text-ink-mute p-6 text-sm">No applications yet.</p>
      ) : (
        <ApplicationsTable headers={sheet.headers} rows={sheet.rows} />
      )}
    </div>
  );
}
