import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initDatabase() {
  console.log('🚀 Initializing database...');

  const sql = `
    CREATE TABLE IF NOT EXISTS tb_ai_gallery_items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      link TEXT NOT NULL,
      category VARCHAR(60) NOT NULL,
      description VARCHAR(500),
      tags TEXT[],
      thumbnail_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_items_category ON tb_ai_gallery_items(category);
    CREATE INDEX IF NOT EXISTS idx_items_created_at ON tb_ai_gallery_items(created_at DESC);

    ALTER TABLE tb_ai_gallery_items DISABLE ROW LEVEL SECURITY;
  `;

  try {
    // Supabase REST API로는 DDL 실행 불가
    // Supabase Dashboard에서 SQL Editor 사용 필요
    console.log('❌ Cannot execute DDL via REST API');
    console.log('');
    console.log('📋 Please run this SQL in Supabase Dashboard > SQL Editor:');
    console.log('');
    console.log(sql);
    console.log('');
    console.log('🔗 https://jzuyjjmettaezgsnapxc.supabase.co/project/_/sql');
  } catch (error) {
    console.error('Error:', error);
  }
}

initDatabase();
