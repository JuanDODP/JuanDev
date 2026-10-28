import { useRef } from 'react';
import { SiClaude } from 'react-icons/si';
import { aiTools } from '../../data/ai';
import { useReveal } from '../../hooks';
import { SectionHeading } from '../../components/ui';
import { WorkflowHub } from './WorkflowHub';
import styles from './AIWorkflow.module.css';

export function AIWorkflow() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="ai" className={`section ${styles.ai}`} aria-labelledby="ai-title">
      <div className="container">
        <span className={styles.badge} data-reveal>
          <SiClaude aria-hidden /> IA en mi flujo de trabajo
        </span>
        <SectionHeading
          id="ai-title"
          title="Desarrollo con IA, con método"
          lede="Claude Code es mi entorno principal: le doy el contexto del proyecto, le cargo skills expertas, lo conecto por MCP a herramientas reales y verifico cada cambio antes de entregarlo."
        />

        <WorkflowHub />

        <div className={styles.footer}>
          <div data-reveal>
            <h3>También en mi caja de herramientas</h3>
            <ul className={styles.tools}>
              {aiTools.map(({ label, icon: Icon, color }) => (
                <li key={label}>
                  {Icon && <Icon aria-hidden style={{ color }} />}
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.proof} data-reveal>
            <p>
              <strong>Este portafolio se construyó así.</strong> Un CLAUDE.md con las reglas de contenido, skills de diseño
              y animación para cada decisión visual, y capturas automáticas en escritorio y móvil para revisar cada sección
              antes de publicarla en AWS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
