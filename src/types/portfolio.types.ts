export interface ProfileData {
  name: string;
  title: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  cvUrl: string;
  photo: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  tags: string[];
  isCurrent?: boolean;
}

export type ProjectCategory = 'web' | 'mobile' | 'infra';
export type ProjectStatus = 'production' | 'internal' | 'active';

export interface ProjectLink {
  label: string;
  url: string;
  type: 'demo' | 'playstore' | 'appstore';
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  context: string;
  description: string;
  links: ProjectLink[];
  tags: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  preview?: string;
  /** Brand color for app-icon previews of mobile projects. */
  accent?: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  items: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
}

export interface SoftSkill {
  label: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  instructors: string;
  /** Human-readable issue date, as printed on the certificate. */
  issued: string;
  hours: number;
  credentialId: string;
  verifyUrl: string;
  /** Rendered first page, used for the card and the lightbox. */
  image: string;
  pdf: string;
  skills: string[];
  /** Accent used for the card's glow and seal. */
  accent: string;
}
