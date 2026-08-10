'use client';

import { useState } from 'react';

type Kind = 'local' | 'proxy' | 'redirect';

const OPTIONS: { value: Kind; label: string; hint: string }[] = [
  { value: 'local', label: 'Local file', hint: 'Upload after creating' },
  { value: 'proxy', label: 'Proxy remote URL', hint: 'Server downloads & serves the bytes' },
  { value: 'redirect', label: 'Anonymous redirect', hint: 'Forward the visitor, hide our origin' },
];

export default function FileTypeToggle({ name }: { name: string }) {
  const [kind, setKind] = useState<Kind>('local');
  const isRemote = kind === 'proxy' || kind === 'redirect';
  return (
    <div className="md:col-span-2 space-y-2">
      <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">Type</span>
      <div className="flex flex-wrap gap-4 text-sm">
        {OPTIONS.map((o) => (
          <label key={o.value} className="inline-flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={kind === o.value}
              onChange={() => setKind(o.value)}
            />
            <span>
              <span className="font-medium">{o.label}</span>
              <span className="ml-2 text-xs text-zinc-500">{o.hint}</span>
            </span>
          </label>
        ))}
      </div>
      {isRemote && (
        <label className="block">
          <span className="block text-xs font-medium uppercase tracking-wider text-zinc-600">
            {kind === 'proxy' ? 'Remote URL (proxied)' : 'Redirect URL'}
          </span>
          <input
            type="url"
            name="remoteUrl"
            required
            placeholder="https://example.com/path/to/file.zip"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono"
          />
          <p className="mt-1 text-xs text-zinc-500">
            {kind === 'proxy' ? (
              <>
                Visitors download from the public URL; the server fetches this URL and streams the
                bytes back, so the source URL never appears in the browser. Downloads over the size
                limit are refused.
              </>
            ) : (
              <>
                Visitors hitting the public URL are 302-redirected here with no referrer, so the
                destination can&rsquo;t see that our site sent them.
              </>
            )}
          </p>
        </label>
      )}
    </div>
  );
}
