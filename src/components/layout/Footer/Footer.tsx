import { socials } from '../../../data/socials';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>© {new Date().getFullYear()} Juan Diego Domínguez Castaño. Desplegado en AWS S3.</p>
        <ul className={styles.links}>
          {socials.map(({ label, href, icon: Icon, external }) => (
            <li key={label}>
              <a href={href} aria-label={label} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
                <Icon aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
