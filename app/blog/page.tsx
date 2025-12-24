import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import type { BlogItem } from '@/lib/types';
import { BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Blog - AI Studio Gallery',
  description: 'Google AI Studio 활용 팁과 가이드 블로그',
  keywords: ['AI 블로그', 'Google AI Studio', 'AI 가이드', 'AI 팁', 'AI 활용법'],
  openGraph: {
    title: 'AI Blog - AI Studio Gallery',
    description: 'Google AI Studio 활용 팁과 가이드 블로그',
    type: 'website',
  },
};

export default async function BlogPage() {
  let posts: BlogItem[] = [];

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('tb_ai_blog')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    posts = (data || []) as BlogItem[];
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-white opacity-50 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 shadow-sm text-green-600">
              <BookOpen className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 tracking-tight">
                AI Blog
              </h1>
              <p className="text-xl text-gray-500">AI 활용 팁과 가이드</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <span className="px-4 py-2 bg-gray-100 rounded-full text-sm border border-gray-200">
              {posts.length}개의 글
            </span>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
             <div className="flex justify-center mb-6">
               <div className="p-4 bg-gray-50 rounded-full grayscale opacity-50">
                 <BookOpen className="w-20 h-20 text-gray-400" />
               </div>
             </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              아직 등록된 글이 없습니다
            </h2>
            <p className="text-gray-500 mb-8">
              AI 블로그 글을 준비 중입니다
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition shadow-sm"
            >
              홈으로 돌아가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {post.thumbnail_url && (
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={post.thumbnail_url}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {post.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold rounded shadow-sm border border-green-100">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                      {post.description}
                    </p>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-50 border border-gray-100 text-gray-500 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center gap-2 text-green-600 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>글 읽기</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
