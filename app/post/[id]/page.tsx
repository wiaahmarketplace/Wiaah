'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart, MessageCircle, Share2, MapPin, Send, Bookmark, Smile, ChevronLeft, ChevronRight, MoreVertical, ExternalLink, AlertCircle, Trash2, ImageIcon, Link2, QrCode, UserMinus, Edit, Flag } from 'lucide-react';
import { VerifiedBadge } from '@/components/verified-badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OptimizedImage } from '@/components/optimized-image';
import { mockImages } from '@/lib/mock-data';
import { toast } from 'sonner';

interface Reply {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  timestamp: string;
  isVerified?: boolean;
  isLiked?: boolean;
}

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
  isLiked?: boolean;
  replyList?: Reply[];
}

const mockReplies: { [key: string]: Reply[] } = {
  '1': [
    {
      id: 'r1-1',
      userId: '6',
      username: 'emma_wilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: '@johndoe Totally agree with you!',
      likes: 5,
      timestamp: '1m ago',
    },
    {
      id: 'r1-2',
      userId: '7',
      username: 'davidlee',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: 'This is amazing!',
      likes: 3,
      timestamp: '2m ago',
      isVerified: true,
    },
  ],
};

const mockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    username: 'johndoe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: '@janedoe This is the first sample comment. This is the first sample comment,This is the first sample comment, This is the first sample comment, This i #react #typescript #python ...',
    likes: 42,
    replies: 5,
    timestamp: '6 seconds ago',
    isVerified: true,
    replyList: mockReplies['1'],
  },
  {
    id: '2',
    userId: '2',
    username: 'janedoe',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: '@janedoe This is the second sample comment. #react #typescript #python',
    likes: 10,
    replies: 28,
    timestamp: '8s ago',
  },
  {
    id: '3',
    userId: '3',
    username: 'alexsmith',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: '@janedoe This is the third sample comment. #react #typescript #python',
    likes: 15,
    replies: 31,
    timestamp: '1m ago',
    isVerified: true,
  },
];

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(42);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});

  const post = {
    id: params.id,
    author: 'johndoe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    time: '6 seconds ago',
    description: '@janedoe This is the first sample comment. This is the first sample comment. #travel #photography',
    location: 'Paris, France',
    images: [
      'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    comments: 245,
    shares: 15,
  };

  const hasMultipleImages = post.images && post.images.length > 1;
  const displayImage = post.images[currentImageIndex];

  const handleNextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleUsernameClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const handleReplyLike = (commentId: string, replyId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId && comment.replyList) {
        return {
          ...comment,
          replyList: comment.replyList.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                isLiked: !reply.isLiked,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
              };
            }
            return reply;
          })
        };
      }
      return comment;
    }));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setCommentText(commentText + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😀', '😂', '❤️', '👍', '🔥', '✨', '🎉', '💯', '👏', '😍', '🤔', '😎', '💪', '🙌', '✅'];

  const handleHashtagClick = (hashtag: string) => {
    router.push(`/hashtag/${hashtag}`);
  };

  const handleLocationClick = (location: string) => {
    const locationSlug = location.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    router.push(`/location/${locationSlug}`);
  };

  const isOwnPost = false;

  const handleSavePost = () => {
    toast.success('Post saved to your collection');
  };

  const handleCopyLink = () => {
    const postLink = window.location.href;
    navigator.clipboard.writeText(postLink);
    toast.success('Link copied to clipboard');
  };

  const handleShareQR = () => {
    toast.info('QR code feature coming soon');
  };

  const handleUnfollow = () => {
    toast.success('Unfollowed user');
  };

  const handleNotInterested = () => {
    toast.success('We\'ll show you less like this');
  };

  const handleReport = () => {
    toast.success('Post reported. We\'ll review it shortly.');
  };

  const handleEditPost = () => {
    toast.info('Edit post feature coming soon');
  };

  const handleDeletePost = () => {
    toast.success('Post deleted successfully');
    router.push('/');
  };

  const handleReportComment = () => {
    toast.success('Comment reported. We\'ll review it shortly.');
  };

  const handleDeleteComment = () => {
    toast.success('Comment deleted successfully');
  };

  const renderTextWithMentions = (text: string) => {
    return text.split(' ').map((word, i) => {
      if (word.startsWith('@')) {
        const username = word.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
        return (
          <span
            key={i}
            className="text-gray-600 font-medium hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleUsernameClick(username);
            }}
          >
            {word}{' '}
          </span>
        );
      }
      if (word.startsWith('#')) {
        const hashtag = word.slice(1).replace(/[^a-zA-Z0-9_]/g, '');
        return (
          <span
            key={i}
            className="text-emerald-500 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleHashtagClick(hashtag);
            }}
          >
            {word}{' '}
          </span>
        );
      }
      return <span key={i}>{word} </span>;
    });
  };

  const otherPosts = mockImages.slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="relative bg-black" style={{ height: '600px' }}>
              <button
                onClick={() => router.back()}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/30 transition-colors z-10"
              >
                <X className="h-5 w-5 text-white" />
              </button>
              <img
                src={displayImage}
                alt="Post media"
                className="w-full h-full object-contain"
              />

              {hasMultipleImages && (
                <>
                  {currentImageIndex > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 rounded-full bg-black/50 backdrop-blur-sm"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  )}
                  {currentImageIndex < post.images.length - 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 rounded-full bg-black/50 backdrop-blur-sm"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {post.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'w-6 bg-white'
                            : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar
                  className="h-12 w-12 flex-shrink-0 cursor-pointer"
                  onClick={() => handleUsernameClick(post.author)}
                >
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-base cursor-pointer hover:underline"
                        onClick={() => handleUsernameClick(post.author)}
                      >
                        {post.author}
                      </span>
                      <VerifiedBadge className="w-4 h-4" />
                      <span className="text-gray-500 text-sm">{post.time}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
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
                            <DropdownMenuItem onClick={handleUnfollow} className="cursor-pointer">
                              <UserMinus className="mr-2 h-4 w-4" />
                              <span>Unfollow</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleNotInterested} className="cursor-pointer">
                              <AlertCircle className="mr-2 h-4 w-4" />
                              <span>Not interested</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem onClick={handleSavePost} className="cursor-pointer">
                          <Bookmark className="mr-2 h-4 w-4" />
                          <span>Save post</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
                          <Link2 className="mr-2 h-4 w-4" />
                          <span>Copy link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleShareQR} className="cursor-pointer">
                          <QrCode className="mr-2 h-4 w-4" />
                          <span>Share via QR code</span>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-4 ${isFollowing ? 'text-gray-700 border border-gray-300 hover:bg-gray-50' : 'text-emerald-500 border border-emerald-500 hover:bg-emerald-50'}`}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                {renderTextWithMentions(post.description)}
                {post.location && (
                  <span
                    className="text-gray-600 ml-2 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLocationClick(post.location);
                    }}
                  >
                    <MapPin className="inline w-3 h-3 mr-1" />
                    {post.location}
                  </span>
                )}
              </p>

              <div className="flex items-center gap-6 pt-3 border-t">
                <button onClick={handleLike} className="hover:text-gray-700 flex items-center gap-2">
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-sm">{likes}</span>
                </button>
                <button className="hover:text-gray-700 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="hover:text-gray-700 flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm">{post.shares}</span>
                </button>
                <button onClick={() => setIsSaved(!isSaved)} className="ml-auto hover:text-gray-700 flex items-center gap-2">
                  <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  <span className="text-sm">15</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto p-6 space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="flex items-start gap-3">
                      <Avatar
                        className="h-8 w-8 flex-shrink-0 cursor-pointer"
                        onClick={() => handleUsernameClick(comment.username)}
                      >
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-semibold text-sm cursor-pointer hover:underline"
                            onClick={() => handleUsernameClick(comment.username)}
                          >
                            {comment.username}
                          </span>
                          {comment.isVerified && (
                            <VerifiedBadge className="w-3.5 h-3.5 flex-shrink-0" />
                          )}
                          <span className="text-gray-500 text-xs">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 break-words">
                          {renderTextWithMentions(comment.text)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className="hover:text-gray-700 flex items-center gap-1"
                          >
                            <Heart className={`h-3.5 w-3.5 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span>{comment.likes}</span>
                          </button>
                          <button className="hover:text-gray-700">Reply</button>
                        </div>
                        {comment.replies > 0 && (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                          >
                            {expandedReplies[comment.id] ? '— Hide' : '— View'} {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
                          </button>
                        )}

                        {expandedReplies[comment.id] && comment.replyList && comment.replyList.length > 0 && (
                          <div className="mt-4 space-y-4">
                            {comment.replyList.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <Avatar
                                  className="h-7 w-7 flex-shrink-0 cursor-pointer"
                                  onClick={() => handleUsernameClick(reply.username)}
                                >
                                  <AvatarImage src={reply.avatar} />
                                  <AvatarFallback>{reply.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className="font-semibold text-xs cursor-pointer hover:underline"
                                      onClick={() => handleUsernameClick(reply.username)}
                                    >
                                      {reply.username}
                                    </span>
                                    {reply.isVerified && (
                                      <VerifiedBadge className="w-3 h-3 flex-shrink-0" />
                                    )}
                                    <span className="text-gray-500 text-xs">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 break-words">
                                    {renderTextWithMentions(reply.text)}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <button
                                      onClick={() => handleReplyLike(comment.id, reply.id)}
                                      className="hover:text-gray-700 flex items-center gap-1"
                                    >
                                      <Heart className={`h-3 w-3 ${reply.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                      <span>{reply.likes}</span>
                                    </button>
                                    <button className="hover:text-gray-700">Reply</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={handleReportComment} className="cursor-pointer">
                            <Flag className="mr-2 h-4 w-4" />
                            <span>Report comment</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleDeleteComment} className="cursor-pointer text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete comment</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload" className="hover:text-gray-600 cursor-pointer">
                    <ImageIcon className="h-5 w-5" />
                  </label>
                  <div className="relative">
                    <button
                      className="hover:text-gray-600"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 min-w-[200px]">
                        <div className="grid grid-cols-5 gap-1">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="text-2xl hover:bg-gray-100 rounded-lg p-2 transition-colors w-10 h-10 flex items-center justify-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 text-sm outline-none border rounded-full px-4 py-2"
                  />
                  {selectedImage && (
                    <span className="text-xs text-gray-500 truncate max-w-[100px]">
                      {selectedImage.name}
                    </span>
                  )}
                  <button
                    className={`${commentText.trim() ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-400'} transition-colors`}
                    disabled={!commentText.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Other Posts</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherPosts.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => router.push(`/post/${image.id}`)}
              >
                <OptimizedImage
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="font-semibold">{image.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="px-8"
              onClick={() => router.push('/')}
            >
              View More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
