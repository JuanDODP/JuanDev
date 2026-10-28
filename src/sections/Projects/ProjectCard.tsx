import { useRef } from 'react';
import { Link } from 'react-router';
import { TbArrowUpRight } from 'react-icons/tb';
import { gsap, useGSAP } from '../../lib/gsap';
import { setNavDirection } from '../../lib/navDirection';
import type { ProjectItem } from '../../types/portfolio.types';
import { ProjectMeta, ProjectPreview } from '../../components/project';
import { TechTag } from '../../components/ui';
import styles from './ProjectCard.module.css';

const HOVER_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function ProjectCard({ project, featured }: { project: ProjectItem; featured?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const { id, title, subtitle, description, tags, links, targetAudience } = project;
  const primaryLink = links[0];
  const visibleTags = featured ? 3 : 2;

  // Hover reveals the technical sheet; the screenshot eases in slightly behind it.
  const { contextSafe } = useGSAP({ scope: root });
  const canHover = () => window.matchMedia(HOVER_QUERY).matches;

  const onEnter = contextSafe(() => {
    if (!canHover()) return;
    gsap.to(`.${styles.sheet}`, { autoAlpha: 1, yPercent: 0, duration: 0.24, ease: 'power3.out', overwrite: true });
    gsap.to(`.${styles.preview}`, { scale: 1.03, duration: 0.4, ease: 'power3.out', overwrite: true });
  });

  const onLeave = contextSafe(() => {
    if (!canHover()) return;
    gsap.to(`.${styles.sheet}`, { autoAlpha: 0, yPercent: 100, duration: 0.18, ease: 'power2.out', overwrite: true });
    gsap.to(`.${styles.preview}`, { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
  });

  useGSAP(() => gsap.set(`.${styles.sheet}`, { yPercent: 100 }), { scope: root });

  return (
    <article
      ref={root}
      className={`${styles.card} ${featured ? styles.featured : ''} glow-card`}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      data-reveal
    >
      <div className={styles.media} data-media>
        <ProjectPreview project={project} className={styles.preview} />
        <dl className={styles.sheet} aria-hidden>
          <dt>Stack</dt>
          <dd>{tags.join(', ')}</dd>
          <dt>Para</dt>
          <dd>{targetAudience}</dd>
        </dl>
      </div>

      <div className={styles.body}>
        <ProjectMeta project={project} />
        <h3 className={styles.title}>
          <Link to={`/projects/${id}`} viewTransition onClick={() => setNavDirection('forward')}>
            {title}
          </Link>
        </h3>
        <p className={styles.subtitle}>{subtitle}</p>
        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <div className={styles.tags}>
            {tags.slice(0, visibleTags).map((t) => (
              <TechTag key={t} name={t} />
            ))}
            {tags.length > visibleTags && <span className={styles.more}>+{tags.length - visibleTags}</span>}
          </div>
          {primaryLink && (
            <a
              className={styles.external}
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${primaryLink.label}: ${title} (abre en una pestaña nueva)`}
            >
              <TbArrowUpRight aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
