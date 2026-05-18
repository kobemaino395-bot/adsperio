'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;  // 0–1, how pronounced the tilt is
};

export default function TiltCard({ children, className = '', intensity = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1
    const rotX = (0.5 - y) * 12 * intensity;          // deg
    const rotY = (x - 0.5) * 12 * intensity;          // deg
    el.style.setProperty('--rot-x', `${rotX}deg`);
    el.style.setProperty('--rot-y', `${rotY}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rot-x', '0deg');
    el.style.setProperty('--rot-y', '0deg');
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      className={`group relative ${className}`}
    >
      <div
        style={{
          transform: 'rotateX(var(--rot-x, 0deg)) rotateY(var(--rot-y, 0deg))',
          transformStyle: 'preserve-3d',
          transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative h-full w-full"
      >
        {/* Specular highlight — follows cursor */}
        <div
          aria-hidden
          style={{
            background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.25), transparent 40%)',
          }}
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {children}
      </div>
    </div>
  );
}