'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function TestUploadPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [pasteReady, setPasteReady] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  useEffect(() => {
    addLog('✅ Component mounted');
    addLog('👂 Adding paste event listener...');

    const handlePaste = async (e: ClipboardEvent) => {
      addLog('🎯 Paste event detected!');
      addLog(`pasteReady: ${pasteReady}`);

      if (!pasteReady) {
        addLog('⚠️ Paste mode not active');
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) {
        addLog('❌ No clipboard items');
        alert('클립보드가 비어있습니다');
        return;
      }

      addLog(`📦 Clipboard items: ${items.length}`);

      for (let i = 0; i < items.length; i++) {
        addLog(`📄 Item ${i}: ${items[i].type} (${items[i].kind})`);

        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          addLog('🖼️ Image found!');

          const file = items[i].getAsFile();
          if (!file) {
            addLog('❌ Failed to get file');
            alert('파일 가져오기 실패');
            continue;
          }

          addLog(`📁 File: ${file.name}, ${file.type}, ${file.size} bytes`);

          try {
            addLog('🚀 Creating Supabase client...');
            const supabase = createBrowserClient();
            addLog('✅ Supabase client created');

            const fileName = `test-${Date.now()}.png`;
            const filePath = `thumbnails/${fileName}`;
            addLog(`📁 Upload path: ${filePath}`);

            addLog('📤 Uploading to gallery-images bucket...');
            const { data, error } = await supabase.storage
              .from('gallery-images')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
              });

            if (error) {
              addLog(`❌ Upload error: ${error.message}`);
              alert(`업로드 실패: ${error.message}`);
              return;
            }

            addLog(`✅ Upload successful: ${JSON.stringify(data)}`);

            const { data: { publicUrl } } = supabase.storage
              .from('gallery-images')
              .getPublicUrl(filePath);

            addLog(`🔗 Public URL: ${publicUrl}`);
            setImageUrl(publicUrl);
            alert('업로드 성공! 🎉');
            setPasteReady(false);

          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            addLog(`💥 Exception: ${msg}`);
            alert(`에러: ${msg}`);
          }
          break;
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      addLog('🔇 Removing paste listener');
      document.removeEventListener('paste', handlePaste);
    };
  }, [pasteReady]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">이미지 업로드 테스트</h1>

        {/* Paste Zone */}
        <div
          onClick={() => {
            setPasteReady(true);
            addLog('✅ Paste mode activated');
          }}
          onBlur={() => {
            setPasteReady(false);
            addLog('⚠️ Paste mode deactivated');
          }}
          tabIndex={0}
          className={`w-full min-h-[200px] border-4 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition ${
            pasteReady ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
          }`}
        >
          <div className="text-6xl mb-4">{pasteReady ? '✅' : '📋'}</div>
          <div className="text-xl font-bold mb-2">
            {pasteReady ? '지금 Ctrl+V 누르세요!' : '클릭해서 활성화'}
          </div>
          <div className="text-sm text-gray-600">
            이미지를 복사한 후 여기를 클릭하고 Ctrl+V
          </div>
        </div>

        {/* Image Preview */}
        {imageUrl && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h2 className="font-bold mb-2">업로드된 이미지:</h2>
            <img src={imageUrl} alt="Uploaded" className="max-w-md rounded border" />
            <p className="text-xs text-gray-500 mt-2 break-all">{imageUrl}</p>
          </div>
        )}

        {/* Logs */}
        <div className="mt-6 bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
          <div className="font-bold mb-2">📋 실시간 로그:</div>
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">로그 없음</div>}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold mb-2">🧪 테스트 방법:</h3>
          <ol className="list-decimal ml-5 space-y-1 text-sm">
            <li>이미지를 복사하세요 (스크린샷: Win+Shift+S 또는 Cmd+Shift+4)</li>
            <li>위의 점선 박스를 클릭하세요 (파란색으로 변함)</li>
            <li>Ctrl+V (Mac: Cmd+V)를 누르세요</li>
            <li>아래 로그에서 무슨 일이 일어나는지 확인하세요</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
