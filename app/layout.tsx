import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: {
    default: 'AI Studio Gallery - Google AI Studio 결과물 갤러리',
    template: '%s | AI Studio Gallery',
  },
  description: 'Google AI Studio로 생성한 AI 결과물을 카테고리별로 관리하고 공유하는 플랫폼. 이미지 생성, 텍스트 생성, 코드 생성 등 다양한 AI Studio 작품을 발견하세요.',
  keywords: [
    'Google AI Studio',
    'AI Studio Gallery',
    'AI 결과물',
    '이미지 생성',
    'AI 갤러리',
    '인공지능',
    'Gemini',
    'AI 작품',
    '생성형 AI',
    'Google DeepMind',
    'Vertex AI',
    'Prompt Engineering',
    '프롬프트 엔지니어링',
    'AI 아트',
    '생성형 AI 커뮤니티',
  ],
  authors: [{ name: 'AI Studio Gallery' }],
  creator: 'AI Studio Gallery',
  publisher: 'AI Studio Gallery',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AI Studio Gallery - Google AI Studio 결과물 갤러리',
    description: 'Google AI Studio로 생성한 AI 결과물을 카테고리별로 관리하고 공유하는 플랫폼',
    url: '/',
    siteName: 'AI Studio Gallery',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Studio Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Studio Gallery - Google AI Studio 결과물 갤러리',
    description: 'Google AI Studio로 생성한 AI 결과물을 카테고리별로 관리하고 공유',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Google Search Console에서 발급받은 코드로 교체
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
