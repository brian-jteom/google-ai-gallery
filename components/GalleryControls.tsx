'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trophy, User, Clock } from 'lucide-react';

export default function GalleryControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nickname, setNickname] = useState<string | null>(null);

  const currentSort = searchParams.get('sort') || 'latest';
  const currentNicknameFilter = searchParams.get('nickname');

  useEffect(() => {
    // Load nickname from local storage
    const saved = localStorage.getItem('gallery_nickname');
    setNickname(saved);
  }, []);

  const handleSort = (sort: 'latest' | 'popular') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/gallery?${params.toString()}`);
  };

  const toggleMyUploads = () => {
    if (!nickname) {
      alert('등록한 작품이 없습니다 (닉네임이 저장되지 않음)');
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (currentNicknameFilter) {
      params.delete('nickname');
    } else {
      params.set('nickname', nickname);
    }
    router.push(`/gallery?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleSort('latest')}
          className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-all ${
            currentSort === 'latest'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Clock className="w-3 h-3" />
          최신
        </button>
        <button
          onClick={() => handleSort('popular')}
          className={`px-3 py-1 text-xs font-medium rounded-md flex items-center gap-1 transition-all ${
            currentSort === 'popular'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Trophy className="w-3 h-3" />
          인기
        </button>
      </div>

      {nickname && (
        <button
          onClick={toggleMyUploads}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1 transition-all ${
            currentNicknameFilter
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User className="w-3 h-3" />
          내 작품
        </button>
      )}
    </div>
  );
}
