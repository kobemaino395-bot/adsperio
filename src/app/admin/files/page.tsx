import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { readSessionFromCookies } from '@/server/admin/auth';
import { audit, esc, readClientIp } from '@/server/admin/security';
import { DEFAULT_MAX_BYTES, listSlots, type SlotRecord } from '@/server/slot-registry';
import { readSlotStatus, type SlotStatus } from '@/server/files';
import { readStats } from '@/server/storage';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ ok?: string; error?: string; slug?: string; created?: string; deleted?: string }>;

export default async function FilesPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await readSessionFromCookies();
  if (!session) redirect('/admin/login');

  const h = await headers();
  audit({ kind: 'admin.access', username: session.username, ip: readClientIp(h), path: '/admin/files' });

  const { ok, error, slug, created, deleted } = await searchParams;
  const slots = await listSlots();
  const statuses = await Promise.all(slots.map((s) => readSlotStatus(s.slug)));
  const stats = await readStats();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Files</h1>
        <span className="text-xs text-zinc-500">{slots.length} slot{slots.length === 1 ? '' : 's'}</span>
      </header>

      {ok && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          File replaced{slug ? ` for "${esc(slug)}"` : ''}. Previous version saved as file.bin.bak.
        </div>
      )}
      {created && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          New slot &ldquo;{esc(created)}&rdquo; created. Public URL: <span className="font-mono">/api/downloads/{esc(created)}</span> (404 until you upload a file below).
        </div>
      )}
      {deleted && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Slot &ldquo;{esc(deleted)}&rdquo; deleted.
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {esc(decodeURIComponent(error))}
        </div>
      )}

      <CreateSlotCard csrf={session.csrf} />

      <div className="space-y-6">
        {slots.map((s, i) => (
          <SlotCard
            key={s.slug}
            slot={s}
            status={statuses[i] as SlotStatus}
            downloadsServed={stats[`files.${s.slug}.downloads`] ?? (s.slug === 'take-home' ? (stats['takehome.downloads'] ?? 0) : 0)}
            csrf={session.csrf}
          />
        ))}
      </div>
    </div>
  );
}

function CreateSlotCard({ csrf }: { csrf: string }) {
  return (
    <section className="rounded-lg border border-dashed border-zinc-300 bg-white">
      <header className="border-b border-zinc-200 px-6 py-4">
        <h2 className="text-sm font-semibold tracking-tight">Create a new download slot</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Each slot creates a public URL at <span className="font-mono">/api/downloads/&lt;slug&gt;</span>. After creating the slot, upload the file in its card below.
        </p>
      </header>
      <form method="POST" action="/admin/files/create" className="grid gap-4 px-6 py-5 md:grid-cols-2">
        <input type="hidden" name="_csrf" value={csrf} />
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Slug (URL-safe)</label>
          <input
            type="text"
            name="slug"
            required
            pattern="^[a-z][a-z0-9-]{1,40}$"
            placeholder="e.g. employee-handbook"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-zinc-500">2–41 chars, lowercase letters / digits / hyphens, start with a letter.</p>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g. Employee handbook"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Description (optional)</label>
          <input
            type="text"
            name="description"
            placeholder="What this file is for"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Public filename (optional)</label>
          <input
            type="text"
            name="publicFilename"
            placeholder="e.g. Adnovara_Handbook.pdf"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-zinc-500">If blank, visitors get the original uploaded filename.</p>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Public MIME type (optional)</label>
          <input
            type="text"
            name="publicMimeType"
            placeholder="e.g. application/pdf"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-zinc-500">If blank, uses the uploaded file&apos;s detected type.</p>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Create slot
          </button>
          <span className="ml-3 text-xs text-zinc-500">Max upload size will default to {Math.round(DEFAULT_MAX_BYTES / (1024 * 1024))} MB.</span>
        </div>
      </form>
    </section>
  );
}

function SlotCard({
  slot,
  status,
  downloadsServed,
  csrf,
}: {
  slot: SlotRecord;
  status: SlotStatus;
  downloadsServed: number;
  csrf: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white">
      <header className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">{esc(slot.title)}</h2>
            {slot.isBuiltin && (
              <span className="rounded-full border border-zinc-300 px-2 py-px font-mono text-[0.55rem] uppercase tracking-[0.18em] text-zinc-500">
                Built-in
              </span>
            )}
          </div>
          {slot.description && (
            <p className="mt-1 text-xs text-zinc-500">{esc(slot.description)}</p>
          )}
        </div>
        <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">{esc(slot.slug)}</span>
      </header>

      <div className="grid gap-6 px-6 py-5 md:grid-cols-2">
        <div className="space-y-1 text-sm text-zinc-700">
          {status.hasFile ? (
            <>
              {status.meta && (
                <div>Original filename: <span className="font-mono font-medium">{esc(status.meta.originalFilename)}</span></div>
              )}
              <div>
                Public filename:{' '}
                <span className="font-mono font-medium">
                  {esc(slot.publicFilename || status.meta?.originalFilename || `${slot.slug}.bin`)}
                </span>
              </div>
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
          {!slot.isBuiltin && (
            <form method="POST" action={`/admin/files/${slot.slug}/delete`} className="pt-4">
              <input type="hidden" name="_csrf" value={csrf} />
              <button
                type="submit"
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Delete this slot
              </button>
              <span className="ml-2 text-xs text-zinc-400">(removes config + file)</span>
            </form>
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
            className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            {status.hasFile ? 'Upload & replace' : 'Upload'}
          </button>
          <p className="text-xs text-zinc-500">
            Any file type. Max {(slot.maxBytes / (1024 * 1024)).toFixed(0)} MB.
          </p>
        </form>
      </div>
    </section>
  );
}
