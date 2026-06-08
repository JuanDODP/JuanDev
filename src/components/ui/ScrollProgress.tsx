import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 20, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: 2,
        height: '100vh',
        background: 'linear-gradient(to bottom, transparent 0%, var(--cyan) 12%, var(--cyan) 88%, transparent 100%)',
        scaleY,
        transformOrigin: 'top center',
        zIndex: 200,
        opacity: 0.6,
        boxShadow: '0 0 8px rgba(34,211,238,0.45)',
        pointerEvents: 'none',
      }}
    />
  );
}
