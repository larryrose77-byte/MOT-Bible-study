import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const studies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/studies' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    passage: z.string(),
    audioUrl: z.string().url().optional(),
    audioType: z
      .enum(['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg'])
      .default('audio/mpeg'),
    videoUrl: z.string().url().optional(),
    videoType: z
      .enum(['video/mp4', 'video/webm', 'video/quicktime'])
      .default('video/mp4'),
    transcriptUrl: z.string().url().optional(),
    duration: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { studies };
