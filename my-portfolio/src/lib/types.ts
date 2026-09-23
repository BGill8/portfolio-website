export interface About {
  bio?: string;
  headline?: string;
  subheadline?: string;
  resumeUrl?: string;
  profilePicUrl?: string;
}

export interface Experience {
  _id: string;
  title: string;
  organization: string;
  location?: string;
  dates: string;
  description: string[];
  skills?: string[];
  orderRank?: number;
}

export interface Skill {
  _id: string;
  name: string;
  category?: string;
  orderRank?: number;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  orderRank?: number;
}

export interface Certification {
  _id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credlyUrl?: string;
  localBadgeUrl?: string;
  description?: string;
  skills?: string[];
  orderRank?: number;
}

// Backwards-compatible aliases for existing components
export type SanityAbout = About;
export type SanityExperience = Experience;
export type SanitySkill = Skill;
export type SanityProject = Project;
export type SanityCertification = Certification;
