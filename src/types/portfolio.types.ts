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
}

export interface SkillGroup {
  category: string;
  icon: string;
  items: string[];
  accent?: string;
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
  name: string;
  issuer: string;
  date?: string;
  url?: string;
  badge?: string;
}
