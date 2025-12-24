import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import type { GalleryItem } from '@/lib/types';
import { Palette, FileText, Code, Music, Search, ArrowLeft, Image as ImageIcon } from 'lucide-react';

type Props = {
  params: Promise<{ category: string }>;
};

// ... (existing generateMetadata) ...

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const categoryInfo: Record<string, { name: string; icon: React.ReactNode; description: string; color: string }> = {
    image: { name: '이미지 생성', icon: <Palette className="w-10 h-10 text-pink-500" />, description: 'AI가 생성한 이미지와 그래픽', color: 'from-pink-500 to-rose-500' },
    text: { name: '텍스트 생성', icon: <FileText className="w-10 h-10 text-blue-500" />, description: 'AI가 작성한 텍스트와 문서', color: 'from-blue-500 to-cyan-500' },
    code: { name: '코드 생성', icon: <Code className="w-10 h-10 text-green-500" />, description: 'AI가 생성한 코드와 프로그램', color: 'from-green-500 to-emerald-500' },
    music: { name: '음악 생성', icon: <Music className="w-10 h-10 text-purple-500" />, description: 'AI가 작곡한 음악과 사운드', color: 'from-purple-500 to-violet-500' },
  };

  const info = categoryInfo[category] || { name: category, icon: <Search className="w-10 h-10 text-gray-500" />, description: 'AI 작품 모음', color: 'from-gray-500 to-gray-600' };

  let items: GalleryItem[] = [];

  try {
    const supabase = createServerClient();
    const { data } = await supabase
      .from('tb_ai_gallery_items')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(100);

    items = (data || []) as GalleryItem[];
  } catch (error) {
    console.error('Failed to fetch items:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className={`absolute inset-0 bg-gradient-to-b ${info.color.replace('from-', 'from-').replace('to-', 'to-').replace('500', '50')} opacity-20 pointer-events-none`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors text-sm font-medium group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            갤러리로 돌아가기
          </Link>

          <div className="flex items-center gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">{info.icon}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 tracking-tight">
                {info.name}
              </h1>
              <p className="text-xl text-gray-500">{info.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500 font-medium">
            <span className="px-4 py-2 bg-gray-100 rounded-full text-sm border border-gray-200">
              {items.length}개의 작품
            </span>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
             <div className="flex justify-center mb-6">
               <div className="p-4 bg-gray-50 rounded-full grayscale opacity-50">{info.icon}</div>
             </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              아직 등록된 작품이 없습니다
            </h2>
            <p className="text-gray-500 mb-8">
              {info.name} 카테고리의 첫 작품을 등록해보세요
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
            {items.map((item, idx) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
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
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}

                  {item.purpose && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded shadow-sm border border-gray-200">
                        {item.purpose}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                     <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
