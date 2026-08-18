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
  const isRemote = kind === 'proxy' || kind === 'redirect';
  return (
    <>
      <label className="block">
        <span className="field-label">Type</span>
        <select
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="field"
        >
          <option value="local">Local file</option>
          <option value="proxy">Proxy remote URL (server serves the bytes)</option>
          <option value="redirect">Anonymous redirect (forward the visitor)</option>
        </select>
        <p className="caption mt-1.5">
          Switching local → remote keeps the on-disk file as a backup but stops serving it.
        </p>
      </label>
      {isRemote && (
        <label className="block md:col-span-2">
          <span className="field-label">
            {kind === 'proxy' ? 'Remote URL (proxied)' : 'Redirect URL'}
          </span>
          <input
            type="text"
            name="remoteUrl"
            defaultValue={initialRemoteUrl}
            placeholder="https://example.com/path/to/file.zip"
            className="field font-mono text-[0.875rem]"
          />
          <p className="caption mt-1.5">
            {kind === 'proxy'
              ? 'Server fetches this URL and streams the bytes on every download.'
              : 'Visitors are 302-redirected here with no referrer — our origin stays hidden.'}
          </p>
        </label>
      )}
    </>
  );
}
