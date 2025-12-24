# AI Studio Gallery

Google AI Studio 결과물을 카테고리별로 관리하고 공유하는 풀스택 애플리케이션

## 🚀 기술 스택

- **Frontend & Backend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Validation**: Zod

## 📦 프로젝트 구조

```
gallery-frontend/
├── app/
│   ├── api/              # Backend API Routes
│   │   ├── items/        # Gallery items CRUD
│   │   └── health/       # Health check
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── lib/
│   ├── supabase/         # Supabase clients
│   │   ├── client.ts     # Client-side
│   │   └── server.ts     # Server-side
│   ├── types.ts          # Shared TypeScript types
│   └── schemas.ts        # Zod validation schemas
└── components/           # React components (coming soon)
```

## 🛠️ 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 설정을 추가하세요:

```bash
cp .env.example .env.local
```

**Supabase 프로젝트 생성:**
1. https://supabase.com/dashboard 접속
2. "New Project" 클릭하여 프로젝트 생성
3. Settings → API에서 다음 정보 복사:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_URL`
   - `anon` `public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` 키 → `SUPABASE_SERVICE_ROLE_KEY`

`.env.local`:
```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**데이터베이스 테이블 생성:**

Supabase SQL Editor에서 다음 SQL 실행:

```sql
CREATE TABLE tb_ai_gallery_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  link TEXT NOT NULL,
  category VARCHAR(60) NOT NULL,
  description VARCHAR(500),
  tags TEXT[],
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

**참고:** Supabase 설정 없이도 프론트엔드는 실행됩니다. 단, 데이터 조회/저장 기능은 Supabase 연결 후 사용 가능합니다.

## 📚 주요 명령어

```bash
# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Lint
npm run lint
```

## 🌐 주요 페이지

- `/` - 홈페이지
- `/gallery` - 갤러리 목록 (모든 작품)
- `/gallery/new` - 새 작품 등록
- `/gallery/edit/[id]` - 작품 수정
- `/items/[id]` - 작품 상세 페이지

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```

### Gallery Items

**List items** (with filtering & pagination)
```
GET /api/items?category=<category>&q=<search>&limit=<limit>&offset=<offset>
```

**Get single item**
```
GET /api/items/[id]
```

**Create item**
```
POST /api/items
Content-Type: application/json

{
  "title": "Item title",
  "link": "https://ai.studio/apps/...",
  "category": "image",
  "description": "Optional description",
  "tags": ["tag1", "tag2"],
  "thumbnail_url": "https://example.com/image.jpg"
}
```

**Update item**
```
PUT /api/items/[id]
Content-Type: application/json

{
  "title": "Updated title",
  "link": "https://ai.studio/apps/...",
  "category": "image",
  "description": "Updated description",
  "tags": ["tag1", "tag2"],
  "thumbnail_url": "https://example.com/image.jpg"
}
```

**Delete item**
```
DELETE /api/items/[id]
```

## 🗄️ Database Schema

Supabase `tb_ai_gallery_items` 테이블:

```sql
CREATE TABLE tb_ai_gallery_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  link TEXT NOT NULL,
  category VARCHAR(60) NOT NULL,
  description VARCHAR(500),
  tags TEXT[],
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚢 배포

### Vercel (권장)

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포

### 기타 플랫폼

```bash
npm run build
npm start
```

## 📝 특징

- ✅ 풀스택 TypeScript (프론트/백엔드 타입 공유)
- ✅ Supabase 통합 (PostgreSQL + Auth)
- ✅ API Routes (서버리스 백엔드)
- ✅ Zod 스키마 검증
- ✅ Tailwind CSS 스타일링
- ✅ SEO 최적화 가능
- ✅ 단일 배포

## 📄 라이선스

Private
