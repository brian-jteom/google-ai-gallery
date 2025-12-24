import { Metadata } from 'next';
import GalleryForm from '@/components/GalleryForm';

export const metadata: Metadata = {
  title: '새 작품 등록',
  description: 'Google AI Studio 작품을 갤러리에 등록하세요',
};

export default function NewItemPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">새 작품 등록</h1>
          <p className="text-gray-600">
            Google AI Studio로 생성한 작품을 갤러리에 공유하세요
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <GalleryForm mode="create" />
        </div>
      </div>
    </main>
  );
}
