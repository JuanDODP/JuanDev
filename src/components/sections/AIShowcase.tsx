import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import {
  useScroll, useTransform, motion, AnimatePresence, useMotionValueEvent,
} from 'motion/react';

/* ─── Data ──────────────────────────────────────────────────────────── */
const STEPS = [
  {
    index: 0, num: '01', label: 'Terminal CLI',
    title: 'Mi terminal,\nredefinida',
    desc: 'Claude Code integrado directo en el CLI — revisa commits, refactoriza módulos y detecta bugs antes de llegar a producción, sin cambiar de contexto.',
    color: '#d97757', cmd: '~/dev  claude --cli',
    tags: ['Code Review', 'Refactoring', 'Debugging', 'Git Hooks'],
  },
  {
    index: 1, num: '02', label: 'Skills & MCPs',
    title: 'Claude Code,\nextendido.',
    desc: 'Skills de Vercel, Emil Kowalski y la comunidad instalan patrones de diseño, mejores prácticas y flujos especializados directamente en mi entorno — en segundos.',
    color: '#22d3ee', cmd: '~/dev  claude skills install',
    tags: ['Skills', 'MCPs', 'Vercel', 'Comunidad'],
  },
  {
    index: 2, num: '03', label: 'Agentes',
    title: 'Lo repetitivo,\nresuelto.',
    desc: 'Agentes y skills personalizados que generan tests, documentan código y hacen scaffolding de proyectos completos — para enfocarme en decisiones de alto impacto.',
    color: '#818cf8', cmd: '~/dev  claude agent run',
    tags: ['Automation', 'Skills', 'Scaffolding', 'Docs'],
  },
  {
    index: 3, num: '04', label: 'Ecosistema',
    title: 'Stack completo.\nVentaja real.',
    desc: 'ChatGPT, Gemini y Stitch como aliados estratégicos — ciclos de entrega hasta ×3 más rápidos, sin sacrificar calidad ni criterio técnico.',
    color: '#a855f7', cmd: '~/dev  ai --status',
    tags: ['ChatGPT', 'Gemini', 'Stitch', 'Productividad ×3'],
  },
];

/* ─── Panel 1: Terminal ─────────────────────────────────────────────── */
type TLine = { text: string; t: 'info' | 'ok' | 'warn' | 'dim' };
type TItem = { kind: 'prompt'; text: string } | { kind: 'gap' } | ({ kind: 'out' } & TLine);

const TERM_CMD1 = 'claude --review src/auth/login.ts';

const TERM_SESS: Array<{ cmd: string; out: TLine[]; pace?: number }> = [
  {
    cmd: TERM_CMD1,
    out: [
      { text: '● Analizando 847 líneas de código...', t: 'info' },
      { text: '✓ JWT sin expiración detectado en handler', t: 'ok' },
      { text: '✓ validateToken() duplicado × 3 → extrayendo', t: 'ok' },
      { text: '✗ Rate limiter ausente en /auth/refresh', t: 'warn' },
      { text: '● Aplicando refactoring automático...', t: 'info' },
      { text: '✓ 14 tests generados · cobertura 94%', t: 'ok' },
    ],
  },
  {
    cmd: 'claude memory read MEMORY.md',
    out: [
      { text: '● Cargando índice de memorias del proyecto...', t: 'info' },
      { text: '✓ project_portfolio.md → stack, fases, decisiones', t: 'ok' },
      { text: '✓ feedback_content_rules.md → sin versiones en UI', t: 'ok' },
      { text: '✓ user_role.md → Full Stack JS · Claude Code user', t: 'ok' },
      { text: '  3 memorias activas · contexto persistente ✓', t: 'dim' },
    ],
  },
  {
    cmd: 'claude --context CLAUDE.md --apply',
    out: [
      { text: '● Leyendo instrucciones del proyecto...', t: 'info' },
      { text: '✓ Tema: Graphite/Midnight Blue · acentos cyan', t: 'ok' },
      { text: '✓ Skills: vercel/react · emilkowalski/ui-eng', t: 'ok' },
      { text: '✓ Reglas: sin versiones · sin modalidad laboral', t: 'ok' },
      { text: '✓ GSAP useGSAP hook · mobile-first · 0 lint errors', t: 'ok' },
      { text: '  Fases 1-4 cargadas · modo Pro-Max habilitado', t: 'dim' },
    ],
  },
  {
    cmd: 'claude --audit src/components/sections/',
    pace: 260,
    out: [
      { text: '● Escaneando 7 secciones del portafolio...', t: 'info' },
      { text: '✓ TechStack: bug móvil MTag → CSS ticker resuelto', t: 'ok' },
      { text: '✓ AIShowcase: layout 2 cols · 4 paneles animados', t: 'ok' },
      { text: '✓ Projects: sheen holográfico + 3D tilt vía GSAP', t: 'ok' },
      { text: '✓ About: nivel inglés → intermedio actualizado', t: 'ok' },
      { text: '  0 errores TS · build limpio · linting ✓', t: 'dim' },
    ],
  },
  {
    cmd: 'claude --generate-commit',
    pace: 240,
    out: [
      { text: '● Analizando diff · 8 archivos modificados...', t: 'info' },
      { text: '✓ feat(showcase): terminal CLI + paneles custom', t: 'ok' },
      { text: '✓ fix(tech): MTag roto → CSS marquee ticker', t: 'ok' },
      { text: '✓ fix(about): descripción inglés → nivel intermedio', t: 'ok' },
      { text: '  Co-authored: Juan × Claude Sonnet 4.6', t: 'dim' },
    ],
  },
];

function TerminalPanel({ color }: { color: string }) {
  const [typed, setTyped]         = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [blink, setBlink]         = useState(true);
  const [items, setItems]         = useState<TItem[]>([]);
  const scrollRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handles: ReturnType<typeof setTimeout>[] = [];
    const sched = (fn: () => void, ms: number) => handles.push(setTimeout(fn, ms));
    const push  = (item: TItem) => setItems(p => [...p, item]);

    let ci = 0;
    const typer = setInterval(() => {
      setTyped(TERM_CMD1.slice(0, ++ci));
      if (ci >= TERM_CMD1.length) {
        clearInterval(typer);
        setTypingDone(true);

        /* Schedule all sessions sequentially */
        let delay = 200;
        TERM_SESS.forEach((sess, si) => {
          const pace = sess.pace ?? 300;
          /* First session output only (prompt already typed) */
          if (si === 0) {
            sess.out.forEach(l => {
              const line = l;
              sched(() => push({ kind: 'out', ...line }), delay);
              delay += pace;
            });
          } else {
            delay += 320;
            sched(() => push({ kind: 'gap' }), delay); delay += 55;
            const cmd = sess.cmd;
            sched(() => push({ kind: 'prompt', text: cmd }), delay); delay += 240;
            sess.out.forEach(l => {
              const line = l;
              sched(() => push({ kind: 'out', ...line }), delay);
              delay += pace;
            });
          }
        });
      }
    }, 34);

    const bi = setInterval(() => setBlink(b => !b), 500);
    return () => { clearInterval(typer); clearInterval(bi); handles.forEach(clearTimeout); };
  }, []);

  /* Auto-scroll to bottom as new lines appear */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items, typed]);

  const lineColor = (t: TLine['t']) =>
    t === 'ok' ? '#4ade80' : t === 'warn' ? '#fb923c' : t === 'dim' ? 'rgba(255,255,255,0.28)' : color;

  const Prompt = ({ cmd }: { cmd: string }) => (
    <div>
      <span style={{ color }}>juan@dev</span>
      <span style={{ color: 'rgba(255,255,255,0.25)' }}>:~$&nbsp;</span>
      <span style={{ color: 'var(--text-1)' }}>{cmd}</span>
    </div>
  );

  return (
    <div ref={scrollRef} style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(0.56rem, 0.85vw, 0.67rem)',
      lineHeight: 1.75,
      padding: '1.1rem 1.4rem',
      color: 'var(--text-2)',
      height: '100%',
      overflowY: 'auto',
      scrollbarWidth: 'none',
    }}>
      {/* First prompt (typewriter) */}
      <div>
        <span style={{ color }}>juan@dev</span>
        <span style={{ color: 'rgba(255,255,255,0.25)' }}>:~$&nbsp;</span>
        <span style={{ color: 'var(--text-1)' }}>{typed}</span>
        {!typingDone && (
          <span style={{ display: 'inline-block', width: 5.5, height: '0.8em', background: blink ? color : 'transparent', verticalAlign: 'middle', marginLeft: 1 }} />
        )}
      </div>

      {items.map((item, i) => {
        if (item.kind === 'gap')    return <div key={i} style={{ height: '0.45rem' }} />;
        if (item.kind === 'prompt') return (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
            <Prompt cmd={item.text} />
          </motion.div>
        );
        return (
          <motion.div key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22 }}
            style={{ color: lineColor(item.t), paddingLeft: '0.35ch' }}
          >
            {item.text}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Panel 2: Skills & MCPs ─────────────────────────────────────────── */
const SKILL_LIST = [
  { pkg: 'vercel-labs/agent-skills',      label: 'React Best Practices', desc: 'Patrones modernos, SSR, composición limpia',  type: 'skill' },
  { pkg: 'emilkowalski/skill',            label: 'Design Engineering',   desc: 'Animaciones, gestos y micro-interacciones',   type: 'skill' },
  { pkg: 'anthropics/skills',             label: 'Frontend Design',      desc: 'Accesibilidad y design systems escalables',   type: 'skill' },
  { pkg: 'jddc/deploy-skill',             label: 'Deploy Workflow',      desc: 'CI/CD + AWS sync personalizado',              type: 'custom' },
] as const;

const MCP_LIST = [
  { name: 'github',  color: '#f0f6ff' },
  { name: 'browser', color: '#22d3ee' },
  { name: 'figma',   color: '#a78bfa' },
  { name: 'linear',  color: '#818cf8' },
];

function SkillsPanel({ color }: { color: string }) {
  const [visible, setVisible] = useState(0);
  const [mcpVisible, setMcpVisible] = useState(false);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setVisible(++i);
      if (i >= SKILL_LIST.length) {
        clearInterval(t);
        setTimeout(() => setMcpVisible(true), 320);
      }
    }, 420);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ height: '100%', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', justifyContent: 'center' }}>
      {/* Header */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
        <motion.span
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }}
        />
        {SKILL_LIST.length} skills instalados · {MCP_LIST.length} MCPs activos
      </div>

      {/* Skill rows */}
      {SKILL_LIST.slice(0, visible).map((s) => (
        <motion.div key={s.pkg}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '0.6rem 0.875rem',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${s.type === 'custom' ? `${color}35` : 'rgba(255,255,255,0.07)'}`,
            display: 'flex', alignItems: 'center', gap: '0.75rem',
          }}
        >
          {/* Icon */}
          <div style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: s.type === 'custom' ? `${color}14` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${s.type === 'custom' ? `${color}30` : 'rgba(255,255,255,0.08)'}`,
            display: 'grid', placeItems: 'center',
          }}>
            {s.type === 'custom' ? (
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M8 2l1.5 4.5H14l-3.5 2.5 1.3 4-3.8-2.5-3.8 2.5 1.3-4L2 6.5h4.5z" fill={color} opacity="0.8" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5.5" height="5.5" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                <rect x="8.5" y="2" width="5.5" height="5.5" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                <rect x="2" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" stroke={color} strokeWidth="1" opacity="0.7" />
              </svg>
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.12rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.58rem, 0.85vw, 0.66rem)', color: 'var(--text-1)', fontWeight: 700 }}>{s.label}</span>
              {s.type === 'custom' && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color, background: `${color}15`, border: `1px solid ${color}30`, padding: '0.05rem 0.35rem', borderRadius: 3, letterSpacing: '0.06em' }}>custom</span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.desc}</div>
          </div>

          {/* Active dot */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 1.5 }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }}
          />
        </motion.div>
      ))}

      {/* MCP strip */}
      {mcpVisible && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          style={{
            marginTop: '0.2rem', padding: '0.55rem 0.875rem',
            borderRadius: 8, background: `${color}07`,
            border: `1px solid ${color}1e`,
            display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>MCPs</span>
          {MCP_LIST.map((m, i) => (
            <motion.span key={m.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.25 }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 600,
                padding: '0.15rem 0.5rem', borderRadius: 4,
                background: `${color}0c`, color, border: `1px solid ${color}28`,
                letterSpacing: '0.04em',
              }}
            >mcp:{m.name}</motion.span>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Panel 3: Agents ────────────────────────────────────────────────── */
const TASKS = [
  { id: 1, text: 'Generar tests para auth.service.ts', status: 'done',    sub: '14 tests · cobertura 94%' },
  { id: 2, text: 'Documentar endpoints REST /api/v2',  status: 'done',    sub: 'OpenAPI spec generado' },
  { id: 3, text: 'Scaffold /api/payments module',      status: 'running', sub: 'controllers · models · routes' },
  { id: 4, text: 'Code review pull request #247',      status: 'pending', sub: '3 archivos · 127 líneas' },
] as const;

function AgentsPanel({ color }: { color: string }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setVisible(++i);
      if (i >= TASKS.length) clearInterval(t);
    }, 460);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ height: '100%', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.57rem', letterSpacing: '0.14em',
        textTransform: 'uppercase', color, marginBottom: '0.35rem',
        display: 'flex', alignItems: 'center', gap: '0.45rem',
      }}>
        <motion.span
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }}
        />
        Claude Agent — Ejecutando
      </div>

      {TASKS.slice(0, visible).map(task => (
        <motion.div key={task.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '0.65rem 0.875rem',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${task.status === 'running' ? `${color}40` : 'rgba(255,255,255,0.07)'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.22rem' }}>
            {task.status === 'done' && (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="8" cy="8" r="7.5" stroke="#4ade80" strokeWidth="1" fill="#4ade8012" />
                <path d="M5 8l2.5 2.5L11 5.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {task.status === 'running' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${color}`, borderTopColor: 'transparent', flexShrink: 0 }}
              />
            )}
            {task.status === 'pending' && (
              <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.18)', flexShrink: 0 }} />
            )}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.57rem, 0.85vw, 0.66rem)',
              color: task.status === 'pending' ? 'var(--text-3)' : 'var(--text-1)',
              fontWeight: 500,
            }}>{task.text}</span>
          </div>

          {task.status === 'running' && (
            <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden', marginInline: '18px 0', marginBottom: '0.18rem' }}>
              <motion.div
                initial={{ width: '0%' }} animate={{ width: '68%' }}
                transition={{ duration: 2.2, ease: 'easeOut' }}
                style={{ height: '100%', background: color, borderRadius: 1 }}
              />
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-3)', paddingLeft: 18 }}>
            {task.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Panel 4: Ecosystem ─────────────────────────────────────────────── */
const AI_TOOLS = [
  { name: 'Claude Code', stat: '×4',   label: 'ciclos más rápidos', c: '#d97757', primary: true },
  { name: 'ChatGPT',     stat: '200k', label: 'tokens de contexto', c: '#10b981' },
  { name: 'Gemini',      stat: '1M',   label: 'ventana de contexto', c: '#3b82f6' },
  { name: 'Stitch',      stat: '∞',    label: 'flujos sin código',   c: '#f59e0b' },
];

function EcosystemPanel({ color }: { color: string }) {
  return (
    <div style={{ height: '100%', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', justifyContent: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {AI_TOOLS.map((tool, i) => (
          <motion.div key={tool.name}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 10,
              background: tool.primary ? `${color}0c` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${tool.primary ? `${color}35` : 'rgba(255,255,255,0.07)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: tool.c, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-1)', fontWeight: 700 }}>{tool.name}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)', fontWeight: 900, color: tool.c, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {tool.stat}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.53rem', color: 'var(--text-3)', marginTop: '0.2rem' }}>
              {tool.label}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48, duration: 0.38 }}
        style={{
          textAlign: 'center', padding: '0.875rem',
          background: `${color}08`, borderRadius: 10,
          border: `1px solid ${color}1e`,
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', color: 'var(--text-3)', letterSpacing: '0.12em', marginBottom: '0.28rem' }}>
          IMPACTO EN PRODUCTIVIDAD
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.55rem, 2.4vw, 2rem)', fontWeight: 900, color, letterSpacing: '-0.05em', lineHeight: 1 }}>
          ×3&nbsp;<span style={{ fontSize: '54%', opacity: 0.62, fontWeight: 400, letterSpacing: '-0.02em' }}>más rápido</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Motion variants ────────────────────────────────────────────────── */
type BezierEase = [number, number, number, number];
const E1 = [0.22, 1, 0.36, 1]  as BezierEase;
const E2 = [0.4,  0, 1,    1]  as BezierEase;

const panelV = {
  enter: (d: number) => ({ y: d > 0 ? 38 : -38, opacity: 0, filter: 'blur(10px)', scale: 0.975 }),
  center: { y: 0, opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 0.6, ease: E1 } },
  exit:  (d: number) => ({ y: d > 0 ? -28 : 28, opacity: 0, filter: 'blur(6px)', scale: 0.975, transition: { duration: 0.28, ease: E2 } }),
};

const textV = {
  enter: (d: number) => ({ y: d > 0 ? 18 : -18, opacity: 0 }),
  center: { y: 0, opacity: 1, transition: { duration: 0.5, ease: E1 } },
  exit:  (d: number) => ({ y: d > 0 ? -14 : 14, opacity: 0, transition: { duration: 0.22 } }),
};

/* ─── Main ────────────────────────────────────────────────────────────── */
const PANELS = [TerminalPanel, SkillsPanel, AgentsPanel, EcosystemPanel] as Array<React.FC<{ color: string }>>;

export default function AIShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef     = useRef<HTMLDivElement>(null);
  const scanRef      = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [dir, setDir]               = useState(1);
  const prevRef                     = useRef(0);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const rawStep     = useTransform(scrollYProgress, [0, 1], [0, STEPS.length]);
  const progressPct = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(rawStep, 'change', v => {
    const next = Math.min(Math.floor(v), STEPS.length - 1);
    if (next !== prevRef.current) {
      setDir(next > prevRef.current ? 1 : -1);
      prevRef.current = next;
      setActiveStep(next);
    }
  });

  /* GSAP scan-line on step change */
  useEffect(() => {
    const el = scanRef.current;
    if (!el) return;
    const tl = gsap.fromTo(el,
      { y: 0, opacity: 0.55 },
      { y: '100%', opacity: 0, duration: 0.7, ease: 'power2.in' },
    );
    return () => { tl.kill(); };
  }, [activeStep]);

  /* GSAP frame flash */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const step = STEPS[activeStep];
    const tl = gsap.fromTo(el,
      { outline: `2px solid ${step.color}` },
      { outline: '2px solid transparent', duration: 0.9, ease: 'power3.out' },
    );
    return () => { tl.kill(); };
  }, [activeStep]);

  const step      = STEPS[activeStep];
  const PanelComp = PANELS[activeStep] ?? PANELS[0];

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .ai-root        { flex-direction: column !important; }
          .ai-visual-col  { flex: 0 0 44vh !important; min-height: 220px !important; }
          .ai-content-col { flex: 1 !important; justify-content: flex-start !important; }
        }
      `}</style>

      <section ref={containerRef} id="ai-showcase" style={{ position: 'relative', height: `${STEPS.length * 100}vh` }}>
        <div style={{
          position: 'sticky', top: 0, height: '100svh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', background: 'var(--bg)',
        }}>
          {/* Ambient glow */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            background: `radial-gradient(ellipse 68% 62% at 26% 52%, ${step.color}13 0%, transparent 65%)`,
            transition: 'background 1s ease',
          }} />
          {/* Dot grid */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: 'radial-gradient(rgba(34,211,238,0.038) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }} />

          {/* Layout */}
          <div className="ai-root" style={{
            position: 'relative', zIndex: 1, flex: 1, display: 'flex',
            maxWidth: 1180, marginInline: 'auto', width: '100%',
            padding: 'clamp(0.875rem, 2vw, 1.5rem)',
            paddingTop: 'calc(clamp(0.875rem, 2vw, 1.5rem) + 64px)',
            gap: 'clamp(1rem, 2.5vw, 2.25rem)',
          }}>

            {/* ── Left: Visual ── */}
            <div className="ai-visual-col" style={{ flex: '0 0 54%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <motion.span
                    animate={{ background: step.color, boxShadow: `0 0 8px ${step.color}80` }}
                    transition={{ duration: 0.6 }}
                    style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cyan)' }}>IA &amp; Productividad</span>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.7rem' }}>/</span>
                  <AnimatePresence mode="wait">
                    <motion.span key={step.label}
                      initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.2 } }}
                      exit={{ opacity: 0, x: -5, transition: { duration: 0.15 } }}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.57rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)' }}
                    >{step.label}</motion.span>
                  </AnimatePresence>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
                  <AnimatePresence mode="wait">
                    <motion.span key={step.num}
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                      exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }}
                      style={{ color: step.color, fontWeight: 700 }}
                    >{step.num}</motion.span>
                  </AnimatePresence>
                  <span style={{ color: 'var(--text-3)', opacity: 0.4 }}>&nbsp;/ 04</span>
                </div>
              </div>

              {/* Device frame */}
              <div ref={frameRef} style={{
                flex: 1, minHeight: 0, borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.07)',
                background: '#060c1e', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 0 50px ${step.color}0d`,
                transition: 'box-shadow 0.9s ease',
                position: 'relative',
              }}>
                {/* Chrome bar */}
                <div style={{
                  height: 33, flexShrink: 0,
                  background: 'rgba(255,255,255,0.025)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center',
                  paddingInline: '0.875rem', gap: '0.35rem',
                }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.62 }} />
                  ))}
                  <AnimatePresence mode="wait">
                    <motion.span key={step.cmd}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.1 } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}
                    >{step.cmd}</motion.span>
                  </AnimatePresence>
                </div>

                {/* GSAP scan line */}
                <div ref={scanRef} aria-hidden style={{
                  position: 'absolute', top: 33, left: 0, right: 0, height: 2, zIndex: 10,
                  background: `linear-gradient(to right, transparent 0%, ${step.color} 40%, ${step.color} 60%, transparent 100%)`,
                  pointerEvents: 'none',
                }} />

                {/* Animated panel */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  <AnimatePresence mode="wait" custom={dir}>
                    <motion.div key={activeStep} custom={dir} variants={panelV} initial="enter" animate="center" exit="exit"
                      style={{ position: 'absolute', inset: 0 }}
                    >
                      <PanelComp color={step.color} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── Right: Content ── */}
            <div className="ai-content-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0, paddingBlock: '0.5rem' }}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.7rem, 3vw, 2.5rem)',
                  fontWeight: 900, letterSpacing: '-0.045em', lineHeight: 1.05,
                  background: 'linear-gradient(135deg, var(--text-1) 0%, #a78bfa 55%, var(--cyan) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  marginBottom: 'clamp(1.25rem, 2vw, 2rem)',
                }}>
                  Código ×<br />Inteligencia
                </h2>

                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div key={activeStep} custom={dir} variants={textV} initial="enter" animate="center" exit="exit"
                    style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
                  >
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.59rem',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: step.color, fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '0.45rem',
                    }}>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: step.color, display: 'inline-block', flexShrink: 0 }} />
                      {step.num} — {step.label}
                    </p>

                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.35rem, 2.5vw, 1.9rem)',
                      fontWeight: 800, color: 'var(--text-1)',
                      letterSpacing: '-0.04em', lineHeight: 1.15,
                      whiteSpace: 'pre-line',
                    }}>{step.title}</h3>

                    <p style={{ fontSize: 'clamp(0.875rem, 1.25vw, 0.975rem)', color: 'var(--text-2)', lineHeight: 1.72, maxWidth: '40ch' }}>
                      {step.desc}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.1rem' }}>
                      {step.tags.map((tag, i) => (
                        <motion.span key={tag}
                          initial={{ opacity: 0, scale: 0.82 }}
                          animate={{ opacity: 1, scale: 1, transition: { delay: 0.08 + i * 0.05, duration: 0.3 } }}
                          style={{
                            fontFamily: 'var(--font-mono)', fontSize: '0.61rem', fontWeight: 600,
                            padding: '0.22rem 0.6rem', borderRadius: 5,
                            background: `${step.color}0d`, color: step.color,
                            border: `1px solid ${step.color}32`,
                            letterSpacing: '0.04em',
                            display: 'flex', alignItems: 'center', gap: '0.28rem',
                          }}
                        >
                          <span style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: step.color, flexShrink: 0 }} />
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom nav */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {STEPS.map((_, i) => (
                    <motion.div key={i}
                      animate={{
                        width: i === activeStep ? 26 : 5,
                        opacity: i === activeStep ? 1 : 0.22,
                        background: i === activeStep ? step.color : '#ffffff',
                      }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: 4, borderRadius: 2 }}
                    />
                  ))}
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                  <motion.div style={{ height: '100%', background: step.color, width: progressPct, borderRadius: 1, transition: 'background 0.6s ease' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
