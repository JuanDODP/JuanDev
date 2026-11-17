import { useRef, type CSSProperties } from 'react';
import { TbArrowUpRight } from 'react-icons/tb';
import { gsap, useGSAP } from '../../lib/gsap';
import type { CertificationItem } from '../../types/portfolio.types';
import { issuerBrand } from './brand';
import { useCertifications } from './context';
import styles from './CertificateTile.module.css';

const HOVER_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** "17 de noviembre de 2026" → "nov 2026" */
const shortDate = (issued: string) => {
  const parts = issued.split(' de ');
  return parts.length === 3 ? `${parts[1].slice(0, 3)} ${parts[2]}` : issued;
};

/**
 * Compact certificate preview. Hovering zooms the paper and sweeps a light band
 * across it; clicking hands the thumbnail to the slider, which morphs it open.
 */
export function CertificateTile({ cert }: { cert: CertificationItem }) {
  const root = useRef<HTMLButtonElement>(null);
  const hover = useRef<{ enter: () => void; leave: () => void } | null>(null);
  const { open } = useCertifications();
  const issuer = issuerBrand(cert.issuer);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(HOVER_QUERY, (ctx) => {
        const q = gsap.utils.selector(root);
        const lift = gsap
          .timeline({ paused: true, defaults: { duration: 0.24, ease: 'power3.out' } })
          .to(q(`.${styles.thumb} img`), { scale: 1.08 }, 0)
          .to(q(`.${styles.thumb}`), { y: -3, boxShadow: '0 18px 30px -16px rgba(0,0,0,0.9)' }, 0)
          .to(q(`.${styles.arrow}`), { x: 3, y: -3, color: 'var(--amber)' }, 0);

        hover.current = {
          enter: ctx.add('enter', () => {
            lift.play();
            gsap.fromTo(
              q(`.${styles.sheen}`),
              { xPercent: -130 },
              { xPercent: 130, duration: 0.8, ease: 'power2.inOut', overwrite: true },
            );
          }) as () => void,
          leave: ctx.add('leave', () => lift.reverse()) as () => void,
        };
        return () => {
          hover.current = null;
        };
      });
    },
    { scope: root },
  );

  return (
    <button
      ref={root}
      type="button"
      className={styles.tile}
      style={{ '--glow': cert.accent } as CSSProperties}
      onClick={() => {
        const thumb = root.current?.querySelector<HTMLElement>(`.${styles.thumb}`);
        if (thumb) open(cert, thumb);
      }}
      onPointerEnter={() => hover.current?.enter()}
      onPointerLeave={() => hover.current?.leave()}
      aria-haspopup="dialog"
      data-tile
    >
      <span className={styles.thumb} data-cert-thumb={cert.id}>
        <img src={cert.image} alt="" width={1600} height={1190} loading="lazy" decoding="async" />
        <span className={styles.sheen} aria-hidden />
      </span>

      <span className={styles.info}>
        <span className={styles.issuer}>
          <issuer.icon aria-hidden style={{ color: issuer.color }} /> {issuer.name}
        </span>
        <span className={styles.title}>{cert.title}</span>
        <span className={styles.meta}>
          {cert.hours ? `${cert.hours} h · ` : ''}
          {shortDate(cert.issued)}
        </span>
      </span>

      <TbArrowUpRight className={styles.arrow} aria-hidden />
    </button>
  );
}
