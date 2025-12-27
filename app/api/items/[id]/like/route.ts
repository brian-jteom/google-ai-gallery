import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = createServerClient();

    // 1. Get current like count
    const { data: item, error: fetchError } = await supabase
      .from('tb_ai_gallery_items')
      .select('like_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // 2. Increment like count
    const currentLikes = item.like_count || 0;
    const { data, error: updateError } = await supabase
      .from('tb_ai_gallery_items')
      .update({ like_count: currentLikes + 1 })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update like count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      likes: data.like_count 
    });
  } catch (error) {
    console.error('Error liking item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
