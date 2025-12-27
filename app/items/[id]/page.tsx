import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import type { GalleryItem } from '@/lib/types';
import LikeButton from '@/components/LikeButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: item } = await supabase
    .from('tb_ai_gallery_items')
    .select('*')
    .eq('id', id)
    .single();

  if (!item) {
    return {
      title: '작품을 찾을 수 없습니다',
    };
  }

  const title = `${item.title} - AI Studio Gallery`;
  const description = item.description || `Google AI Studio로 생성된 ${item.category} 작품입니다.`;
  const imageUrl = item.thumbnail_url || '/og-image.png';

  return {
    title,
    description,
    keywords: [
      'Google AI Studio',
      item.category,
      item.title,
      ...(item.tags || []),
      'AI 생성',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/items/${id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: item.title,
        },
      ],
      publishedTime: item.created_at,
      tags: item.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  try {
    const supabase = createServerClient();
    const { data: items } = await supabase
      .from('tb_ai_gallery_items')
      .select('id')
      .limit(100);

    if (!items) return [];

    return items.map((item) => ({
      id: String(item.id),
    }));
  } catch (error) {
    console.warn('generateStaticParams failed:', error);
    return [];
  }
}

export default async function ItemPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServerClient();

  const { data: item, error } = await supabase
    .from('tb_ai_gallery_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) {
    notFound();
  }

  // Related items from same category
  const { data: relatedItems } = await supabase
    .from('tb_ai_gallery_items')
    .select('*')
    .eq('category', item.category)
    .neq('id', id)
    .limit(4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: item.title,
    description: item.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/items/${id}`,
    image: item.thumbnail_url,
    dateCreated: item.created_at,
    creator: {
      '@type': 'Organization',
      name: 'AI Studio Gallery',
    },
    genre: item.category,
    keywords: item.tags?.join(', '),
    inLanguage: 'ko-KR',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header/Hero for Item */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <Link href="/gallery" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              갤러리 목록으로
            </Link>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Image Column */}
              <div className="w-full md:w-2/3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  {item.thumbnail_url ? (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <span className="text-6xl">✨</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Column */}
              <div className="w-full md:w-1/3 flex flex-col">
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 uppercase tracking-wide">
                      {item.category}
                    </span>
                    {item.purpose && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                        {item.purpose}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {item.title}
                  </h1>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-900">
                        {item.nickname || '익명'}
                      </span>
                      <span>•</span>
                      <time>
                        {new Date(item.created_at).toLocaleDateString('ko-KR', {
                           year: 'numeric',
                           month: 'long',
                           day: 'numeric',
                        })}
                      </time>
                    </div>
                    
                    {/* Like Button */}
                    <div className="ml-auto">
                        <LikeButton itemId={item.id} initialLikes={item.like_count || 0} />
                    </div>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition shadow-sm hover:shadow-md mb-4"
                  >
                    <span>Google AI Studio 열기</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                     <div className="flex flex-wrap gap-2 mb-6">
                       {item.tags.map((tag: string) => (
                         <span key={tag} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer">
                            #{tag}
                         </span>
                       ))}
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        {item.description && (
          <section className="py-12 border-b border-gray-200">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="max-w-3xl">
                 <h2 className="text-xl font-bold text-gray-900 mb-4">작품 설명</h2>
                 <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                   {item.description}
                 </p>
               </div>
             </div>
          </section>
        )}

        {/* Related Items */}
        {relatedItems && relatedItems.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 작품</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedItems.map((related) => (
                  <Link
                    key={related.id}
                    href={`/items/${related.id}`}
                    className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      {related.thumbnail_url ? (
                        <Image
                          src={related.thumbnail_url}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                          <span className="text-3xl">✨</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">
                        {related.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                         <span>{related.category}</span>
                         <span>•</span>
                         <time>{new Date(related.created_at).toLocaleDateString()}</time>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
