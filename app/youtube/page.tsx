import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import type { YoutubeItem } from '@/lib/types';
import { MonitorPlay, Play } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Learning YouTube - AI Studio Gallery',
  description: 'Google AI Studio 활용법을 배우는 유튜브 영상 모음',
  keywords: ['AI 학습', '유튜브', 'Google AI Studio', '튜토리얼', 'AI 교육'],
  openGraph: {
    title: 'AI Learning YouTube - AI Studio Gallery',
    description: 'Google AI Studio 활용법을 배우는 유튜브 영상 모음',
    type: 'website',
  },
};

export default async function YoutubePage() {
  let videos: YoutubeItem[] = [];

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('tb_ai_youtube')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    videos = (data || []) as YoutubeItem[];
  } catch (error) {
    console.error('Failed to fetch YouTube videos:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50 to-white opacity-50 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 shadow-sm text-red-600">
              <MonitorPlay className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 tracking-tight">
                AI Learning YouTube
              </h1>
              <p className="text-xl text-gray-500">AI 활용법을 배우는 영상 모음</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <span className="px-4 py-2 bg-gray-100 rounded-full text-sm border border-gray-200">
              {videos.length}개의 영상
            </span>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {videos.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
             <div className="flex justify-center mb-6">
               <div className="p-4 bg-gray-50 rounded-full grayscale opacity-50">
                 <MonitorPlay className="w-20 h-20 text-gray-400" />
               </div>
             </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              아직 등록된 영상이 없습니다
            </h2>
            <p className="text-gray-500 mb-8">
              AI 학습 영상을 준비 중입니다
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition shadow-sm"
            >
              홈으로 돌아가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video, idx) => (
              <a
                key={video.id}
                href={video.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <MonitorPlay className="w-14 h-14" />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {video.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-red-700 text-xs font-semibold rounded shadow-sm border border-red-100">
                        {video.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {video.description}
                    </p>
                  )}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                     <span className="text-xs text-gray-400">YouTube</span>
                     <span className="text-xs font-medium text-red-600 group-hover:underline">시청하기</span>
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
