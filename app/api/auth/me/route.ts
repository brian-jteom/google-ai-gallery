import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  const supabase = createServerClient();
  const { data: user } = await supabase
    .from('tb_ai_gallery_users')
    .select('id, email, nickname')
    .eq('id', session.userId)
    .single();

  return NextResponse.json({ user });
}
