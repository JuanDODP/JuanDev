import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP, EASE_OUT, MOTION_OK } from '../../lib/gsap';
import type { CertificationItem, CertificationTrackInfo } from '../../types/portfolio.types';
import { TRACK_BRANDS } from './brand';
import { CertificateTile } from './CertificateTile';
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

  // The rule draws across like a track being laid down, the header slides in
  // and the tiles deal out after it. After a tab switch everything comes in
  // faster, from the side the visitor moved towards.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const switching = entrance === 'switch';
        const tl = gsap.timeline(
          switching
            ? { delay: 0.05 + order * 0.08 }
            : { scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } },
        );
        tl.from(q(`.${styles.rule}`), {
          scaleX: 0,
          duration: switching ? 0.6 : 0.9,
          ease: 'power3.inOut',
          clearProps: 'transform',
        })
          .from(
            q('[data-head]'),
            {
              autoAlpha: 0,
              x: switching ? direction * 32 : 0,
              y: switching ? 0 : 16,
              duration: switching ? 0.4 : 0.6,
              stagger: 0.05,
              ease: EASE_OUT,
            },
            0.05,
          )
          .from(
            q('[data-tile]'),
            {
              autoAlpha: 0,
              x: switching ? direction * 48 : 0,
              y: switching ? 0 : 28,
              scale: 0.96,
              duration: switching ? 0.45 : 0.7,
              stagger: 0.07,
              ease: EASE_OUT,
              clearProps: 'transform',
            },
            switching ? 0.08 : 0.15,
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
      <span className={styles.rule} aria-hidden />

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
      </header>

      <ul className={styles.tiles}>
        {certs.map((c) => (
          <li key={c.id}>
            <CertificateTile cert={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}
