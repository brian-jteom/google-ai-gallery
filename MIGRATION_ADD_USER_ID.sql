-- Add user_id column for authenticated users
ALTER TABLE tb_ai_gallery_items 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Comment on column
COMMENT ON COLUMN tb_ai_gallery_items.user_id IS 'Supabase Auth User ID';

-- Index for performance (filtering by user)
CREATE INDEX IF NOT EXISTS idx_gallery_items_user_id ON tb_ai_gallery_items(user_id);
