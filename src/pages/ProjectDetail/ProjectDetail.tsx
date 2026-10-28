import { useRef } from 'react';
import { Link, useParams } from 'react-router';
import type { IconType } from 'react-icons';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import { TbArrowLeft, TbArrowRight, TbExternalLink } from 'react-icons/tb';
import { projects } from '../../data/portfolio';
import type { ProjectLink } from '../../types/portfolio.types';
import { useReveal } from '../../hooks';
import { setNavDirection } from '../../lib/navDirection';
import { ProjectMeta, ProjectPreview } from '../../components/project';
import { Button, TechTag } from '../../components/ui';
import styles from './ProjectDetail.module.css';

const LINK_ICON: Record<ProjectLink['type'], IconType> = {
  demo: TbExternalLink,
  playstore: SiGoogleplay,
  appstore: SiAppstore,
};

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  const index = projects.findIndex((p) => p.id === id);
  const project = projects[index];

  if (!project) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.missing}>
          <h1 className={styles.title}>Proyecto no encontrado</h1>
          <p className={styles.description}>El enlace puede estar desactualizado. Revisa la lista completa de proyectos.</p>
          <Button href="/#projects">Ver proyectos</Button>
        </div>
      </div>
    );
  }

  const prev = projects[index - 1];
  const next = projects[index + 1];

  return (
    <article ref={root} className={`container ${styles.page}`}>
      <Link to="/#projects" className={styles.back} viewTransition onClick={() => setNavDirection('back')}>
        <TbArrowLeft aria-hidden /> Proyectos
      </Link>

      <header>
        <ProjectMeta project={project} />
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.subtitle}>{project.subtitle}</p>
        {project.links.length > 0 && (
          <div className={styles.links}>
            {project.links.map((link, i) => {
              const Icon = LINK_ICON[link.type];
              return (
                <Button key={link.url} href={link.url} external variant={i === 0 ? 'primary' : 'ghost'}>
                  <Icon aria-hidden /> {link.label}
                </Button>
              );
            })}
          </div>
        )}
      </header>

      <div className={styles.frame}>
        <div className={styles.frameBar} aria-hidden>
          <i />
          <i />
          <i />
          <span>{project.links[0]?.url ?? project.title}</span>
        </div>
        <ProjectPreview project={project} className={styles.preview} eager />
      </div>

      <div className={styles.content}>
        <section data-reveal>
          <h2>Descripción</h2>
          <p className={styles.description}>{project.description}</p>
        </section>

        <dl className={styles.facts} data-reveal>
          <div>
            <dt>Público</dt>
            <dd>{project.targetAudience}</dd>
          </div>
          <div>
            <dt>Contexto</dt>
            <dd>{project.context}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd className={styles.tags}>
              {project.tags.map((t) => (
                <TechTag key={t} name={t} />
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <nav className={styles.pager} aria-label="Otros proyectos">
        {prev && (
          <Link to={`/projects/${prev.id}`} viewTransition onClick={() => setNavDirection('lateral')}>
            <small>
              <TbArrowLeft aria-hidden /> Anterior
            </small>
            <strong>{prev.title}</strong>
          </Link>
        )}
        {next && (
          <Link
            to={`/projects/${next.id}`}
            className={styles.next}
            viewTransition
            onClick={() => setNavDirection('lateral')}
          >
            <small>
              Siguiente <TbArrowRight aria-hidden />
            </small>
            <strong>{next.title}</strong>
          </Link>
        )}
      </nav>
    </article>
  );
}
