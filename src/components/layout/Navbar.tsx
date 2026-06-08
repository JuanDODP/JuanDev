import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { profile } from '../../data/portfolio';
import { useMagnetic } from '../../hooks/useMagnetic';

const NAV_LINKS = [
  { label: 'Home',      href: '#hero' },
  { label: 'About',     href: '#about' },
  { label: 'Tech Stack',href: '#tech' },
  { label: 'Projects',  href: '#projects' },
  { label: 'Contact',   href: '#contact' },
];

function ResumeBtn() {
  const ref = useMagnetic(0.3) as React.RefObject<HTMLAnchorElement>;
  return (
    <a
      ref={ref}
      href={profile.cvUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        padding: '0.45rem 1rem',
        border: '1px solid var(--border-2)',
        borderRadius: 6,
        color: 'var(--text-1)',
        textDecoration: 'none',
        transition: 'border-color var(--t-fast), color var(--t-fast), background var(--t-fast)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--cyan)';
        el.style.color = 'var(--cyan)';
        el.style.background = 'var(--cyan-dim)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'var(--border-2)';
        el.style.color = 'var(--text-1)';
        el.style.background = 'transparent';
      }}
    >
      Resume
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </a>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useGSAP(() => {
    gsap.from(navRef.current, { y: -60, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 });
  }, { scope: navRef });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    if (location.pathname !== '/') return;
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{`
        .nav-links { display: none; align-items: center; gap: 0.125rem; }
        .nav-resume { display: none; }
        .nav-hamburger { display: flex; }
        @media (min-width: 768px) {
          .nav-links { display: flex; }
          .nav-resume { display: inline-flex; }
          .nav-hamburger { display: none; }
          .nav-mobile-panel { display: none !important; }
        }
      `}</style>

      <nav
        ref={navRef}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '60px',
          display: 'flex', alignItems: 'center',
          transition: 'background var(--t-slow), border-color var(--t-slow), backdrop-filter var(--t-slow)',
          background: scrolled ? 'rgba(11,19,38,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <a
            href="/"
            onClick={(e) => scrollTo(e, '#hero')}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 900,
              color: 'var(--cyan)',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              userSelect: 'none',
            }}
          >
            J.D.D.C.
          </a>

          {/* Desktop Nav */}
          <ul className="nav-links" style={{ listStyle: 'none' }}>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => scrollTo(e, l.href)}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-2)',
                    textDecoration: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: 6,
                    display: 'block',
                    transition: 'color var(--t-fast), background var(--t-fast)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-2)'; }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-resume"><ResumeBtn /></div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="nav-hamburger"
            style={{ background: 'none', border: '1px solid var(--border-2)', borderRadius: 6, padding: '0.4rem', cursor: 'pointer', color: 'var(--text-2)', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle menu"
          >
            {menuOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>

        {/* Mobile panel */}
        {menuOpen && (
          <div className="nav-mobile-panel" style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'rgba(11,19,38,0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)', padding: '1rem var(--px) 1.25rem',
          }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)}
                style={{ display: 'block', padding: '0.7rem 0.5rem', fontSize: '0.9375rem', color: 'var(--text-2)', textDecoration: 'none', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)' }}
              >{l.label}</a>
            ))}
            <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', marginTop: '0.75rem', textAlign: 'center', padding: '0.7rem', border: '1px solid var(--border-2)', borderRadius: 6, color: 'var(--text-1)', textDecoration: 'none', fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 600 }}
            >Resume ↓</a>
          </div>
        )}
      </nav>
    </>
  );
}
