import { useRef } from 'react';
import { TbArrowDown, TbDownload } from 'react-icons/tb';
import { gsap, SplitText, useGSAP, EASE_OUT, MOTION_OK } from '../../lib/gsap';
import { profile } from '../../data/portfolio';
import { socials } from '../../data/socials';
import { Button } from '../../components/ui';
import photo from '../../assets/profile/Juan.png';
import styles from './Hero.module.css';

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // One orchestrated entrance (~1.2s): the name rises letter by letter from behind
  // its line, the rest follows, and the portrait wipes open while settling from a zoom.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(`.${styles.line}`, { type: 'words,chars', mask: 'lines' });
        gsap
          .timeline({ defaults: { ease: EASE_OUT } })
          .from(split.chars, { yPercent: 110, duration: 1, stagger: 0.018 })
          .from('[data-hero]', { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 0.35)
          .from(`.${styles.frame}`, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, clearProps: 'clipPath' }, 0.15)
          .from(`.${styles.frame} img`, { scale: 1.25, duration: 1.4, clearProps: 'scale' }, 0.15)
          .from(`.${styles.photo}`, { '--tick': '14px', autoAlpha: 0, duration: 0.6 }, 0.6);
        return () => split.revert();
      });

      // Cursor spotlight over the grid (fine pointers only)
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const light = root.current?.querySelector(`.${styles.spotlight}`);
        if (!light || !root.current) return;
        const x = gsap.quickTo(light, 'x', { duration: 0.6, ease: 'power3.out' });
        const y = gsap.quickTo(light, 'y', { duration: 0.6, ease: 'power3.out' });
        const section = root.current;
        const onMove = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          x(e.clientX - r.left);
          y(e.clientY - r.top);
        };
        section.addEventListener('pointermove', onMove);
        return () => section.removeEventListener('pointermove', onMove);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hero" className={styles.hero}>
      <div className={styles.spotlight} aria-hidden />
      <div className={`container ${styles.grid}`}>
        <div>
          <h1 className={styles.name}>
            <span className={styles.line}>Juan Diego</span>
            <span className={styles.line}>Domínguez Castaño</span>
            <span className={styles.role} data-hero>
              <span className="visually-hidden"> - </span>Full Stack JS Developer
            </span>
          </h1>

          <p className={styles.lede} data-hero>
            Construyo <strong>soluciones escalables</strong> en el ecosistema <strong>JavaScript y TypeScript</strong>, las
            despliego sobre <strong>arquitecturas AWS</strong> y automatizo procesos con <strong>IA</strong>.
          </p>

          <div className={styles.ctas} data-hero>
            <Button href="#projects">
              Ver proyectos <TbArrowDown aria-hidden />
            </Button>
            <Button href={profile.cvUrl} external variant="ghost">
              <TbDownload aria-hidden /> Descargar CV
            </Button>
          </div>

          <div className={styles.meta} data-hero>
            <span className={styles.status}>
              <span className={styles.dot} aria-hidden />
              Disponible para nuevos proyectos
            </span>
            <ul className={styles.socials}>
              {socials.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <a href={href} aria-label={label} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
                    <Icon aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <figure className={styles.photo}>
          <div className={styles.frame}>
            <img src={photo} alt="Juan Diego Domínguez Castaño" width={340} height={425} fetchPriority="high" />
          </div>
        </figure>
      </div>
    </section>
  );
}
