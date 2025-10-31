'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Smile, ImageIcon } from 'lucide-react';
import { VerifiedBadge } from './verified-badge';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
  isVerified?: boolean;
  replies?: number;
}

interface VideoCommentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: {
    username: string;
    user_avatar: string;
    description: string;
    likes: number;
    comments_count: number;
    shares: number;
    saves: number;
    comments: Comment[];
  };
}

export function VideoCommentsDialog({ open, onOpenChange, video }: VideoCommentsDialogProps) {
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(video.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[90vh] p-0 gap-0">
        <div className="flex flex-col h-full bg-white">
          <div className="p-4 border-b">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={video.user_avatar} />
                <AvatarFallback>{video.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{video.username}</span>
                    <VerifiedBadge className="w-4 h-4" />
                    <span className="text-gray-500 text-xs">0 seconds ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-4 text-emerald-500 border border-emerald-500 hover:bg-emerald-50">
                      Follow
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  {video.description.split(' ').map((word, i) => {
                    if (word.startsWith('@')) {
                      return <span key={i} className="text-gray-600 font-medium">{word} </span>;
                    }
                    if (word.startsWith('#')) {
                      return <span key={i} className="text-emerald-500">{word} </span>;
                    }
                    return <span key={i}>{word} </span>;
                  })}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <button onClick={handleLike} className="hover:text-gray-700 flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{likes}</span>
                  </button>
                  <button className="hover:text-gray-700 flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{video.comments_count}</span>
                  </button>
                  <button className="hover:text-gray-700 flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>{video.shares}</span>
                  </button>
                  <button onClick={() => setIsSaved(!isSaved)} className="ml-auto hover:text-gray-700">
                    <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                    <span className="ml-1">{video.saves}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {video.comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.username}</span>
                      {comment.isVerified && (
                        <VerifiedBadge className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 break-words">
                      {comment.text.split(' ').map((word, i) => {
                        if (word.startsWith('@')) {
                          return <span key={i} className="text-gray-600 font-medium">{word} </span>;
                        }
                        if (word.startsWith('#')) {
                          return <span key={i} className="text-emerald-500">{word} </span>;
                        }
                        return <span key={i}>{word} </span>;
                      })}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{comment.timestamp}</span>
                      <button className="hover:text-gray-700 flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="hover:text-gray-700">Reply</button>
                    </div>
                    {comment.replies && comment.replies > 0 && (
                      <button className="text-xs text-gray-500 hover:text-gray-700 mt-2 flex items-center gap-1">
                        — View {comment.replies} replies
                      </button>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t">
            <div className="p-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <button className="hover:text-gray-600">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button className="hover:text-gray-600">
                  <Smile className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1 text-sm outline-none"
                />
                <button
                  className={`${comment.trim() ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-400'} transition-colors`}
                  disabled={!comment.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
