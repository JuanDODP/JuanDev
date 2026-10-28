import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { TbDownload, TbMenu2, TbX } from 'react-icons/tb';
import { profile } from '../../../data/portfolio';
import { useActiveSection } from '../../../hooks';
import { setNavDirection } from '../../../lib/navDirection';
import { Button } from '../../ui';
import styles from './Navbar.module.css';

const NAV = [
  { id: 'about', label: 'Sobre mí' },
  { id: 'cloud', label: 'Nube' },
  { id: 'ai', label: 'IA' },
  { id: 'projects', label: 'Proyectos' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'contact', label: 'Contacto' },
] as const;

const SECTION_IDS = NAV.map((n) => n.id);

export function Navbar() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav className={`${styles.bar} ${scrolled || open ? styles.scrolled : ''}`} aria-label="Principal">
        <div className={`container ${styles.inner}`}>
          <Link
            to="/"
            className={styles.logo}
            viewTransition
            onClick={() => {
              setNavDirection('lateral');
              close();
            }}
          >
            dominguez<span>.</span>dev
          </Link>

          <ul className={styles.links}>
            {NAV.map(({ id, label }) => {
              const isActive = onHome && active === id;
              return (
                <li key={id}>
                  <Link to={`/#${id}`} className={styles.link} aria-current={isActive}>
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className={styles.indicator}
                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.35, bounce: 0 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.actions}>
            <Button href={profile.cvUrl} external variant="ghost" size="small" className={styles.cv}>
              <TbDownload aria-hidden /> CV
            </Button>
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <TbX /> : <TbMenu2 />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className={styles.sheet}
            initial={{ opacity: 0, transform: 'translateY(-8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-8px)', transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <ul>
              {NAV.map(({ id, label }) => (
                <li key={id}>
                  <Link to={`/#${id}`} onClick={close}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button href={profile.cvUrl} external variant="ghost" className={styles.sheetCv}>
              <TbDownload aria-hidden /> Descargar CV
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
