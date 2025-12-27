// Shared types for frontend and backend

export interface GalleryItem {
  id: number;
  title: string;
  link: string;
  category: string;
  purpose?: string | null;
  description?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
  created_at: string;
  nickname?: string | null;
  password?: string | null;
  view_count?: number;
  like_count?: number;
  user_id?: string | null;
}

export interface GalleryItemCreate {
  title: string;
  link: string;
  category: string;
  purpose?: string | null;
  description?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
  nickname?: string | null;
  password?: string | null;
  user_id?: string | null;
}

export interface YoutubeItem {
  id: number;
  title: string;
  link: string;
  category: string;
  purpose?: string | null;
  description?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
  created_at: string;
}

export interface YoutubeItemCreate {
  title: string;
  link: string;
  category: string;
  purpose?: string | null;
  description?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
}

export interface BlogItem {
  id: number;
  title: string;
  link: string;
  category: string;
  purpose?: string | null;
  description?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
  created_at: string;
}

export interface BlogItemCreate {
  title: string;
  link: string;
  category: string;
  purpose?: string | null;
  description?: string | null;
  tags?: string[] | null;
  thumbnail_url?: string | null;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
