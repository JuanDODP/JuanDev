import { useLayoutEffect, useRef } from 'react';
import { TbExternalLink, TbFileTypePdf, TbX } from 'react-icons/tb';
import type { CertificationItem } from '../../types/portfolio.types';
import styles from './CertificateViewer.module.css';

/** View-transition name shared by the card thumbnail and the enlarged certificate. */
export const SHARED_NAME = 'certificate-hero';

type Props = { cert: CertificationItem; onClose: () => void };

export function CertificateViewer({ cert, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  // Open as a modal in the same commit, so the view transition captures it.
  useLayoutEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    return () => el?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="certificate-viewer-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <div>
            <p className={styles.issuer}>
              {cert.issuer} · {cert.issued}
            </p>
            <h2 id="certificate-viewer-title" className={styles.title}>
              {cert.title}
            </h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar certificado">
            <TbX aria-hidden />
          </button>
        </header>

        <img
          className={styles.image}
          src={cert.image}
          alt={`Certificado de finalización: ${cert.title}, emitido por ${cert.issuer} a Juan Diego`}
          width={1600}
          height={1190}
          style={{ viewTransitionName: SHARED_NAME }}
        />

        <footer className={styles.footer}>
          <code className={styles.id}>{cert.credentialId}</code>
          <div className={styles.actions}>
            <a href={cert.pdf} target="_blank" rel="noopener noreferrer" className={styles.ghost}>
              <TbFileTypePdf aria-hidden /> PDF
            </a>
            <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className={styles.primary}>
              Verificar en {cert.issuer} <TbExternalLink aria-hidden />
            </a>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
