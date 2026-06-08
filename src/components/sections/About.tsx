import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

const SOFT_SKILLS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Liderazgo y Colaboración',
    desc: 'Gestión de equipos técnicos bajo metodologías ágiles, fomentando un ambiente de mentoría y crecimiento mutuo.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Inglés Técnico — Nivel Intermedio',
    desc: 'Comprensión sólida de documentación técnica, APIs y especificaciones en inglés. Comunicación profesional en desarrollo activo y aprendizaje constante.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'Resolución Analítica',
    desc: 'Diagnóstico sistemático de problemas complejos en producción con impacto medible en métricas de negocio.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: 'IA como Multiplicador',
    desc: 'Uso profesional de Claude Code, ChatGPT, Gemini y Stitch para acelerar ciclos de desarrollo, revisión de código y documentación técnica.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll('[data-reveal]') ?? [];
    gsap.set(els, { opacity: 0, y: 30 });
    ScrollTrigger.batch(els, {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }),
      start: 'top 87%',
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Left: Bio */}
          <div>
            <h2 data-reveal className="cyan-line" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              Sobre Mí
            </h2>
            <p data-reveal style={{ fontSize: '1.0625rem', color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              Mi enfoque trasciende la simple escritura de código; se trata de diseñar ecosistemas digitales que impulsen el crecimiento empresarial. Como líder técnico, priorizo la arquitectura limpia y la ética profesional en cada decisión de diseño.
            </p>
            <p data-reveal style={{ fontSize: '1.0625rem', color: 'var(--text-2)', lineHeight: 1.8 }}>
              {profile.bio}
            </p>
          </div>

          {/* Right: Soft skill cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {SOFT_SKILLS.map((s) => (
              <div
                key={s.title}
                data-reveal
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  padding: '1.25rem 1.375rem',
                  background: 'var(--glass)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  transition: 'border-color var(--t-base), box-shadow var(--t-base)',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glow)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--cyan-dim)', border: '1px solid var(--border-2)', display: 'grid', placeItems: 'center', color: 'var(--cyan)', flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-1)', marginBottom: '0.3rem' }}>{s.title}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
