import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Magnetic tag component ── */
function MTag({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 130;

      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 0.38;
        gsap.to(el, { x: dx * force, y: dy * force, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <span
      ref={ref}
      className="tag tag-magnetic"
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </span>
  );
}

const tags = (items: string[]) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
    {items.map(t => <MTag key={t}>{t}</MTag>)}
  </div>
);

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll('[data-reveal]') ?? [];
    gsap.set(els, { opacity: 0, y: 30 });
    ScrollTrigger.batch(els, {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out' }),
      start: 'top 88%',
    });
  }, { scope: sectionRef });

  /* ── Shared card hover handler ── */
  const cardEnter = (e: React.MouseEvent<HTMLDivElement>, color = 'var(--border-2)') => {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = color;
    el.style.boxShadow   = `0 0 40px ${color}33, 0 8px 32px rgba(0,0,0,0.4)`;
    el.style.transform   = 'translateY(-3px)';
  };
  const cardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = 'var(--border)';
    el.style.boxShadow   = 'none';
    el.style.transform   = 'none';
  };

  return (
    <section ref={sectionRef} id="tech" className="section" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%)' }}>
      <div className="container">

        {/* Header */}
        <div data-reveal style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="label" style={{ marginBottom: '0.75rem' }}>Stack Técnico</p>
          <h2 className="section-title" style={{ margin: '0 auto 0.75rem' }}>Ecosistema Tecnológico</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Stacks de ingeniería seleccionados para el máximo rendimiento y escalabilidad horizontal.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem' }} className="bento-grid">

          {/* ── Frontend & Mobile — large left ── */}
          <div
            data-reveal
            className="bento-card-glow"
            style={{ gridColumn: 'span 5', gridRow: 'span 2', padding: '2rem', background: 'var(--glass)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '340px', transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s', cursor: 'default' }}
            onMouseEnter={e => cardEnter(e, 'rgba(34,211,238,0.45)')}
            onMouseLeave={cardLeave}
          >
            {/* Shimmer glow top-left */}
            <div aria-hidden style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Corner tag */}
            <span style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cyan)', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'var(--cyan-dim)', border: '1px solid var(--border-2)', borderRadius: 4, padding: '0.15rem 0.5rem' }}>Core Frontend</span>

            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--cyan-dim)', border: '1px solid var(--border-2)', display: 'grid', placeItems: 'center', color: 'var(--cyan)', marginBottom: '1.25rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Frontend &amp; Mobile</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 'auto' }}>
              Desarrollo de interfaces reactivas y aplicaciones móviles nativas con alto performance visual.
            </p>
            {tags(['React', 'React Native', 'TypeScript', 'Angular', 'Next.js', 'Tailwind CSS'])}
          </div>

          {/* ── Backend Architecture ── */}
          <div
            data-reveal
            className="bento-card-glow"
            style={{ gridColumn: 'span 7', padding: '1.75rem', background: 'var(--glass)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s', cursor: 'default' }}
            onMouseEnter={e => cardEnter(e, 'rgba(34,211,238,0.4)')}
            onMouseLeave={cardLeave}
          >
            {/* Cyan top accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--cyan) 0%, transparent 70%)' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--cyan-dim)', border: '1px solid var(--border-2)', display: 'grid', placeItems: 'center', color: 'var(--cyan)', marginBottom: '1rem' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.35rem' }}>Backend Architecture</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
                  Construcción de APIs RESTful robustas, seguras y altamente concurrentes.
                </p>
              </div>
            </div>
            {tags(['NestJS', 'Node.js', 'PostgreSQL', 'TypeORM', 'REST APIs', 'JWT', 'Socket.io'])}
          </div>

          {/* ── Cloud & Infra — with scanner beam ── */}
          <div
            data-reveal
            className="bento-card-glow"
            style={{ gridColumn: 'span 4', padding: '1.5rem', background: 'var(--glass)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s', cursor: 'default' }}
            onMouseEnter={e => cardEnter(e, 'rgba(251,191,36,0.4)')}
            onMouseLeave={cardLeave}
          >
            {/* Scanner beam */}
            <div aria-hidden className="scanner-beam" />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', display: 'grid', placeItems: 'center', color: '#fbbf24' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DevOps</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.4rem' }}>Cloud &amp; Infra</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '0.75rem' }}>Infraestructura AWS con S3 para almacenamiento, CloudFront como CDN para distribución de assets y pipelines CI/CD automatizados.</p>
            {tags(['AWS', 'EC2', 'S3', 'CloudFront', 'RDS', 'Docker', 'GitHub Actions', 'Nginx'])}
          </div>

          {/* ── Innovación OpenAI ── */}
          <div
            data-reveal
            className="bento-card-glow"
            style={{ gridColumn: 'span 3', padding: '1.5rem', background: 'var(--glass)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s', cursor: 'default' }}
            onMouseEnter={e => cardEnter(e, 'rgba(129,140,248,0.5)')}
            onMouseLeave={cardLeave}
          >
            <div aria-hidden style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(129,140,248,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.25)', display: 'grid', placeItems: 'center', color: '#818cf8', marginBottom: '0.75rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><circle cx="18" cy="6" r="4"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.4rem' }}>OpenAI APIs</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '0.75rem' }}>Consumo e integración de APIs de OpenAI y Gemini para automatización de procesos en productos reales.</p>
            {tags(['OpenAI API', 'Gemini API', 'LLMs', 'Prompting'])}
          </div>

          {/* ── IA & Productividad ── */}
          <div
            data-reveal
            className="bento-card-glow"
            style={{ gridColumn: 'span 5', padding: '1.5rem', background: 'var(--glass)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s', cursor: 'default' }}
            onMouseEnter={e => cardEnter(e, 'rgba(168,85,247,0.45)')}
            onMouseLeave={cardLeave}
          >
            {/* Purple top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #a855f7 0%, transparent 70%)' }} />
            <div aria-hidden style={{ position: 'absolute', bottom: -30, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', display: 'grid', placeItems: 'center', color: '#a855f7' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Productividad</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.4rem' }}>IA &amp; Developer Tools</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
                  Uso profesional de herramientas de IA para acelerar ciclos de desarrollo, revisión de código, generación de tests y documentación técnica.
                </p>
                {tags(['Claude Code', 'ChatGPT', 'Gemini', 'Stitch', 'GitHub Copilot', 'Cursor'])}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .bento-grid > div { grid-column: span 12 !important; grid-row: span 1 !important; min-height: auto !important; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .bento-grid > div:first-child { grid-column: span 6 !important; }
          .bento-grid > div:nth-child(2) { grid-column: span 6 !important; }
          .bento-grid > div:nth-child(3) { grid-column: span 6 !important; }
          .bento-grid > div:nth-child(4) { grid-column: span 6 !important; }
        }
      `}</style>
    </section>
  );
}
