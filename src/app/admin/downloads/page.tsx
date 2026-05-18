import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { fileMeta, readStats, takeHomeBackupPath, takeHomePath } from '@/server/storage';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ok?: string; error?: string }>;

export default async function DownloadsPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/downloads' });

  const { ok, error } = await searchParams;
  const [asset, backup, stats] = await Promise.all([
    fileMeta(takeHomePath()),
    fileMeta(takeHomeBackupPath()),
    readStats(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Take-home asset</h1>

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          File replaced. Previous version saved to take-home.bak.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold tracking-tight">Current file</h2>
        {asset ? (
          <div className="mt-3 space-y-1 text-sm text-zinc-700">
            <div>Size: <span className="font-medium">{(asset.size / 1024).toFixed(1)} KB</span></div>
            <div>Modified: <span className="font-medium">{new Date(asset.mtimeMs).toLocaleString()}</span></div>
            <div>Downloads served: <span className="font-medium">{stats['takehome.downloads'] ?? 0}</span></div>
            <div className="pt-3">
              <a href="/admin/downloads/file" className="text-sm text-blue-600 hover:underline">Download current file →</a>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">No file uploaded yet.</p>
        )}
        {backup && (
          <p className="mt-4 text-xs text-zinc-500">
            Backup available: take-home.bak ({(backup.size / 1024).toFixed(1)} KB, {new Date(backup.mtimeMs).toLocaleString()})
          </p>
        )}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold tracking-tight">Replace file</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Accepts ZIP or DOCX (PK\x03\x04 magic-byte verified). Max 50 MB. The current file is moved to take-home.bak before replacement.
        </p>
        <form
          method="POST"
          action="/admin/downloads/replace"
          encType="multipart/form-data"
          className="mt-4 space-y-3"
        >
          <input type="hidden" name="_csrf" value={session.csrf} />
          <input
            type="file"
            name="file"
            required
            accept=".zip,.docx,application/zip,application/x-zip-compressed,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Upload & replace
          </button>
        </form>
      </section>
    </div>
  );
}
