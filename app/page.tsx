import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import { generateWebSiteSchema } from '@/lib/seo';

import { ArrowRight, MonitorPlay, BookOpen, Sparkles, Image as ImageIcon } from 'lucide-react';

export default async function Home() {
  const websiteSchema = generateWebSiteSchema();

  let featuredItems = [];
  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('tb_ai_gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(12);

    featuredItems = data || [];
  } catch (error) {
    console.warn('Failed to fetch featured items:', error);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8 border border-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI 활용 & 학습 플랫폼
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 text-balance">
              AI Studio <span className="text-indigo-600">Gallery</span>
            </h1>

            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed text-balance">
              Google AI Studio로 만든 창의적인 결과물을 발견하고,<br className="hidden md:inline" />
              당신의 영감을 세상과 공유하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/gallery"
                className="px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm hover:shadow-md flex items-center gap-2"
              >
                갤러리 탐험하기
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/gallery/new"
                className="px-8 py-3.5 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                작품 등록하기
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Gallery Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">추천 갤러리</h2>
                <p className="text-gray-500">Google AI Studio로 만든 최신 작품</p>
              </div>
              <Link
                href="/gallery"
                className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                전체보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {featuredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredItems.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/items/${item.id}`}
                    className="group flex flex-col"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-gray-100 mb-4 border border-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                      {item.thumbnail_url ? (
                        <Image
                          src={item.thumbnail_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">• {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-500 mb-6">아직 등록된 작품이 없습니다</p>
                <Link
                  href="/gallery/new"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  첫 작품 등록하기
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Resources Grid (YouTube & Blog) */}
        <section className="py-24 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* YouTube Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">학습 센터</h2>
                  <Link href="/youtube" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    더 보기 <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-64 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-red-50 rounded-2xl mb-4 text-red-600">
                    <MonitorPlay className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">YouTube강의</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    AI 활용법을 쉽고 재미있게 배워보세요. 준비 중입니다.
                  </p>
                </div>
              </div>

              {/* Blog Section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold text-gray-900">블로그</h2>
                   <Link href="/blog" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    더 보기 <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm h-64 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-green-50 rounded-2xl mb-4 text-green-600">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tech Blog</h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    AI 관련 최신 소식과 팁을 공유합니다. 준비 중입니다.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="py-24 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              당신의 아이디어를 현실로 만들고, 전 세계 크리에이터와 공유하세요.
            </p>
            <Link
              href="/gallery/new"
              className="inline-flex px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
