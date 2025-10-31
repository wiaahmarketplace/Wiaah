'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, ChevronLeft, ChevronRight, Pause, Play, Heart, Send, Volume2, VolumeX, User, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { OptimizedVideo } from './optimized-video';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { followUser, unfollowUser, checkIsFollowing } from '@/lib/follow-service';
import { toast } from 'sonner';

interface Story {
  id: string;
  image_url: string;
  username: string;
  avatar: string;
  timestamp: string;
  type?: 'image' | 'video';
  postId?: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewPost?: (postId: string) => void;
}

export function StoryViewer({ stories, initialIndex, open, onOpenChange, onViewPost }: StoryViewerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showViewPost, setShowViewPost] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [userId] = useState<string>('d7b2c8e0-1234-5678-90ab-cdef12345678'); // Mock user ID for johndoe
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStory = stories[currentIndex];
  const storyDuration = 5000;

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
    setMessage('');
    setIsLiked(false);
    setShowViewPost(false);
  }, [initialIndex, open]);

  useEffect(() => {
    if (videoRef.current) {
      if (open && !isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [open, isPaused, currentIndex]);

  useEffect(() => {
    if (!open || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + (100 / (storyDuration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, open, isPaused]);

  useEffect(() => {
    // Check if current user is following this profile
    const loadFollowStatus = async () => {
      if (userId) {
        const following = await checkIsFollowing(userId);
        setIsFollowing(following);
      }
    };
    loadFollowStatus();
  }, [userId]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onOpenChange(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
      setMessage('');
      setIsLiked(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleViewPost = () => {
    if (currentStory.postId) {
      router.push(`/post/${currentStory.postId}`);
      onOpenChange(false);
    }
  };

  const handleProfileClick = () => {
    router.push(`/profile/${currentStory.username}`);
    onOpenChange(false);
  };

  if (!currentStory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-screen h-screen p-0 gap-0 bg-black border-0 rounded-none overflow-hidden">
        <div className="relative h-full w-full flex items-center justify-center bg-black">
          <div className="relative max-w-md w-full h-[95vh] flex flex-col bg-black rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-20 p-4">
            <div className="flex gap-1 mb-3">
              {stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={handleProfileClick}>
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={currentStory.avatar} />
                  <AvatarFallback>{currentStory.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <p className="font-semibold text-sm hover:underline">{currentStory.username}</p>
                  <p className="text-xs opacity-80">{currentStory.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            </div>

            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {currentIndex < stories.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              {currentStory.type === 'video' ? (
                <>
                  <OptimizedVideo
                    ref={videoRef}
                    src={currentStory.image_url}
                    className="w-full h-full"
                    loop
                    muted={isMuted}
                    playsInline
                    autoPlay
                    priority
                    maxWidth={1080}
                    maxHeight={1920}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-20 right-4 text-white hover:bg-white/20 z-10 bg-black/30 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                </>
              ) : (
                <img
                  src={currentStory.image_url}
                  alt="Story"
                  className="w-full h-full object-contain"
                />
              )}
              {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <Pause className="h-16 w-16 text-white" fill="white" />
                  </div>
                </div>
              )}
              {showViewPost && currentStory.postId && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPost();
                    }}
                    className="bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-semibold transition-all pointer-events-auto shadow-lg"
                  >
                    View Post
                  </button>
                </div>
              )}
            </div>

            <div
              className="absolute inset-0 flex pointer-events-none"
              style={{ top: '80px', bottom: '80px' }}
            >
              <div
                className="flex-1 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              />
              <div
                className="flex-1 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                  setShowViewPost(!showViewPost);
                }}
              />
              <div
                className="flex-1 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              />
            </div>

            <div className="absolute bottom-6 left-6 z-30">
              <Popover open={showUserPopover} onOpenChange={setShowUserPopover}>
                <PopoverTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 p-4"
                  side="top"
                  align="start"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/profile/${currentStory.username}`);
                        setShowUserPopover(false);
                      }}
                      className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={currentStory.avatar} />
                        <AvatarFallback>{currentStory.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm truncate">{currentStory.username}</p>
                          <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">John Doe</p>
                      </div>
                    </button>
                    <div className="px-2 py-1 text-xs text-gray-600">
                      <p>Posted {currentStory.timestamp}</p>
                    </div>
                    <Button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setIsFollowLoading(true);
                        try {
                          if (isFollowing) {
                            const result = await unfollowUser(userId);
                            if (result.success) {
                              setIsFollowing(false);
                              toast.success('Unfollowed successfully');
                            } else {
                              toast.error(result.error || 'Failed to unfollow');
                            }
                          } else {
                            const result = await followUser(userId);
                            if (result.success) {
                              setIsFollowing(true);
                              toast.success('Following successfully');
                            } else {
                              toast.error(result.error || 'Failed to follow');
                            }
                          }
                        } catch (error) {
                          toast.error('An error occurred');
                        } finally {
                          setIsFollowLoading(false);
                        }
                      }}
                      disabled={isFollowLoading}
                      className={`w-full ${
                        isFollowing
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                          : 'bg-black hover:bg-gray-800 text-white'
                      }`}
                    >
                      {isFollowLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {isFollowing ? 'Unfollowing...' : 'Following...'}
                        </>
                      ) : (
                        isFollowing ? 'Following' : 'Follow'
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Send message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-transparent border border-white/50 rounded-full px-4 py-2 text-white placeholder-white/70 text-sm outline-none focus:border-white"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLiked(!isLiked);
                  }}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                >
                  <Heart
                    className={`h-7 w-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                  />
                </button>
                {message.trim() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendMessage();
                    }}
                    className="flex-shrink-0"
                  >
                    <Send className="h-6 w-6 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
