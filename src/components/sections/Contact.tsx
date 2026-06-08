import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMagnetic } from '../../hooks/useMagnetic';
import { profile } from '../../data/portfolio';

gsap.registerPlugin(ScrollTrigger);

function SubmitBtn({ disabled }: { disabled: boolean }) {
  const ref = useMagnetic(0.25) as React.RefObject<HTMLButtonElement>;
  return (
    <button
      ref={ref}
      type="submit"
      disabled={disabled}
      className="btn-cyan"
      style={{ width: '100%', justifyContent: 'center', padding: '0.875rem 1.5rem', fontSize: '0.9375rem', fontFamily: 'var(--font-display)', opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {disabled ? 'Enviando...' : (
        <>
          Enviar Propuesta
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </>
      )}
    </button>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  useGSAP(() => {
    const els = sectionRef.current?.querySelectorAll('[data-reveal]') ?? [];
    gsap.set(els, { opacity: 0, y: 24 });
    ScrollTrigger.batch(els, {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }),
      start: 'top 85%',
    });
  }, { scope: sectionRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Propuesta de proyecto — ${form.name}`);
    const body = encodeURIComponent(`Nombre: ${form.name}\nCorreo: ${form.email}\n\n${form.message}`);
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(13,24,48,0.8)',
    border: '1px solid var(--border-2)',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    color: 'var(--text-1)',
    outline: 'none',
    transition: 'border-color var(--t-fast), box-shadow var(--t-fast)',
    boxSizing: 'border-box',
  };

  return (
    <section ref={sectionRef} id="contact" className="section" style={{ background: 'var(--bg-2)' }}>
      <div className="container">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>

          {/* Header */}
          <div data-reveal style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="label" style={{ marginBottom: '0.75rem' }}>Contacto</p>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>¿Iniciamos un proyecto?</h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-2)', lineHeight: 1.75 }}>
              Si buscas un perfil técnico con visión estratégica para tu próxima gran idea, hablemos.
            </p>
          </div>

          {/* Form */}
          <form
            data-reveal
            onSubmit={handleSubmit}
            style={{ background: 'var(--glass)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid var(--border-2)', borderRadius: 'var(--radius-lg)', padding: 'clamp(1.5rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Row: name + email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Nombre Completo</label>
                <input
                  type="text" required value={form.name} placeholder="John Doe"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 3px var(--cyan-dim)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Correo Electrónico</label>
                <input
                  type="email" required value={form.email} placeholder="john@example.com"
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 3px var(--cyan-dim)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Mensaje</label>
              <textarea
                required value={form.message} placeholder="Cuéntame sobre tu proyecto..."
                rows={5}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px', fontFamily: 'var(--font-body)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--cyan)'; e.target.style.boxShadow = '0 0 0 3px var(--cyan-dim)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <SubmitBtn disabled={sent} />

            {sent && (
              <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--success)' }}>
                ✓ Abriendo cliente de correo…
              </p>
            )}
          </form>

          {/* Quick links */}
          <div data-reveal style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {[
              { label: profile.email, href: `mailto:${profile.email}`, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
              { label: 'LinkedIn', href: profile.linkedin, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              { label: 'GitHub', href: profile.github, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg> },
            ].map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color var(--t-fast)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--cyan)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-2)')}
              >
                {l.icon}{l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 520px) { .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
