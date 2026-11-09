import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { TbCertificate, TbClockHour4, TbShieldCheck } from 'react-icons/tb';
import { certifications } from '../../data/portfolio';
import { useReveal } from '../../hooks';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { SectionHeading } from '../../components/ui';
import type { CertificationItem } from '../../types/portfolio.types';
import { CertificateCard } from './CertificateCard';
import { CertificateViewer, SHARED_NAME } from './CertificateViewer';
import styles from './Certifications.module.css';

const TOTAL_HOURS = certifications.reduce((sum, c) => sum + c.hours, 0);

/**
 * Runs a DOM update inside a view transition when the browser supports it,
 * so the certificate thumbnail morphs into the lightbox (and back).
 */
function morph(update: () => void) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduce) {
    update();
    return Promise.resolve();
  }
  // Plain cross-fade for the page; only the shared certificate image moves.
  document.documentElement.dataset.nav = 'lateral';
  return document.startViewTransition(() => flushSync(update)).finished;
}

export function Certifications() {
  const root = useRef<HTMLElement>(null);
  const thumb = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<CertificationItem | null>(null);
  useReveal(root);

  // Total study hours count up once the stats row scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = root.current?.querySelector<HTMLElement>('[data-hours]');
        if (!el) return;
        const counter = { value: 0 };
        gsap.to(counter, {
          value: TOTAL_HOURS,
          duration: 1.6,
          ease: 'power3.out',
          snap: { value: 1 },
          onUpdate: () => {
            el.textContent = String(counter.value);
          },
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    },
    { scope: root },
  );

  const open = useCallback((cert: CertificationItem, source: HTMLElement) => {
    thumb.current = source;
    source.style.viewTransitionName = SHARED_NAME;
    morph(() => {
      source.style.viewTransitionName = '';
      setActive(cert);
    });
  }, []);

  const close = useCallback(() => {
    const source = thumb.current;
    morph(() => {
      if (source) source.style.viewTransitionName = SHARED_NAME;
      setActive(null);
    }).finally(() => {
      if (source) {
        source.style.viewTransitionName = '';
        source.closest('article')?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
      }
    });
  }, []);

  return (
    <section ref={root} id="certifications" className="section" aria-labelledby="certifications-title">
      <div className="container">
        <SectionHeading
          id="certifications-title"
          title="Certificaciones"
          lede="Formación continua validada con credenciales verificables, enfocada en backend escalable y desarrollo móvil nativo."
        />

        <ul className={styles.stats} data-stagger>
          <li>
            <TbCertificate aria-hidden />
            <strong>{certifications.length}</strong>
            <span>certificados</span>
          </li>
          <li>
            <TbClockHour4 aria-hidden />
            <strong>
              <span data-hours>{TOTAL_HOURS}</span> h
            </strong>
            <span>de formación</span>
          </li>
          <li>
            <TbShieldCheck aria-hidden />
            <strong>100%</strong>
            <span>verificables en línea</span>
          </li>
        </ul>

        <div className={styles.grid}>
          {certifications.map((c, i) => (
            <CertificateCard key={c.id} cert={c} index={i} onOpen={open} />
          ))}
        </div>
      </div>

      {active && <CertificateViewer cert={active} onClose={close} />}
    </section>
  );
}
