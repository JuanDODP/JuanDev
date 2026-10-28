import type { ReactNode } from 'react';
import styles from './Tag.module.css';

export function Tag({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className={styles.tag}>
      {icon}
      {children}
    </span>
  );
}
