import { useRef } from 'react';
import { skillGroups } from '../../data/portfolio';
import { useReveal } from '../../hooks';
import { SectionHeading, TechTag } from '../../components/ui';
import styles from './Stack.module.css';

export function Stack() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="stack" className="section" aria-labelledby="stack-title">
      <div className="container">
        <SectionHeading
          id="stack-title"
          title="Stack técnico"
          lede="Lo que uso a diario para llevar productos a producción, del componente a la base de datos."
        />
        <div className={styles.bento}>
          {skillGroups.map((group) => (
            <article key={group.id} className={`${styles.cell} ${styles[group.id] ?? ''} glow-card`} data-reveal>
              <div>
                <h3>{group.title}</h3>
                <p>{group.blurb}</p>
              </div>
              <div className={styles.tags} data-stagger>
                {group.items.map((item) => (
                  <TechTag key={item} name={item} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
