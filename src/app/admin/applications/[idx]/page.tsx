import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';

export const dynamic = 'force-dynamic';

type Params = Promise<{ idx: string }>;

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
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Application #{n}</h1>
        <a href="/admin/applications" className="text-xs text-zinc-500 hover:text-zinc-900">← Back to list</a>
      </header>

      <div className="rounded-lg border border-zinc-200 bg-white">
        <dl className="divide-y divide-zinc-100">
          {sheet.headers.map((header, i) => {
            const value = row[i] ?? '';
            return (
              <div key={header} className="grid grid-cols-1 gap-2 px-5 py-3 sm:grid-cols-[14rem_1fr]">
                <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">{esc(header)}</dt>
                <dd className="whitespace-pre-wrap break-words text-sm text-zinc-800">
                  {looksLikeUrl(value) ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {esc(value)}
                    </a>
                  ) : (
                    esc(value) || <span className="text-zinc-400">—</span>
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
