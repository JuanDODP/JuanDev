import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CYAN_BASE = 'rgba(34,211,238,';

function spawnRipple(x: number, y: number) {
  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'fixed',
    left: x + 'px',
    top: y + 'px',
    width: '0px',
    height: '0px',
    borderRadius: '50%',
    border: '1.5px solid rgba(34,211,238,0.75)',
    transform: 'translate(-50%,-50%)',
    pointerEvents: 'none',
    zIndex: '9989',
  });
  document.body.appendChild(el);

  // Second, subtler ripple
  const el2 = document.createElement('div');
  Object.assign(el2.style, {
    position: 'fixed',
    left: x + 'px',
    top: y + 'px',
    width: '0px',
    height: '0px',
    borderRadius: '50%',
    border: '1px solid rgba(34,211,238,0.35)',
    transform: 'translate(-50%,-50%)',
    pointerEvents: 'none',
    zIndex: '9988',
  });
  document.body.appendChild(el2);

  gsap.to(el,  { width: 80,  height: 80,  opacity: 0, duration: 0.55, ease: 'power2.out', onComplete: () => el.remove() });
  gsap.to(el2, { width: 130, height: 130, opacity: 0, duration: 0.8,  ease: 'power2.out', delay: 0.05, onComplete: () => el2.remove() });
}

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cvRef   = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on touch-only devices
    if (window.matchMedia('(pointer:coarse)').matches) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;
    const glow = glowRef.current!;
    const cv   = cvRef.current!;
    const ctx  = cv.getContext('2d')!;

    const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
    resize();
    addEventListener('resize', resize);

    // GSAP: center elements via xPercent/yPercent, start off-screen
    gsap.set([dot, ring, glow], { xPercent: -50, yPercent: -50, x: -300, y: -300, opacity: 0 });

    // quickSetters for high-frequency moves (no Tween overhead)
    const qsDotX  = gsap.quickSetter(dot,  'x', 'px') as (v: number) => void;
    const qsDotY  = gsap.quickSetter(dot,  'y', 'px') as (v: number) => void;
    const qsRingX = gsap.quickSetter(ring, 'x', 'px') as (v: number) => void;
    const qsRingY = gsap.quickSetter(ring, 'y', 'px') as (v: number) => void;
    const qsGlowX = gsap.quickSetter(glow, 'x', 'px') as (v: number) => void;
    const qsGlowY = gsap.quickSetter(glow, 'y', 'px') as (v: number) => void;

    // Lerp positions
    const m  = { x: -300, y: -300 }; // target (mouse)
    const rp = { x: -300, y: -300 }; // ring  position
    const gp = { x: -300, y: -300 }; // glow  position

    let ready    = false;
    let hovering = false;

    // ── Particle pool ───────────────────────────────────────────
    interface Pt { x: number; y: number; vx: number; vy: number; a: number; decay: number; r: number; }
    const pts: Pt[] = [];
    let lpx = -300, lpy = -300;

    // ── Mouse move ──────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      m.x = e.clientX; m.y = e.clientY;
      qsDotX(e.clientX); qsDotY(e.clientY);

      if (!ready) {
        ready = true;
        gsap.to([dot, ring, glow], { opacity: 1, duration: 0.35, stagger: 0.06 });
      }

      // Spawn particles on significant movement
      const dx = e.clientX - lpx, dy = e.clientY - lpy;
      const dd = dx * dx + dy * dy;
      if (dd > 100) {
        const spd = Math.sqrt(dd) * 0.05;
        const n   = Math.min(4, Math.ceil(spd) + 1);
        for (let i = 0; i < n; i++) {
          pts.push({
            x:     e.clientX + (Math.random() - .5) * 12,
            y:     e.clientY + (Math.random() - .5) * 12,
            vx:    (Math.random() - .5) * 2,
            vy:    -(Math.random() * 2.2 + 0.5),
            a:     Math.random() * 0.55 + 0.2,
            decay: Math.random() * 0.028 + 0.01,
            r:     Math.random() * 2.8 + 0.4,
          });
        }
        lpx = e.clientX; lpy = e.clientY;
      }
    };

    // ── Hover detection ─────────────────────────────────────────
    const HOVER_SEL = 'a,button,[role="button"]';

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(HOVER_SEL) && !hovering) {
        hovering = true;
        gsap.to(ring, { width: 54, height: 54, borderColor: 'rgba(34,211,238,0.95)', duration: 0.22, ease: 'power2.out' });
        gsap.to(dot,  { scale: 0, duration: 0.18 });
        gsap.to(glow, { opacity: 0.9, duration: 0.2 });
      }
    };

    const onOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as HTMLElement)?.closest(HOVER_SEL) && hovering) {
        hovering = false;
        gsap.to(ring, { width: 34, height: 34, borderColor: 'rgba(34,211,238,0.5)', duration: 0.28, ease: 'power2.out' });
        gsap.to(dot,  { scale: 1, duration: 0.2 });
        gsap.to(glow, { opacity: 1, duration: 0.2 });
      }
    };

    // ── Click ripple + ring pulse ────────────────────────────────
    const onDown = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY);
      gsap.timeline()
        .to(ring, { scale: 2.4, opacity: 0, duration: 0.42, ease: 'power2.out' }, 0)
        .to(dot,  { scale: hovering ? 0 : 0.5, duration: 0.1 }, 0)
        .set(ring, { scale: 1, opacity: hovering ? 0.9 : 1 })
        .to(dot,  { scale: hovering ? 0 : 1, duration: 0.15 });
    };

    // ── Window visibility ────────────────────────────────────────
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.18 });
    const onEnter = () => { if (ready) gsap.to([dot, ring], { opacity: 1, duration: 0.18 }); };

    // ── Ticker: lerp + canvas particles ─────────────────────────
    const tick = () => {
      // Ring lerp
      rp.x += (m.x - rp.x) * 0.13;
      rp.y += (m.y - rp.y) * 0.13;
      qsRingX(rp.x); qsRingY(rp.y);

      // Glow lerp (slower, dreamier)
      gp.x += (m.x - gp.x) * 0.045;
      gp.y += (m.y - gp.y) * 0.045;
      qsGlowX(gp.x); qsGlowY(gp.y);

      // Canvas particle system
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.03; // gravity
        p.vx *= 0.98; // friction
        p.a  -= p.decay;
        if (p.a <= 0) { pts.splice(i, 1); continue; }

        // Core particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = CYAN_BASE + p.a.toFixed(3) + ')';
        ctx.fill();

        // Tiny inner bright core
        if (p.r > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = CYAN_BASE + Math.min(1, p.a * 2).toFixed(3) + ')';
          ctx.fill();
        }
      }
    };
    gsap.ticker.add(tick);

    document.addEventListener('mousemove',   onMove);
    document.addEventListener('mouseover',   onOver);
    document.addEventListener('mouseout',    onOut);
    document.addEventListener('mousedown',   onDown);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      document.removeEventListener('mousemove',   onMove);
      document.removeEventListener('mouseover',   onOver);
      document.removeEventListener('mouseout',    onOut);
      document.removeEventListener('mousedown',   onDown);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      removeEventListener('resize', resize);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={cvRef}
        aria-hidden
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9992 }}
      />

      {/* Ambient glow sphere — slowest follower */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 420, height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, rgba(129,140,248,0.03) 45%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9993,
          filter: 'blur(1px)',
        }}
      />

      {/* Outer ring — medium lerp */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 34, height: 34,
          borderRadius: '50%',
          border: '1.5px solid rgba(34,211,238,0.5)',
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'screen',
        }}
      />

      {/* Precise inner dot */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6,
          borderRadius: '50%',
          background: '#22d3ee',
          boxShadow: '0 0 10px rgba(34,211,238,0.9), 0 0 22px rgba(34,211,238,0.45)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
}
