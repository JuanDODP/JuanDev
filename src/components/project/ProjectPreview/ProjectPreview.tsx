import type { CSSProperties } from 'react';
import { TbBrowser, TbServerCog } from 'react-icons/tb';
import type { ProjectItem } from '../../../types/portfolio.types';
import styles from './ProjectPreview.module.css';

type Props = { project: ProjectItem; className?: string; eager?: boolean };

/**
 * Visual for a project. Carries a per-project `view-transition-name` so the card
 * image morphs into the detail hero when navigating.
 */
export function ProjectPreview({ project, className, eager }: Props) {
  const { id, title, preview, category, accent } = project;
  const style = { viewTransitionName: `project-${id}`, '--accent': accent } as CSSProperties;
  const cls = [styles.preview, className].filter(Boolean).join(' ');

  if (preview && category === 'mobile') {
    return (
      <div className={cls} style={style}>
        <div className={styles.app}>
          <img src={preview} alt={`Ícono de ${title}`} loading={eager ? 'eager' : 'lazy'} />
        </div>
      </div>
    );
  }

  if (preview) {
    return (
      <div className={cls} style={style}>
        <img className={styles.shot} src={preview} alt={`Captura de ${title}`} loading={eager ? 'eager' : 'lazy'} />
      </div>
    );
  }

  const Icon = category === 'infra' ? TbServerCog : TbBrowser;
  return (
    <div className={cls} style={style}>
      <div className={styles.placeholder}>
        <Icon aria-hidden />
        <span>{category === 'infra' ? 'Infraestructura sin interfaz pública' : 'Sistema de uso interno'}</span>
      </div>
    </div>
  );
}
