import type { ProjectItem } from '../../../types/portfolio.types';
import styles from './ProjectMeta.module.css';

const CATEGORY: Record<ProjectItem['category'], string> = {
  web: 'Web',
  mobile: 'Móvil',
  infra: 'Infraestructura',
};

const STATUS: Record<ProjectItem['status'], string> = {
  production: 'En producción',
  internal: 'Uso interno',
  active: 'En desarrollo',
};

export function ProjectMeta({ project }: { project: ProjectItem }) {
  return (
    <p className={styles.meta}>
      <span>{CATEGORY[project.category]}</span>
      <span className={`${styles.status} ${project.status === 'production' ? styles.production : ''}`}>
        {STATUS[project.status]}
      </span>
    </p>
  );
}
