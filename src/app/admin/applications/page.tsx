import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { getSheetData } from '@/server/applications/sheet';

export const dynamic = 'force-dynamic';

function looksLikeUrl(v: string): boolean {
  return /^https?:\/\/\S+$/i.test(v);
}

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
          Source: {sheet.source} · fetched {new Date(sheet.fetchedAt).toLocaleTimeString()}
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
        <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-3 py-2">#</th>
                {sheet.headers.map((col) => (
                  <th key={col} className="whitespace-nowrap px-3 py-2">{esc(col)}</th>
                ))}
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {sheet.rows.map((row, idx) => (
                <tr key={idx} className="border-t border-zinc-100 align-top">
                  <td className="px-3 py-2 text-xs text-zinc-400">{idx}</td>
                  {row.map((cell, ci) => (
                    <td key={ci} className="max-w-[18rem] truncate px-3 py-2 text-zinc-700" title={cell}>
                      {looksLikeUrl(cell) ? (
                        <a href={cell} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {esc(cell)}
                        </a>
                      ) : (
                        esc(cell)
                      )}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <a href={`/admin/applications/${idx}`} className="text-xs text-zinc-500 hover:text-zinc-900">
                      Open →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
