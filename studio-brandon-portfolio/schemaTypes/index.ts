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
  ],
});

export const schemaTypes = [about, experience, skill, project];