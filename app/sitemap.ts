import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes: MetadataRoute.Sitemap = [
    // 홈페이지
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // 갤러리 페이지
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const supabase = createServerClient();

    // 모든 갤러리 아이템 가져오기
    const { data: items } = await supabase
      .from('tb_ai_gallery_items')
      .select('id, created_at, category')
      .order('created_at', { ascending: false });

    // 모든 카테고리 가져오기
    const { data: categories } = await supabase
      .from('tb_ai_gallery_items')
      .select('category')
      .order('category');

    const uniqueCategories = Array.from(
      new Set(categories?.map((c) => c.category) || [])
    );

    // 카테고리 페이지들
    uniqueCategories.forEach((category) => {
      routes.push({
        url: `${baseUrl}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // 각 갤러리 아이템 페이지
    if (items) {
      items.forEach((item) => {
        routes.push({
          url: `${baseUrl}/items/${item.id}`,
          lastModified: new Date(item.created_at),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.warn('Failed to fetch items for sitemap, using static routes only:', error);
  }

  return routes;
}
