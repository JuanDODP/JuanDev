import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

type Props = { id?: string; title: ReactNode; lede?: ReactNode };

export function SectionHeading({ id, title, lede }: Props) {
  return (
    <header className={styles.heading}>
      <h2 id={id} className={styles.title} data-split>
        {title}
      </h2>
      {lede && (
        <p className={styles.lede} data-reveal>
          {lede}
        </p>
      )}
    </header>
  );
}
