# SEO 최적화 가이드

AI Studio Gallery의 검색 엔진 최적화(SEO) 구현 및 설정 가이드입니다.

## 📊 구현된 SEO 기능

### 1. 메타데이터 최적화

#### 루트 레이아웃 (`app/layout.tsx`)
```typescript
- title: 계층적 제목 시스템
- description: 상세한 설명
- keywords: Google AI Studio 관련 키워드
- Open Graph: SNS 공유 최적화
- Twitter Card: 트위터 공유 최적화
- robots: 검색 엔진 크롤링 지침
```

#### 동적 페이지 메타데이터 (`app/items/[id]/page.tsx`)
- 각 갤러리 아이템마다 고유한 메타데이터 생성
- 제목, 설명, 이미지가 자동으로 설정됨
- Open Graph 및 Twitter Card 지원

### 2. 구조화된 데이터 (JSON-LD)

#### WebSite 스키마 (홈페이지)
```json
{
  "@type": "WebSite",
  "name": "AI Studio Gallery",
  "description": "...",
  "potentialAction": {
    "@type": "SearchAction"
  }
}
```

#### CreativeWork 스키마 (갤러리 아이템)
```json
{
  "@type": "CreativeWork",
  "name": "작품명",
  "creator": {...},
  "genre": "카테고리",
  "keywords": "태그..."
}
```

### 3. URL 구조

```
/ - 홈페이지
/items/[id] - 갤러리 아이템 상세
/category/[category] - 카테고리별 갤러리 (추후 구현)
```

### 4. Sitemap.xml
- 자동 생성: `/sitemap.xml`
- 모든 갤러리 아이템 포함
- 카테고리 페이지 포함
- 변경 빈도 및 우선순위 설정

### 5. Robots.txt
- 자동 생성: `/robots.txt`
- 검색 엔진별 크롤링 규칙
- Sitemap 위치 명시

### 6. Open Graph 이미지
- 동적 생성: `/api/og`
- 쿼리 파라미터로 커스터마이징
- 1200x630 최적 크기

## 🚀 배포 후 설정

### 1. Google Search Console 설정

1. **사이트 등록**
   ```
   https://search.google.com/search-console
   ```

2. **소유권 확인**
   - 메타 태그 방식 선택
   - `app/layout.tsx`의 `verification.google` 값 업데이트
   ```typescript
   verification: {
     google: 'YOUR_VERIFICATION_CODE',
   }
   ```

3. **Sitemap 제출**
   ```
   https://your-domain.com/sitemap.xml
   ```

4. **URL 검사 요청**
   - 주요 페이지들의 색인 요청
   - `/`
   - `/items/1`, `/items/2`, ...

### 2. 환경 변수 설정

`.env.local` 또는 Vercel 환경 변수:
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Open Graph 이미지 테스트

개발 중:
```
http://localhost:3000/api/og?title=Test&category=image&description=Test
```

프로덕션:
```
https://your-domain.com/api/og?title=갤러리&category=이미지
```

### 4. 메타데이터 검증

#### Facebook Sharing Debugger
```
https://developers.facebook.com/tools/debug/
```
- Open Graph 태그 확인
- 이미지 미리보기

#### Twitter Card Validator
```
https://cards-dev.twitter.com/validator
```
- Twitter Card 미리보기

#### LinkedIn Post Inspector
```
https://www.linkedin.com/post-inspector/
```

## 🎯 SEO 체크리스트

### ✅ 기본 SEO
- [x] 각 페이지마다 고유한 `<title>` 태그
- [x] 각 페이지마다 고유한 `<meta description>`
- [x] 의미 있는 URL 구조
- [x] H1, H2, H3 계층 구조
- [x] 이미지 alt 텍스트
- [x] 내부 링크 구조 (Breadcrumb)

### ✅ 기술적 SEO
- [x] robots.txt
- [x] sitemap.xml
- [x] 모바일 최적화 (Tailwind 반응형)
- [x] HTTPS (Vercel 기본 제공)
- [x] 페이지 로딩 속도 (Next.js 최적화)
- [x] 구조화된 데이터 (JSON-LD)

### ✅ 컨텐츠 SEO
- [x] 키워드 최적화
- [x] 고품질 콘텐츠
- [x] 메타 키워드
- [x] Open Graph 메타데이터
- [x] Twitter Card 메타데이터

### ⏳ 추가 구현 예정
- [ ] 카테고리 페이지
- [ ] 검색 페이지
- [ ] 관련 작품 추천
- [ ] 사용자 프로필 페이지
- [ ] 댓글/리뷰 시스템
- [ ] 좋아요/공유 기능

## 📈 성능 최적화

### Next.js 기능 활용

1. **Static Generation (SSG)**
   ```typescript
   export async function generateStaticParams() {
     // 빌드 타임에 정적 페이지 생성
   }
   ```

2. **Dynamic Metadata**
   ```typescript
   export async function generateMetadata() {
     // 페이지별 동적 메타데이터
   }
   ```

3. **Image Optimization**
   - Next.js Image 컴포넌트 사용 권장
   - 자동 최적화 및 lazy loading

### 예상 Core Web Vitals
- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1

## 🔍 검색 키워드 전략

### 타겟 키워드
1. **Primary**
   - "Google AI Studio"
   - "AI Studio 갤러리"
   - "Google AI 작품"

2. **Secondary**
   - "AI 이미지 생성"
   - "Gemini 작품"
   - "생성형 AI 갤러리"

3. **Long-tail**
   - "Google AI Studio로 만든 이미지"
   - "AI Studio 결과물 공유"
   - "Gemini로 생성한 작품"

### 콘텐츠 전략
- 각 갤러리 아이템에 상세한 설명 추가
- 카테고리별 랜딩 페이지 생성
- 사용 방법, 튜토리얼 콘텐츠 추가

## 📱 소셜 미디어 최적화

### Open Graph 프로퍼티
```html
og:title - 제목
og:description - 설명
og:image - 이미지 (1200x630)
og:url - URL
og:type - 타입 (website, article)
```

### Twitter Card
```html
twitter:card - summary_large_image
twitter:title - 제목
twitter:description - 설명
twitter:image - 이미지
```

## 🛠️ 유틸리티 함수

`lib/seo.ts`에서 제공하는 함수들:
- `generateOgImageUrl()` - OG 이미지 URL 생성
- `generateCreativeWorkSchema()` - CreativeWork JSON-LD
- `generateItemListSchema()` - ItemList JSON-LD
- `generateWebSiteSchema()` - WebSite JSON-LD
- `generateKeywords()` - 키워드 배열 생성
- `generateTitle()` - 동적 제목 생성
- `generateDescription()` - 동적 설명 생성

## 📊 모니터링

### Google Analytics (추가 예정)
```typescript
// app/layout.tsx에 추가
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

### Google Search Console 모니터링
- 검색 성능 추적
- 색인 커버리지 확인
- 사이트맵 상태 모니터링
- 모바일 사용성 확인

## 📝 콘텐츠 작성 가이드

### 갤러리 아이템 등록 시
1. **제목**: 명확하고 설명적인 제목
2. **설명**: 최소 50자 이상 상세 설명
3. **카테고리**: 적절한 카테고리 선택
4. **태그**: 관련성 높은 태그 3-5개
5. **썸네일**: 고품질 이미지 (최소 1200x630)

### SEO 친화적 콘텐츠
- 자연스러운 키워드 사용
- 구체적이고 상세한 설명
- 사용자 의도에 맞는 정보 제공
- 정기적인 콘텐츠 업데이트

## 🚨 주의사항

1. **중복 콘텐츠 방지**
   - 각 페이지마다 고유한 콘텐츠
   - Canonical URL 설정

2. **키워드 스터핑 금지**
   - 자연스러운 키워드 사용
   - 과도한 반복 피하기

3. **품질 우선**
   - 사용자 경험 최우선
   - 검색 엔진만을 위한 최적화 지양

4. **정기적인 업데이트**
   - 콘텐츠 신선도 유지
   - 오래된 정보 업데이트

## 📚 참고 자료

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
