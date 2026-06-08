import { motion } from 'motion/react';

const ORBS = [
  {
    color: 'rgba(34,211,238,0.09)',
    size: 720,
    style: { top: '5%', left: '8%' },
    keyframes: { x: [0, 90, -40, 20, 0], y: [0, -60, 50, -20, 0] },
    duration: 30,
    delay: 0,
  },
  {
    color: 'rgba(129,140,248,0.08)',
    size: 680,
    style: { top: '50%', right: '-4%' },
    keyframes: { x: [0, -70, 55, -30, 0], y: [0, 80, -60, 30, 0] },
    duration: 38,
    delay: 5,
  },
  {
    color: 'rgba(34,211,238,0.07)',
    size: 580,
    style: { bottom: '8%', left: '-2%' },
    keyframes: { x: [0, 60, -25, 40, 0], y: [0, -50, 35, -15, 0] },
    duration: 26,
    delay: 10,
  },
  {
    color: 'rgba(99,102,241,0.08)',
    size: 520,
    style: { top: '38%', right: '22%' },
    keyframes: { x: [0, -45, 65, -20, 0], y: [0, 55, -35, 20, 0] },
    duration: 42,
    delay: 14,
  },
  {
    color: 'rgba(34,211,238,0.06)',
    size: 440,
    style: { top: '70%', left: '45%' },
    keyframes: { x: [0, 35, -55, 15, 0], y: [0, -45, 25, -10, 0] },
    duration: 34,
    delay: 7,
  },
] as const;

export default function AmbientOrbs() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none',
        zIndex: 9980,
        overflow: 'hidden',
      }}
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 68%)`,
            filter: 'blur(0px)',
            mixBlendMode: 'screen',
            ...orb.style,
          }}
          animate={orb.keyframes}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
