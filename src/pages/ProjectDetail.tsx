import { useParams, Link } from 'react-router';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { projects } from '../data/portfolio';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current?.children ?? [], {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    },
    { scope: containerRef },
  );

  if (!project) {
    return (
      <div style={{ paddingTop: '8rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p>Proyecto no encontrado.</p>
        <Link to="/" className="btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          ← Volver
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
      <div className="container">
        <div ref={containerRef} style={{ maxWidth: 760 }}>
          {/* Back */}
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '2.5rem',
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-accent)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)')}
          >
            ← Volver a proyectos
          </Link>

          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="section-label">{project.subtitle}</p>
            <h1 className="section-title">{project.title}</h1>
            <p className="section-desc">{project.description}</p>
          </div>

          {/* Meta */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            <div className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Público objetivo
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {project.targetAudience}
              </p>
            </div>
            <div className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Contexto
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                {project.context}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {project.tags.map((tag) => (
              <span key={tag} className="badge">{tag}</span>
            ))}
          </div>

          {/* Links */}
          {project.links.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  {link.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
