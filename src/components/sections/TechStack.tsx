import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { IconType } from 'react-icons';
import { FaAws } from 'react-icons/fa6';
import {
  SiReact,
  SiTypescript,
  SiAngular,
  SiNextdotjs,
  SiTailwindcss,
  SiVite,
  SiNestjs,
  SiNodedotjs,
  SiPostgresql,
  SiTypeorm,
  SiJsonwebtokens,
  SiSocketdotio,
  SiDocker,
  SiTerraform,
  SiGithubactions,
  SiNginx,
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

/* ── Brand icons per tag — falls back to plain text when no match ── */
const TECH_ICONS: Record<string, IconType> = {
  React: SiReact,
  'React Native': SiReact,
  TypeScript: SiTypescript,
  Angular: SiAngular,
  'Next.js': SiNextdotjs,
  'Tailwind CSS': SiTailwindcss,
  Vite: SiVite,
  NestJS: SiNestjs,
  'Node.js': SiNodedotjs,
  PostgreSQL: SiPostgresql,
  TypeORM: SiTypeorm,
  JWT: SiJsonwebtokens,
  'Socket.io': SiSocketdotio,
  AWS: FaAws,
  Docker: SiDocker,
  Terraform: SiTerraform,
  'GitHub Actions': SiGithubactions,
  Nginx: SiNginx,
};

/* ── Infinite horizontal tag ticker ─────────────────────────── */
function TagTicker({ items, color = 'var(--cyan)' }: { items: string[]; color?: string }) {
  /* Duplicate so the loop is seamless: scroll exactly -50% = one full copy */
  const doubled = [...items, ...items];
  /* Speed scales with item count so dense rows don't rush */
  const duration = Math.max(items.length * 2.8, 16);

  return (
    <div
      style={{
        marginTop: '0.875rem',
        overflow: 'hidden',
        /* Fade both edges for the "infinite tape" illusion */
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        maskImage:       'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '0.45rem',
          width: 'max-content',
          animation: `tag-scroll ${duration}s linear infinite`,
        }}
      >
        {doubled.map((t, i) => {
          const Icon = TECH_ICONS[t];
          return (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 500,
                padding: '0.2rem 0.55rem',
                borderRadius: 4,
                background: `${color}12`,
                color,
                border: `1px solid ${color}2e`,
                whiteSpace: 'nowrap',
                letterSpacing: '0.03em',
                flexShrink: 0,
              }}
            >
              {Icon && <Icon size={12} style={{ flexShrink: 0 }} aria-hidden />}
              {t}
            </span>
          );
        })}
      </div>
    </div>
  );
}

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
            <TagTicker items={['React', 'React Native', 'TypeScript', 'Angular', 'Next.js', 'Tailwind CSS', 'Vite']} color="var(--cyan)" />
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
            <TagTicker items={['Node.js', 'NestJS', 'PostgreSQL', 'TypeORM', 'REST APIs', 'JWT', 'Socket.io']} color="var(--cyan)" />
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
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', lineHeight: 1.65, marginBottom: '0.75rem' }}>Infraestructura como código con Terraform, contenedores Docker y despliegues en AWS (S3, CloudFront, Amplify) orquestados con pipelines CI/CD en GitHub Actions.</p>
            <TagTicker items={['Terraform', 'Docker', 'AWS', 'S3', 'CloudFront', 'Amplify', 'EC2', 'RDS', 'GitHub Actions', 'Nginx']} color="#fbbf24" />
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
            <TagTicker items={['OpenAI API', 'Gemini API', 'LLMs', 'Prompting']} color="#818cf8" />
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
                <TagTicker items={['Claude Code', 'ChatGPT', 'Gemini', 'Stitch', 'GitHub Copilot', 'Cursor']} color="#a855f7" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes tag-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="tag-scroll"] { animation: none !important; }
        }
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
