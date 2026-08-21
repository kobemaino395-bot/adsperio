import { POSITION_FALLBACK_KEY } from '@/server/content/position-files';
import type { Position } from '@/server/content/positions';

type Row = { key: string; label: string; filename: string };

function rowsFor(position: Position): Row[] {
  const rows: Row[] = position.roleOptions.map((r) => ({
    key: r.id,
    label: r.label || r.id,
    filename: r.testFileName,
  }));
  rows.push({ key: POSITION_FALLBACK_KEY, label: 'Position-level fallback', filename: position.testFileName });
  return rows;
}

export default function TakeHomeFiles({ position, csrf }: { position: Position; csrf: string }) {
  const rows = rowsFor(position);

  return (
    <fieldset className="card space-y-4 p-5">
      <legend className="eyebrow text-ink px-2">Take-home files</legend>
      <p className="text-ink-mute text-xs leading-relaxed">
        PDF, ZIP, DOC, or DOCX — 50 MB max. Uploading replaces the current file for that row.
      </p>
      <div className="divide-hairline divide-y">
        {rows.map((row) => (
          <div key={row.key} className="grid gap-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="text-sm font-medium">{row.label}</div>
              <div className="text-ink-mute mt-1 font-mono text-xs">
                {row.filename ? row.filename : 'No file uploaded'}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <form
                method="POST"
                action={`/admin/content/positions/${position.slug}/take-home/${row.key}/upload`}
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
                  {row.filename ? 'Replace' : 'Upload'}
                </button>
              </form>
              {row.filename && (
                <form
                  method="POST"
                  action={`/admin/content/positions/${position.slug}/take-home/${row.key}/delete`}
                >
                  <input type="hidden" name="_csrf" value={csrf} />
                  <button type="submit" className="eyebrow text-ink-mute hover:text-ink transition-colors">
                    Remove
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
