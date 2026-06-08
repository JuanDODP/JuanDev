import { useParams, Link } from 'react-router';
import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/portfolio';
import type { ProjectItem } from '../types/portfolio.types';

gsap.registerPlugin(ScrollTrigger);

/* ── Category accent ── */
const CAT_COLOR: Record<string, string> = { web: '#22d3ee', mobile: '#818cf8', infra: '#34d399' };
const CAT_LABEL: Record<string, string> = { web: 'Web App', mobile: 'Mobile App', infra: 'DevOps / Infra' };

/* ── Generative SVG previews (same as in Projects list) ── */
function SvgHero({ category, title }: { category: string; title: string }) {
  const c = CAT_COLOR[category] ?? '#22d3ee';
  if (category === 'infra') {
    return (
      <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="1200" height="600" fill="#060f1a"/>
        <defs><radialGradient id="ig2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={c} stopOpacity="0.1"/><stop offset="100%" stopColor="#060f1a" stopOpacity="0"/></radialGradient></defs>
        <rect width="1200" height="600" fill="url(#ig2)"/>
        {['$ docker build -t app:latest .', '→  Building image [====================] 100%', '$ docker push registry/app:v2.4.1', '→  Pushed 12 layers successfully', '$ gh workflow run deploy.yml', '→  Workflow triggered on branch main', '✓  Pipeline: build → test → deploy', '✓  Health check passed — 200 OK'].map((line, i) => (
          <text key={i} x="60" y={100 + i * 50} fontFamily="monospace" fontSize="18" fill={i % 3 === 1 ? c : i % 3 === 2 ? '#34d399' : 'rgba(240,246,255,0.55)'} fillOpacity={1 - i * 0.06}>{line}</text>
        ))}
        {['BUILD', 'TEST', 'DEPLOY'].map((step, i) => (
          <g key={step}>
            <rect x={60 + i * 260} y="510" width="200" height="56" rx="10" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>
            <text x={60 + i * 260 + 100} y="543" textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="bold" fill={c} fillOpacity="0.85">{step}</text>
            {i < 2 && <line x1={60 + (i+1)*260 - 30} y1="538" x2={60 + i*260 + 208} y2="538" stroke={c} strokeWidth="1.5" strokeOpacity="0.45"/>}
          </g>
        ))}
      </svg>
    );
  }
  if (category === 'mobile') {
    return (
      <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="1200" height="600" fill="#0d1830"/>
        <defs><radialGradient id={`mg2-${title.slice(0,3)}`} cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor={c} stopOpacity="0.14"/><stop offset="100%" stopColor="#0d1830" stopOpacity="0"/></radialGradient></defs>
        <rect width="1200" height="600" fill={`url(#mg2-${title.slice(0,3)})`}/>
        <rect x="440" y="30" width="320" height="540" rx="36" fill="#111827" stroke={c} strokeWidth="2" strokeOpacity="0.4"/>
        <rect x="452" y="80" width="296" height="464" rx="8" fill="#1a2540"/>
        <rect x="452" y="60" width="296" height="24" rx="0" fill="#0f1e3a"/>
        <circle cx="600" cy="55" r="8" fill="#0f1e3a"/>
        <rect x="468" y="100" width="264" height="96" rx="8" fill={c} fillOpacity="0.08" stroke={c} strokeWidth="0.5" strokeOpacity="0.25"/>
        <rect x="484" y="116" width="130" height="10" rx="4" fill={c} fillOpacity="0.4"/>
        <rect x="484" y="136" width="200" height="7" rx="3" fill="white" fillOpacity="0.12"/>
        {[0,1,2,3,4,5,6].map(i => <line key={i} x1="0" y1={i*88} x2="1200" y2={i*88} stroke={c} strokeWidth="0.3" strokeOpacity="0.06"/>)}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="1200" height="600" fill="#0a1628"/>
      <defs><radialGradient id="wg2" cx="70%" cy="30%" r="50%"><stop offset="0%" stopColor={c} stopOpacity="0.1"/><stop offset="100%" stopColor="#0a1628" stopOpacity="0"/></radialGradient></defs>
      <rect width="1200" height="600" fill="url(#wg2)"/>
      <rect x="0" y="0" width="1200" height="60" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="0.4" strokeOpacity="0.15"/>
      <circle cx="36" cy="30" r="7" fill={c} fillOpacity="0.5"/><circle cx="62" cy="30" r="7" fill={c} fillOpacity="0.3"/><circle cx="88" cy="30" r="7" fill={c} fillOpacity="0.15"/>
      <rect x="150" y="20" width="380" height="20" rx="10" fill="rgba(255,255,255,0.04)" stroke={c} strokeWidth="0.4" strokeOpacity="0.2"/>
      <rect x="40" y="100" width="340" height="36" rx="6" fill={c} fillOpacity="0.12"/>
      <rect x="40" y="152" width="480" height="14" rx="4" fill="white" fillOpacity="0.07"/>
      <rect x="40" y="176" width="400" height="14" rx="4" fill="white" fillOpacity="0.05"/>
      <rect x="40" y="220" width="130" height="44" rx="8" fill={c} fillOpacity="0.25"/>
      <rect x="186" y="220" width="100" height="44" rx="8" fill="rgba(255,255,255,0.04)" stroke={c} strokeWidth="0.5" strokeOpacity="0.3"/>
      <rect x="40" y="300" width="300" height="200" rx="12" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="0.5" strokeOpacity="0.18"/>
      <polyline points="56,480 96,424 136,444 176,404 216,416 256,380 296,400 322,480" stroke={c} strokeWidth="2" strokeOpacity="0.5" fill="none"/>
      <rect x="380" y="300" width="200" height="92" rx="8" fill={c} fillOpacity="0.07" stroke={c} strokeWidth="0.5" strokeOpacity="0.18"/>
      <rect x="380" y="408" width="200" height="92" rx="8" fill={c} fillOpacity="0.04" stroke={c} strokeWidth="0.4" strokeOpacity="0.12"/>
      <rect x="620" y="100" width="540" height="400" rx="12" fill="rgba(255,255,255,0.02)" stroke={c} strokeWidth="0.5" strokeOpacity="0.12"/>
      {[0,1,2,3,4,5,6,7].map(i => <rect key={i} x="644" y={124 + i * 44} width={350 - i * 22} height="18" rx="4" fill={c} fillOpacity={0.07 - i * 0.007}/>)}
    </svg>
  );
}

/* ── Sticky top nav ── */
function StickyNav({ project, accentColor }: { project: ProjectItem; accentColor: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -56, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          style={{
            position: 'fixed', top: 64, left: 0, right: 0, zIndex: 90,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.6rem 2rem',
            background: 'rgba(11,19,38,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            pointerEvents: 'auto',
          }}
        >
          <Link
            to="/#projects"
            viewTransition
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-2)', textDecoration: 'none', transition: 'color 0.18s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = accentColor)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-2)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Proyectos
          </Link>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{project.title}</span>
          {project.links[0] && (
            <a href={project.links[0].url} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, color: accentColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', border: `1px solid ${accentColor}40`, borderRadius: 6, transition: 'background 0.18s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = `${accentColor}15`)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              Ver proyecto
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main component ── */
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find(p => p.id === id);
  const projectIndex = projects.findIndex(p => p.id === id);
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  const heroRef    = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useGSAP(() => {
    if (!contentRef.current) return;
    const reveals = contentRef.current.querySelectorAll('[data-reveal]');
    gsap.set(reveals, { opacity: 0, y: 36 });
    ScrollTrigger.batch(reveals, {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' }),
      start: 'top 88%',
    });
  }, { scope: contentRef });

  if (!project) {
    return (
      <div style={{ paddingTop: '8rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-2)' }}>Proyecto no encontrado.</p>
        <Link to="/" className="btn-ghost" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>← Volver</Link>
      </div>
    );
  }

  const accent = CAT_COLOR[project.category] ?? '#22d3ee';

  return (
    <>
      <StickyNav project={project} accentColor={accent} />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <div ref={heroRef} style={{ position: 'relative', minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden', paddingBottom: '0' }}>

        {/* Background layer — parallax */}
        <motion.div style={{ position: 'absolute', inset: 0, y: heroY, opacity: heroOpacity }} aria-hidden>
          {/* Grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,211,238,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.025) 1px,transparent 1px)', backgroundSize: '100px 100px' }} />
          {/* Radial ambient */}
          <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: `radial-gradient(ellipse, ${accent}12 0%, transparent 60%)`, borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(129,140,248,0.07) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
        </motion.div>

        {/* Hero text — centered above image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0, 0, 1] }}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: 'calc(80px + 3rem) 2rem 2.5rem', width: '100%', maxWidth: 900, margin: '0 auto' }}
        >
          {/* Pill badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, background: `${accent}14`, border: `1px solid ${accent}40`, borderRadius: 20, padding: '0.3rem 0.85rem' }}>
              {CAT_LABEL[project.category]}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.06em', color: project.status === 'production' ? 'var(--success)' : 'var(--warning)', background: project.status === 'production' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', border: `1px solid ${project.status === 'production' ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`, borderRadius: 20, padding: '0.3rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: project.status === 'production' ? 'var(--success)' : 'var(--warning)', display: 'inline-block' }} />
              {project.status === 'production' ? 'En Producción' : 'Interno'}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em', marginBottom: '1rem', background: `linear-gradient(160deg, var(--text-1) 0%, ${accent} 55%, #818cf8 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {project.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.125rem, 2vw, 1.625rem)', fontWeight: 500, color: 'var(--text-2)', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
            {project.subtitle}
          </p>
        </motion.div>

        {/* Preview image — large Apple-style device frame */}
        <motion.div
          ref={previewRef}
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.25, 0, 0, 1], delay: 0.18 }}
          style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1rem, 4vw, 3rem)' }}
        >
          {/* Frame */}
          <div style={{
            borderRadius: 20,
            overflow: 'hidden',
            border: `1px solid ${accent}28`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 48px 120px rgba(0,0,0,0.8), 0 0 80px ${accent}18`,
            background: '#060e1c',
            position: 'relative',
          }}>
            {/* Browser chrome */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, height: 22, marginLeft: '0.75rem', display: 'flex', alignItems: 'center', paddingLeft: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-3)', letterSpacing: '0.04em' }}>
                  {project.links[0]?.url ?? `/${project.id}`}
                </span>
              </div>
            </div>
            {/* Preview content */}
            <div style={{ aspectRatio: '16/8', position: 'relative', overflow: 'hidden' }}>
              {project.preview ? (
                <img src={project.preview} alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                />
              ) : (
                <SvgHero category={project.category} title={project.title} />
              )}
              {/* Subtle vignette */}
              <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 70%, rgba(6,14,28,0.6) 100%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Frame glow reflection */}
          <div aria-hidden style={{ position: 'absolute', bottom: -60, left: '10%', right: '10%', height: 60, background: `radial-gradient(ellipse, ${accent}18 0%, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', zIndex: 3, pointerEvents: 'none' }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-3)' }}>SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 36, background: `linear-gradient(to bottom, ${accent}, transparent)` }}
          />
        </motion.div>
      </div>

      {/* ══ CONTENT ═══════════════════════════════════════════════════ */}
      <div ref={contentRef}>

        {/* ─── Overview section ─── */}
        <section style={{ padding: 'clamp(5rem, 10vw, 9rem) 0', background: 'var(--bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'start' }}>

              {/* Left — description editorial */}
              <div>
                <div data-reveal style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 32, height: 2, background: accent, borderRadius: 1 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: accent, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Descripción</span>
                </div>
                <p data-reveal style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', color: 'var(--text-1)', lineHeight: 1.75, fontWeight: 500, letterSpacing: '-0.01em' }}>
                  {project.description}
                </p>
              </div>

              {/* Right — meta cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  data-reveal
                  style={{ padding: '1.5rem', background: 'var(--glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Público objetivo</p>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-1)', lineHeight: 1.65 }}>{project.targetAudience}</p>
                </div>
                <div
                  data-reveal
                  style={{ padding: '1.5rem', background: 'var(--glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, rgba(129,140,248,0.8), transparent)` }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#818cf8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Contexto</p>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-1)', lineHeight: 1.65 }}>{project.context}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Context accent band ─── */}
        <section data-reveal style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(3.5rem, 7vw, 6rem) 0' }}>
          {/* Subtle accent glow */}
          <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: `radial-gradient(ellipse, ${accent}08 0%, transparent 65%)`, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 760 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Alcance del Proyecto</p>
            <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.375rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.45, letterSpacing: '-0.03em', margin: 0, padding: 0 }}>
              "{project.context}"
            </blockquote>
          </div>
        </section>

        {/* ─── Tech Stack ─── */}
        <section style={{ padding: 'clamp(5rem, 10vw, 9rem) 0', background: 'var(--bg)' }}>
          <div className="container">

            <div data-reveal style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: 24, height: 1, background: 'var(--border-2)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Stack Técnico</span>
                <div style={{ width: 24, height: 1, background: 'var(--border-2)' }} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                Construido con
              </h2>
            </div>

            {/* Tag grid */}
            <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
              {project.tags.map((tag, i) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: i * 0.045, ease: [0.25, 0, 0, 1] }}
                  whileHover={{ y: -4, scale: 1.04 }}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600,
                    padding: '0.6rem 1.25rem', borderRadius: 10,
                    background: `${accent}0e`,
                    color: accent,
                    border: `1px solid ${accent}35`,
                    letterSpacing: '0.03em',
                    cursor: 'default',
                    boxShadow: `0 0 20px ${accent}12`,
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block', boxShadow: `0 0 6px ${accent}` }} />
                  {tag}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Links / CTA ─── */}
        {project.links.length > 0 && (
          <section style={{ padding: 'clamp(4rem, 8vw, 8rem) 0', background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
            <div className="container" style={{ textAlign: 'center' }}>
              <div data-reveal style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Acceso directo</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.04em' }}>
                  Ver el producto
                </h2>
              </div>
              <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                {project.links.map((link, i) => (
                  <motion.a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.875rem 2rem',
                      fontFamily: 'var(--font-display)', fontSize: '0.9375rem', fontWeight: 700,
                      textDecoration: 'none',
                      borderRadius: 12,
                      ...(i === 0
                        ? { background: accent, color: '#0b1326', boxShadow: `0 0 32px ${accent}50, 0 8px 24px rgba(0,0,0,0.4)` }
                        : { background: 'transparent', color: 'var(--text-1)', border: `1.5px solid ${accent}50` }
                      ),
                    }}
                  >
                    {link.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Prev / Next navigation ─── */}
        <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div data-reveal style={{ display: 'grid', gridTemplateColumns: prevProject && nextProject ? '1fr 1fr' : '1fr', gap: '1rem' }}>
              {prevProject && (
                <Link
                  to={`/projects/${prevProject.id}`}
                  viewTransition
                  style={{ padding: '1.5rem', background: 'var(--glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', transition: 'border-color 0.25s, transform 0.25s', group: 'prev' } as React.CSSProperties}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-2)'; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none'; }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Anterior
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>{prevProject.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: CAT_COLOR[prevProject.category] }}>{prevProject.subtitle}</span>
                </Link>
              )}
              {nextProject && (
                <Link
                  to={`/projects/${nextProject.id}`}
                  viewTransition
                  style={{ padding: '1.5rem', background: 'var(--glass)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'right', transition: 'border-color 0.25s, transform 0.25s', marginLeft: prevProject ? 'auto' : 0 } as React.CSSProperties}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-2)'; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none'; }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    Siguiente
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)' }}>{nextProject.title}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: CAT_COLOR[nextProject.category] }}>{nextProject.subtitle}</span>
                </Link>
              )}
            </div>

            {/* Back to all */}
            <div data-reveal style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link
                to="/#projects"
                viewTransition
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.18s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--cyan)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                Ver todos los proyectos
              </Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 640px) {
          [data-sticky-title] { display: none; }
        }
      `}</style>
    </>
  );
}
