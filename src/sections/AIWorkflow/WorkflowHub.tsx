import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { SiClaude } from 'react-icons/si';
import { aiWorkflow, type WorkflowNode } from '../../data/ai';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { ToolIcon } from '../../components/ui';
import styles from './WorkflowHub.module.css';

const STEP_SECONDS = 2.6;
const SPLIT = 3; // first three nodes sit left of Claude Code, the rest to the right

type Link = { d: string; side: 'left' | 'right' };

/**
 * Claude Code in the middle, the six stages of my workflow around it.
 * While on screen, a GSAP timeline walks the stages: the matching node lights
 * up, its connector carries a pulse and the center card prints what it's doing.
 */
export function WorkflowHub() {
  const hub = useRef<HTMLDivElement>(null);
  const center = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLLIElement | null)[]>([]);
  const cycle = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(0);
  const [links, setLinks] = useState<Link[]>([]);
  const [drawn, setDrawn] = useState(false);

  // Connector geometry follows the real layout (and is skipped when stacked on mobile).
  useLayoutEffect(() => {
    const root = hub.current;
    if (!root) return;
    const measure = () => {
      const c = center.current?.getBoundingClientRect();
      const h = root.getBoundingClientRect();
      if (!c || window.innerWidth < 1024) return setLinks([]);
      const cy = c.top + c.height / 2 - h.top;
      setLinks(
        nodeRefs.current.map((el, i) => {
          const r = el?.getBoundingClientRect();
          if (!r) return { d: '', side: 'left' as const };
          const ny = r.top + r.height / 2 - h.top;
          const left = i < SPLIT;
          const sx = (left ? c.left : c.right) - h.left;
          const ex = (left ? r.right : r.left) - h.left;
          const bend = (ex - sx) * 0.5;
          return { d: `M ${sx} ${cy} C ${sx + bend} ${cy}, ${ex - bend} ${ny}, ${ex} ${ny}`, side: left ? 'left' : 'right' };
        }),
      );
    };
    // ResizeObserver also fires once on observe, which gives the first measurement.
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true, repeat: -1 });
      aiWorkflow.forEach((_, i) => {
        tl.call(() => setActive(i)).to({}, { duration: STEP_SECONDS });
      });
      cycle.current = tl;

      ScrollTrigger.create({
        trigger: hub.current,
        start: 'top 75%',
        end: 'bottom 20%',
        onEnter: () => setDrawn(true),
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    },
    { scope: hub },
  );

  // Hover or focus takes over the cycle; leaving hands it back.
  const focusNode = (i: number) => {
    cycle.current?.pause();
    setActive(i);
  };
  const release = () => {
    const tl = cycle.current;
    if (!tl) return;
    tl.seek(active * STEP_SECONDS + 0.01).play();
  };

  const renderNode = (node: WorkflowNode, i: number) => (
    <li
      key={node.id}
      ref={(el) => {
        nodeRefs.current[i] = el;
      }}
      className={`${styles.node} glow-card`}
      style={{ '--glow': 'var(--violet)' } as CSSProperties}
      data-active={i === active}
      data-reveal
      tabIndex={0}
      onPointerEnter={() => focusNode(i)}
      onPointerLeave={release}
      onFocus={() => focusNode(i)}
      onBlur={release}
    >
      <div className={styles.nodeHead}>
        <ToolIcon icon={node.icon} color="var(--violet)" size={36} />
        <h3>{node.title}</h3>
      </div>
      <p>{node.text}</p>
      <ul className={styles.chips}>
        {node.chips.map(({ label, icon: Icon, color }) => (
          <li key={label}>
            {Icon && <Icon aria-hidden style={{ color }} />}
            {label}
          </li>
        ))}
      </ul>
    </li>
  );

  const current = aiWorkflow[active];

  return (
    <div ref={hub} className={styles.hub} data-drawn={drawn}>
      {links.length > 0 && (
        <svg className={styles.wires} aria-hidden>
          {links.map((link, i) => (
            <g key={i} data-active={i === active}>
              <path d={link.d} pathLength={1} className={styles.wire} style={{ transitionDelay: `${i * 90}ms` }} />
              <path d={link.d} pathLength={1} className={`${styles.pulse} ${styles[link.side]}`} />
            </g>
          ))}
        </svg>
      )}

      <ul className={`${styles.column} ${styles.leftCol}`}>{aiWorkflow.slice(0, SPLIT).map(renderNode)}</ul>

      <div ref={center} className={styles.center} data-reveal>
        <span className={styles.logo}>
          <SiClaude aria-hidden />
        </span>
        <h3 className={styles.centerTitle}>Claude Code</h3>
        <p className={styles.centerSub}>Mi entorno principal de desarrollo</p>
        <div className={styles.console} aria-live="polite">
          <span className={styles.caret}>›</span>
          <span key={current.id} className={styles.status}>
            {current.status}
          </span>
        </div>
        <ol className={styles.steps} aria-hidden>
          {aiWorkflow.map((n, i) => (
            <li key={n.id} data-state={i < active ? 'done' : i === active ? 'active' : 'idle'} />
          ))}
        </ol>
      </div>

      <ul className={`${styles.column} ${styles.rightCol}`}>
        {aiWorkflow.slice(SPLIT).map((n, i) => renderNode(n, i + SPLIT))}
      </ul>
    </div>
  );
}
