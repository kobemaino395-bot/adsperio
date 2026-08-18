import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';
import LocalTime from '@/components/admin/LocalTime';

export const dynamic = 'force-dynamic';

type Params = Promise<{ idx: string }>;

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const DATE_COL_RE = /(submittedAt|at$|At$|date|Date)/;

function looksLikeUrl(v: string): boolean {
  return /^https?:\/\/\S+$/i.test(v);
}

export default async function ApplicationDetail({ params }: { params: Params }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const { idx } = await params;
  const n = Number(idx);
  if (!Number.isInteger(n) || n < 0) notFound();

  const sheet = await getSheetData();
  const row = sheet.rows[n];
  if (!row) notFound();

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: `/admin/applications/${n}` });

  return (
    <div className="space-y-6">
      <header className="border-hairline flex flex-wrap items-baseline justify-between gap-3 border-b pb-5">
        <h1 className="display-3 tabular-nums">Application #{n}</h1>
        <a href="/admin/applications" className="eyebrow text-ink hover:text-ink-mute transition-colors">
          ← Back to list
        </a>
      </header>

      <div className="card">
        <dl className="divide-hairline divide-y">
          {sheet.headers.map((header, i) => {
            const value = row[i] ?? '';
            const isDate = DATE_COL_RE.test(header) && ISO_RE.test(value);
            return (
              <div key={header} className="grid grid-cols-1 gap-2 px-5 py-3 sm:grid-cols-[14rem_1fr]">
                <dt className="eyebrow pt-1">{esc(header)}</dt>
                <dd className="text-ink-2 whitespace-pre-wrap break-words text-sm">
                  {isDate ? (
                    <LocalTime iso={value} />
                  ) : looksLikeUrl(value) ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="link-inline">
                      {esc(value)}
                    </a>
                  ) : (
                    esc(value) || <span className="text-ink-mute">—</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
