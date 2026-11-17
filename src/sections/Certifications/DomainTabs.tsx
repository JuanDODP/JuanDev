import type { KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { CertificationDomain, CertificationDomainInfo } from '../../types/portfolio.types';
import { DOMAIN_ICONS } from './brand';
import { PANEL_ID, tabId } from './context';
import styles from './DomainTabs.module.css';

type Props = {
  domains: CertificationDomainInfo[];
  counts: Record<CertificationDomain, number>;
  selected: CertificationDomain;
  onSelect: (id: CertificationDomain) => void;
};

export function DomainTabs({ domains, counts, selected, onSelect }: Props) {
  const reduceMotion = useReducedMotion();

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = domains[(index + delta + domains.length) % domains.length];
    onSelect(next.id);
    document.getElementById(tabId(next.id))?.focus();
  };

  return (
    <div className={styles.tabs} role="tablist" aria-label="Áreas de certificación" data-reveal>
      {domains.map((d, i) => {
        const Icon = DOMAIN_ICONS[d.id];
        const isSelected = d.id === selected;
        return (
          <button
            key={d.id}
            id={tabId(d.id)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={PANEL_ID}
            tabIndex={isSelected ? 0 : -1}
            className={styles.tab}
            onClick={() => onSelect(d.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {isSelected && (
              <motion.span
                layoutId="cert-domain-tab"
                className={styles.indicator}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', duration: 0.35, bounce: 0.15 }}
              />
            )}
            <span className={styles.content}>
              <Icon aria-hidden className={styles.icon} />
              {d.label}
              <span className={styles.count} aria-label={`${counts[d.id]} certificados`}>
                {counts[d.id]}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
