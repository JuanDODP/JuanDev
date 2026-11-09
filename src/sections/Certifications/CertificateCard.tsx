import { useId, useRef, type CSSProperties, type PointerEvent } from 'react';
import { SiUdemy } from 'react-icons/si';
import { TbExternalLink, TbFileTypePdf, TbRosetteDiscountCheck, TbZoomIn } from 'react-icons/tb';
import { gsap, useGSAP, EASE_OUT, MOTION_OK } from '../../lib/gsap';
import { TechTag } from '../../components/ui';
import type { CertificationItem } from '../../types/portfolio.types';
import styles from './CertificateCard.module.css';

const HOVER_QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const HEX = '0123456789abcdef';
const MAX_TILT = 9;

type Props = {
  cert: CertificationItem;
  index: number;
  onOpen: (cert: CertificationItem, source: HTMLElement) => void;
};

export function CertificateCard({ cert, index, onOpen }: Props) {
  const root = useRef<HTMLElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const pointer = useRef<{
    enter: () => void;
    move: (e: PointerEvent<HTMLElement>) => void;
    reset: () => void;
  } | null>(null);

  // Scroll entrance: the card lifts out of depth, the certificate wipes open,
  // the seal stamps down and the credential ID decodes like a live verification.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({
          delay: index * 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        });

        tl.from(root.current, {
          autoAlpha: 0,
          y: 70,
          rotateX: -12,
          transformPerspective: 1400,
          transformOrigin: '50% 100%',
          duration: 1.1,
          ease: EASE_OUT,
          clearProps: 'transform',
        })
          .from(q(`.${styles.paper}`), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut', clearProps: 'clipPath' }, 0.15)
          .from(q(`.${styles.paper} img`), { scale: 1.25, duration: 1.3, ease: EASE_OUT, clearProps: 'scale' }, 0.15)
          .fromTo(q(`.${styles.sheen}`), { xPercent: -130 }, { xPercent: 130, duration: 1.1, ease: 'power2.inOut' }, 0.7)
          .from(q(`.${styles.seal}`), { scale: 0, rotate: -160, autoAlpha: 0, duration: 0.8, ease: 'back.out(2.2)' }, 0.75)
          .from(q('[data-fade]'), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.06, ease: EASE_OUT }, 0.45)
          .to(q('[data-id]'), { duration: 1.3, scrambleText: { text: cert.credentialId, chars: HEX, speed: 0.5 } }, 0.8)
          .from(q(`.${styles.verified}`), { autoAlpha: 0, scale: 0.8, duration: 0.45, ease: 'back.out(3)' }, '>-0.1');
      });

      // Pointer tilt + light sweep for the certificate (fine pointers only).
      // Handlers are created inside the GSAP context so their tweens get cleaned up.
      mm.add(HOVER_QUERY, (ctx) => {
        const el = paper.current;
        if (!el) return;
        gsap.set(el, { transformPerspective: 900 });
        const rotY = gsap.quickTo(el, 'rotateY', { duration: 0.5, ease: 'power3.out' });
        const rotX = gsap.quickTo(el, 'rotateX', { duration: 0.5, ease: 'power3.out' });
        const safe = <T extends (...args: never[]) => void>(name: string, fn: T) => ctx.add(name, fn) as T;

        pointer.current = {
          enter: safe('enter', () => {
            gsap.fromTo(
              el.querySelector(`.${styles.sheen}`),
              { xPercent: -130 },
              { xPercent: 130, duration: 0.9, ease: 'power2.inOut', overwrite: true },
            );
          }),
          move: safe('move', (e: PointerEvent<HTMLElement>) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rotY(px * MAX_TILT * 2);
            rotX(-py * MAX_TILT * 2);
            el.style.setProperty('--sx', `${(px + 0.5) * 100}%`);
            el.style.setProperty('--sy', `${(py + 0.5) * 100}%`);
          }),
          reset: safe('reset', () => {
            rotY(0);
            rotX(0);
          }),
        };
        return () => {
          pointer.current = null;
        };
      });
    },
    { scope: root },
  );

  const handleOpen = () => {
    if (!paper.current) return;
    // Settle the tilt so the morph lands on a flat rectangle.
    pointer.current?.reset();
    onOpen(cert, paper.current);
  };

  return (
    <article ref={root} className={`${styles.card} glow-card`} style={{ '--glow': cert.accent } as CSSProperties}>
      <div className={styles.stage}>
        <button
          type="button"
          className={styles.frame}
          onClick={handleOpen}
          onPointerEnter={() => pointer.current?.enter()}
          onPointerMove={(e) => pointer.current?.move(e)}
          onPointerLeave={() => pointer.current?.reset()}
          aria-label={`Ampliar certificado: ${cert.title}`}
        >
          <div ref={paper} className={styles.paper}>
            <img src={cert.image} alt="" width={1600} height={1190} loading="lazy" decoding="async" />
            <span className={styles.sheen} aria-hidden />
            <span className={styles.glare} aria-hidden />
          </div>
          <span className={styles.hint} aria-hidden>
            <TbZoomIn /> Ver certificado
          </span>
        </button>

        <Seal hours={cert.hours} />
      </div>

      <div className={styles.body}>
        <p className={styles.issuer} data-fade>
          <SiUdemy aria-hidden /> {cert.issuer} · Certificado de finalización
        </p>
        <h3 className={styles.title} data-fade>
          {cert.title}
        </h3>
        <p className={styles.instructors} data-fade>
          {cert.instructors}
        </p>

        <dl className={styles.meta} data-fade>
          <div>
            <dt>Emitido</dt>
            <dd>{cert.issued}</dd>
          </div>
          <div>
            <dt>Duración</dt>
            <dd>{cert.hours} horas</dd>
          </div>
        </dl>

        <div className={styles.credential} data-fade>
          <span className={styles.label}>ID de credencial</span>
          <code data-id>{cert.credentialId}</code>
          <span className={styles.verified}>
            <TbRosetteDiscountCheck aria-hidden /> Verificable
          </span>
        </div>

        <div className={styles.tags} data-fade>
          {cert.skills.map((s) => (
            <TechTag key={s} name={s} />
          ))}
        </div>

        <div className={styles.actions} data-fade>
          <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className={styles.verify}>
            Verificar credencial <TbExternalLink aria-hidden />
          </a>
          <a
            href={cert.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pdf}
            aria-label={`Abrir PDF del certificado ${cert.title} (pestaña nueva)`}
          >
            <TbFileTypePdf aria-hidden /> PDF
          </a>
        </div>
      </div>
    </article>
  );
}

/** Rotating credential seal: circular text around the course length. */
function Seal({ hours }: { hours: number }) {
  const pathId = useId();
  return (
    <div className={styles.seal} aria-hidden>
      <svg viewBox="0 0 100 100" className={styles.ring}>
        <defs>
          <path id={pathId} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text>
          <textPath href={`#${pathId}`} textLength={236} lengthAdjust="spacing">
            CERTIFICADO DE FINALIZACIÓN · UDEMY ·
          </textPath>
        </text>
      </svg>
      <span className={styles.sealCore}>
        <strong>{hours}</strong>
        <small>horas</small>
      </span>
    </div>
  );
}
