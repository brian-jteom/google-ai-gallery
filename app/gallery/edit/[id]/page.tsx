import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import GalleryForm from '@/components/GalleryForm';
import type { GalleryItem } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: '작품 수정',
  description: '갤러리 작품을 수정하세요',
};

export default async function EditItemPage({ params }: PageProps) {
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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">작품 수정</h1>
          <p className="text-gray-600">
            갤러리 작품 정보를 수정하세요
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <GalleryForm mode="edit" item={item as GalleryItem} />
        </div>
      </div>
    </main>
  );
}
