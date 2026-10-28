import type { IconType } from 'react-icons';
import { SiGithub, SiWhatsapp } from 'react-icons/si';
import { TbBrandLinkedin, TbMail } from 'react-icons/tb';
import { profile } from './portfolio';

export type Social = { label: string; handle: string; href: string; icon: IconType; external: boolean };

const WA_TEXT = encodeURIComponent('¡Hola Juan! Acabo de visitar tu portafolio y me encantó tu trabajo. Me gustaría hablar contigo 😊');

export const socials: Social[] = [
  { label: 'Email', handle: profile.email, href: `mailto:${profile.email}`, icon: TbMail, external: false },
  { label: 'LinkedIn', handle: 'in/dominguez-dev', href: profile.linkedin, icon: TbBrandLinkedin, external: true },
  { label: 'GitHub', handle: 'JuanDODP', href: profile.github, icon: SiGithub, external: true },
  {
    label: 'WhatsApp',
    handle: profile.phone,
    href: `https://wa.me/${profile.phone.replace(/\D/g, '')}?text=${WA_TEXT}`,
    icon: SiWhatsapp,
    external: true,
  },
];
