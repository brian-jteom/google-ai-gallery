'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import type { GalleryItem, GalleryItemCreate } from '@/lib/types';
import { Clipboard, FileImage, Upload, Check, Lightbulb, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface GalleryFormProps {
  item?: GalleryItem;
  mode: 'create' | 'edit';
}

export default function GalleryForm({ item, mode }: GalleryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [pasteReady, setPasteReady] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<GalleryItemCreate>({
    title: item?.title || '',
    link: item?.link || '',
    category: item?.category || '',
    purpose: item?.purpose || '',
    description: item?.description || '',
    tags: item?.tags || [],
    thumbnail_url: item?.thumbnail_url || '',
  });

  const [tagInput, setTagInput] = useState('');

  // 전역 붙여넣기 이벤트 리스너
  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      console.log('🎯 Paste event detected! pasteReady:', pasteReady);

      // 붙여넣기 준비 상태가 아니면 무시
      if (!pasteReady) {
        console.log('⚠️ Paste mode not active, ignoring...');
        return;
      }

      console.log('✅ Paste mode is active, processing...');
      const items = e.clipboardData?.items;
      if (!items) {
        console.log('❌ No clipboard items found');
        alert('클립보드에 데이터가 없습니다.');
        return;
      }

      console.log('📦 Clipboard items count:', items.length);

      // 모든 아이템 타입 출력
      for (let i = 0; i < items.length; i++) {
        console.log(`📄 Item ${i}: type="${items[i].type}", kind="${items[i].kind}"`);
      }

      // 이미지 찾기
      let imageFound = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          imageFound = true;
          e.preventDefault();
          console.log('🖼️ Image found in clipboard!');
          const file = items[i].getAsFile();

          if (!file) {
            console.log('❌ Failed to get file from clipboard item');
            alert('클립보드에서 파일을 가져올 수 없습니다.');
            continue;
          }

          console.log('📁 File details:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified
          });

          setUploading(true);
          setError('');

          try {
            console.log('🚀 Starting upload to Supabase...');
            const url = await uploadImage(file);
            console.log('✅ Upload successful! URL:', url);
            alert('이미지 업로드 성공!');
            setFormData(prev => ({ ...prev, thumbnail_url: url }));
            setPasteReady(false); // 업로드 후 비활성화
          } catch (err) {
            console.error('❌ Upload error:', err);
            const errorMsg = err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMsg);
            alert('업로드 실패: ' + errorMsg);
          } finally {
            setUploading(false);
          }
          break;
        }
      }

      if (!imageFound) {
        console.log('⚠️ No image found in clipboard');
        alert('클립보드에 이미지가 없습니다. 이미지를 복사한 후 다시 시도하세요.');
      }
    };

    console.log('👂 Adding paste event listener...');
    document.addEventListener('paste', handleGlobalPaste);

    return () => {
      console.log('🔇 Removing paste event listener...');
      document.removeEventListener('paste', handleGlobalPaste);
    };
  }, [pasteReady]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'create'
        ? '/api/items'
        : `/api/items/${item?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save item');
      }

      const data = await response.json();

      // 성공 시 상세 페이지로 이동
      router.push(`/items/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save item');
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleDelete = async () => {
    if (!item?.id) return;

    if (!confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/items/${item.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      router.push('/gallery');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    console.log('📤 uploadImage called with file:', file.name, file.type, file.size);

    const supabase = createBrowserClient();
    console.log('🔗 Supabase client created');

    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    console.log('📁 Upload path:', filePath);

    try {
      const { data, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('❌ Supabase upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('✅ Upload successful, data:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL generated:', publicUrl);

      return publicUrl;
    } catch (err) {
      console.error('💥 Upload exception:', err);
      throw err;
    }
  };

  const activatePasteMode = () => {
    setPasteReady(true);
    console.log('Paste mode activated - Ready to accept Ctrl+V');
  };

  const deactivatePasteMode = () => {
    setPasteReady(false);
    console.log('Paste mode deactivated');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const url = await uploadImage(file);
      setFormData({ ...formData, thumbnail_url: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          maxLength={120}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
          placeholder="작품 제목을 입력하세요"
        />
      </div>

      {/* Link */}
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
          AI Studio 링크 <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          id="link"
          required
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
          placeholder="https://ai.studio/apps/..."
        />
        <p className="mt-1 text-sm text-gray-500">
          Google AI Studio 앱 링크를 입력하세요
        </p>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          카테고리 <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow bg-white"
        >
          <option value="">카테고리 선택</option>
          <option value="image">이미지 생성</option>
          <option value="text">텍스트 생성</option>
          <option value="code">코드 생성</option>
          <option value="music">음악 생성</option>
          <option value="video">비디오 생성</option>
          <option value="data">데이터 분석</option>
          <option value="other">기타</option>
        </select>
      </div>

      {/* Purpose */}
      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
          용도
        </label>
        <select
          id="purpose"
          value={formData.purpose || ''}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value || null })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow bg-white"
        >
          <option value="">용도 선택 (선택사항)</option>
          <option value="shopping">쇼핑몰</option>
          <option value="youtube">유튜브</option>
          <option value="ocr">OCR</option>
          <option value="development">개발</option>
          <option value="blog">블로그</option>
          <option value="education">교육</option>
          <option value="entertainment">엔터테인먼트</option>
          <option value="other">기타</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          AI 작품의 사용 목적을 선택하세요
        </p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          설명
        </label>
        <textarea
          id="description"
          rows={4}
          maxLength={500}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
          placeholder="작품에 대한 설명을 입력하세요 (선택사항)"
        />
      </div>

      {/* Thumbnail Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          썸네일 이미지
        </label>

        {/* Hidden file input */}
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Paste area and URL input */}
        <div className="space-y-3">
          {/* Paste Drop Zone */}
          <div
            ref={dropZoneRef}
            tabIndex={0}
            className={`w-full min-h-[120px] px-4 py-6 border-2 border-dashed rounded-lg transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
              pasteReady
                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={activatePasteMode}
            onBlur={deactivatePasteMode}
          >
            <div className="text-gray-400">
              {pasteReady ? <Clipboard className="w-16 h-16 text-indigo-500" /> : <Clipboard className="w-16 h-16" />}
            </div>
            <div className={`text-sm font-bold ${pasteReady ? 'text-indigo-700' : 'text-gray-700'}`}>
              {pasteReady ? '지금 Ctrl+V를 눌러 붙여넣기 하세요!' : '여기를 클릭한 후 Ctrl+V로 이미지 붙여넣기'}
            </div>
            <div className="text-xs text-gray-500">
              또는 아래 버튼으로 파일 선택
            </div>
          </div>

          {/* File Select Button */}
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            disabled={uploading}
            className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            <FileImage className="w-5 h-5" />
            <span>파일에서 선택</span>
          </button>

          {/* URL Input */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">또는</span>
            <input
              type="text"
              id="thumbnail_url"
              value={formData.thumbnail_url || ''}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
              placeholder="이미지 URL 직접 입력"
              disabled={uploading}
            />
          </div>
        </div>

        {uploading && (
          <div className="mt-3 text-sm text-indigo-600 flex items-center gap-2 bg-indigo-50 px-4 py-3 rounded-lg">
            <Loader2 className="animate-spin h-5 w-5" />
            <span className="font-medium">이미지 업로드 중...</span>
          </div>
        )}

        {formData.thumbnail_url && !uploading && (
          <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <img
              src={formData.thumbnail_url}
              alt="Preview"
              className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-300 mx-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
              className="mt-3 w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition text-sm font-medium"
            >
              <X className="w-4 h-4" /> 이미지 제거
            </button>
          </div>
        )}

        <div className="mt-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="text-sm">이미지 붙여넣기 사용법:</span>
          </div>
          <ol className="text-xs text-indigo-800 space-y-2 ml-4 list-decimal">
            <li>
              <strong>이미지를 복사하세요:</strong>
              <ul className="ml-4 mt-1 list-disc space-y-1 text-indigo-700">
                <li>스크린샷: Windows <kbd className="px-1 py-0.5 bg-white rounded border border-indigo-200">Win + Shift + S</kbd> / Mac <kbd className="px-1 py-0.5 bg-white rounded border border-indigo-200">Cmd + Shift + 4</kbd></li>
                <li>파일: 이미지 파일 우클릭 → 복사</li>
                <li>웹에서: 이미지 우클릭 → 이미지 복사</li>
              </ul>
            </li>
            <li>
              <strong>위의 점선 박스를 클릭하세요</strong> (파란색으로 변함)
            </li>
            <li>
              <strong>키보드에서 <kbd className="px-2 py-1 bg-white rounded border border-indigo-200 font-mono">Ctrl + V</kbd> (Mac: <kbd className="px-2 py-1 bg-white rounded border border-indigo-200 font-mono">Cmd + V</kbd>)</strong>를 누르세요
            </li>
            <li>
              자동으로 업로드되고 미리보기가 표시됩니다!
            </li>
          </ol>
          {pasteReady && (
            <div className="mt-3 p-2 bg-indigo-600 text-white rounded-lg text-center font-bold animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                준비 완료! 지금 Ctrl+V를 누르세요!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          태그
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow"
            placeholder="태그를 입력하고 엔터"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-200"
          >
            추가
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm flex items-center gap-2 border border-indigo-100"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? '저장 중...' : mode === 'create' ? '등록하기' : '수정하기'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          취소
        </button>
        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 bg-white border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            삭제
          </button>
        )}
      </div>
    </form>
  );
}
