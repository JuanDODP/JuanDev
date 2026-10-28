import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

/**
 * Router-aware scrolling: jumps to `#hash` targets (smoothly when staying on the
 * same page) and resets to the top when entering a new route.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const prevPath = useRef(pathname);

  useEffect(() => {
    const samePage = prevPath.current === pathname;
    prevPath.current = pathname;

    if (!hash) {
      if (!samePage) window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    // Wait a frame so the target section exists after a route change.
    const raf = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: samePage ? 'smooth' : 'instant' });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
