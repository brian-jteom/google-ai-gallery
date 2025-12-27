import { z } from 'zod';

// Zod schemas for validation (converted from Pydantic)

export const itemCreateSchema = z.object({
  title: z.string().min(1).max(120),
  link: z.string().url(),
  category: z.string().min(1).max(60),
  purpose: z.string().min(1).max(60).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
  nickname: z.string().max(30).optional().nullable(),
  password: z.string().max(100).optional().nullable(),
});

export const itemReadSchema = itemCreateSchema.extend({
  id: z.number(),
  created_at: z.string(),
});

export const youtubeItemCreateSchema = z.object({
  title: z.string().min(1).max(120),
  link: z.string().url(),
  category: z.string().min(1).max(60),
  purpose: z.string().min(1).max(60).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
});

export const youtubeItemReadSchema = youtubeItemCreateSchema.extend({
  id: z.number(),
  created_at: z.string(),
});

export const blogItemCreateSchema = z.object({
  title: z.string().min(1).max(120),
  link: z.string().url(),
  category: z.string().min(1).max(60),
  purpose: z.string().min(1).max(60).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  thumbnail_url: z.string().url().optional().nullable(),
});

export const blogItemReadSchema = blogItemCreateSchema.extend({
  id: z.number(),
  created_at: z.string(),
});

export type ItemCreate = z.infer<typeof itemCreateSchema>;
export type ItemRead = z.infer<typeof itemReadSchema>;
export type YoutubeItemCreate = z.infer<typeof youtubeItemCreateSchema>;
export type YoutubeItemRead = z.infer<typeof youtubeItemReadSchema>;
export type BlogItemCreate = z.infer<typeof blogItemCreateSchema>;
export type BlogItemRead = z.infer<typeof blogItemReadSchema>;
