import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import type { GalleryItem } from '@/lib/types';
import GalleryControls from '@/components/GalleryControls';

export const metadata: Metadata = {
  title: '갤러리 - AI Studio Gallery',
  description: 'Google AI Studio로 생성된 모든 작품들을 둘러보세요',
};

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  let galleryItems: GalleryItem[] = [];
  const params = await searchParams;
  
  const sort = typeof params.sort === 'string' ? params.sort : 'latest';
  const nickname = typeof params.nickname === 'string' ? params.nickname : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined; // Existing category structure uses path params, but checking just in case
  // Actually, category is handled via /category/[category] page, not here. 
  // Wait, the filter bar links to /category/..., so this page is "All".
  // But if I want to support sort on category page, I need to update that page too.
  // The user interaction "Ranking" and "My Uploads" is mainly on the main gallery.
  // I will focus on this page first.

  try {
    const supabase = createServerClient();
    
    let query = supabase
      .from('tb_ai_gallery_items')
      .select('*');

    // Filter by nickname if present
    if (nickname) {
       query = query.eq('nickname', nickname);
    }

    // Sort
    if (sort === 'popular') {
       query = query.order('like_count', { ascending: false }).order('created_at', { ascending: false });
    } else {
       query = query.order('created_at', { ascending: false });
    }

    const { data: items, error } = await query.limit(100);

    if (error) console.error('Error fetching items:', error);
    galleryItems = (items || []) as GalleryItem[];
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4 transition-colors group font-medium text-sm">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                홈으로
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 tracking-tight">
                Gallery
              </h1>
              <p className="text-lg text-gray-500">
                {nickname ? `'${nickname}'님의 컬렉션` : (sort === 'popular' ? '인기 작품 랭킹' : `${galleryItems.length}개의 AI 창작물을 탐험해보세요`)}
              </p>
            </div>
            <Link
              href="/gallery/new"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <span>+</span>
              <span>작품 등록</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap mr-1 uppercase tracking-wider">Type</span>
            <Link
              href="/gallery"
              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-100 transition whitespace-nowrap border border-indigo-100"
            >
              전체
            </Link>
            {[
              { name: '이미지', category: 'image' },
              { name: '텍스트', category: 'text' },
              { name: '코드', category: 'code' },
              { name: '음악', category: 'music' },
            ].map((cat) => (
              <Link
                key={cat.category}
                href={`/category/${cat.category}`}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap mr-1 uppercase tracking-wider">Purpose</span>
            {[
              { name: '쇼핑몰', purpose: 'shopping' },
              { name: '유튜브', purpose: 'youtube' },
              { name: 'OCR', purpose: 'ocr' },
              { name: '개발', purpose: 'development' },
            ].map((p) => (
              <Link
                key={p.purpose}
                href={`/purpose/${p.purpose}`}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition whitespace-nowrap"
              >
                {p.name}
              </Link>
            ))}

            <GalleryControls />
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {galleryItems.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="text-6xl mb-6 opacity-50">🎨</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              아직 등록된 작품이 없습니다
            </h2>
            <p className="text-gray-500 mb-8">
              첫 번째 작품을 등록하고 커뮤니티를 시작하세요
            </p>
            <Link
              href="/gallery/new"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition shadow-sm"
            >
              작품 등록하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryItems.map((item, idx) => (
              <article
                key={item.id}
                className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Link href={`/items/${item.id}`} className="block relative">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {item.thumbnail_url ? (
                      <Image
                        src={item.thumbnail_url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <span className="text-4xl">✨</span>
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <time className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString('ko-KR')}
                      </time>
                      <span className="text-xs font-medium text-indigo-600 group-hover:underline">
                        자세히 보기
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
