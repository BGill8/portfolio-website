// schemas/index.ts

import { defineType, defineField } from 'sanity';

// Document type for the 'About Me' section
export const about = defineType({
  name: 'about',
  title: 'About Me',
  type: 'document',
  fields: [
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      description: 'A brief introduction about yourself and your background.',
    }),
    defineField({
      name: 'resumeFile',
      title: 'Resume File',
      type: 'file',
      description: 'Your resume PDF file.',
    }),
  ],
});

// Document type for 'Experience' entries (e.g., internships, volunteer work)
export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., Web Developer Intern',
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'dates',
      title: 'Dates',
      type: 'string',
      description: 'e.g., Jan 2023 - Present',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'A list of your responsibilities or achievements.',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Use this to manually order items. Lower numbers appear first.',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 100,
    }),
  ],
});

// Document type for 'Skills' entries
export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'The SVG or PNG icon for the skill.',
      options: {
        hotspot: true, // enables cropping for images
      },
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Use this to manually order skills. Lower numbers appear first.',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 100,
    }),
  ],
});

// Document type for 'Project' entries
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'A list of technologies used.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live Demo URL',
      type: 'url',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Use this to manually order projects. Lower numbers appear first.',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 100,
    }),
  ],
});

export const certification = defineType({
  name: 'certification',
  title: 'Certifications & Badges',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., AWS Certified Machine Learning Engineer – Associate',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuing Organization',
      type: 'string',
      description: 'e.g., Amazon Web Services, Google Cloud',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'issueDate',
      title: 'Issue Date',
      type: 'string',
      description: 'e.g., April 2026 or 2026-04-13',
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'string',
      description: 'e.g., April 2029 or No Expiration',
    }),
    defineField({
      name: 'credlyUrl',
      title: 'Credly / Verification URL',
      type: 'url',
      description: 'Link to verified badge on Credly or certification page',
    }),
    defineField({
      name: 'badgeImage',
      title: 'Badge Image / Logo',
      type: 'image',
      description: 'The PNG or SVG badge logo image from Credly',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A summary of skills and requirements demonstrated by this credential.',
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Associated competencies (e.g. Machine Learning, Cloud Computing, Generative AI).',
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'number',
      description: 'Use this to manually order certifications. Lower numbers appear first.',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 100,
    }),
  ],
});

export const schemaTypes = [about, experience, skill, project, certification];