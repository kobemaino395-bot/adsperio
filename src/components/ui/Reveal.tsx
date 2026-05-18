'use client';

import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
};

export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}