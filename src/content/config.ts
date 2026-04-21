import { defineCollection, z } from 'astro:content';

// Shared sub-schemas
const ctaSchema = z.object({
  text: z.string(),
  link: z.string(),
});

const statSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const cardSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  link: z.string(),
  iconKey: z.enum([
    'hurricane', 'flood', 'wildfire', 'winter-storm', 'tornado',
    'generator', 'insurance', 'emergency-kit', 'flood-protection',
    'safe-room', 'backup-power',
  ]),
});

// Homepage collection
const homepage = defineCollection({
  type: 'content',
  schema: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subheading: z.string(),
      image: z.string(),
      imageAlt: z.string(),
      ctaPrimary: ctaSchema,
      ctaSecondary: ctaSchema,
    }),
    stats: z.array(statSchema).length(4),
    threatsSection: z.object({
      heading: z.string(),
      subheading: z.string(),
      cards: z.array(cardSchema).length(5),
    }),
    productsSection: z.object({
      heading: z.string(),
      subheading: z.string(),
      cards: z.array(cardSchema).length(6),
    }),
    emailCapture: z.object({
      heading: z.string(),
      subheading: z.string(),
      buttonText: z.string(),
      formName: z.string(),
    }),
  }),
});

export const collections = {
  homepage,
};
