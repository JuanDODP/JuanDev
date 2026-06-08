import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'motion/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import claude1 from '../../assets/tools/claude.jpeg';
import claude2 from '../../assets/tools/claude2.png';
import claude3 from '../../assets/tools/claude3.png';
import claude4 from '../../assets/tools/claude4.svg';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    index: 0,
    num: '01',
    label: 'Claude Code',
    title: 'IA en cada línea de código',
    desc: 'Claude Code integrado en el flujo de desarrollo diario — revisión de PR, refactorización profunda, generación de tests y debugging inteligente sin salir de la terminal.',
    color: '#d97757',
    image: claude1,
    fit: 'cover' as const,
    tags: ['Terminal CLI', 'Code Review', 'Refactoring', 'Debugging'],
  },
  {
    index: 1,
    num: '02',
    label: 'MCP Servers',
    title: 'Conexión con herramientas externas',
    desc: 'Model Context Protocol para extender las capacidades de Claude Code — integración directa con bases de datos, APIs propias, sistemas de archivos y servicios cloud como AWS.',
    color: '#22d3ee',
    image: claude2,
    fit: 'contain' as const,
    tags: ['Model Context Protocol', 'AWS', 'APIs', 'Databases'],
  },
  {
    index: 2,
    num: '03',
    label: 'Skills & Agentes',
    title: 'Flujos de trabajo autónomos',
    desc: 'Habilidades y agentes personalizados que ejecutan tareas complejas de forma autónoma — documentación técnica, generación de tests, análisis de código y scaffolding de proyectos.',
    color: '#818cf8',
    image: claude3,
    fit: 'contain' as const,
    tags: ['Agents', 'Automation', 'Scaffolding', 'Docs'],
  },
  {
    index: 3,
    num: '04',
    label: 'Productividad × 3',
    title: 'Multiplicador de productividad',
    desc: 'Ciclos de desarrollo hasta 3× más rápidos. Claude como copiloto en producción real — ChatGPT, Gemini y Stitch complementan el ecosistema de IA para diseño, investigación y prototipado.',
    color: '#d97757',
    image: claude4,
    fit: 'contain' as const,
    tags: ['ChatGPT', 'Gemini', 'Stitch', 'Productivity'],
  },
] as const;

/* ── Step indicator dot ── */
function StepDot({ active, index, color, onClick }: { active: boolean; index: number; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Ir a paso ${index + 1}`}
      style={{ background: 'none', border: 'none', padding: '0.35rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.div
        animate={{ scale: active ? 1 : 0.6, opacity: active ? 1 : 0.35 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{ width: active ? 28 : 8, height: 8, borderRadius: 4, background: active ? color : 'var(--border-2)', transition: 'width 0.3s, background 0.3s' }}
      />
    </button>
  );
}

export default function AIShowcase() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const stickyRef      = useRef<HTMLDivElement>(null);
  const headerRef      = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [manualStep, setManualStep] = useState<number | null>(null);

  /* ── Scroll progress through the entire section ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const rawStep = useTransform(scrollYProgress, [0, 1], [0, STEPS.length]);

  useEffect(() => {
    if (manualStep !== null) return;
    return rawStep.on('change', v => {
      const s = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v)));
      setActiveStep(s);
    });
  }, [rawStep, manualStep]);

  /* ── Manual step click — scroll to that panel ── */
  const goToStep = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionH   = el.offsetHeight - window.innerHeight;
    const target     = sectionTop + (i / (STEPS.length - 1)) * sectionH;
    window.scrollTo({ top: target, behavior: 'smooth' });
    setActiveStep(i);
    setManualStep(i);
    setTimeout(() => setManualStep(null), 900);
  };

  /* ── Header reveal ── */
  useGSAP(() => {
    if (!headerRef.current) return;
    gsap.set(headerRef.current.children, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: headerRef.current,
      start: 'top 85%',
      onEnter: () => gsap.to(headerRef.current!.children, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }),
    });
  }, { scope: headerRef });

  const step = STEPS[activeStep];

  return (
    /* ── Scroll track: 400vh so 4 steps × 100vh each ── */
    <div ref={containerRef} style={{ height: `${STEPS.length * 100}vh`, position: 'relative' }}>

      {/* ── Sticky viewport wrapper ── */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky', top: 0, height: '100svh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg)',
        }}
      >
        {/* Ambient background glow — transitions with step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${activeStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            aria-hidden
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
              background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${step.color}0a 0%, transparent 70%)`,
            }}
          />
        </AnimatePresence>

        {/* Grid lines (subtle) */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(34,211,238,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.02) 1px,transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none', zIndex: 0 }} />

        {/* ── Section header (appears once) ── */}
        <div ref={headerRef} style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '60px 2rem 0' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: '0.5rem' }}>
            IA & Productividad
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Potenciado por Claude Code
          </h2>
        </div>

        {/* ── Main content — image + text ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, padding: '1.5rem clamp(1.25rem, 5vw, 4rem) 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem, 5vw, 5rem)', alignItems: 'center', width: '100%', maxWidth: 1100 }} className="ai-showcase-grid">

            {/* ── Image panel ── */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {/* Frame glow */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`glow-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
                  aria-hidden
                  style={{
                    position: 'absolute', inset: -20,
                    background: `radial-gradient(ellipse, ${step.color}25 0%, transparent 65%)`,
                    filter: 'blur(24px)',
                    borderRadius: 32,
                    pointerEvents: 'none',
                  }}
                />
              </AnimatePresence>

              {/* Image card */}
              <motion.div
                layout
                style={{
                  position: 'relative',
                  width: '100%', maxWidth: 520,
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: `1px solid ${step.color}30`,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px ${step.color}15`,
                  background: '#060e1c',
                }}
              >
                {/* Browser chrome bar */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: `1px solid ${step.color}18`, padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
                  <div style={{ flex: 1, marginLeft: '0.5rem', height: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-3)' }}>claude.ai/code</span>
                  </div>
                </div>

                {/* Image crossfade */}
                <div style={{ position: 'relative', aspectRatio: activeStep === 0 ? '16/9' : activeStep === 3 ? '1/1' : '600/487', background: '#060e1c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: activeStep === 3 ? '2.5rem' : 0, overflow: 'hidden' }}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`img-${activeStep}`}
                      src={step.image}
                      alt={step.label}
                      initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
                      transition={{ duration: 0.55, ease: [0.25, 0, 0, 1] }}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: step.fit,
                        display: 'block',
                        ...(activeStep === 3 ? { filter: `drop-shadow(0 0 32px ${step.color}80)` } : {}),
                      }}
                    />
                  </AnimatePresence>

                  {/* Subtle scanlines */}
                  <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px)', pointerEvents: 'none' }} />
                </div>
              </motion.div>
            </div>

            {/* ── Text panel ── */}
            <div>
              {/* Step number + label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`label-${activeStep}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: step.color, letterSpacing: '0.1em' }}>{step.num}</span>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${step.color}60, transparent)` }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: step.color, letterSpacing: '0.15em', textTransform: 'uppercase', background: `${step.color}14`, border: `1px solid ${step.color}35`, borderRadius: 4, padding: '0.15rem 0.5rem' }}>{step.label}</span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                    {step.title}
                  </h3>

                  <p style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)', color: 'var(--text-2)', lineHeight: 1.75, marginBottom: '1.75rem', maxWidth: '46ch' }}>
                    {step.desc}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {step.tags.map(t => (
                      <motion.span
                        key={t}
                        initial={{ opacity: 0, scale: 0.88 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600,
                          padding: '0.28rem 0.65rem', borderRadius: 6,
                          background: `${step.color}10`, color: step.color,
                          border: `1px solid ${step.color}30`,
                          letterSpacing: '0.04em',
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                        }}
                      >
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: step.color, display: 'inline-block', boxShadow: `0 0 5px ${step.color}` }} />
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── Step indicators (bottom center) ── */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0 2rem 1.5rem' }}>
          {STEPS.map((s, i) => (
            <StepDot key={i} active={activeStep === i} index={i} color={s.color} onClick={() => goToStep(i)} />
          ))}
        </div>

        {/* ── Scroll progress thin line at bottom ── */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: 0, height: 2, zIndex: 10,
            background: `linear-gradient(90deg, ${step.color}, transparent)`,
            scaleX: useTransform(scrollYProgress, [0, 1], [0, 1]),
            transformOrigin: 'left center',
          }}
        />

        {/* Scroll nudge (only on first step) */}
        <AnimatePresence>
          {activeStep === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.2 }}
              style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', pointerEvents: 'none', zIndex: 3 }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)', writingMode: 'vertical-rl' }}>SCROLL</span>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, var(--cyan), transparent)' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ai-showcase-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
