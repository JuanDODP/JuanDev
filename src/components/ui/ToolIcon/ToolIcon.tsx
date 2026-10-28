import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import styles from './ToolIcon.module.css';

type Props = { icon: IconType; color: string; size?: number; className?: string };

/** Tinted icon tile: the tone drives icon, fill and border so every service keeps its own color. */
export function ToolIcon({ icon: Icon, color, size = 40, className }: Props) {
  const style = { '--tone': color, '--size': `${size}px` } as CSSProperties;
  return (
    <span className={[styles.tile, className].filter(Boolean).join(' ')} style={style} aria-hidden>
      <Icon />
    </span>
  );
}
