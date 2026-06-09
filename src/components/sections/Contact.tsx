import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from '../../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

/* ── Endpoint ────────────────────────────────────────────────────────── */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiatWoYxg7rcPjsgpFLaqqiwEv3W7YhrrYztYsLeRrAiSxPLV57goYfjatw4ddJIDJ/exec';

/* ── Design tokens ───────────────────────────────────────────────────── */
const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'rgba(4,8,24,0.9)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '0.75rem 1rem',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--text-1)',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box',
  letterSpacing: '0.015em',
  caretColor: 'var(--cyan)',
};

const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(34,211,238,0.5)';
  e.target.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.09), inset 0 1px 3px rgba(0,0,0,0.35)';
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
  e.target.style.boxShadow = 'none';
};

/* ── Field label ─────────────────────────────────────────────────────── */
function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: '0.38rem',
      fontFamily: 'var(--font-mono)', fontSize: '0.57rem',
      color: 'var(--text-3)', letterSpacing: '0.16em',
      textTransform: 'uppercase', marginBottom: '0.42rem',
    }}>
      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', opacity: 0.65 }} />
      {children}
    </label>
  );
}

/* ── Quick-link row ──────────────────────────────────────────────────── */
function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1rem', borderRadius: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
        transition: 'border-color 0.2s, background 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,211,238,0.35)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(34,211,238,0.05)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
      }}
    >
      <span style={{ color: 'var(--cyan)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-2)', letterSpacing: '0.02em' }}>{label}</span>
    </a>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const successRef  = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);

  /* ── Scroll-reveal + contextSafe ──────────────────────────────────── */
  const { contextSafe } = useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll('[data-reveal]') ?? [];
    gsap.set(els, { opacity: 0, y: 28 });
    ScrollTrigger.batch(els, {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }),
      start: 'top 88%',
    });
  }, { scope: sectionRef });

  /* ── Success animation (GSAP contextSafe) ─────────────────────────── */
  const triggerSuccess = contextSafe(() => {
    gsap.to(formWrapRef.current, {
      opacity: 0, y: -22, duration: 0.45, ease: 'power3.in',
      onComplete: () => {
        if (formWrapRef.current) formWrapRef.current.style.display = 'none';
        gsap.fromTo(
          successRef.current,
          { opacity: 0, y: 18, display: 'flex' },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        );
      },
    });
  });

  /* ── Submit ────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot trap
    setLoading(true);

    const fd = new FormData();
    fd.append('nombre',    form.nombre);
    fd.append('email',     form.email);
    fd.append('telefono',  form.telefono);
    fd.append('mensaje',   form.mensaje);
    fd.append('honeypot',  honeypot);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode:   'no-cors',
        body:   fd,
      });
    } catch (_) { /* opaque response expected with no-cors */ }

    setLoading(false);
    setSent(true);
    triggerSuccess();
  };

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  /* ── Render ────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @media (max-width: 540px)  { .contact-name-row  { grid-template-columns: 1fr !important; } }
        @media (max-width: 959px)  { .contact-main-grid { grid-template-columns: 1fr !important; } }
        input:-webkit-autofill, textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(4,8,24,0.95) inset !important;
          -webkit-text-fill-color: var(--text-1) !important;
        }
      `}</style>

      <section ref={sectionRef} id="contact" className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div data-reveal style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>Contacto</p>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>¿Iniciamos algo grande?</h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-2)', lineHeight: 1.75, maxWidth: '52ch', margin: '0 auto' }}>
              Si buscas un perfil técnico con visión estratégica para tu próxima gran idea — hablemos.
            </p>
          </div>

          {/* ── Two-column grid ────────────────────────────────────── */}
          <div
            className="contact-main-grid"
            data-reveal
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 380px',
              gap: '2rem',
              maxWidth: 960,
              margin: '0 auto',
              alignItems: 'start',
            }}
          >
            {/* ── Left: Form card ─────────────────────────────────── */}
            <div style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
            }}>
              {/* Terminal chrome */}
              <div style={{
                height: 36, background: 'rgba(255,255,255,0.025)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', paddingInline: '1rem', gap: '0.35rem',
              }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.6 }} />
                ))}
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
                  ~/contacto  new-connection
                </span>
              </div>

              {/* Form wrapper (GSAP target) */}
              <div ref={formWrapRef}>
                <form onSubmit={handleSubmit} style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                  {/* Honeypot — invisible to humans */}
                  <input
                    name="honeypot"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                  />

                  {/* Row: nombre + email */}
                  <div className="contact-name-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <div>
                      <Lbl>Nombre completo</Lbl>
                      <input
                        type="text" name="nombre" required
                        placeholder="John Doe"
                        value={form.nombre} onChange={set('nombre')}
                        style={INPUT} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                    <div>
                      <Lbl>Correo electrónico</Lbl>
                      <input
                        type="email" name="email" required
                        placeholder="john@company.com"
                        value={form.email} onChange={set('email')}
                        style={INPUT} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <Lbl>Teléfono</Lbl>
                    <input
                      type="tel" name="telefono"
                      placeholder="+57 300 000 0000"
                      value={form.telefono} onChange={set('telefono')}
                      style={INPUT} onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>

                  {/* Mensaje */}
                  <div>
                    <Lbl>Mensaje</Lbl>
                    <textarea
                      name="mensaje" required rows={5}
                      placeholder="Cuéntame sobre tu proyecto, los retos técnicos y lo que buscas lograr..."
                      value={form.mensaje} onChange={set('mensaje')}
                      style={{ ...INPUT, resize: 'vertical', minHeight: 120, lineHeight: 1.65 }}
                      onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '0.6rem', padding: '0.875rem 1.5rem',
                      background: loading ? 'rgba(34,211,238,0.55)' : 'var(--cyan)',
                      color: '#020c1a', borderRadius: 9, border: 'none',
                      fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.25s, opacity 0.25s, transform 0.15s',
                      boxShadow: loading ? 'none' : '0 0 24px rgba(34,211,238,0.35)',
                    }}
                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                  >
                    {loading ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        Enviando conexión...
                      </>
                    ) : (
                      <>
                        Establecer conexión
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Success message (GSAP reveals this) */}
              <div
                ref={successRef}
                style={{
                  display: sent ? 'flex' : 'none',
                  opacity: 0,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3.5rem 2rem',
                  gap: '1rem',
                }}
              >
                {/* Green check */}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  display: 'grid', placeItems: 'center', flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(0.875rem, 1.4vw, 1.0625rem)',
                    color: '#4ade80',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.6,
                    marginBottom: '0.5rem',
                  }}>
                    {'> Enlace establecido. Mensaje recibido con éxito.'}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-3)', letterSpacing: '0.04em' }}>
                    Tiempo de respuesta estimado — {'<'} 24h
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: Info panel ───────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Availability badge */}
              <div style={{
                padding: '1.25rem',
                background: 'rgba(74,222,128,0.05)',
                border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', gap: '0.875rem',
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
                  <div style={{
                    position: 'absolute', inset: -3, borderRadius: '50%',
                    background: 'rgba(74,222,128,0.3)',
                    animation: 'ping 1.8s cubic-bezier(0,0,0.2,1) infinite',
                  }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#4ade80', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.15rem' }}>DISPONIBLE</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)' }}>Abierto a proyectos y colaboraciones</p>
                </div>
              </div>

              {/* Quick contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.25rem' }}>Contacto directo</p>
                <QuickLink
                  href={`mailto:${profile.email}`}
                  label={profile.email}
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
                />
                <QuickLink
                  href={profile.linkedin}
                  label="LinkedIn"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                />
                <QuickLink
                  href={profile.github}
                  label="GitHub"
                  icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>}
                />
              </div>

              {/* Terminal decoration */}
              <div style={{
                padding: '1rem 1.25rem',
                background: 'rgba(4,8,24,0.7)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                lineHeight: 1.9,
                color: 'var(--text-3)',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.18)', marginBottom: '0.4rem' }}>// stack técnico</div>
                <div><span style={{ color: 'var(--cyan)', opacity: 0.7 }}>languages</span>{' → TS · JS · SQL'}</div>
                <div><span style={{ color: '#818cf8', opacity: 0.7 }}>frontend&nbsp;</span>{' → React · React Native'}</div>
                <div><span style={{ color: '#d97757', opacity: 0.7 }}>backend&nbsp;&nbsp;</span>{' → NestJS · Node'}</div>
                <div><span style={{ color: '#fbbf24', opacity: 0.7 }}>cloud&nbsp;&nbsp;&nbsp;&nbsp;</span>{' → AWS · EC2 · S3 · RDS'}</div>
                <div><span style={{ color: '#a855f7', opacity: 0.7 }}>ai&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{' → Claude · OpenAI · Gemini'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
