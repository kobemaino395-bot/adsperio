'use client';
import { useState } from 'react';

export default function SettingsKindFields({
  initialKind,
  initialRemoteUrl,
}: {
  initialKind: string;
  initialRemoteUrl: string;
}) {
  const [kind, setKind] = useState(initialKind);
  return (
    <>
      <label className="block">
        <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Type</span>
        <select
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="local">Local file</option>
          <option value="remote">Remote URL (proxy)</option>
        </select>
        <p className="mt-1 text-xs text-zinc-500">
          Switching local → remote keeps the on-disk file as a backup but stops serving it.
        </p>
      </label>
      {kind === 'remote' && (
        <label className="block md:col-span-2">
          <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Remote URL</span>
          <input
            type="text"
            name="remoteUrl"
            defaultValue={initialRemoteUrl}
            placeholder="https://example.com/path/to/file.zip"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
          />
        </label>
      )}
    </>
  );
}
