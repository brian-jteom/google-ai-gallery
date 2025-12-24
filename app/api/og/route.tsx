import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'AI Studio Gallery';
    const category = searchParams.get('category') || '';
    const description = searchParams.get('description') || 'Google AI Studio 결과물 갤러리';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom right, #e0f2fe 0%, #dbeafe 50%, #e0e7ff 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 80px',
            }}
          >
            {/* 로고/제목 */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: 20,
              }}
            >
              AI Studio Gallery
            </div>

            {/* 카테고리 */}
            {category && (
              <div
                style={{
                  fontSize: 32,
                  color: '#6366f1',
                  backgroundColor: '#eef2ff',
                  padding: '8px 24px',
                  borderRadius: 999,
                  marginBottom: 30,
                }}
              >
                {category}
              </div>
            )}

            {/* 제목 */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#1e293b',
                textAlign: 'center',
                maxWidth: '90%',
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              {title}
            </div>

            {/* 설명 */}
            <div
              style={{
                fontSize: 28,
                color: '#64748b',
                textAlign: 'center',
                maxWidth: '80%',
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          </div>

          {/* 푸터 */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              fontSize: 24,
              color: '#94a3b8',
            }}
          >
            🤖 Google AI Studio로 생성된 작품
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
