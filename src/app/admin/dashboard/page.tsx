import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';
import { readStats } from '@/server/storage';
import { listSlots } from '@/server/slot-registry';
import { readSlotStats } from '@/server/slot-stats';
import LocalTime from '@/components/admin/LocalTime';
import { Notice } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

/** Rows whose timestamp column falls inside the trailing `windowMs`. Kept out
 *  of the component body so the clock read isn't a render-time side effect. */
function countWithin(rows: string[][], col: number, windowMs: number): number {
  if (col < 0) return 0;
  const since = Date.now() - windowMs;
  return rows.reduce((n, row) => {
    const t = Date.parse(row[col] ?? '');
    return Number.isFinite(t) && t >= since ? n + 1 : n;
  }, 0);
}

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

  const last24h = countWithin(sheet.rows, headerIdx('submittedAt'), 24 * 60 * 60 * 1000);

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
      <header className="border-hairline border-b pb-5">
        <h1 className="display-3">Dashboard</h1>
      </header>

      {sheet.error && (
        <Notice tone="warn" label="Fallback">
          Sheet unreachable; showing local JSONL fallback. Reason: {esc(sheet.error)}
        </Notice>
      )}

      {/* Hairline grid: the gap is the hairline. */}
      <section className="border-hairline bg-hairline grid gap-px border sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Applications" value={String(total)} />

        <div className="bg-canvas p-5">
          <div className="eyebrow">Downloads</div>
          <div className="mt-3 text-[2rem] font-[620] leading-none tracking-[-0.03em] tabular-nums">
            {String(testDownloads)}
          </div>
          {lastDownloadedAt && (
            <div className="caption mt-2">
              Last <LocalTime iso={lastDownloadedAt} />
            </div>
          )}
          {slotBreakdown.length > 0 && (
            <dl className="border-hairline divide-hairline mt-4 divide-y border-t">
              {slotBreakdown.map((s) => (
                <div key={s.slug} className="flex justify-between gap-3 py-1.5">
                  <dt className="text-ink-mute truncate text-xs">{esc(s.title)}</dt>
                  <dd className="text-ink text-xs font-medium tabular-nums">{s.downloads}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <Stat
          label="Conversion"
          value={conversion}
          mark
          sub={testDownloads > 0 ? `${total} / ${testDownloads}` : 'No downloads yet'}
        />
        <Stat label="Last 24h apps" value={String(last24h)} />
      </section>

      <section className="card">
        <header className="border-hairline flex items-center justify-between border-b px-5 py-3.5">
          <h2 className="eyebrow text-ink">Recent applications</h2>
          <a href="/admin/applications" className="eyebrow text-ink hover:text-ink-mute transition-colors">
            View all →
          </a>
        </header>
        {recent.length === 0 ? (
          <p className="text-ink-mute px-5 py-8 text-sm">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-hairline border-b">
                  <th className="eyebrow px-5 py-2.5 text-left">Submitted</th>
                  <th className="eyebrow px-5 py-2.5 text-left">Name</th>
                  <th className="eyebrow px-5 py-2.5 text-left">Email</th>
                  <th className="eyebrow px-5 py-2.5 text-left">Country</th>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-hairline divide-y">
                {recent.map((row, i) => {
                  const realIdx = sheet.rows.length - 1 - i;
                  return (
                    <tr key={realIdx} className="hover:bg-canvas-soft transition-colors">
                      <td className="text-ink-mute whitespace-nowrap px-5 py-2.5 tabular-nums">
                        <LocalTime iso={row[headerIdx('submittedAt')] ?? ''} />
                      </td>
                      <td className="px-5 py-2.5 font-medium">{esc(row[headerIdx('fullName')] ?? '')}</td>
                      <td className="text-ink-2 px-5 py-2.5">{esc(row[headerIdx('email')] ?? '')}</td>
                      <td className="text-ink-2 px-5 py-2.5">{esc(row[headerIdx('country')] ?? '')}</td>
                      <td className="px-5 py-2.5 text-right">
                        <a
                          href={`/admin/applications/${realIdx}`}
                          className="eyebrow text-ink hover:text-ink-mute transition-colors"
                        >
                          Open →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label, value, subIso, subPrefix, sub, mark,
}: { label: string; value: string; subIso?: string | null; subPrefix?: string; sub?: string; mark?: boolean }) {
  return (
    <div className="bg-canvas p-5">
      <div className="eyebrow">{label}</div>
      <div className="mt-3 text-[2rem] font-[620] leading-none tracking-[-0.03em] tabular-nums">
        {mark ? <span className="emph">{value}</span> : value}
      </div>
      {subIso ? (
        <div className="caption mt-2">
          {subPrefix ?? ''}
          <LocalTime iso={subIso} />
        </div>
      ) : sub ? (
        <div className="caption mt-2">{sub}</div>
      ) : null}
    </div>
  );
}
