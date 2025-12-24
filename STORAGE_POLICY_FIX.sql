-- Supabase Storage Policy 설정
-- Supabase Dashboard > Storage > gallery-images > Policies에서 실행

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;

-- 1. 업로드 허용 정책
CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'gallery-images');

-- 2. 읽기 허용 정책
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- 3. 삭제 허용 정책 (선택사항)
CREATE POLICY "Allow public deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'gallery-images');

-- 4. 업데이트 허용 정책 (선택사항)
CREATE POLICY "Allow public updates"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'gallery-images')
WITH CHECK (bucket_id = 'gallery-images');
