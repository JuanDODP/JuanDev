import React, { useRef } from 'react';
import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/portfolio';
import type { ProjectItem } from '../../types/portfolio.types';

gsap.registerPlugin(ScrollTrigger);

/* ── Design tokens ─────────────────────────────────────────── */
const CAT_COLOR: Record<string, string> = { web: '#22d3ee', mobile: '#818cf8', infra: '#34d399' };
const CAT_LABEL: Record<string, string> = { web: 'Web App', mobile: 'Mobile', infra: 'DevOps / Infra' };

const MOBILE_BRAND: Record<string, { glow: string; bg: string; iconBg: string; store: 'appstore' | 'playstore' | 'both' }> = {
  'merry-color': { glow: '#f472b6', bg: 'linear-gradient(135deg,#1a0d25 0%,#0f0818 100%)', iconBg: '#fff', store: 'appstore' },
  'yo-comparto':  { glow: '#f59e0b', bg: 'linear-gradient(135deg,#1a1200 0%,#0e0a00 100%)', iconBg: '#000', store: 'playstore' },
};

/* ── Store badges ──────────────────────────────────────────── */
function AppStoreBadge({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: 6, border: `1px solid ${color}35`, background: `${color}10` }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill={color}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600, color, letterSpacing: '0.06em' }}>App Store</span>
    </div>
  );
}
function PlayStoreBadge({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.7rem', borderRadius: 6, border: `1px solid ${color}35`, background: `${color}10` }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill={color}><path d="M3.18 23.67c.3.16.64.18.96.08l12.14-7.01-2.78-2.78-10.32 9.71zM.46 1.3C.17 1.63 0 2.12 0 2.75v18.5c0 .63.17 1.12.46 1.45l.07.07 10.37-10.37v-.24L.53 1.23.46 1.3zM20.94 10.23l-2.91-1.68-3.08 3.08 3.08 3.08 2.93-1.69c.84-.48.84-1.27-.02-1.79zM4.14.31L16.28 7.32l-2.78 2.78L3.18.39a.97.97 0 0 1 .96-.08z"/></svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600, color, letterSpacing: '0.06em' }}>Google Play</span>
    </div>
  );
}

/* ── Mobile app preview ────────────────────────────────────── */
function MobileAppPreview({ projectId, iconUrl, height }: { projectId: string; iconUrl: string; height: string }) {
  const brand = MOBILE_BRAND[projectId] ?? { glow: '#818cf8', bg: 'linear-gradient(135deg,#0d1040 0%,#060818 100%)', iconBg: '#111', store: 'appstore' as const };
  return (
    <div style={{ width: '100%', height, position: 'relative', background: brand.bg, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div aria-hidden style={{ position: 'absolute', top: '10%', left: '15%', width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${brand.glow}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', bottom: '5%', right: '10%', width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${brand.glow}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${brand.glow}08 1px,transparent 1px),linear-gradient(90deg,${brand.glow}08 1px,transparent 1px)`, backgroundSize: '40px 40px', opacity: 0.6 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: -6, borderRadius: 28, background: `${brand.glow}20`, filter: 'blur(8px)' }} />
        <div style={{ width: 96, height: 96, borderRadius: 22, overflow: 'hidden', background: brand.iconBg, border: `2px solid ${brand.glow}40`, boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${brand.glow}25`, position: 'relative', flexShrink: 0 }}>
          <img src={iconUrl} alt="App icon" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        {brand.store === 'appstore'  && <AppStoreBadge  color={brand.glow} />}
        {brand.store === 'playstore' && <PlayStoreBadge color={brand.glow} />}
        {brand.store === 'both' && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <AppStoreBadge color={brand.glow} /><PlayStoreBadge color={brand.glow} />
          </div>
        )}
      </div>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)', pointerEvents: 'none' }} />
    </div>
  );
}

/* ── Generative SVG placeholder ───────────────────────────── */
function SvgPreview({ category, title }: { category: string; title: string }) {
  const c = CAT_COLOR[category] ?? '#22d3ee';
  const id = `g${title.replace(/\s/g, '').slice(0, 6)}`;

  if (category === 'mobile') return (
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="640" height="360" fill="#0d1830"/>
      <rect width="640" height="360" fill={`url(#${id})`}/>
      <defs><radialGradient id={id} cx="50%" cy="30%" r="60%"><stop offset="0%" stopColor={c} stopOpacity="0.12"/><stop offset="100%" stopColor="#0d1830" stopOpacity="0"/></radialGradient></defs>
      <rect x="220" y="20" width="200" height="320" rx="24" fill="#111827" stroke={c} strokeWidth="1.5" strokeOpacity="0.4"/>
      <rect x="228" y="52" width="184" height="264" rx="6" fill="#1a2540"/>
      <rect x="228" y="36" width="184" height="16" rx="0" fill="#0f1e3a"/>
      <circle cx="320" cy="35" r="6" fill="#0f1e3a"/>
      <rect x="240" y="68" width="160" height="60" rx="6" fill={c} fillOpacity="0.08" stroke={c} strokeWidth="0.5" strokeOpacity="0.3"/>
      <rect x="252" y="80" width="80" height="7" rx="3" fill={c} fillOpacity="0.4"/>
      <rect x="252" y="94" width="120" height="5" rx="2" fill="white" fillOpacity="0.12"/>
      {[0,1,2,3,4,5,6,7].map(i => <line key={i} x1="0" y1={i*46} x2="640" y2={i*46} stroke={c} strokeWidth="0.3" strokeOpacity="0.07"/>)}
    </svg>
  );

  if (category === 'infra') return (
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="640" height="360" fill="#060f1a"/>
      <defs><radialGradient id={id} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={c} stopOpacity="0.1"/><stop offset="100%" stopColor="#060f1a" stopOpacity="0"/></radialGradient></defs>
      <rect width="640" height="360" fill={`url(#${id})`}/>
      {['$ docker build -t app:latest .', '→  Building image [============] 100%', '$ docker push registry/app:v2.4.1', '→  Pushed 12 layers successfully', '$ gh workflow run deploy.yml', '→  Workflow triggered on branch main', '✓  Pipeline: build → test → deploy', '✓  Health check passed — 200 OK'].map((line, i) => (
        <text key={i} x="32" y={52 + i * 32} fontFamily="monospace" fontSize="13" fill={i % 3 === 1 ? c : i % 3 === 2 ? '#34d399' : 'rgba(240,246,255,0.6)'} fillOpacity={1 - i * 0.07}>{line}</text>
      ))}
      {['BUILD', 'TEST', 'DEPLOY'].map((s, i) => (
        <g key={s}>
          <rect x={32 + i * 140} y="300" width="110" height="36" rx="6" fill={c} fillOpacity="0.1" stroke={c} strokeWidth="0.8" strokeOpacity="0.4"/>
          <text x={32 + i * 140 + 55} y="323" textAnchor="middle" fontFamily="monospace" fontSize="11" fontWeight="bold" fill={c} fillOpacity="0.8">{s}</text>
          {i < 2 && <line x1={32 + (i+1)*140 - 18} y1="318" x2={32 + i*140 + 118} y2="318" stroke={c} strokeWidth="1" strokeOpacity="0.4"/>}
        </g>
      ))}
    </svg>
  );

  return (
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="640" height="360" fill="#0a1628"/>
      <defs><radialGradient id={id} cx="70%" cy="30%" r="50%"><stop offset="0%" stopColor={c} stopOpacity="0.1"/><stop offset="100%" stopColor="#0a1628" stopOpacity="0"/></radialGradient></defs>
      <rect width="640" height="360" fill={`url(#${id})`}/>
      <rect x="0" y="0" width="640" height="44" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="0.4" strokeOpacity="0.2"/>
      <circle cx="24" cy="22" r="5" fill={c} fillOpacity="0.5"/>
      <circle cx="42" cy="22" r="5" fill={c} fillOpacity="0.3"/>
      <circle cx="60" cy="22" r="5" fill={c} fillOpacity="0.15"/>
      <rect x="100" y="14" width="260" height="16" rx="8" fill="rgba(255,255,255,0.04)" stroke={c} strokeWidth="0.4" strokeOpacity="0.2"/>
      <rect x="24" y="64" width="200" height="24" rx="4" fill={c} fillOpacity="0.12"/>
      <rect x="24" y="98" width="280" height="10" rx="3" fill="white" fillOpacity="0.07"/>
      <rect x="24" y="116" width="240" height="10" rx="3" fill="white" fillOpacity="0.05"/>
      <rect x="24" y="148" width="80" height="28" rx="6" fill={c} fillOpacity="0.25"/>
      <rect x="116" y="148" width="60" height="28" rx="6" fill="rgba(255,255,255,0.04)" stroke={c} strokeWidth="0.5" strokeOpacity="0.3"/>
      <rect x="24" y="198" width="180" height="120" rx="8" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="0.5" strokeOpacity="0.2"/>
      <polyline points="36,298 60,262 84,274 108,244 132,256 156,224 180,240 192,298" stroke={c} strokeWidth="1.5" strokeOpacity="0.5" fill="none"/>
      <rect x="220" y="198" width="120" height="56" rx="6" fill={c} fillOpacity="0.07" stroke={c} strokeWidth="0.5" strokeOpacity="0.2"/>
      <rect x="356" y="64" width="260" height="186" rx="8" fill="rgba(255,255,255,0.02)" stroke={c} strokeWidth="0.5" strokeOpacity="0.15"/>
      {[0,1,2,3,4,5].map(i => <rect key={i} x="370" y={80 + i * 28} width={160 - i * 14} height="12" rx="3" fill={c} fillOpacity={0.08 - i * 0.01}/>)}
    </svg>
  );
}

/* ── Single project card ───────────────────────────────────── */
function ProjectCard({
  p, large = false, onHoverChange, dimmed = false,
}: {
  p: ProjectItem; large?: boolean;
  onHoverChange?: (id: string | null) => void; dimmed?: boolean;
}) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const viewRef  = useRef<HTMLDivElement>(null);
  const accent   = CAT_COLOR[p.category] ?? '#22d3ee';

  const didInit = useRef(false);
  const initView = () => {
    if (viewRef.current) gsap.set(viewRef.current, { scale: 0.6, opacity: 0 });
  };

  const onEnter = () => {
    if (!didInit.current) { didInit.current = true; initView(); }
    gsap.to(cardRef.current, { y: -6, duration: 0.35, ease: 'power2.out' });
    gsap.to(imgRef.current,  { scale: 1.05, duration: 0.6, ease: 'power2.out' });
    gsap.to(viewRef.current, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)' });
    if (cardRef.current) {
      cardRef.current.style.borderColor = `${accent}55`;
      cardRef.current.style.boxShadow   = `0 28px 64px rgba(0,0,0,0.65), 0 0 48px ${accent}20`;
    }
    onHoverChange?.(p.id);
  };

  const onLeave = () => {
    gsap.to(cardRef.current,  { y: 0, rotateX: 0, rotateY: 0, duration: 0.75, ease: 'elastic.out(1, 0.42)' });
    gsap.to(imgRef.current,   { scale: 1, duration: 0.5, ease: 'power2.out' });
    gsap.to(sheenRef.current, { opacity: 0, duration: 0.35 });
    gsap.to(viewRef.current,  { scale: 0.6, opacity: 0, duration: 0.22, ease: 'power2.in' });
    if (cardRef.current) {
      cardRef.current.style.borderColor = 'rgba(255,255,255,0.08)';
      cardRef.current.style.boxShadow   = 'none';
    }
    onHoverChange?.(null);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el    = cardRef.current;
    const sheen = sheenRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    const nx = (lx - rect.width  / 2) / (rect.width  / 2);
    const ny = (ly - rect.height / 2) / (rect.height / 2);

    gsap.to(el, {
      rotateX: -ny * 8, rotateY: nx * 8,
      transformPerspective: 1000,
      duration: 0.3, ease: 'power2.out', overwrite: 'auto',
    });

    if (sheen) {
      const sx = ((nx + 1) / 2 * 100).toFixed(1);
      const sy = ((ny + 1) / 2 * 100).toFixed(1);
      sheen.style.background = `radial-gradient(ellipse at ${sx}% ${sy}%, rgba(255,255,255,0.07) 0%, ${accent}10 35%, transparent 65%)`;
      gsap.to(sheen, { opacity: 1, duration: 0.18, overwrite: 'auto' });
    }
  };

  const previewH = large ? '260px' : '200px';

  return (
    <div
      ref={cardRef}
      data-reveal
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: '#0c1628',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color var(--t-base), box-shadow var(--t-base), opacity 0.4s ease, filter 0.4s ease',
        willChange: 'transform',
        cursor: 'default',
        position: 'relative',
        opacity: dimmed ? 0.35 : 1,
        filter: dimmed ? 'blur(1px) saturate(0.5)' : 'none',
      }}
    >
      {/* Holographic sheen overlay */}
      <div
        ref={sheenRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', opacity: 0, mixBlendMode: 'screen' }}
      />

      {/* ── Preview image area ── */}
      <div style={{ position: 'relative', height: previewH, overflow: 'hidden', flexShrink: 0, background: '#060f1a' }}>

        {/* Corner arrow badge — reveals on hover */}
        <div
          ref={viewRef}
          aria-hidden
          style={{
            position: 'absolute', bottom: '0.875rem', right: '0.875rem',
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(11,19,38,0.78)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${accent}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 20, pointerEvents: 'none',
            boxShadow: `0 0 20px ${accent}40, inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </div>

        {/* Image / art */}
        <div ref={imgRef} style={{ width: '100%', height: '100%', transformOrigin: 'center center' }}>
          {p.category === 'mobile' && p.preview ? (
            <MobileAppPreview projectId={p.id} iconUrl={p.preview} height={previewH} />
          ) : p.preview ? (
            <img
              src={p.preview}
              alt={`Preview ${p.title}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
              loading="lazy"
            />
          ) : (
            <SvgPreview category={p.category} title={p.title} />
          )}
        </div>

        {/* Gradient fade to card background */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, transparent, #0c1628)', pointerEvents: 'none' }} />

        {/* Category badge — top left */}
        <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: accent,
            background: 'rgba(11,19,38,0.85)', backdropFilter: 'blur(8px)',
            border: `1px solid ${accent}44`, borderRadius: 5,
            padding: '0.22rem 0.55rem',
          }}>
            {CAT_LABEL[p.category]}
          </span>
        </div>

        {/* Status badge — top right */}
        <div style={{
          position: 'absolute', top: '0.875rem', right: '0.875rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          background: 'rgba(11,19,38,0.85)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
          padding: '0.22rem 0.65rem',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', display: 'inline-block',
            background: p.status === 'internal' ? 'var(--warning)' : 'var(--success)',
            boxShadow: p.status === 'internal' ? '0 0 6px var(--warning)' : '0 0 6px var(--success)',
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 500, color: 'var(--text-1)', letterSpacing: '0.06em' }}>
            {p.status === 'internal' ? 'Interno' : 'Producción'}
          </span>
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ padding: large ? '1.75rem 1.75rem 1.5rem' : '1.375rem 1.5rem 1.375rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: large ? '1.5rem' : '1.0625rem',
          fontWeight: 900,
          color: 'var(--text-1)',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: '0.2rem',
        }}>
          {p.title}
        </h3>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: accent, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          {p.subtitle}
        </p>

        <p style={{
          fontSize: large ? '0.9375rem' : '0.8125rem',
          color: 'var(--text-2)',
          lineHeight: 1.7,
          display: '-webkit-box',
          WebkitLineClamp: large ? 4 : 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          marginBottom: '1rem',
          flex: 1,
        }}>
          {p.description}
        </p>

        {/* Tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {p.tags.slice(0, large ? 6 : 4).map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 500,
              padding: '0.18rem 0.5rem', borderRadius: 4,
              background: `${accent}12`, color: accent,
              border: `1px solid ${accent}30`,
              whiteSpace: 'nowrap',
            }}>{t}</span>
          ))}
          {p.tags.length > (large ? 6 : 4) && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-3)', padding: '0.18rem 0.5rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
              +{p.tags.length - (large ? 6 : 4)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            to={`/projects/${p.id}`}
            viewTransition
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'color var(--t-fast)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = accent)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-3)')}
          >
            Ver detalles →
          </Link>

          {p.links[0] && (
            <a
              href={p.links[0].url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: 'auto',
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontFamily: 'var(--font-display)', fontSize: '0.8125rem', fontWeight: 600,
                color: 'var(--text-1)',
                padding: '0.4rem 0.9rem',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 7,
                textDecoration: 'none',
                transition: 'border-color var(--t-fast), color var(--t-fast), background var(--t-fast)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = accent; el.style.color = accent; el.style.background = `${accent}12`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = 'var(--text-1)'; el.style.background = 'transparent';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Show
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────── */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  useGSAP(() => {
    const header = sectionRef.current?.querySelector<HTMLElement>('[data-header]');
    const cards  = sectionRef.current?.querySelectorAll('[data-reveal]') ?? [];

    if (header) {
      gsap.set(header, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: header, start: 'top 88%',
        onEnter: () => gsap.to(header, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }),
      });
    }

    gsap.set(cards, { opacity: 0, y: 40 });
    ScrollTrigger.batch(cards, {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }),
      start: 'top 90%',
    });
  }, { scope: sectionRef });

  const row1 = projects.slice(0, 2);
  const row2 = projects.slice(2, 5);
  const row3 = projects.slice(5);

  const cardProps = (p: ProjectItem, large?: boolean) => ({
    key: p.id, p, large,
    onHoverChange: setHoveredId,
    dimmed: hoveredId !== null && hoveredId !== p.id,
  });

  return (
    <section ref={sectionRef} id="projects" className="section">
      <div className="container">

        {/* Header */}
        <div data-header style={{ marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p className="label" style={{ marginBottom: '0.6rem' }}>Portfolio</p>
            <h2 className="section-title">Proyectos Destacados</h2>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text-2)', maxWidth: '42ch', lineHeight: 1.75 }}>
            Soluciones de ingeniería aplicadas a problemas reales del sector comercial, salud y educación.
          </p>
        </div>

        {/* Row 1 — 2 large featured */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }} className="proj-row-2">
          {row1.map(p => <ProjectCard {...cardProps(p, true)} />)}
        </div>

        {/* Row 2 — 3 medium */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.25rem' }} className="proj-row-3">
          {row2.map(p => <ProjectCard {...cardProps(p)} />)}
        </div>

        {/* Row 3 */}
        {row3.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="proj-row-2">
            {row3.map(p => <ProjectCard {...cardProps(p)} />)}
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 768px)  { .proj-row-2, .proj-row-3 { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .proj-row-3 { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
