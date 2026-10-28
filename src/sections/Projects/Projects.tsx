import { useRef } from 'react';
import { projects } from '../../data/portfolio';
import { useReveal } from '../../hooks';
import { SectionHeading } from '../../components/ui';
import { ProjectCard } from './ProjectCard';
import styles from './Projects.module.css';

const FEATURED = 2;

export function Projects() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section ref={root} id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          title="Proyectos destacados"
          lede="Sistemas en producción para restaurantes, logística, finanzas, educación y comercio, en web y móvil."
        />
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} featured={i < FEATURED} />
          ))}
        </div>
      </div>
    </section>
  );
}
