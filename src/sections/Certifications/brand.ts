import type { IconType } from 'react-icons';
import { SiUdemy } from 'react-icons/si';
import { TbBrandAws, TbBrowser, TbCertificate, TbCloud, TbCode, TbServer2 } from 'react-icons/tb';
import type { CertificationDomain, CertificationTrack } from '../../types/portfolio.types';

type Brand = { icon: IconType; color: string };

const ISSUERS: Record<string, Brand & { seal: string }> = {
  Udemy: { icon: SiUdemy, color: '#a435f0', seal: 'UDEMY' },
  'AWS Training & Certification': { icon: TbBrandAws, color: '#ff9900', seal: 'AWS' },
};

/** Logo, brand color and short seal label for a certificate issuer. */
export const issuerBrand = (issuer: string) =>
  ISSUERS[issuer] ?? { icon: TbCertificate, color: 'var(--amber)', seal: issuer.toUpperCase() };

export const DOMAIN_ICONS: Record<CertificationDomain, IconType> = {
  web: TbCode,
  cloud: TbCloud,
};

export const TRACK_BRANDS: Record<CertificationTrack, Brand> = {
  frontend: { icon: TbBrowser, color: 'var(--azure)' },
  backend: { icon: TbServer2, color: 'var(--mint)' },
  cloud: { icon: TbBrandAws, color: '#ff9900' },
};
