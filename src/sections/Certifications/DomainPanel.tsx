import { useRef } from 'react';
import { gsap, useGSAP, EASE_OUT, MOTION_OK } from '../../lib/gsap';
import type { CertificationDomainInfo, CertificationItem } from '../../types/portfolio.types';
import { PANEL_ID, tabId, useCertifications } from './context';
import { TrackLane } from './TrackLane';
import styles from './Certifications.module.css';

type Props = { domain: CertificationDomainInfo; certs: CertificationItem[] };

export function DomainPanel({ domain, certs }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const { entrance, direction } = useCertifications();

  // On a tab switch the domain summary leads the new content in from the side.
  useGSAP(
    () => {
      if (entrance !== 'switch') return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(`.${styles.summary}`, { autoAlpha: 0, x: direction * 28, duration: 0.4, ease: EASE_OUT });
      });
    },
    { scope: root },
  );

  const lanes = domain.tracks
    .map((track) => ({ track, certs: certs.filter((c) => c.track === track.id) }))
    .filter((lane) => lane.certs.length > 0);

  return (
    <div ref={root} id={PANEL_ID} role="tabpanel" aria-labelledby={tabId(domain.id)} className={styles.panel}>
      <p className={styles.summary} data-swap>
        {domain.summary}
      </p>
      {lanes.map(({ track, certs: laneCerts }, i) => (
        <TrackLane key={track.id} track={track} certs={laneCerts} order={i} />
      ))}
    </div>
  );
}
