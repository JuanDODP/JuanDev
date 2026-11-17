import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { TbCertificate, TbClockHour4, TbSchool } from 'react-icons/tb';
import { certificationDomains, certifications } from '../../data/portfolio';
import { useReveal } from '../../hooks';
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../../lib/gsap';
import { SectionHeading } from '../../components/ui';
import type { CertificationDomain, CertificationItem } from '../../types/portfolio.types';
import { CertificateViewer, SHARED_NAME } from './CertificateViewer';
import { CertificationsContext, type Entrance } from './context';
import { DomainPanel } from './DomainPanel';
import { DomainTabs } from './DomainTabs';
import styles from './Certifications.module.css';

const TOTAL_HOURS = certifications.reduce((sum, c) => sum + (c.hours ?? 0), 0);
const ISSUER_COUNT = new Set(certifications.map((c) => c.issuer)).size;

const certsByDomain = Object.fromEntries(
  certificationDomains.map((d) => [d.id, certifications.filter((c) => d.tracks.some((t) => t.id === c.track))]),
) as Record<CertificationDomain, CertificationItem[]>;

const counts = Object.fromEntries(
  certificationDomains.map((d) => [d.id, certsByDomain[d.id].length]),
) as Record<CertificationDomain, number>;

const domainIndex = (id: CertificationDomain) => certificationDomains.findIndex((d) => d.id === id);

type View = { domain: CertificationDomain; entrance: Entrance; direction: 1 | -1 };

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs a DOM update inside a view transition when the browser supports it,
 * so the certificate thumbnail morphs into the lightbox (and back).
 */
function morph(update: () => void) {
  if (!document.startViewTransition || prefersReducedMotion()) {
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
  // `selected` drives the tab indicator instantly; `view` swaps the panel
  // once the outgoing content has finished leaving.
  const [selected, setSelected] = useState<CertificationDomain>(certificationDomains[0].id);
  const [view, setView] = useState<View>({ domain: selected, entrance: 'scroll', direction: 1 });
  const shown = useRef(view.domain);
  const [active, setActive] = useState<CertificationItem | null>(null);
  useReveal(root);

  // Total study hours count up once the stats row scrolls in.
  const { contextSafe } = useGSAP(
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

  // Panels differ in height, so every trigger further down the page needs new positions.
  useEffect(() => {
    if (view.entrance === 'switch') ScrollTrigger.refresh();
  }, [view]);

  const selectDomain = (next: CertificationDomain) => {
    if (next === selected) return;
    const direction = domainIndex(next) > domainIndex(selected) ? 1 : -1;
    setSelected(next);

    const leaving = root.current?.querySelectorAll<HTMLElement>('[data-swap]');
    const commit = () => {
      shown.current = next;
      setView({ domain: next, entrance: 'switch', direction });
    };

    if (!leaving?.length || prefersReducedMotion()) {
      commit();
      return;
    }
    // Came back to the panel that was still leaving: bring it back instead of remounting.
    if (next === shown.current) {
      contextSafe(() => {
        gsap.to(leaving, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.3, ease: 'power2.out', overwrite: true });
      })();
      return;
    }
    // Created through contextSafe so the tween is reverted if the section unmounts mid-swap.
    contextSafe(() => {
      gsap.to(leaving, {
        autoAlpha: 0,
        x: -direction * 48,
        filter: 'blur(6px)',
        duration: 0.22,
        stagger: 0.035,
        ease: 'power2.in',
        overwrite: true,
        onComplete: commit,
      });
    })();
  };

  const open = (cert: CertificationItem, source: HTMLElement) => {
    thumb.current = source;
    source.style.viewTransitionName = SHARED_NAME;
    morph(() => {
      source.style.viewTransitionName = '';
      setActive(cert);
    });
  };

  const close = () => {
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
  };

  const ctx = { entrance: view.entrance, direction: view.direction, open };
  const domain = certificationDomains[domainIndex(view.domain)];

  return (
    <section ref={root} id="certifications" className="section" aria-labelledby="certifications-title">
      <div className="container">
        <SectionHeading
          id="certifications-title"
          title="Certificaciones"
          lede="Formación continua con credenciales oficiales, organizada por dominio: desarrollo web —frontend y backend— e infraestructura cloud."
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
            <TbSchool aria-hidden />
            <strong>{ISSUER_COUNT}</strong>
            <span>emisores oficiales</span>
          </li>
        </ul>

        <DomainTabs domains={certificationDomains} counts={counts} selected={selected} onSelect={selectDomain} />

        <CertificationsContext value={ctx}>
          <DomainPanel key={domain.id} domain={domain} certs={certsByDomain[domain.id]} />
        </CertificationsContext>
      </div>

      {active && <CertificateViewer cert={active} onClose={close} />}
    </section>
  );
}
