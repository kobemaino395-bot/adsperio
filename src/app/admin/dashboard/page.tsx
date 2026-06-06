import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';
import { readStats } from '@/server/storage';
import { listSlots } from '@/server/slot-registry';
import { readSlotStats } from '@/server/slot-stats';
import LocalTime from '@/components/admin/LocalTime';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/dashboard' });

  const slots = await listSlots();
  const [sheet, stats, allSlotStats] = await Promise.all([
    getSheetData(),
    readStats(),
    Promise.all(slots.map((s) => readSlotStats(s.slug))),
  ]);

  const total = sheet.rows.length;
  const recent = sheet.rows.slice(Math.max(0, sheet.rows.length - 20)).reverse();
  const headerIdx = (name: string) => sheet.headers.indexOf(name);

  const submittedCol = headerIdx('submittedAt');
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const last24h = submittedCol >= 0
    ? sheet.rows.reduce((n, row) => {
        const t = Date.parse(row[submittedCol] ?? '');
        return Number.isFinite(t) && t >= since ? n + 1 : n;
      }, 0)
    : 0;

  const testDownloads = allSlotStats.reduce((sum, s) => sum + s.downloads, 0) ||
    Number(stats['takehome.downloads'] ?? 0);
  const lastDownloadedAt = allSlotStats
    .map((s) => s.lastDownloadedAt)
    .filter(Boolean)
    .sort()
    .at(-1) ?? null;
  const slotBreakdown = slots.map((s, i) => ({ slug: s.slug, title: s.title, downloads: allSlotStats[i]!.downloads }));
  const conversion = testDownloads > 0
    ? `${((total / testDownloads) * 100).toFixed(1)}%`
    : '—';

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      {sheet.error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Sheet unreachable; showing local JSONL fallback. Reason: {esc(sheet.error)}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Applications" value={String(total)} />
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Downloads</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{String(testDownloads)}</div>
          {lastDownloadedAt && (
            <div className="mt-1 text-xs text-zinc-500">Last: <LocalTime iso={lastDownloadedAt} /></div>
          )}
          {slotBreakdown.length > 0 && (
            <div className="mt-3 space-y-1 border-t border-zinc-100 pt-2">
              {slotBreakdown.map((s) => (
                <div key={s.slug} className="flex justify-between gap-2 text-xs">
                  <span className="truncate text-zinc-500">{esc(s.title)}</span>
                  <span className="tabular-nums font-medium text-zinc-700">{s.downloads}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Stat
          label="Conversion"
          value={conversion}
          sub={testDownloads > 0 ? `${total} / ${testDownloads}` : 'No downloads yet'}
        />
        <Stat label="Last 24h apps" value={String(last24h)} />
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
                    <td className="px-5 py-2 text-zinc-500">
                      <LocalTime iso={row[headerIdx('submittedAt')] ?? ''} />
                    </td>
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

function Stat({
  label, value, subIso, subPrefix, sub,
}: { label: string; value: string; subIso?: string | null; subPrefix?: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {subIso ? (
        <div className="mt-1 text-xs text-zinc-500">
          {subPrefix ?? ''}<LocalTime iso={subIso} />
        </div>
      ) : sub ? (
        <div className="mt-1 text-xs text-zinc-500">{sub}</div>
      ) : null}
    </div>
  );
}
