'use client';

import { useEffect, useState } from 'react';

export default function LocalTime({ iso, fallback }: { iso: string; fallback?: string }) {
  const [text, setText] = useState(fallback ?? iso);
  useEffect(() => {
    if (!iso) {
      setText('');
      return;
    }
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) setText(d.toLocaleString());
  }, [iso]);
  return <time dateTime={iso} suppressHydrationWarning>{text}</time>;
}
