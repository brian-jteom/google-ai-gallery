// SEO 유틸리티 함수들

/**
 * Open Graph 이미지 URL 생성
 */
export function generateOgImageUrl(params: {
  title: string;
  category?: string;
  description?: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const searchParams = new URLSearchParams();

  searchParams.set('title', params.title);
  if (params.category) searchParams.set('category', params.category);
  if (params.description) searchParams.set('description', params.description);

  return `${baseUrl}/api/og?${searchParams.toString()}`;
}

/**
 * JSON-LD 스키마 생성 - CreativeWork
 */
export function generateCreativeWorkSchema(item: {
  id: number | string;
  title: string;
  description?: string | null;
  category: string;
  tags?: string[] | null;
  thumbnail_url?: string | null;
  created_at: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: item.description || `Google AI Studio로 생성된 ${item.category} 작품`,
    url: `${baseUrl}/items/${item.id}`,
    image: item.thumbnail_url || `${baseUrl}/og-image.png`,
    dateCreated: item.created_at,
    creator: {
      '@type': 'Organization',
      name: 'AI Studio Gallery',
      url: baseUrl,
    },
    genre: item.category,
    keywords: item.tags?.join(', ') || '',
    inLanguage: 'ko-KR',
  };
}

/**
 * JSON-LD 스키마 생성 - ItemList (갤러리)
 */
export function generateItemListSchema(items: Array<{
  id: number | string;
  title: string;
  thumbnail_url?: string | null;
  category: string;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: item.title,
        url: `${baseUrl}/items/${item.id}`,
        image: item.thumbnail_url,
        genre: item.category,
      },
    })),
  };
}

/**
 * JSON-LD 스키마 생성 - WebSite (사이트 전체)
 */
export function generateWebSiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AI Studio Gallery',
    url: baseUrl,
    description: 'Google AI Studio로 생성한 AI 결과물을 카테고리별로 관리하고 공유하는 플랫폼',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'ko-KR',
  };
}

/**
 * 메타 키워드 생성 (아이템 기반)
 */
export function generateKeywords(item: {
  title: string;
  category: string;
  tags?: string[] | null;
}): string[] {
  const baseKeywords = [
    'Google AI Studio',
    'AI Studio Gallery',
    'AI 결과물',
    'AI 생성',
  ];

  return [
    ...baseKeywords,
    item.category,
    item.title,
    ...(item.tags || []),
  ];
}

/**
 * 동적 타이틀 생성
 */
export function generateTitle(parts: string[]): string {
  return [...parts, 'AI Studio Gallery'].join(' | ');
}

/**
 * 동적 설명 생성
 */
export function generateDescription(item: {
  title: string;
  category: string;
  description?: string | null;
}): string {
  if (item.description) {
    return item.description;
  }

  return `Google AI Studio로 생성된 ${item.category} 카테고리의 "${item.title}" 작품을 감상하세요.`;
}
