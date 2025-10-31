'use client';

import { cn } from '@/lib/utils';

interface EmojiMessageProps {
  emoji: string;
  isUser: boolean;
  time: string;
}

export function EmojiMessage({ emoji, isUser, time }: EmojiMessageProps) {
  return (
    <div className="flex flex-col">
      <div className={cn('text-7xl', isUser ? 'text-right' : 'text-left')}>
        {emoji}
      </div>
      <span className="text-xs text-gray-500 mt-1">{time}</span>
    </div>
  );
}
