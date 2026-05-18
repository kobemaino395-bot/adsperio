import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { fileSlots, type FileSlot } from '@/content/files';
import { readSlotStatus, type SlotStatus } from '@/server/files';
import { readStats } from '@/server/storage';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ok?: string; error?: string; slug?: string }>;

export default async function FilesPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/files' });

  const { ok, error, slug } = await searchParams;
  const statuses = await Promise.all(fileSlots.map((s) => readSlotStatus(s)));
  const stats = await readStats();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Files</h1>
        <span className="text-xs text-zinc-500">{fileSlots.length} slot{fileSlots.length === 1 ? '' : 's'}</span>
      </header>

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          File replaced{slug ? ` for "${esc(slug)}"` : ''}. Previous version saved as file.bin.bak.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <div className="space-y-6">
        {fileSlots.map((slot, i) => (
          <SlotCard
            key={slot.slug}
            slot={slot}
            status={statuses[i] as SlotStatus}
            downloadsServed={stats[`files.${slot.slug}.downloads`] ?? (slot.slug === 'take-home' ? (stats['takehome.downloads'] ?? 0) : 0)}
            csrf={session.csrf}
          />
        ))}
      </div>
    </div>
  );
}

function SlotCard({
  slot,
  status,
  downloadsServed,
  csrf,
}: {
  slot: FileSlot;
  status: SlotStatus;
  downloadsServed: number;
  csrf: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <header className="flex items-start justify-between border-b border-zinc-200 px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">{esc(slot.title)}</h2>
          <p className="mt-1 text-xs text-zinc-500">{esc(slot.description)}</p>
        </div>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">{esc(slot.slug)}</span>
      </header>

      <div className="grid gap-6 px-6 py-5 md:grid-cols-2">
        <div className="text-sm text-zinc-700 space-y-1">
          {status.hasFile ? (
            <>
              {status.meta && (
                <div>Original filename: <span className="font-mono font-medium">{esc(status.meta.originalFilename)}</span></div>
              )}
              <div>Public filename: <span className="font-mono font-medium">{esc(slot.publicFilename)}</span></div>
              <div>Size: <span className="font-medium">{(status.size / 1024).toFixed(1)} KB</span></div>
              <div>Modified: <span className="font-medium">{new Date(status.mtimeMs).toLocaleString()}</span></div>
              <div>Downloads served: <span className="font-medium">{downloadsServed}</span></div>
              {status.backupSize > 0 && (
                <div className="text-xs text-zinc-500">
                  Backup: {(status.backupSize / 1024).toFixed(1)} KB
                </div>
              )}
              <div className="pt-3 space-x-4">
                <a href={`/admin/files/${slot.slug}/file`} className="text-sm text-blue-600 hover:underline">
                  Download (admin) →
                </a>
                <a href={`/api/downloads/${slot.slug}`} className="text-sm text-blue-600 hover:underline">
                  Public link →
                </a>
              </div>
            </>
          ) : (
            <p className="text-zinc-500">No file uploaded yet.</p>
          )}
        </div>

        <form
          method="POST"
          action={`/admin/files/${slot.slug}/replace`}
          encType="multipart/form-data"
          className="space-y-3"
        >
          <input type="hidden" name="_csrf" value={csrf} />
          <input
            type="file"
            name="file"
            required
            accept={slot.accept}
            className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {status.hasFile ? 'Upload & replace' : 'Upload'}
          </button>
          <p className="text-xs text-zinc-500">
            Max {(slot.maxBytes / (1024 * 1024)).toFixed(0)} MB. Validated by magic bytes ({slot.magicBytes.join(' / ')}).
          </p>
        </form>
      </div>
    </section>
  );
}
