import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences, education } from '../../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = sectionRef.current?.querySelectorAll('[data-reveal]') ?? [];
    gsap.set(items, { opacity: 0, x: -24 });
    gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 78%',
      onEnter: () => {
        gsap.to(lineRef.current, { scaleY: 1, duration: 1.4, ease: 'power3.inOut' });
        gsap.to(items, { opacity: 1, x: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="experience" className="section" style={{ background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg) 100%)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Timeline */}
          <div>
            <div data-reveal style={{ marginBottom: '2.5rem' }}>
              <p className="label" style={{ marginBottom: '0.6rem' }}>Trayectoria</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>Experiencia Profesional</h2>
            </div>

            <div style={{ position: 'relative', paddingLeft: '1.75rem' }}>
              <div ref={lineRef} style={{ position: 'absolute', left: 6, top: 6, bottom: 0, width: 1, background: 'linear-gradient(to bottom, var(--cyan) 0%, var(--border) 100%)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>
                {experiences.map(exp => (
                  <div key={exp.id} data-reveal style={{ position: 'relative' }}>
                    {/* Dot */}
                    <div style={{ position: 'absolute', left: -22, top: 5, width: 13, height: 13, borderRadius: '50%', background: exp.isCurrent ? 'var(--cyan)' : 'var(--surface-2)', border: `2px solid ${exp.isCurrent ? 'var(--cyan)' : 'var(--border-2)'}`, boxShadow: exp.isCurrent ? '0 0 12px rgba(34,211,238,0.6)' : 'none' }} />

                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.4rem 0.75rem', marginBottom: '0.2rem' }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>{exp.company}</h3>
                        {exp.isCurrent && <span className="tag" style={{ fontSize: '0.6rem', padding: '0.1rem 0.45rem' }}>Actual</span>}
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.2rem' }}>{exp.role}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)', marginBottom: '0.875rem', letterSpacing: '0.04em' }}>{exp.period} · {exp.location}</p>

                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {exp.highlights.map((h, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
                            <span style={{ color: 'var(--cyan)', marginTop: '0.4rem', flexShrink: 0, fontSize: '0.5rem' }}>▶</span>{h}
                          </li>
                        ))}
                      </ul>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.875rem' }}>
                        {exp.tags.map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education + Achievements */}
          <div>
            <div data-reveal style={{ marginBottom: '2rem' }}>
              <p className="label" style={{ marginBottom: '0.6rem' }}>Formación</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>Educación</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              {education.map(edu => (
                <div key={edu.degree} data-reveal style={{ padding: '1.375rem 1.5rem', background: 'var(--glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'border-color var(--t-base)', cursor: 'default' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
                >
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--cyan)', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>{edu.period}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.2rem', lineHeight: 1.4 }}>{edu.degree}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>{edu.institution}</p>
                </div>
              ))}
            </div>

            {/* Metric highlights */}
            <div data-reveal>
              <p className="label" style={{ marginBottom: '1.25rem' }}>Logros clave</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { m: '−30%', d: 'errores en producción' },
                  { m: '−40%', d: 'tiempo de despliegue' },
                  { m: '90d', d: 'SGA empresarial sin regresiones' },
                  { m: '3×', d: 'plataformas móviles publicadas' },
                ].map(a => (
                  <div key={a.m} style={{ padding: '1.25rem', background: 'var(--glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.625rem', fontWeight: 900, color: 'var(--cyan)', letterSpacing: '-0.05em', lineHeight: 1 }}>{a.m}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)', marginTop: '0.4rem', lineHeight: 1.4 }}>{a.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
