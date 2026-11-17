import { createContext, useContext } from 'react';
import type { CertificationDomain, CertificationItem } from '../../types/portfolio.types';

/**
 * How a panel's content should enter:
 * - `scroll`  first visit, played when each block scrolls into view
 * - `switch`  after a tab change, played right away and faster, sliding in
 *             from the side of the tab the visitor moved towards
 */
export type Entrance = 'scroll' | 'switch';

type CertificationsContextValue = {
  entrance: Entrance;
  /** 1 when moving to a tab on the right, -1 when moving left. */
  direction: 1 | -1;
  open: (cert: CertificationItem, source: HTMLElement) => void;
};

export const CertificationsContext = createContext<CertificationsContextValue | null>(null);

export function useCertifications() {
  const ctx = useContext(CertificationsContext);
  if (!ctx) throw new Error('useCertifications must be used inside <Certifications>');
  return ctx;
}

export const PANEL_ID = 'certifications-panel';
export const tabId = (id: CertificationDomain) => `cert-tab-${id}`;

/** View-transition name shared by a tile's thumbnail and the slider's certificate. */
export const SHARED_NAME = 'certificate-hero';
