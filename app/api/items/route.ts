import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { itemCreateSchema } from '@/lib/schemas';
import type { GalleryItem, GalleryItemCreate } from '@/lib/types';

// GET /api/items - List items with optional filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '24'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);

    const supabase = createServerClient();

    let query = supabase
      .from('tb_ai_gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    if (q) {
      query = query.ilike('title', `%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch items' },
        { status: 500 }
      );
    }

    return NextResponse.json(data as GalleryItem[]);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = itemCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const itemData: GalleryItemCreate = validationResult.data;
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('tb_ai_gallery_items')
      .insert(itemData)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 400 }
      );
    }

    return NextResponse.json(data as GalleryItem, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
