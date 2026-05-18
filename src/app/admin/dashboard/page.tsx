import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';
import { readStats } from '@/server/storage';
import { getFileSlot } from '@/content/files';
import { readSlotStatus } from '@/server/files';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/dashboard' });

  const takeHomeSlot = getFileSlot('take-home');
  const [sheet, stats, takeHomeStatus] = await Promise.all([
    getSheetData(),
    readStats(),
    takeHomeSlot ? readSlotStatus(takeHomeSlot) : Promise.resolve(null),
  ]);
  const asset = takeHomeStatus?.hasFile
    ? { size: takeHomeStatus.size, mtimeMs: takeHomeStatus.mtimeMs }
    : null;

  const total = sheet.rows.length;
  const recent = sheet.rows.slice(Math.max(0, sheet.rows.length - 5)).reverse();
  const headerIdx = (name: string) => sheet.headers.indexOf(name);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      {sheet.error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Sheet unreachable; showing local JSONL fallback. Reason: {esc(sheet.error)}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Applications" value={String(total)} />
        <Stat label="Take-home downloads" value={String(stats['takehome.downloads'] ?? 0)} />
        <Stat
          label="Take-home asset"
          value={asset ? `${(asset.size / 1024).toFixed(1)} KB` : 'Not uploaded'}
          sub={asset ? new Date(asset.mtimeMs).toLocaleString() : ''}
        />
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white">
        <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
          <h2 className="text-sm font-semibold tracking-tight">Recent applications</h2>
          <a href="/admin/applications" className="text-xs text-zinc-500 hover:text-zinc-900">View all →</a>
        </header>
        {recent.length === 0 ? (
          <p className="px-5 py-6 text-sm text-zinc-500">No applications yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-2">Submitted</th>
                <th className="px-5 py-2">Name</th>
                <th className="px-5 py-2">Email</th>
                <th className="px-5 py-2">Country</th>
                <th className="px-5 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row, i) => {
                const realIdx = sheet.rows.length - 1 - i;
                return (
                  <tr key={realIdx} className="border-t border-zinc-100">
                    <td className="px-5 py-2 text-zinc-500">{esc(row[headerIdx('submittedAt')] ?? '')}</td>
                    <td className="px-5 py-2 font-medium">{esc(row[headerIdx('fullName')] ?? '')}</td>
                    <td className="px-5 py-2 text-zinc-600">{esc(row[headerIdx('email')] ?? '')}</td>
                    <td className="px-5 py-2 text-zinc-600">{esc(row[headerIdx('country')] ?? '')}</td>
                    <td className="px-5 py-2 text-right">
                      <a href={`/admin/applications/${realIdx}`} className="text-xs text-zinc-500 hover:text-zinc-900">
                        Open →
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}
