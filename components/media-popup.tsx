'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart, MessageCircle, Send, ChevronLeft, ChevronRight, MoreHorizontal, Image as ImageIcon, Smile, Link2, AlertCircle, Flag, Trash2, Edit, Share2, ExternalLink, User, Loader2 } from 'lucide-react';
import { Image as ImageType } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmojiPicker } from '@/components/emoji-picker';
import { ShareDialog } from '@/components/share-dialog';
import { ReportPostDialog } from '@/components/report-post-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { followUser, unfollowUser, checkIsFollowing } from '@/lib/follow-service';

interface MediaPopupProps {
  image: ImageType;
  type?: 'image' | 'video';
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

interface Reply {
  id: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
  verified: boolean;
  isLiked?: boolean;
}

interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  replies: number;
  timestamp: string;
  verified: boolean;
  isLiked?: boolean;
  replyList?: Reply[];
}

export function MediaPopup({
  image,
  type = 'image',
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: MediaPopupProps) {
  const router = useRouter();
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [comment, setComment] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [showHashtagDropdown, setShowHashtagDropdown] = useState(false);
  const [hashtagSearch, setHashtagSearch] = useState('');
  const [hashtagPosition, setHashtagPosition] = useState(0);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isOwnPost, setIsOwnPost] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUserPopover, setShowUserPopover] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [userId] = useState<string>('d7b2c8e0-1234-5678-90ab-cdef12345678'); // Mock user ID for johndoe
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      username: 'johndoe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: 'Absolutely love how detailed this explanation is! 🙌 I was stuck on this exact problem for hours. #JavaScript #DevTips',
      likes: 87,
      replies: 12,
      timestamp: '0 seconds ago',
      verified: true,
      isLiked: false,
      replyList: [
        {
          id: '1-1',
          username: 'alexsmith',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
          text: 'Glad it helped! Let me know if you have any questions.',
          likes: 24,
          timestamp: '5 minutes ago',
          verified: true,
          isLiked: false,
        },
        {
          id: '1-2',
          username: 'sarahconnor',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
          text: 'Same here! This saved me so much time 🙏',
          likes: 15,
          timestamp: '10 minutes ago',
          verified: false,
          isLiked: false,
        },
        {
          id: '1-3',
          username: 'mikejohnson',
          avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
          text: 'Great explanation! Could you do one on async/await next?',
          likes: 8,
          timestamp: '15 minutes ago',
          verified: true,
          isLiked: false,
        },
      ],
    },
    {
      id: '2',
      username: 'janedoe',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: 'Nice breakdown! 🔥 I tried this with #React and it worked flawlessly. Curious though — have you tested this approach with #NextJS?',
      likes: 54,
      replies: 8,
      timestamp: '0 seconds ago',
      verified: false,
      isLiked: false,
      replyList: [
        {
          id: '2-1',
          username: 'techguru',
          avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
          text: 'Yes, it works perfectly with #NextJS! Just tested it yesterday.',
          likes: 19,
          timestamp: '3 minutes ago',
          verified: true,
          isLiked: false,
        },
        {
          id: '2-2',
          username: 'davidwilson',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
          text: 'I had some issues with server components but fixed it with "use client"',
          likes: 12,
          timestamp: '8 minutes ago',
          verified: true,
          isLiked: false,
        },
      ],
    },
    {
      id: '3',
      username: 'techguru',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: 'Thanks for sharing this! 🙏 I\'ve been working on something similar for a #Python backend. @alexsmith do you think this can scale well for production?',
      likes: 33,
      replies: 5,
      timestamp: '0 seconds ago',
      verified: true,
      isLiked: false,
      replyList: [
        {
          id: '3-1',
          username: 'alexsmith',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
          text: '@techguru Absolutely! We use it in production handling millions of requests.',
          likes: 28,
          timestamp: '2 minutes ago',
          verified: true,
          isLiked: false,
        },
        {
          id: '3-2',
          username: 'emilydavis',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
          text: 'Make sure you add proper error handling and monitoring!',
          likes: 11,
          timestamp: '6 minutes ago',
          verified: false,
          isLiked: false,
        },
      ],
    },
  ]);

  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockUsers = [
    { id: '1', username: 'alexsmith', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', verified: true },
    { id: '2', username: 'sarahconnor', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', verified: false },
    { id: '3', username: 'mikejohnson', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100', verified: true },
    { id: '4', username: 'emilydavis', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', verified: false },
    { id: '5', username: 'davidwilson', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100', verified: true },
    { id: '6', username: 'lisabrown', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100', verified: false },
  ];

  const mockHashtags = [
    { id: '1', name: 'JavaScript', posts: '2.5M' },
    { id: '2', name: 'React', posts: '1.8M' },
    { id: '3', name: 'NextJS', posts: '850K' },
    { id: '4', name: 'TypeScript', posts: '1.2M' },
    { id: '5', name: 'WebDev', posts: '3.1M' },
    { id: '6', name: 'Programming', posts: '4.2M' },
    { id: '7', name: 'Coding', posts: '2.9M' },
    { id: '8', name: 'DevTips', posts: '650K' },
    { id: '9', name: 'Frontend', posts: '890K' },
    { id: '10', name: 'Backend', posts: '720K' },
    { id: '11', name: 'FullStack', posts: '940K' },
    { id: '12', name: 'Python', posts: '2.1M' },
    { id: '13', name: 'NodeJS', posts: '1.1M' },
    { id: '14', name: 'CSS', posts: '1.5M' },
    { id: '15', name: 'HTML', posts: '1.3M' },
  ];

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoad = () => {
      const naturalWidth =
        type === 'image'
          ? (media as HTMLImageElement).naturalWidth
          : (media as HTMLVideoElement).videoWidth;
      const naturalHeight =
        type === 'image'
          ? (media as HTMLImageElement).naturalHeight
          : (media as HTMLVideoElement).videoHeight;

      if (!naturalWidth || !naturalHeight) return;

      setImageSize({ width: naturalWidth, height: naturalHeight });
    };

    if (type === 'image') {
      if ((media as HTMLImageElement).complete) {
        handleLoad();
      } else {
        (media as HTMLImageElement).onload = handleLoad;
      }
    } else {
      (media as HTMLVideoElement).onloadedmetadata = handleLoad;
    }
  }, [image.image_url, type]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) onPrevious();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

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

  const aspectRatio = imageSize.width && imageSize.height ? imageSize.width / imageSize.height : 1;
  const commentsPanelWidthPercent = 30;
  const mediaWidthPercent = 70;

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const commentsPanelWidth = (windowWidth * commentsPanelWidthPercent) / 100;
  const availableWidth = (windowWidth * mediaWidthPercent) / 100 - 100;
  const availableHeight = windowHeight * 0.9;

  let imageWidth = imageSize.width;
  let imageHeight = imageSize.height;

  if (imageWidth > availableWidth) {
    imageWidth = availableWidth;
    imageHeight = imageWidth / aspectRatio;
  }
  if (imageHeight > availableHeight) {
    imageHeight = availableHeight;
    imageWidth = imageHeight * aspectRatio;
  }

  const handleHashtagClick = (hashtag: string) => {
    const hashtagName = hashtag.replace('#', '');
    router.push(`/hashtag/${hashtagName}`);
  };

  const handleMentionClick = (mention: string) => {
    const username = mention.replace('@', '');
    router.push(`/profile/${username}`);
  };

  const handleProfileClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(c =>
        c.id === commentId
          ? {
              ...c,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments(prevComments =>
      prevComments.map(c =>
        c.id === commentId && c.replyList
          ? {
              ...c,
              replyList: c.replyList.map(r =>
                r.id === replyId
                  ? {
                      ...r,
                      isLiked: !r.isLiked,
                      likes: r.isLiked ? r.likes - 1 : r.likes + 1,
                    }
                  : r
              ),
            }
          : c
      )
    );
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleReplyClick = () => {
    commentInputRef.current?.focus();
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setComment(value);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPosition);

    // Check for @ mentions
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');

    if (lastAtIndex !== -1 && lastAtIndex > lastHashIndex) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('#')) {
        setShowMentionDropdown(true);
        setShowHashtagDropdown(false);
        setMentionSearch(textAfterAt.toLowerCase());
        setMentionPosition(lastAtIndex);
      } else {
        setShowMentionDropdown(false);
      }
    } else if (lastHashIndex !== -1 && lastHashIndex > lastAtIndex) {
      const textAfterHash = textBeforeCursor.slice(lastHashIndex + 1);
      if (!textAfterHash.includes(' ') && !textAfterHash.includes('@')) {
        setShowHashtagDropdown(true);
        setShowMentionDropdown(false);
        setHashtagSearch(textAfterHash.toLowerCase());
        setHashtagPosition(lastHashIndex);
      } else {
        setShowHashtagDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
      setShowHashtagDropdown(false);
    }
  };

  const handleMentionSelect = (username: string) => {
    const beforeMention = comment.slice(0, mentionPosition);
    const afterMention = comment.slice(mentionPosition).replace(/@\w*/, `@${username} `);
    setComment(beforeMention + afterMention);
    setShowMentionDropdown(false);
    commentInputRef.current?.focus();
  };

  const handleHashtagSelect = (hashtag: string) => {
    const beforeHashtag = comment.slice(0, hashtagPosition);
    const afterHashtag = comment.slice(hashtagPosition).replace(/#\w*/, `#${hashtag} `);
    setComment(beforeHashtag + afterHashtag);
    setShowHashtagDropdown(false);
    commentInputRef.current?.focus();
  };

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(mentionSearch)
  );

  const filteredHashtags = mockHashtags.filter(hashtag =>
    hashtag.name.toLowerCase().includes(hashtagSearch)
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const cursorPosition = commentInputRef.current?.selectionStart || comment.length;
    const newComment = comment.slice(0, cursorPosition) + emoji + comment.slice(cursorPosition);
    setComment(newComment);
    setShowEmojiPicker(false);
    commentInputRef.current?.focus();
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyLink = () => {
    const postLink = `${window.location.origin}/post/${image.id}`;
    navigator.clipboard.writeText(postLink);
    toast.success('Link copied to clipboard');
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleNotInterested = () => {
    toast.success('We\'ll show you less like this');
  };

  const handleReport = () => {
    setShowReportDialog(true);
  };

  const handleGoToPost = () => {
    router.push(`/post/${image.id}`);
    onClose();
  };

  const handleEditPost = () => {
    toast.info('Edit post feature coming soon');
  };

  const handleDeletePost = () => {
    toast.success('Post deleted successfully');
    onClose();
  };

  const renderCommentText = (text: string) => {
    return text.split(' ').map((word, idx) => {
      if (word.startsWith('#')) {
        return (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              handleHashtagClick(word);
            }}
            className="text-emerald-600 font-medium hover:underline cursor-pointer"
          >
            {word}{' '}
          </button>
        );
      }
      if (word.startsWith('@')) {
        return (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              handleMentionClick(word);
            }}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            {word}{' '}
          </button>
        );
      }
      return word + ' ';
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 left-6 text-white hover:text-gray-300 transition-colors z-50"
      >
        <X className="h-8 w-8" />
      </button>

      <div className="flex items-center justify-center h-full" style={{ paddingRight: `${commentsPanelWidth}px` }}>
        <div className="relative flex items-center justify-center">
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious?.();
              }}
              className="absolute -left-16 bg-gray-800/50 hover:bg-gray-700/70 text-white p-3 rounded-full transition-all z-40"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div
            className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: `${imageWidth}px`,
              height: `${imageHeight}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {type === 'image' ? (
              <img
                ref={mediaRef as React.RefObject<HTMLImageElement>}
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                src={image.image_url}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            )}

            <div className="absolute bottom-6 left-6 z-30">
              <Popover open={showUserPopover} onOpenChange={setShowUserPopover}>
                <PopoverTrigger asChild>
                  <button
                    className="bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform"
                  >
                    <User className="h-5 w-5 text-gray-700" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 p-4"
                  side="top"
                  align="start"
                >
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        handleProfileClick('johndoe');
                        setShowUserPopover(false);
                      }}
                      className="flex items-center gap-3 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <p className="font-semibold text-sm truncate">johndoe</p>
                          <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-500">John Doe</p>
                      </div>
                    </button>
                    <div className="px-2 py-1 text-xs text-gray-600">
                      <p>Posted 0 seconds ago</p>
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
          </div>

          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext?.();
              }}
              className="absolute -right-16 bg-gray-800/50 hover:bg-gray-700/70 text-white p-3 rounded-full transition-all z-40"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      <div
        className="fixed right-0 top-0 h-full bg-white shadow-2xl flex flex-col"
        style={{ width: `${commentsPanelWidth}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <button
            onClick={() => handleProfileClick('johndoe')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">johndoe</p>
                <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-xs text-gray-500">0 seconds ago</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button className="px-5 py-1.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Suivre
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isOwnPost ? (
                  <>
                    <DropdownMenuItem onClick={handleEditPost} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeletePost} className="cursor-pointer text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete post</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleNotInterested} className="cursor-pointer">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      <span>Not interested</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleGoToPost} className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Go to post</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                  <Link2 className="mr-2 h-4 w-4" />
                  <span>Copy link</span>
                </DropdownMenuItem>
                {!isOwnPost && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleReport} className="cursor-pointer text-red-600">
                      <Flag className="mr-2 h-4 w-4" />
                      <span>Report</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50">
          {comments.map((commentItem) => (
            <div key={commentItem.id} className="space-y-2">
              <div className="flex gap-3">
                <button
                  onClick={() => handleProfileClick(commentItem.username)}
                  className="flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={commentItem.avatar} />
                    <AvatarFallback>{commentItem.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => handleProfileClick(commentItem.username)}
                      className="font-semibold text-sm hover:underline"
                    >
                      {commentItem.username}
                    </button>
                    {commentItem.verified && (
                      <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span className="text-xs text-gray-500">{commentItem.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-800 break-words leading-relaxed">
                    {renderCommentText(commentItem.text)}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => handleLikeComment(commentItem.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        commentItem.isLiked
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${commentItem.isLiked ? 'fill-current' : ''}`}
                      />
                      <span className="text-xs font-medium">{commentItem.likes}</span>
                    </button>
                    <button
                      onClick={handleReplyClick}
                      className="text-emerald-500 hover:text-emerald-600 text-xs font-medium flex items-center gap-1"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Reply
                    </button>
                  </div>
                  {commentItem.replies > 0 && (
                    <button
                      onClick={() => toggleReplies(commentItem.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 mt-2 font-medium"
                    >
                      {expandedComments.has(commentItem.id)
                        ? `– Hide ${commentItem.replies} replies`
                        : `– View ${commentItem.replies} replies`}
                    </button>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {expandedComments.has(commentItem.id) && commentItem.replyList && (
                <div className="ml-12 mt-3 space-y-4">
                  {commentItem.replyList.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <button
                        onClick={() => handleProfileClick(reply.username)}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.avatar} />
                          <AvatarFallback>{reply.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => handleProfileClick(reply.username)}
                            className="font-semibold text-sm hover:underline"
                          >
                            {reply.username}
                          </button>
                          {reply.verified && (
                            <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="10" />
                              <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          <span className="text-xs text-gray-500">{reply.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-800 break-words leading-relaxed">
                          {renderCommentText(reply.text)}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <button
                            onClick={() => handleLikeReply(commentItem.id, reply.id)}
                            className={`flex items-center gap-1 transition-colors ${
                              reply.isLiked
                                ? 'text-red-500'
                                : 'text-gray-500 hover:text-red-500'
                            }`}
                          >
                            <Heart
                              className={`h-3.5 w-3.5 ${reply.isLiked ? 'fill-current' : ''}`}
                            />
                            <span className="text-xs font-medium">{reply.likes}</span>
                          </button>
                          <button
                            onClick={handleReplyClick}
                            className="text-emerald-500 hover:text-emerald-600 text-xs font-medium flex items-center gap-1"
                          >
                            <MessageCircle className="h-3 w-3" />
                            Reply
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t bg-white p-4 relative">
          {showMentionDropdown && filteredUsers.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-64 overflow-y-auto z-50">
              <div className="p-2 border-b bg-gray-50">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={mentionSearch}
                  onChange={(e) => setMentionSearch(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 transition-colors"
                  autoFocus
                />
              </div>
              <div className="py-2">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleMentionSelect(user.username)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{user.username}</span>
                        {user.verified && (
                          <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">@{user.username}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showHashtagDropdown && filteredHashtags.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-64 overflow-y-auto z-50">
              <div className="p-2 border-b bg-gray-50">
                <input
                  type="text"
                  placeholder="Search hashtags..."
                  value={hashtagSearch}
                  onChange={(e) => setHashtagSearch(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 transition-colors"
                  autoFocus
                />
              </div>
              <div className="py-2">
                {filteredHashtags.map((hashtag) => (
                  <button
                    key={hashtag.id}
                    onClick={() => handleHashtagSelect(hashtag.name)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">#</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm">#{hashtag.name}</div>
                        <span className="text-xs text-gray-500">{hashtag.posts} posts</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {uploadedImage && (
            <div className="mb-3 relative inline-block">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="max-h-32 rounded-lg border border-gray-200"
              />
              <button
                onClick={removeUploadedImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ImageIcon className="h-6 w-6" />
            </button>
            <input
              ref={commentInputRef}
              type="text"
              placeholder="Type a message"
              value={comment}
              onChange={handleCommentChange}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:bg-gray-200 transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && comment.trim() && !showMentionDropdown && !showHashtagDropdown) {
                  setComment('');
                  setUploadedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }
                if (e.key === 'Escape') {
                  setShowMentionDropdown(false);
                  setShowHashtagDropdown(false);
                  setShowEmojiPicker(false);
                }
              }}
            />
            <div className="relative">
              {showEmojiPicker && (
                <EmojiPicker
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
              <button
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowMentionDropdown(false);
                  setShowHashtagDropdown(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Smile className="h-6 w-6" />
              </button>
            </div>
            <button
              className="p-2.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50"
              disabled={!comment.trim() && !uploadedImage}
              onClick={() => {
                if (comment.trim() || uploadedImage) {
                  setComment('');
                  setUploadedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }
              }}
            >
              <Send className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/post/${image.id}`}
        title={image.title}
      />

      <ReportPostDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
      />
    </div>
  );
}
