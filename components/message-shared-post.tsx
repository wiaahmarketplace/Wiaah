'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StoryViewer } from './story-viewer';

interface SharedPostProps {
  postId: string;
  postType: 'post' | 'story';
  thumbnail: string;
  username: string;
  userAvatar: string;
  caption?: string;
  isUser: boolean;
  time: string;
}

export function SharedPost({
  postId,
  postType,
  thumbnail,
  username,
  userAvatar,
  caption,
  isUser,
  time,
}: SharedPostProps) {
  const router = useRouter();
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  const handleClick = () => {
    if (postType === 'post') {
      router.push(`/post/${postId}`);
    } else if (postType === 'story') {
      setShowStoryViewer(true);
    }
  };

  const story = {
    id: postId,
    image_url: thumbnail,
    username: username,
    avatar: userAvatar,
    timestamp: time,
    type: 'image' as const,
  };

  return (
    <>
      <div className="flex flex-col">
        <div
          className={cn(
            'rounded-2xl overflow-hidden max-w-sm border cursor-pointer hover:bg-gray-50 transition-colors',
            isUser ? 'bg-gray-50' : 'bg-white'
          )}
          onClick={handleClick}
        >
          <div className="p-3 flex items-center gap-2 border-b">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-900">@{username}</span>
          </div>

          <div className="relative aspect-square bg-gray-100">
            <img
              src={thumbnail}
              alt={`${postType} by ${username}`}
              className="w-full h-full object-cover"
            />
            {postType === 'story' && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            )}
          </div>

          {caption && (
            <div className="p-3">
              <p className="text-sm text-gray-900 line-clamp-2">{caption}</p>
            </div>
          )}

          <div className="px-3 pb-3">
            <span className="text-xs text-gray-500">
              {postType === 'story' ? 'Story' : 'Post'}
            </span>
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1">{time}</span>
      </div>

      {postType === 'story' && (
        <StoryViewer
          stories={[story]}
          initialIndex={0}
          open={showStoryViewer}
          onOpenChange={setShowStoryViewer}
        />
      )}
    </>
  );
}
