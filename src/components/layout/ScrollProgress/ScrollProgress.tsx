import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../../lib/gsap';
import styles from './ScrollProgress.module.css';

/** Thin amber line under the navbar that tracks how far down the page you are. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.3 } },
      );
    });
  });

  return <div ref={bar} className={styles.bar} aria-hidden />;
}
