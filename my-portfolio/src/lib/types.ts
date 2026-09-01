import type { PortableTextBlock } from '@portabletext/types';

export interface SanityAbout {
  bio?: string;
  headline?: string;
  subheadline?: string;
  resumeUrl?: string;
  profilePic?: {
    asset: {
      _ref: string;
    };
  };
}

export interface SanityExperience {
  _id: string;
  title: string;
  organization: string;
  location?: string;
  dates: string;
  description?: PortableTextBlock[] | string[];
  skills?: string[];
  orderRank?: number;
}

export interface SanitySkill {
  _id: string;
  name: string;
  category?: 'ai-ml' | 'cloud-devops' | 'languages' | 'frameworks' | 'tools' | string;
  icon?: {
    asset: {
      _ref: string;
    };
  };
  orderRank?: number;
}

export interface SanityProject {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  mainImage?: {
    asset: {
      _ref: string;
    };
  };
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  orderRank?: number;
}

export interface SanityCertification {
  _id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credlyUrl?: string;
  badgeImage?: {
    asset: {
      _ref: string;
    };
  };
  localBadgeUrl?: string;
  description?: string;
  skills?: string[];
  orderRank?: number;
}
