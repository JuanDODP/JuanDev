import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP, EASE_OUT, MOTION_OK } from '../../lib/gsap';
import type { CertificationItem, CertificationTrackInfo } from '../../types/portfolio.types';
import { TRACK_BRANDS } from './brand';
import { CertificateCard } from './CertificateCard';
import { useCertifications } from './context';
import styles from './TrackLane.module.css';

type Props = {
  track: CertificationTrackInfo;
  certs: CertificationItem[];
  /** Position of the lane in its panel, printed as "01", "02"… */
  order: number;
};

export function TrackLane({ track, certs, order }: Props) {
  const root = useRef<HTMLElement>(null);
  const { entrance, direction } = useCertifications();
  const { icon: Icon, color } = TRACK_BRANDS[track.id];
  const hours = certs.reduce((sum, c) => sum + (c.hours ?? 0), 0);
  const headingId = `track-${track.id}-title`;

  // The lane header slides in from the side the visitor moved towards, while
  // its rule draws across like a timeline track being laid down.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const switching = entrance === 'switch';
        const tl = gsap.timeline(
          switching
            ? { delay: order * 0.08 }
            : { scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } },
        );
        tl.from(q('[data-head]'), {
          autoAlpha: 0,
          x: switching ? direction * 36 : 0,
          y: switching ? 0 : 18,
          duration: switching ? 0.45 : 0.7,
          stagger: 0.06,
          ease: EASE_OUT,
        }).from(
          q(`.${styles.rule}`),
          { scaleX: 0, duration: switching ? 0.6 : 0.9, ease: 'power3.inOut', clearProps: 'transform' },
          0.05,
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className={styles.lane}
      aria-labelledby={headingId}
      style={{ '--track': color } as CSSProperties}
      data-swap
    >
      <header className={styles.head}>
        <span className={styles.icon} data-head aria-hidden>
          <Icon />
        </span>
        <div className={styles.titles} data-head>
          <p className={styles.kicker}>
            <span className={styles.order}>{String(order + 1).padStart(2, '0')}</span> Track
          </p>
          <h3 id={headingId} className={styles.title}>
            {track.label}
          </h3>
        </div>
        <p className={styles.summary} data-head>
          {track.summary}
        </p>
        <p className={styles.meta} data-head>
          {certs.length} {certs.length === 1 ? 'certificado' : 'certificados'}
          {hours > 0 && <> · {hours} h</>}
        </p>
        <span className={styles.rule} aria-hidden />
      </header>

      <div className={styles.grid} data-count={Math.min(certs.length, 2)}>
        {certs.map((c, i) => (
          <CertificateCard key={c.id} cert={c} index={i} wide={certs.length === 1} />
        ))}
      </div>
    </section>
  );
}
