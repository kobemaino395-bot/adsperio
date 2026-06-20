'use client';

import { useState } from 'react';

export default function FileTypeToggle({ name }: { name: string }) {
  const [kind, setKind] = useState<'local' | 'remote'>('local');
  return (
    <div className="md:col-span-2 space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Type</span>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value="local"
            checked={kind === 'local'}
            onChange={() => setKind('local')}
          />
          <span>
            <span className="font-medium">Local file</span>
            <span className="ml-2 text-xs text-zinc-500">Upload after creating</span>
          </span>
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value="remote"
            checked={kind === 'remote'}
            onChange={() => setKind('remote')}
          />
          <span>
            <span className="font-medium">Remote URL</span>
            <span className="ml-2 text-xs text-zinc-500">Proxy on every download</span>
          </span>
        </label>
      </div>
      {kind === 'remote' && (
        <label className="block">
          <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Remote URL</span>
          <input
            type="url"
            name="remoteUrl"
            required
            placeholder="https://example.com/path/to/file.zip"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Visitors download from /d/&lt;slug&gt;; the server proxies the bytes from this URL.
            Hard 50 MB cap per download.
          </p>
        </label>
      )}
    </div>
  );
}
