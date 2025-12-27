-- Create users table
CREATE TABLE IF NOT EXISTS tb_ai_gallery_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user_id to items table if not exists (covering previous migration)
ALTER TABLE tb_ai_gallery_items 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES tb_ai_gallery_users(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gallery_users_email ON tb_ai_gallery_users(email);
CREATE INDEX IF NOT EXISTS idx_gallery_items_user_id ON tb_ai_gallery_items(user_id);

-- Comments
COMMENT ON TABLE tb_ai_gallery_users IS 'Custom auth users table';
COMMENT ON COLUMN tb_ai_gallery_users.email IS 'User login email';
COMMENT ON COLUMN tb_ai_gallery_users.password_hash IS 'Bcrypt hashed password';
