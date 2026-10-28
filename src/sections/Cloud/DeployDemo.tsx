import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TbCheck, TbPlayerSkipForward, TbRefresh } from 'react-icons/tb';
import { deployScenarios, type DeployScenario } from '../../data/cloud';
import { ScrollTrigger, useGSAP } from '../../lib/gsap';
import { ToolIcon } from '../../components/ui';
import { useDeployPlayback } from './useDeployPlayback';
import styles from './DeployDemo.module.css';

type NodeState = 'idle' | 'active' | 'done';

export function DeployDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [scenarioId, setScenarioId] = useState(deployScenarios[0].id);
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();
  const scenario = deployScenarios.find((s) => s.id === scenarioId) ?? deployScenarios[0];

  // Start the first run once the terminal is comfortably on screen.
  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: root.current, start: 'top 70%', once: true, onEnter: () => setInView(true) });
    },
    { scope: root },
  );

  const select = (id: string) => {
    setScenarioId(id);
    setInView(true);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    const next = deployScenarios[(index + delta + deployScenarios.length) % deployScenarios.length];
    select(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <div ref={root} className={styles.demo}>
      <div className={styles.tabs} role="tablist" aria-label="Escenarios de despliegue">
        {deployScenarios.map((s, i) => {
          const selected = s.id === scenario.id;
          return (
            <button
              key={s.id}
              id={`tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="deploy-panel"
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => select(s.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {selected && (
                <motion.span
                  layoutId="deploy-tab"
                  className={styles.tabBg}
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.3, bounce: 0 }}
                />
              )}
              <span className={styles.tabLabel}>{s.label}</span>
            </button>
          );
        })}
      </div>

      <p className={styles.summary}>{scenario.summary}</p>

      {/* Keyed by scenario so playback state restarts cleanly on every switch */}
      <Run key={scenario.id} scenario={scenario} play={inView} />
    </div>
  );
}

function Run({ scenario, play }: { scenario: DeployScenario; play: boolean }) {
  const { lines, nodes } = scenario;
  const { count, chars, finished, replay, skip } = useDeployPlayback(lines, play);
  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [count]);

  const started = count > 0 || chars > 0;
  const current = lines[Math.min(count, lines.length - 1)];
  const activeIndex = nodes.findIndex((n) => n.id === current.node);
  const nodeState = (i: number): NodeState =>
    finished || i < activeIndex ? 'done' : started && i === activeIndex ? 'active' : 'idle';

  const typing = lines[count]?.kind === 'cmd' && chars > 0 ? lines[count].text.slice(0, chars) : null;

  return (
    <div id="deploy-panel" role="tabpanel" aria-labelledby={`tab-${scenario.id}`} className={styles.run}>
      <ol className={styles.pipeline} aria-label="Etapas del pipeline">
        {nodes.map((n, i) => {
          const s = nodeState(i);
          return (
            <li key={n.id} className={styles.node} data-state={s}>
              <span className={styles.nodeIcon}>
                <ToolIcon icon={n.icon} color={n.color} size={40} />
                {s === 'done' && (
                  <span className={styles.check} aria-hidden>
                    <TbCheck />
                  </span>
                )}
              </span>
              <span className={styles.nodeText}>
                <span className={styles.nodeLabel}>{n.label}</span>
                <span className={styles.nodeStatus}>
                  {s === 'done' ? 'Listo' : s === 'active' ? 'En curso' : 'En espera'}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className={styles.terminal}>
        <div className={styles.titlebar}>
          <span className={styles.lights} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.host}>{scenario.host}</span>
          <span className={styles.controls}>
            {finished ? (
              <button type="button" onClick={replay} className={styles.control}>
                <TbRefresh aria-hidden /> Repetir
              </button>
            ) : (
              <button type="button" onClick={skip} className={styles.control} disabled={!play}>
                <TbPlayerSkipForward aria-hidden /> Saltar
              </button>
            )}
          </span>
        </div>

        <div ref={bodyRef} className={styles.body} aria-hidden>
          {lines.slice(0, count).map((line, i) => (
            <TermRow key={i} kind={line.kind} text={line.text} />
          ))}
          {typing !== null && <TermRow kind="cmd" text={typing} cursor />}
          {(finished || !started) && <TermRow kind="cmd" text="" cursor />}
        </div>

        {/* Screen readers get the whole transcript at once instead of keystroke noise */}
        <ol className="visually-hidden">
          {lines.map((line, i) => (
            <li key={i}>{line.kind === 'cmd' ? `Comando: ${line.text}` : line.text}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function TermRow({ kind, text, cursor }: { kind: 'cmd' | 'out' | 'ok'; text: string; cursor?: boolean }) {
  return (
    <div className={`${styles.row} ${styles[kind]}`}>
      {kind === 'cmd' && <span className={styles.prompt}>$</span>}
      {kind === 'ok' && <span className={styles.okMark}>✓</span>}
      <span>{text}</span>
      {cursor && <span className={styles.cursor} />}
    </div>
  );
}
