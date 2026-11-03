// Content schemas. You normally never need to edit this file:
// all site text lives in the Markdown / YAML files inside src/content/.
// If you add a new field to a data file and want it validated, add it here.
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse as parseYaml } from 'yaml';

/**
 * Loads a YAML list and records each entry's position as `order`, so pages can
 * show entries in the same order as the file (the content store sorts by id).
 */
const yamlList = (path: string) =>
  file(path, {
    parser: (text) =>
      (parseYaml(text) as Record<string, unknown>[]).map((entry, i) => ({ order: i, ...entry })),
  });

const link = z.object({ label: z.string(), url: z.string() });

// src/content/profile.md  (home page + site-wide details)
const profile = defineCollection({
  loader: glob({ pattern: 'profile.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    affiliation: z.string().optional(),
    location: z.string().optional(),
    email: z.string(),
    photo: z.string(),
    photoAlt: z.string(),
    cvFile: z.string(),
    cvUpdated: z.string().optional(),
    seoDescription: z.string(),
    expertise: z.array(z.string()),
    links: z.object({
      linkedin: z.string().optional(),
      scholar: z.string().optional(),
      orcid: z.string().optional(),
      github: z.string().optional(),
    }),
  }),
});

// src/content/about.md  (intro text on the About page)
const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: z.object({ title: z.string() }),
});

// src/content/experience.yaml
const experience = defineCollection({
  loader: yamlList('./src/content/experience.yaml'),
  schema: z.object({
    order: z.number(),
    role: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    start: z.string(),
    end: z.string(),
    highlights: z.array(z.string()).default([]),
  }),
});

// src/content/education.yaml
const education = defineCollection({
  loader: yamlList('./src/content/education.yaml'),
  schema: z.object({
    order: z.number(),
    degree: z.string(),
    institution: z.string(),
    location: z.string().optional(),
    start: z.string(),
    end: z.string(),
    details: z.array(z.string()).default([]),
  }),
});

// src/content/honors.yaml  (awards, teaching, memberships)
const honors = defineCollection({
  loader: yamlList('./src/content/honors.yaml'),
  schema: z.object({
    order: z.number(),
    category: z.enum(['award', 'teaching', 'membership']),
    years: z.string().optional(),
    title: z.string(),
    detail: z.string().optional(),
  }),
});

// src/content/publications.yaml
const publications = defineCollection({
  loader: yamlList('./src/content/publications.yaml'),
  schema: z.object({
    order: z.number(),
    year: z.number(),
    authors: z.string(),
    title: z.string(),
    journal: z.string(),
    details: z.string().optional(), // volume, pages, article number
    status: z.string().optional(), // e.g. "Accepted"
    doi: z.string().optional(),
    pmid: z.string().optional(),
    url: z.string().optional(),
    topic: z.enum(['imaging', 'physics']),
    firstAuthor: z.boolean().default(false),
  }),
});

// src/content/presentations.yaml  (talks and posters)
const presentations = defineCollection({
  loader: yamlList('./src/content/presentations.yaml'),
  schema: z.object({
    order: z.number(),
    type: z.enum(['oral', 'poster']),
    date: z.string(),
    year: z.number(),
    title: z.string(),
    event: z.string(),
    location: z.string().optional(),
  }),
});

// src/content/research/*.md  (one Markdown file per research area)
const research = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    imageCaption: z.string().optional(),
  }),
});

// src/content/projects.yaml
const projects = defineCollection({
  loader: yamlList('./src/content/projects.yaml'),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    repo: z.string().optional(), // leave empty while a repo is private
    status: z.string().optional(),
    links: z.array(link).default([]),
  }),
});

// src/content/skills.yaml
const skills = defineCollection({
  loader: yamlList('./src/content/skills.yaml'),
  schema: z.object({
    group: z.string(),
    order: z.number(),
    items: z.array(z.string()),
  }),
});

export const collections = {
  profile,
  about,
  experience,
  education,
  honors,
  publications,
  presentations,
  research,
  projects,
  skills,
};
