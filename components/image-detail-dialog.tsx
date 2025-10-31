'use client';

import { Image as ImageType } from '@/lib/mock-data';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerifiedBadge } from './verified-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Smile, X, ImageIcon, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Trash2, Flag, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  replies: number;
  timestamp: string;
  isVerified?: boolean;
}

interface ImageDetailDialogProps {
  image: ImageType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const mockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    username: 'johndoe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: '@janedoe This is the first sample comment. This is the first sample comment,This is the first sample comment, This is the first sample comment, This i #react #typescript #python ...',
    likes: 42,
    replies: 10,
    timestamp: '0 seconds ago',
    isVerified: true,
  },
  {
    id: '2',
    userId: '2',
    username: 'janedoe',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: '@janedoe This is the second sample comment. #react #typescript #python',
    likes: 28,
    replies: 5,
    timestamp: '0s ago',
  },
  {
    id: '3',
    userId: '3',
    username: 'alexsmith',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: '@janedoe This is the third sample',
    likes: 15,
    replies: 2,
    timestamp: '1m ago',
    isVerified: true,
  },
];

export function ImageDetailDialog({ image, open, onOpenChange, onNext, onPrevious }: ImageDetailDialogProps) {
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(42);

  const handleDelete = () => {
    console.log('Delete post');
  };

  const handleReport = () => {
    console.log('Report post');
  };

  const handleShare = () => {
    console.log('Share post');
  };

  const handleComment = () => {
    console.log('Comment on post');
  };

  if (!image) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0 bg-white">
        <div className="flex h-full relative">
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 text-white hover:bg-white/20 z-10"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm">username</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            className="absolute right-[470px] top-4 text-white hover:bg-white/20 z-20 rounded-full bg-black/50 backdrop-blur-sm"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            className="absolute right-[470px] bottom-4 text-white hover:bg-white/20 z-20 rounded-full bg-black/50 backdrop-blur-sm"
          >
            <ChevronDown className="h-6 w-6" />
          </Button>

          <div className="w-[450px] flex flex-col bg-white border-l">
            <div className="p-4 border-b">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">johndoe</span>
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
                    <span className="text-gray-600 font-medium">@janedoe</span> This is the first sample comment. This is the first sample comment,This is the first sample comment, This is the first sample comment, This i <span className="text-emerald-500">#react #typescript #python</span> ...
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <button onClick={handleLike} className="hover:text-gray-700 flex items-center gap-1">
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{likes}</span>
                    </button>
                    <button className="hover:text-gray-700 flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>10</span>
                    </button>
                    <button className="hover:text-gray-700 flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span>15</span>
                    </button>
                    <button onClick={() => setIsSaved(!isSaved)} className="ml-auto hover:text-gray-700">
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                      <span className="ml-1">15</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {mockComments.map((comment) => (
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
                      {comment.replies > 0 && (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
