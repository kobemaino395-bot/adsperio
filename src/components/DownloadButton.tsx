'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  /** When set, the wait/error message inherits these classes so it can be
   *  themed to match the surrounding card. Defaults to a quiet zinc tone. */
  messageClassName?: string;
};

function parseFilename(cd: string | null): string | null {
  if (!cd) return null;
  const star = /filename\*\s*=\s*[^']*''([^;]+)/i.exec(cd);
  if (star) {
    try {
      return decodeURIComponent(star[1]!.trim());
    } catch {
      // fall through
    }
  }
  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
  return plain ? plain[1]!.trim() : null;
}

export default function DownloadButton({ href, className, children, messageClassName }: Props) {
  const [waitSec, setWaitSec] = useState<number | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  function startCountdown(seconds: number) {
    if (tickRef.current) clearInterval(tickRef.current);
    setWaitSec(seconds);
    tickRef.current = setInterval(() => {
      setWaitSec((n) => {
        if (n === null) return null;
        if (n <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          return null;
        }
        return n - 1;
      });
    }, 1000);
  }

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Preserve modifier-clicks (open in new tab etc.) — let the browser handle them.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (busy) return;

    setErrMsg(null);
    setWaitSec(null);
    setBusy(true);
    try {
      const res = await fetch(href, { cache: 'no-store' });
      if (res.status === 429) {
        const ra = Number(res.headers.get('retry-after') ?? '30');
        startCountdown(Number.isFinite(ra) && ra > 0 ? ra : 30);
        return;
      }
      if (!res.ok) {
        setErrMsg(`Download failed (HTTP ${res.status}). Try again in a moment.`);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = parseFilename(res.headers.get('content-disposition')) ?? '';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setErrMsg('Download failed. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-busy={busy}>
        {children}
      </a>
      {waitSec !== null && (
        <p className={messageClassName ?? 'mt-2 text-xs text-zinc-400'}>
          Please wait {waitSec} more second{waitSec === 1 ? '' : 's'} before downloading again.
        </p>
      )}
      {errMsg && (
        <p className={messageClassName ?? 'mt-2 text-xs text-red-400'}>{errMsg}</p>
      )}
    </>
  );
}
