'use client';

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type ElementType,
} from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
};

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
const motionReduced = () => window.matchMedia(REDUCED_MOTION).matches;
const motionReducedOnServer = () => false;

/** Fade-and-rise on first intersection. Deliberately small: 8px and 450ms.
 *  Anything larger reads as a template. */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  // Read as a subscription rather than an effect, so a reduced-motion visitor
  // gets fully-opaque content on the first paint instead of a fade-in frame.
  const reduced = useSyncExternalStore(
    subscribeMotion,
    motionReduced,
    motionReducedOnServer
  );

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay, reduced]);

  const shown = reduced || visible;

  return (
    <Tag
      ref={ref}
      className={`${
        reduced
          ? ''
          : 'transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.16,0.84,0.44,1)]'
      } ${shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'} ${className}`}
    >
      {children}
    </Tag>
  );
}
