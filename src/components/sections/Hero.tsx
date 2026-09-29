import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { animate, AnimatePresence, motion } from 'motion/react';
import { profile, projects } from '../../data/portfolio';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useScramble } from '../../hooks/useScramble';
import foto from '../../assets/profile/Juan.png';

/* ── Social channels — icon-only quick links under the photo ── */
const SOCIALS = [
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  },
  {
    label: 'LinkedIn',
    href: profile.linkedin,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    label: 'GitHub',
    href: profile.github,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>,
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/525612227107?text=%C2%A1Hola%20Juan!%20Acabo%20de%20visitar%20tu%20portafolio%20y%20me%20encant%C3%B3%20tu%20trabajo.%20Me%20gustar%C3%ADa%20hablar%20contigo%20%F0%9F%98%8A',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>,
  },
];

/* ── Count-up stat component — odometer-style digit roll ── */
/* Hero is always visible on load (first fold), so we start the count-up
   on mount instead of via IntersectionObserver — observing it raced with
   GSAP's entrance transform (translateY) and could miss the trigger.
   Drives a single `animate()` controller that calls setState directly
   (no MotionValue/useTransform in the loop) so nothing gets recreated
   mid-animation. Each digit is its own AnimatePresence slot: when its
   character changes, the old one flips out and the new one flips in —
   a proper odometer feel instead of a flat number swap. */
function CountStat({ target, prefix = '', suffix = '', label }: { target: number; prefix?: string; suffix?: string; label: string }) {
  const [display, setDisplay] = useState(0);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 1.4,
      delay: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: latest => setDisplay(Math.round(latest)),
      onComplete: () => setSettled(true),
    });
    return () => controls.stop();
  }, [target]);

  const digits = String(display).split('');

  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 900,
          color: 'var(--cyan)', letterSpacing: '-0.05em', lineHeight: 1,
          display: 'inline-flex', alignItems: 'baseline',
          textShadow: settled ? '0 0 14px rgba(34,211,238,0.3)' : '0 0 26px rgba(34,211,238,0.7)',
          transform: settled ? 'scale(1)' : 'scale(1.06)',
          transition: 'text-shadow 0.6s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {prefix}
        <span style={{ display: 'inline-flex', fontVariantNumeric: 'tabular-nums' }}>
          {digits.map((d, i) => (
            <span key={i} style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', height: '1.05em' }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={d}
                  initial={{ y: '0.75em', opacity: 0 }}
                  animate={{ y: '0em', opacity: 1 }}
                  exit={{ y: '-0.75em', opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-block' }}
                >
                  {d}
                </motion.span>
              </AnimatePresence>
            </span>
          ))}
        </span>
        {suffix}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)', marginTop: '0.3rem', letterSpacing: '0.05em' }}>{label}</p>
    </div>
  );
}

function CyanBtn({ href, children, primary = false, target }: { href: string; children: React.ReactNode; primary?: boolean; target?: string }) {
  const ref = useMagnetic(0.28) as React.RefObject<HTMLAnchorElement>;
  return (
    <a ref={ref} href={href} target={target} rel={target ? 'noopener noreferrer' : undefined}
      className={primary ? 'btn-cyan' : 'btn-ghost'}
      style={{ fontSize: '0.9rem', padding: '0.7rem 1.4rem', fontFamily: 'var(--font-display)' }}
      onClick={!target ? (e) => { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); } : undefined}
    >
      {children}
    </a>
  );
}

export default function Hero() {
  const sectionRef    = useRef<HTMLElement>(null);
  const photoRef      = useRef<HTMLDivElement>(null);
  const cyanGlowRef   = useRef<HTMLDivElement>(null);
  const purpleGlowRef = useRef<HTMLDivElement>(null);
  const [scrambleTrigger] = useState(true);

  const scrambled = useScramble('Full Stack JS Developer &amp; AI Integrator', scrambleTrigger, 1400);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.set('[data-hero]', { opacity: 0, y: 40 });
    gsap.set(photoRef.current, { opacity: 0, scale: 0.9, x: -30 });

    tl.to(photoRef.current, { opacity: 1, scale: 1, x: 0, duration: 1.0, ease: 'power2.out' }, 0.2)
      .to('[data-hero]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.35);
  }, { scope: sectionRef });

  // Mouse parallax — glow blobs & photo depth
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      const nx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2; // -1..1
      const ny = ((e.clientY - rect.top)   / rect.height - 0.5) * 2; // -1..1

      if (cyanGlowRef.current) {
        gsap.to(cyanGlowRef.current, { x: nx * -50, y: ny * -35, duration: 2.2, ease: 'power2.out', overwrite: 'auto' });
      }
      if (purpleGlowRef.current) {
        gsap.to(purpleGlowRef.current, { x: nx * 35, y: ny * 25, duration: 2.8, ease: 'power2.out', overwrite: 'auto' });
      }
      if (photoRef.current) {
        gsap.to(photoRef.current, {
          rotateY: nx * 6,
          rotateX: -ny * 4,
          transformPerspective: 1200,
          duration: 1.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={sectionRef} id="hero" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '60px' }}>

      {/* Radial glow — tracked by mouse parallax */}
      <div ref={cyanGlowRef}   aria-hidden style={{ position: 'absolute', top: '30%',   right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)',   pointerEvents: 'none', borderRadius: '50%' }} />
      <div ref={purpleGlowRef} aria-hidden style={{ position: 'absolute', bottom: '10%', left: '-5%',   width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 65%)', pointerEvents: 'none', borderRadius: '50%' }} />

      {/* Grid lines */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', paddingBlock: '3rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(2.5rem, 5vw, 5rem)', alignItems: 'center', maxWidth: '1100px' }} className="hero-inner">

          {/* Photo */}
          <div ref={photoRef} style={{ position: 'relative', flexShrink: 0, alignSelf: 'flex-start', marginTop: '1rem' }} className="hero-photo-wrap">
            <div style={{ width: 'clamp(180px, 20vw, 260px)' }}>
              <div style={{ position: 'relative' }}>
                {/* Glowing border frame */}
                <div style={{
                  position: 'absolute', inset: -2,
                  background: `linear-gradient(135deg, var(--cyan) 0%, transparent 50%, rgba(129,140,248,0.6) 100%)`,
                  borderRadius: 16,
                  padding: 1,
                  zIndex: 0,
                }} />
                <div style={{
                  position: 'relative', zIndex: 1,
                  borderRadius: 14,
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  background: 'var(--surface)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}>
                  <img src={foto} alt="Juan Diego Domínguez Castaño"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', filter: 'contrast(1.05) brightness(0.95)' }}
                  />
                  {/* Scanline overlay */}
                  <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px)', pointerEvents: 'none' }} />
                </div>
                {/* Status badge */}
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(11,19,38,0.9)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-2)', borderRadius: 20, padding: '0.3rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', zIndex: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 8px var(--success)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-1)', letterSpacing: '0.06em' }}>DISPONIBLE</span>
                </div>
              </div>

              {/* Social channels — icon-only, same width as the photo card */}
              <div className="hero-social-row" style={{ display: 'flex', justifyContent: 'center', gap: '0.55rem', marginTop: '1.1rem' }}>
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="hero-social-btn"
                    aria-label={s.label}
                  >
                    {s.icon}
                    <span className="hero-social-tip">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <p data-hero style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: '1.25rem' }}>
              Full Stack JS Developer
            </p>

            <h1 data-hero style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '0.5rem', color: 'var(--text-1)' }}>
              Juan Diego<br />Domínguez Castaño
            </h1>

            <h2 data-hero style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
              <span style={{ background: 'linear-gradient(90deg, var(--cyan) 0%, #67e8f9 60%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                dangerouslySetInnerHTML={{ __html: scrambled }} />
            </h2>

            <p data-hero style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '52ch', marginBottom: '2rem' }}>
              Transformando ideas complejas en soluciones escalables. Especializado en aplicaciones móviles multiplataforma, arquitecturas backend robustas con despliegues en la nube, y automatización con Inteligencia Artificial.
            </p>

            <div data-hero style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
              <CyanBtn href="#projects" primary>
                Explorar Proyectos
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </CyanBtn>
              <CyanBtn href={profile.cvUrl} target="_blank">
                Descargar CV
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </CyanBtn>
            </div>

            {/* Stats row — count-up on mount */}
            <div data-hero style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <CountStat target={2}               prefix="+" label="años en producción" />
              <CountStat target={projects.length}            label="proyectos lanzados" />
              <CountStat target={3}                           label="plataformas móviles" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: 0.4, pointerEvents: 'none' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--cyan), transparent)' }} />
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-inner { grid-template-columns: 1fr !important; }
          .hero-photo-wrap { display: flex; justify-content: center; order: -1; }
        }

        /* ── Social icon buttons under the photo ── */
        .hero-social-btn {
          position: relative;
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-2);
          color: var(--text-2);
          text-decoration: none;
          transition: color 0.22s ease, border-color 0.22s ease, background 0.22s ease,
                      transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease;
        }
        .hero-social-btn:hover,
        .hero-social-btn:focus-visible {
          color: var(--cyan);
          border-color: rgba(34,211,238,0.55);
          background: rgba(34,211,238,0.1);
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 10px 22px rgba(34,211,238,0.25);
        }
        .hero-social-tip {
          position: absolute;
          bottom: calc(100% + 9px);
          left: 50%;
          transform: translate(-50%, 4px);
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          background: rgba(8,14,28,0.95);
          border: 1px solid var(--border-2);
          color: var(--text-1);
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 5;
        }
        .hero-social-btn:hover .hero-social-tip,
        .hero-social-btn:focus-visible .hero-social-tip {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      `}</style>
    </section>
  );
}
