# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Studio Gallery** - Full-stack TypeScript application built with Next.js 15, managing Google AI Studio results by category.

## Architecture

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (shared types between frontend & backend)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Validation**: Zod schemas
- **Deployment**: Vercel-ready

## Development Commands

**Start development server:**
```bash
npm run dev
```
Launches Next.js dev server at http://localhost:3000

**Build for production:**
```bash
npm run build
```
Creates optimized production build in `.next/`

**Start production server:**
```bash
npm start
```
Runs production server (requires build first)

**Lint code:**
```bash
npm run lint
```
Runs Next.js ESLint

## Project Structure

```
gallery-frontend/
├── app/
│   ├── api/              # Backend API Routes (Serverless)
│   │   ├── items/        # Gallery items CRUD
│   │   │   ├── route.ts      # GET /api/items, POST /api/items
│   │   │   └── [id]/route.ts # GET /api/items/[id], PUT, DELETE
│   │   ├── health/       # Health check endpoint
│   │   │   └── route.ts  # GET /api/health
│   │   └── og/           # Open Graph image generation
│   │       └── route.tsx # Dynamic OG images
│   ├── blog/             # Blog content pages
│   ├── category/         # Category filtering pages
│   │   └── [category]/   # Dynamic category routes
│   ├── gallery/          # Gallery pages
│   │   ├── page.tsx      # Gallery list
│   │   ├── new/          # Create new item
│   │   └── edit/[id]/    # Edit existing item
│   ├── items/            # Item detail pages
│   │   └── [id]/         # Dynamic item routes
│   ├── purpose/          # Purpose-based filtering
│   │   └── [purpose]/    # Dynamic purpose routes
│   ├── youtube/          # YouTube content section
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Home page (/)
│   ├── globals.css       # Global Tailwind styles
│   ├── sitemap.ts        # Auto-generated sitemap
│   └── robots.ts         # Robots.txt configuration
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # Client-side Supabase (NEXT_PUBLIC_*)
│   │   └── server.ts     # Server-side Supabase (SERVICE_ROLE_KEY)
│   ├── types.ts          # Shared TypeScript interfaces
│   ├── schemas.ts        # Zod validation schemas
│   └── seo.ts            # SEO utility functions
├── components/           # React components
├── public/               # Static assets
├── supabase/             # Supabase configuration
│   └── config.toml       # Supabase local config
└── .env.local            # Environment variables (create from .env.example)
```

## Key Concepts

### Full-Stack TypeScript
- **Shared Types**: `lib/types.ts` defines interfaces used by both frontend and backend (`GalleryItem`, `YoutubeItem`, `BlogItem`, `ApiResponse`)
- **Validation Schemas**: `lib/schemas.ts` contains Zod schemas that enforce type safety at runtime (`itemCreateSchema`, `youtubeItemCreateSchema`, `blogItemCreateSchema`)
- **Type Inference**: Use `z.infer<typeof schema>` to derive TypeScript types from Zod schemas
- **No Duplication**: Single source of truth for data structures across the entire application

### API Routes (Backend)
- **Location**: `app/api/*/route.ts` (follows Next.js file-based routing)
- **Exports**: Named functions `GET`, `POST`, `PUT`, `DELETE` map to HTTP methods
- **Database Access**: Always use `createServerClient()` from `lib/supabase/server.ts` in API routes (has elevated permissions)
- **Responses**: Return `NextResponse.json(data, { status })` for all API responses
- **Validation**: Validate all incoming data using Zod schemas before database operations
- **Error Handling**: Wrap in try/catch, log errors, return appropriate HTTP status codes

### Supabase Integration
- **Client-side**: Use `createBrowserClient()` from `lib/supabase/client.ts` for public data access in components
- **Server-side**: Use `createServerClient()` from `lib/supabase/server.ts` for API routes (uses service role key)
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase project URL (exposed to browser)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key for client-side access
  - `SUPABASE_URL` - Server-only Supabase URL (same as public but not exposed)
  - `SUPABASE_SERVICE_ROLE_KEY` - Server-only admin key (bypasses RLS, use carefully)
- **Tables**: `tb_ai_gallery_items`, `tb_youtube_items`, `tb_blog_items` (identical schemas)

### Dynamic Routes and SEO
- **Dynamic Pages**: Use `[param]` folder naming (e.g., `items/[id]/page.tsx`, `category/[category]/page.tsx`)
- **Static Generation**: Implement `generateStaticParams()` to pre-render dynamic routes at build time
- **Dynamic Metadata**: Use `generateMetadata()` async function to create page-specific metadata from data
- **SEO Utilities**: Use functions from `lib/seo.ts` for consistent metadata generation across pages
- **Structured Data**: Add JSON-LD schema using SEO utilities for better search engine understanding

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add Supabase credentials from https://supabase.com/dashboard
3. Run `npm install`
4. Run `npm run dev`

## Database Schema

The application uses three main Supabase tables:

**`tb_ai_gallery_items`** - Main gallery items:
```sql
CREATE TABLE tb_ai_gallery_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  link TEXT NOT NULL,
  category VARCHAR(60) NOT NULL,
  purpose VARCHAR(60),
  description VARCHAR(500),
  tags TEXT[],
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`tb_youtube_items`** - YouTube content:
- Same schema as `tb_ai_gallery_items`

**`tb_blog_items`** - Blog content:
- Same schema as `tb_ai_gallery_items`

All three tables share the same structure with fields: `id`, `title`, `link`, `category`, `purpose`, `description`, `tags`, `thumbnail_url`, `created_at`.

## API Endpoints

### GET /api/health
Health check endpoint

### Gallery Items API

**GET /api/items**
List gallery items with optional filtering
- Query params: `category`, `q` (search), `limit` (max 100), `offset`
- Returns: Array of `GalleryItem[]`

**GET /api/items/[id]**
Get single gallery item
- Returns: `GalleryItem` object

**POST /api/items**
Create new gallery item
- Body: `{ title, link, category, purpose?, description?, tags?, thumbnail_url? }`
- Validated with `itemCreateSchema` from `lib/schemas.ts`
- Returns: Created `GalleryItem`

**PUT /api/items/[id]**
Update existing gallery item
- Body: Same as POST
- Returns: Updated `GalleryItem`

**DELETE /api/items/[id]**
Delete gallery item
- Returns: Success status

### Dynamic OG Images

**GET /api/og**
Generate Open Graph images dynamically
- Query params: `title`, `description`, `category`
- Returns: PNG image

## Technology Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with server components
- **TypeScript 5.8** - Strict type checking
- **Supabase** - PostgreSQL database with client SDKs
- **Zod** - Runtime type validation
- **Tailwind CSS** - Utility-first styling

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## SEO Optimization Guidelines

**IMPORTANT**: Every new page, feature, or content must be SEO-optimized by default.

### When Creating New Pages

1. **Always Add Metadata**
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title - AI Studio Gallery',
  description: 'Detailed description with keywords (150-160 characters)',
  keywords: ['Google AI Studio', 'relevant', 'keywords'],
  openGraph: {
    title: 'Social Media Title',
    description: 'Social media description',
    images: ['/og-image.png'],
  },
};
```

2. **Use Semantic HTML**
- One `<h1>` per page (main heading)
- Proper heading hierarchy: `<h1>` → `<h2>` → `<h3>`
- Use `<article>`, `<section>`, `<nav>` appropriately
- Add `alt` text to all images
- Use `<time>` for dates with `dateTime` attribute

3. **Add JSON-LD Structured Data**
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork', // or Article, WebPage, etc.
  name: 'Title',
  description: 'Description',
  // ... more schema properties
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

4. **Optimize URLs**
- Use descriptive, keyword-rich URLs
- Keep URLs short and readable
- Use hyphens, not underscores
- Example: `/gallery/ai-image-generation` not `/gallery/123`

5. **Add Breadcrumb Navigation**
```tsx
<nav className="breadcrumb">
  <a href="/">Home</a> > <a href="/category">Category</a> > Current Page
</nav>
```

### SEO Utilities Available

Use helper functions from `lib/seo.ts`:

```typescript
import {
  generateOgImageUrl,           // Create OG image URL
  generateCreativeWorkSchema,   // CreativeWork JSON-LD
  generateItemListSchema,       // ItemList JSON-LD
  generateWebSiteSchema,        // WebSite JSON-LD
  generateKeywords,             // Generate keyword array
  generateTitle,                // Create SEO-friendly title
  generateDescription,          // Create SEO-friendly description
} from '@/lib/seo';
```

### Dynamic Pages SEO

For dynamic routes like `[id]` or `[slug]`:

```typescript
// Generate static paths for pre-rendering
export async function generateStaticParams() {
  const items = await fetchAllItems();
  return items.map(item => ({ id: item.id.toString() }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const item = await fetchItem(params.id);
  return {
    title: `${item.title} | AI Studio Gallery`,
    description: item.description,
    openGraph: {
      images: [item.thumbnail_url],
    },
  };
}
```

### Image Optimization

```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Descriptive alt text with keywords"
  width={1200}
  height={630}
  priority // for above-the-fold images
/>
```

### Internal Linking

- Link to related content within the site
- Use descriptive anchor text (not "click here")
- Example: `<a href="/gallery">Browse our AI Studio Gallery</a>`

### Performance Optimization

```typescript
// Enable revalidation for dynamic content
export const revalidate = 60; // revalidate every 60 seconds

// Use streaming for faster page loads
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <DynamicContent />
</Suspense>
```

### Content Guidelines

1. **Keyword Usage**
   - Primary keyword in H1
   - Secondary keywords in H2, H3
   - Natural keyword density (don't stuff)
   - Include "Google AI Studio" in content

2. **Content Length**
   - Minimum 300 words for blog posts
   - Detailed descriptions (50+ characters)
   - Comprehensive, valuable content

3. **Mobile-First**
   - All designs must be responsive
   - Test on mobile devices
   - Fast loading times (<3s)

### Checklist for New Features

Before completing any feature:

- [ ] Added `Metadata` export to page
- [ ] Used semantic HTML (`h1`, `article`, `time`, etc.)
- [ ] Added JSON-LD structured data if applicable
- [ ] Included relevant keywords naturally
- [ ] Added `alt` text to all images
- [ ] Tested on mobile (responsive design)
- [ ] Added internal links where appropriate
- [ ] Checked page load speed
- [ ] Validated HTML (no errors)
- [ ] Updated sitemap if needed (automatic in `app/sitemap.ts`)

### SEO Testing Tools

Before deploying:

1. **Google Lighthouse** - Check SEO score (aim for 90+)
2. **Google Search Console** - Submit sitemap and monitor
3. **Facebook Debugger** - Test Open Graph tags
4. **Twitter Card Validator** - Test Twitter cards
5. **PageSpeed Insights** - Check performance

### Auto-Generated SEO Files

These files are automatically generated:

- `/sitemap.xml` - Automatic sitemap (updates with new content)
- `/robots.txt` - Crawling rules
- `/api/og` - Dynamic Open Graph images

### Common Mistakes to Avoid

❌ **DON'T:**
- Skip metadata on any page
- Use generic titles like "Page 1"
- Forget alt text on images
- Use multiple H1 tags
- Ignore mobile optimization
- Create duplicate content
- Use keyword stuffing

✅ **DO:**
- Add unique metadata to every page
- Use descriptive, keyword-rich titles
- Include structured data
- Optimize images (size + alt text)
- Write for humans first, then SEO
- Keep URLs clean and descriptive
- Test on real devices

### Reference Documentation

See `SEO.md` for comprehensive SEO guidelines and best practices.

## Notes

- This project was converted from FastAPI (Python) to Next.js (TypeScript)
- All backend logic is now in Next.js API Routes
- Single codebase, single deployment, full type safety
- **SEO is a priority**: Every page must be optimized for search engines
