import { useRef, type CSSProperties } from 'react';
import { TbBrandAws } from 'react-icons/tb';
import { awsServices, devopsTools } from '../../data/cloud';
import { useReveal } from '../../hooks';
import { gsap, useGSAP, EASE_OUT, MOTION_OK } from '../../lib/gsap';
import { SectionHeading, ToolIcon } from '../../components/ui';
import { DeployDemo } from './DeployDemo';
import styles from './Cloud.module.css';

const STRIPE = ['var(--aws-compute)', 'var(--aws-storage)', 'var(--aws-database)', 'var(--aws-network)', 'var(--aws-monitor)'];

export function Cloud() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  // The AWS stripe paints in band by band as the section arrives.
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(`.${styles.stripe} span`, {
          scaleX: 0,
          duration: 0.9,
          stagger: 0.09,
          ease: EASE_OUT,
          scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="cloud" className={`section ${styles.cloud}`} aria-labelledby="cloud-title">
      <div className={styles.stripe} aria-hidden>
        {STRIPE.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </div>
      <div className="container">
        <span className={styles.awsMark} data-reveal>
          <TbBrandAws aria-hidden /> Nube y DevOps
        </span>
        <SectionHeading
          id="cloud-title"
          title="Del commit a producción, en AWS"
          lede="Diseño, automatizo y opero la infraestructura de mis proyectos. Elige uno y mira cómo llega a producción: es una simulación de flujos que construí."
        />

        <div data-reveal>
          <DeployDemo />
        </div>

        <h3 className={styles.subheading} data-split>
          Servicios de AWS que uso
        </h3>
        <ul className={styles.services}>
          {awsServices.map((s) => (
            <li
              key={s.id}
              className={`${styles.service} glow-card`}
              style={{ '--tone': s.color, '--glow': s.color } as CSSProperties}
              data-reveal
            >
              <ToolIcon icon={s.icon} color={s.color} size={44} />
              <div>
                <h4>{s.name}</h4>
                <p>{s.use}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className={styles.subheading} data-split>
          Automatización y entrega
        </h3>
        <ul className={styles.tools}>
          {devopsTools.map((t) => (
            <li key={t.id} className={`${styles.tool} glow-card`} style={{ '--glow': t.color } as CSSProperties} data-reveal>
              <ToolIcon icon={t.icon} color={t.color} size={36} />
              <div>
                <strong>{t.name}</strong>
                <span>{t.use}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
