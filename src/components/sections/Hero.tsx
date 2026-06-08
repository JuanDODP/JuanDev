import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { profile } from '../../data/portfolio';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useScramble } from '../../hooks/useScramble';
import foto from '../../assets/profile/Juan.png';

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
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);
  const [scrambleTrigger] = useState(true);

  const scrambled = useScramble('Full Stack JS Developer &amp; AI Integrator', scrambleTrigger, 1400);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    gsap.set('[data-hero]', { opacity: 0, y: 40 });
    gsap.set(photoRef.current, { opacity: 0, scale: 0.9, x: -30 });

    tl.to(photoRef.current, { opacity: 1, scale: 1, x: 0, duration: 1.0, ease: 'power2.out' }, 0.2)
      .to('[data-hero]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.35);
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="hero" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '60px' }}>

      {/* Radial glow */}
      <div aria-hidden style={{ position: 'absolute', top: '30%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)', pointerEvents: 'none', borderRadius: '50%' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 65%)', pointerEvents: 'none', borderRadius: '50%' }} />

      {/* Grid lines */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,211,238,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.03) 1px,transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', paddingBlock: '3rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(2.5rem, 5vw, 5rem)', alignItems: 'center', maxWidth: '1100px' }} className="hero-inner">

          {/* Photo */}
          <div ref={photoRef} style={{ position: 'relative', flexShrink: 0, alignSelf: 'flex-start', marginTop: '1rem' }} className="hero-photo-wrap">
            <div style={{ width: 'clamp(180px, 20vw, 260px)', position: 'relative' }}>
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
          </div>

          {/* Text */}
          <div>
            <p data-hero style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: '1.25rem' }}>
              Senior Full Stack Architect
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

            {/* Stats row */}
            <div data-hero style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              {[{ v: '+2', l: 'años en producción' }, { v: '7', l: 'proyectos lanzados' }, { v: '3', l: 'plataformas móviles' }].map(s => (
                <div key={s.l}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', fontWeight: 900, color: 'var(--cyan)', letterSpacing: '-0.05em', lineHeight: 1 }}>{s.v}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)', marginTop: '0.3rem', letterSpacing: '0.05em' }}>{s.l}</p>
                </div>
              ))}
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
      `}</style>
    </section>
  );
}
