-- Add new columns for anonymous user features
ALTER TABLE tb_ai_gallery_items 
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS password TEXT,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Comment on columns
COMMENT ON COLUMN tb_ai_gallery_items.nickname IS 'User nickname for anonymous posts';
COMMENT ON COLUMN tb_ai_gallery_items.password IS 'Simple password for editing/deleting anonymous posts';
COMMENT ON COLUMN tb_ai_gallery_items.view_count IS 'Number of views';
COMMENT ON COLUMN tb_ai_gallery_items.like_count IS 'Number of likes';
