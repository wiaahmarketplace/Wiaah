'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
  onReact: (emoji: string) => void;
  onUnreact: (emoji: string) => void;
  isUser: boolean;
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👍', '👏'];

export function MessageReactions({
  messageId,
  reactions,
  onReact,
  onUnreact,
  isUser,
}: MessageReactionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReactionClick = (emoji: string) => {
    const existingReaction = reactions.find((r) => r.emoji === emoji);
    if (existingReaction?.userReacted) {
      onUnreact(emoji);
    } else {
      onReact(emoji);
    }
    setIsOpen(false);
  };

  const hasReactions = reactions.length > 0 && reactions.some((r) => r.count > 0);

  return (
    <div className={cn('flex items-center gap-2', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {hasReactions && (
        <div
          className={cn(
            'flex items-center gap-1 bg-white border rounded-full px-2 py-1 shadow-sm',
            isUser ? '' : ''
          )}
        >
          {reactions
            .filter((r) => r.count > 0)
            .map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReactionClick(reaction.emoji)}
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-colors text-sm',
                  reaction.userReacted
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'hover:bg-gray-100'
                )}
              >
                <span className="text-base">{reaction.emoji}</span>
                {reaction.count > 1 && (
                  <span
                    className={cn(
                      'text-xs font-medium',
                      reaction.userReacted ? 'text-blue-600' : 'text-gray-600'
                    )}
                  >
                    {reaction.count}
                  </span>
                )}
              </button>
            ))}
        </div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded-full">
            <Smile className="w-4 h-4 text-gray-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side={isUser ? 'left' : 'right'}
          className="w-auto p-2 bg-white border shadow-lg"
        >
          <div className="flex gap-1">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors hover:scale-125 transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
