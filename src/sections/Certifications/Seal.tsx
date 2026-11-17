import { useId } from 'react';
import { issuerBrand } from './brand';
import styles from './Seal.module.css';

type Props = { hours?: number; issuer: string; className?: string };

/** Rotating credential seal: circular text around the course length (or the issuer's logo). */
export function Seal({ hours, issuer, className = '' }: Props) {
  const pathId = useId();
  const brand = issuerBrand(issuer);
  return (
    <div className={`${styles.seal} ${className}`} aria-hidden data-seal>
      <svg viewBox="0 0 100 100" className={styles.ring}>
        <defs>
          <path id={pathId} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text>
          <textPath href={`#${pathId}`} textLength={236} lengthAdjust="spacing">
            {`CERTIFICADO DE FINALIZACIÓN · ${brand.seal} ·`}
          </textPath>
        </text>
      </svg>
      <span className={styles.core}>
        {hours ? (
          <>
            <strong>{hours}</strong>
            <small>horas</small>
          </>
        ) : (
          <brand.icon className={styles.logo} style={{ color: brand.color }} />
        )}
      </span>
    </div>
  );
}
