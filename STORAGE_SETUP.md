# Supabase Storage 설정 가이드

이미지 복사-붙여넣기 기능을 사용하려면 Supabase Storage 버킷을 설정해야 합니다.

## 1. Supabase Storage 버킷 생성

1. **Supabase Dashboard** 접속
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **Storage** 메뉴 클릭
   - 왼쪽 사이드바에서 "Storage" 선택

3. **New bucket 생성**
   - "Create a new bucket" 버튼 클릭
   - **Name**: `gallery-images` (정확히 이 이름으로!)
   - **Public bucket**: ✅ **체크** (공개 접근 허용)
   - "Create bucket" 클릭

## 2. Storage Policies 설정 (선택사항)

보안을 강화하려면 다음 정책을 추가하세요:

### 2.1. Upload Policy (업로드 허용)

```sql
-- Storage > gallery-images > Policies > New Policy

-- Policy name: Allow public uploads
-- Policy definition:
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery-images');
```

### 2.2. Read Policy (읽기 허용)

```sql
-- Policy name: Allow public reads
-- Policy definition:
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');
```

### 2.3. Delete Policy (삭제 허용 - 선택)

```sql
-- Policy name: Allow public deletes
-- Policy definition:
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'gallery-images');
```

## 3. 환경 변수 확인

`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. 테스트

1. 개발 서버 재시작: `npm run dev`
2. `/gallery/new` 페이지 접속
3. 이미지를 복사 (스크린샷 또는 이미지 파일 우클릭 → 복사)
4. 점선 박스 클릭 후 `Ctrl+V` (Mac: `Cmd+V`)
5. 이미지가 자동으로 업로드되고 미리보기가 표시됨

## 5. 문제 해결

### 에러: "The resource you are looking for could not be found"
- **원인**: `gallery-images` 버킷이 생성되지 않음
- **해결**: 1단계를 다시 확인하고 버킷 이름이 정확한지 확인

### 에러: "new row violates row-level security policy"
- **원인**: Storage Policy가 설정되지 않음
- **해결**: 2단계의 Policy를 추가

### 에러: "Missing Supabase environment variables"
- **원인**: 환경 변수가 설정되지 않음
- **해결**: 3단계를 확인하고 개발 서버 재시작

### 붙여넣기가 작동하지 않음
1. **브라우저 콘솔 확인** (F12 → Console)
   - 에러 메시지 확인

2. **콘솔에 "Paste event triggered" 메시지가 보이는가?**
   - 보이지 않음: 점선 박스를 클릭한 후 붙여넣기
   - 보임: 다음 로그 확인

3. **"Image found in clipboard" 메시지가 보이는가?**
   - 보이지 않음: 이미지가 클립보드에 제대로 복사되지 않음
   - Windows: `Win + Shift + S`로 스크린샷 캡처
   - Mac: `Cmd + Shift + 4`로 스크린샷 캡처

4. **"Upload error" 메시지가 보이는가?**
   - Supabase Storage 버킷 설정 확인
   - 환경 변수 확인

## 6. 대안: URL만 사용

Storage 설정이 어려운 경우, URL 입력만 사용할 수도 있습니다:

1. 이미지를 다른 곳에 업로드 (Imgur, Cloudinary 등)
2. 이미지 URL 복사
3. "이미지 URL 직접 입력" 필드에 붙여넣기

## 7. 추천: Imgur를 임시로 사용

Supabase Storage 설정 전까지 Imgur를 사용할 수 있습니다:

1. https://imgur.com/upload 접속
2. 이미지 업로드
3. 업로드된 이미지 우클릭 → "이미지 주소 복사"
4. URL 입력 필드에 붙여넣기
