import type { AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'ghost';
  size?: 'default' | 'small';
  external?: boolean;
  children: ReactNode;
};

/** Link styled as a button. `external` opens in a new tab safely. */
export function Button({ variant = 'primary', size = 'default', external, className, children, ...rest }: Props) {
  const classes = [styles.button, styles[variant], size === 'small' && styles.small, className].filter(Boolean).join(' ');
  return (
    <a className={classes} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
      {children}
    </a>
  );
}
