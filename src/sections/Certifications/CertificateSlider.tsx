import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  TbChevronLeft,
  TbChevronRight,
  TbExternalLink,
  TbFileTypePdf,
  TbRosetteDiscountCheck,
  TbX,
} from 'react-icons/tb';
import { gsap, useGSAP, EASE_OUT, MOTION_OK } from '../../lib/gsap';
import { TechTag } from '../../components/ui';
import type { CertificationItem, CertificationTrackInfo } from '../../types/portfolio.types';
import { issuerBrand, TRACK_BRANDS } from './brand';
import { SHARED_NAME } from './context';
import { Seal } from './Seal';
import styles from './CertificateSlider.module.css';

const HEX = '0123456789abcdef';
const SWIPE_PX = 50;

type Direction = -1 | 0 | 1;

type Props = {
  certs: CertificationItem[];
  tracks: Record<string, CertificationTrackInfo & { domain: string }>;
  startIndex: number;
  onClose: (cert: CertificationItem) => void;
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function CertificateSlider({ certs, tracks, startIndex, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<{ index: number; direction: Direction }>({ index: startIndex, direction: 0 });
  // Where navigation is heading (may run ahead of `view` while a slide is leaving).
  const target = useRef(startIndex);
  const swipeStart = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const { contextSafe } = useGSAP({ scope: dialog });

  const total = certs.length;
  const cert = certs[view.index];

  // Open as a modal in the same commit, so the view transition captures it,
  // and keep the page underneath from scrolling while it is open.
  useLayoutEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
      el?.close();
    };
  }, []);

  // Keep the current thumbnail centred in the filmstrip (it scrolls on phones).
  useLayoutEffect(() => {
    dialog.current
      ?.querySelector('[aria-current]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [view.index]);

  const goTo = (rawNext: number, direction: 1 | -1) => {
    const next = (rawNext + total) % total;
    if (next === target.current) return;
    target.current = next;

    const leaving = dialog.current?.querySelector<HTMLElement>('[data-slide]');
    const commit = () => {
      if (target.current === view.index && leaving) {
        // Navigated back to the slide that was on its way out: return it.
        gsap.to(leaving, { autoAlpha: 1, x: 0, duration: 0.25, ease: 'power2.out', overwrite: true });
        return;
      }
      setView({ index: target.current, direction });
    };

    if (!leaving || prefersReducedMotion()) {
      commit();
      return;
    }
    contextSafe(() => {
      gsap.to(leaving, {
        autoAlpha: 0,
        x: -direction * 56,
        duration: 0.18,
        ease: 'power2.in',
        overwrite: true,
        onComplete: commit,
      });
    })();
  };

  const step = (delta: 1 | -1) => goTo(target.current + delta, delta);

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else return;
    e.preventDefault();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1);
  };

  const track = tracks[cert.track];
  const TrackIcon = TRACK_BRANDS[cert.track].icon;

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="certificate-slider-title"
      aria-roledescription="carrusel"
      onKeyDown={onKeyDown}
      onCancel={(e) => {
        e.preventDefault();
        onClose(cert);
      }}
      onClick={(e) => e.target === e.currentTarget && onClose(cert)}
    >
      <header className={styles.header} style={{ '--track': TRACK_BRANDS[cert.track].color } as CSSProperties}>
        <p className={styles.track}>
          <TrackIcon aria-hidden />
          {track.domain} · {track.label}
        </p>
        <p className={styles.counter} aria-live="polite">
          <span className="visually-hidden">Certificado </span>
          <strong>{String(view.index + 1).padStart(2, '0')}</strong>
          <span aria-hidden> / </span>
          <span className="visually-hidden"> de </span>
          {String(total).padStart(2, '0')}
        </p>
        <button type="button" className={styles.close} onClick={() => onClose(cert)} aria-label="Cerrar carrusel">
          <TbX aria-hidden />
        </button>
        <span
          className={styles.progress}
          style={{ transform: `scaleX(${(view.index + 1) / total})` }}
          aria-hidden
        />
      </header>

      <div className={styles.viewport} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <Slide key={cert.id} cert={cert} direction={view.direction} />
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.nav} onClick={() => step(-1)} aria-label="Certificado anterior">
          <TbChevronLeft aria-hidden />
        </button>

        <ol className={styles.strip} aria-label="Todos los certificados">
          {certs.map((c, i) => {
            const current = i === view.index;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  className={styles.thumb}
                  aria-current={current || undefined}
                  aria-label={`Ver ${c.title}`}
                  onClick={() => goTo(i, i > view.index ? 1 : -1)}
                >
                  {current && (
                    <motion.span
                      layoutId="cert-strip-ring"
                      className={styles.ring}
                      transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.35, bounce: 0.2 }}
                    />
                  )}
                  <img src={c.image} alt="" width={1600} height={1190} loading="lazy" decoding="async" />
                </button>
              </li>
            );
          })}
        </ol>

        <button type="button" className={styles.nav} onClick={() => step(1)} aria-label="Certificado siguiente">
          <TbChevronRight aria-hidden />
        </button>
      </footer>
    </dialog>
  );
}

/**
 * One certificate in full. On first open the image arrives through the view
 * transition morph; on later slides it glides in from the travel direction.
 * Either way the details cascade, the seal stamps and the credential decodes.
 */
function Slide({ cert, direction }: { cert: CertificationItem; direction: Direction }) {
  const root = useRef<HTMLElement>(null);
  const issuer = issuerBrand(cert.issuer);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        if (direction !== 0) {
          tl.from(q(`.${styles.paper}`), {
            autoAlpha: 0,
            x: direction * 80,
            rotateY: direction * -10,
            transformPerspective: 1200,
            duration: 0.55,
            clearProps: 'transform',
          }).fromTo(
            q(`.${styles.sheen}`),
            { xPercent: -130 },
            { xPercent: 130, duration: 0.9, ease: 'power2.inOut' },
            0.15,
          );
        }
        tl.from(q('[data-seal]'), { scale: 0, rotate: -160, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.2)' }, 0.2)
          .from(
            q('[data-fade]'),
            { autoAlpha: 0, x: direction === 0 ? 0 : direction * 24, y: direction === 0 ? 14 : 0, duration: 0.45, stagger: 0.045 },
            0.1,
          )
          .from(q(`.${styles.verified}`), { autoAlpha: 0, scale: 0.8, duration: 0.4, ease: 'back.out(3)' }, 0.6);
        if (cert.credentialId) {
          tl.to(q('[data-id]'), { duration: 0.9, scrambleText: { text: cert.credentialId, chars: HEX, speed: 0.6 } }, 0.3);
        }
      });
    },
    { scope: root },
  );

  return (
    <article
      ref={root}
      className={styles.slide}
      style={{ '--glow': cert.accent } as CSSProperties}
      aria-roledescription="certificado"
      data-slide
    >
      <figure className={styles.media}>
        <div className={styles.paper} style={{ viewTransitionName: SHARED_NAME }}>
          <img
            src={cert.image}
            alt={`Certificado de finalización: ${cert.title}, emitido por ${cert.issuer} a Juan Diego Domínguez Castaño`}
            width={1600}
            height={1190}
            draggable={false}
          />
          <span className={styles.sheen} aria-hidden />
        </div>
        <Seal hours={cert.hours} issuer={cert.issuer} className={styles.seal} />
      </figure>

      <div className={styles.details}>
        <p className={styles.issuer} data-fade>
          <issuer.icon aria-hidden style={{ color: issuer.color }} /> {cert.issuer} · Certificado de finalización
        </p>
        <h2 id="certificate-slider-title" className={styles.title} data-fade>
          {cert.title}
        </h2>
        <p className={styles.instructors} data-fade>
          {cert.instructors}
        </p>

        <dl className={styles.meta} data-fade>
          <div>
            <dt>Emitido</dt>
            <dd>{cert.issued}</dd>
          </div>
          <div>
            <dt>{cert.hours ? 'Duración' : 'Emisor'}</dt>
            <dd>{cert.hours ? `${cert.hours} horas` : issuer.name}</dd>
          </div>
        </dl>

        <div className={styles.credential} data-fade>
          <span className={styles.label}>{cert.credentialId ? 'ID de credencial' : 'Credencial'}</span>
          {cert.credentialId ? (
            <code data-id>{cert.credentialId}</code>
          ) : (
            <span className={styles.official}>Emitido directamente por {cert.issuer}</span>
          )}
          <span className={styles.verified}>
            <TbRosetteDiscountCheck aria-hidden /> {cert.verifyUrl ? 'Verificable' : 'Oficial'}
          </span>
        </div>

        <div className={styles.tags} data-fade>
          {cert.skills.map((s) => (
            <TechTag key={s} name={s} />
          ))}
        </div>

        <div className={styles.actions} data-fade>
          {cert.verifyUrl && (
            <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className={styles.primary}>
              Verificar credencial <TbExternalLink aria-hidden />
            </a>
          )}
          <a
            href={cert.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className={cert.verifyUrl ? styles.ghost : styles.primary}
            aria-label={`Abrir PDF del certificado ${cert.title} (pestaña nueva)`}
          >
            <TbFileTypePdf aria-hidden /> {cert.verifyUrl ? 'PDF' : 'Ver certificado en PDF'}
          </a>
        </div>
      </div>
    </article>
  );
}
