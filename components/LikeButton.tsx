'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  itemId: number;
  initialLikes: number;
}

export default function LikeButton({ itemId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (liked || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/items/${itemId}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to like');

      const data = await response.json();
      setLikes(data.likes);
      setLiked(true);
    } catch (err) {
      console.error('Error liking item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
        liked 
          ? 'bg-pink-50 border-pink-200 text-pink-600' 
          : 'bg-white border-gray-200 text-gray-500 hover:border-pink-200 hover:text-pink-500'
      }`}
    >
      <Heart 
        className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} 
      />
      <span className="font-medium">{likes}</span>
    </button>
  );
}
