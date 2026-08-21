import type { Position } from '@/server/content/positions';

export default function TakeHomeFiles({ position, csrf }: { position: Position; csrf: string }) {
  const filename = position.testFileName;

  return (
    <fieldset className="card space-y-4 p-5">
      <legend className="eyebrow text-ink px-2">Take-home file</legend>
      <p className="text-ink-mute text-xs leading-relaxed">
        One file per position, shared across all its roles. PDF, ZIP, DOC, or DOCX — 50 MB max. Uploading
        replaces the current file.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-ink-mute font-mono text-xs">
            {filename ? filename : 'No file uploaded'}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <form
            method="POST"
            action={`/admin/content/positions/${position.slug}/take-home/upload`}
            encType="multipart/form-data"
            className="flex items-center gap-2"
          >
            <input type="hidden" name="_csrf" value={csrf} />
            <input
              type="file"
              name="file"
              accept=".pdf,.zip,.doc,.docx"
              required
              className="text-ink-mute w-48 text-xs file:mr-2 file:rounded-full file:border-0 file:bg-[var(--indigo)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
            />
            <button type="submit" className="btn btn-line px-3 py-1.5 text-xs">
              {filename ? 'Replace' : 'Upload'}
            </button>
          </form>
          {filename && (
            <form method="POST" action={`/admin/content/positions/${position.slug}/take-home/delete`}>
              <input type="hidden" name="_csrf" value={csrf} />
              <button type="submit" className="eyebrow text-ink-mute hover:text-ink transition-colors">
                Remove
              </button>
            </form>
          )}
        </div>
      </div>
    </fieldset>
  );
}
