'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart, MessageCircle, Share2, Send, Image as ImageIcon, Smile, MoreVertical, ExternalLink, AlertCircle, Trash2, Flag } from 'lucide-react';
import { VerifiedBadge } from './verified-badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReportCommentDialog } from './report-comment-dialog';

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

interface VideoCommentsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoData: {
    username: string;
    caption: string;
    likes: number;
    comments: number;
    shares: number;
  };
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
  '2': [
    {
      id: 'r2-1',
      userId: '10',
      username: 'olivia_martin',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: '@janedoe Thanks for sharing!',
      likes: 4,
      timestamp: '3m ago',
    },
  ],
};

const allMockComments: Comment[] = [
  {
    id: '1',
    userId: '1',
    username: 'johndoe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'This video is absolutely incredible! The energy is unmatched 🔥',
    likes: 42,
    replies: 2,
    timestamp: '5m ago',
    isVerified: true,
    replyList: mockReplies['1'],
  },
  {
    id: '2',
    userId: '2',
    username: 'janedoe',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Love this! Keep up the great work 💪',
    likes: 28,
    replies: 1,
    timestamp: '10m ago',
    replyList: mockReplies['2'],
  },
  {
    id: '3',
    userId: '3',
    username: 'alexsmith',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'Amazing content! 🎉',
    likes: 15,
    replies: 0,
    timestamp: '15m ago',
    isVerified: true,
  },
  {
    id: '4',
    userId: '4',
    username: 'mikebrown',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    text: 'This is what I call quality content! 👏',
    likes: 35,
    replies: 0,
    timestamp: '20m ago',
  },
];

export function VideoCommentsPopup({ isOpen, onClose, videoData }: VideoCommentsPopupProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>(allMockComments);
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportingComment, setReportingComment] = useState<{ id: string; username: string } | null>(null);
  const [showHashtagDropdown, setShowHashtagDropdown] = useState(false);
  const [hashtagSearch, setHashtagSearch] = useState('');
  const [hashtagPosition, setHashtagPosition] = useState(0);

  const commonEmojis = ['😀', '😂', '❤️', '👍', '🔥', '✨', '🎉', '💯', '👏', '😍', '🤔', '😎', '💪', '🙌', '✅'];

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

  const handleUsernameClick = (username: string) => {
    router.push(`/profile/${username}`);
    onClose();
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

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'you',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: commentText.trim(),
      likes: 0,
      replies: 0,
      timestamp: 'Just now',
      isVerified: false,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setSelectedImage(null);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommentText(value);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastHashIndex = textBeforeCursor.lastIndexOf('#');

    if (lastHashIndex !== -1) {
      const textAfterHash = textBeforeCursor.slice(lastHashIndex + 1);
      if (!textAfterHash.includes(' ')) {
        setShowHashtagDropdown(true);
        setHashtagSearch(textAfterHash.toLowerCase());
        setHashtagPosition(lastHashIndex);
      } else {
        setShowHashtagDropdown(false);
      }
    } else {
      setShowHashtagDropdown(false);
    }
  };

  const handleHashtagSelect = (hashtag: string) => {
    const beforeHashtag = commentText.slice(0, hashtagPosition);
    const afterHashtag = commentText.slice(hashtagPosition).replace(/#\w*/, `#${hashtag} `);
    setCommentText(beforeHashtag + afterHashtag);
    setShowHashtagDropdown(false);
  };

  const filteredHashtags = mockHashtags.filter(hashtag =>
    hashtag.name.toLowerCase().includes(hashtagSearch)
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !showHashtagDropdown) {
      e.preventDefault();
      handleSendComment();
    }
    if (e.key === 'Escape') {
      setShowHashtagDropdown(false);
      setShowEmojiPicker(false);
    }
  };

  const handleReplyClick = (commentId: string, username: string) => {
    setReplyingTo(commentId);
    setReplyText(`@${username} `);
  };

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      userId: 'current_user',
      username: 'you',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      text: replyText.trim(),
      likes: 0,
      timestamp: 'Just now',
      isVerified: false,
      isLiked: false,
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replyList: comment.replyList ? [...comment.replyList, newReply] : [newReply],
          replies: comment.replies + 1
        };
      }
      return comment;
    }));

    setReplyText('');
    setReplyingTo(null);
    setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
  };

  const handleReplyKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, commentId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply(commentId);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    router.push(`/hashtag/${hashtag}`);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleDeleteReply = (commentId: string, replyId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId && comment.replyList) {
        return {
          ...comment,
          replyList: comment.replyList.filter(reply => reply.id !== replyId),
          replies: comment.replies - 1
        };
      }
      return comment;
    }));
  };

  const handleReportComment = (commentId: string, username: string) => {
    setReportingComment({ id: commentId, username });
    setReportDialogOpen(true);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 max-w-[500px] h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Comments</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
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
                    <button
                      onClick={() => handleReplyClick(comment.id, comment.username)}
                      className="hover:text-gray-700"
                    >
                      Reply
                    </button>
                  </div>

                  {replyingTo === comment.id && (
                    <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                      <input
                        type="text"
                        placeholder={`Reply to ${comment.username}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyPress={(e) => handleReplyKeyPress(e, comment.id)}
                        className="flex-1 text-sm outline-none bg-transparent"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSendReply(comment.id)}
                        className={`${replyText.trim() ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-400'} transition-colors`}
                        disabled={!replyText.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {comment.replies > 0 && (
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 mt-2 flex items-center gap-1"
                    >
                      {expandedReplies[comment.id] ? '— Hide' : '— View'} {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
                    </button>
                  )}

                  {expandedReplies[comment.id] && comment.replyList && comment.replyList.length > 0 && (
                    <div className="mt-4 space-y-4 pl-0">
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
                              <button
                                onClick={() => handleReplyClick(comment.id, reply.username)}
                                className="hover:text-gray-700"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleReportComment(reply.id, reply.username)}>
                                <Flag className="mr-2 h-4 w-4" />
                                Report
                              </DropdownMenuItem>
                              {reply.userId === 'current_user' && (
                                <DropdownMenuItem
                                  onClick={() => handleDeleteReply(comment.id, reply.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleReportComment(comment.id, comment.username)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                    {comment.userId === 'current_user' && (
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4 relative">
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

          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="video-comment-image-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="video-comment-image-upload" className="hover:text-gray-600 cursor-pointer">
              <ImageIcon className="h-5 w-5" />
            </label>
            <div className="relative">
              <button
                className="hover:text-gray-600"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowHashtagDropdown(false);
                }}
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
              onChange={handleCommentChange}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm outline-none bg-transparent"
            />
            {selectedImage && (
              <span className="text-xs text-gray-500 truncate max-w-[100px]">
                {selectedImage.name}
              </span>
            )}
            <button
              onClick={handleSendComment}
              className={`${commentText.trim() ? 'text-emerald-500 hover:text-emerald-600' : 'text-gray-400'} transition-colors`}
              disabled={!commentText.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </DialogContent>

      {reportingComment && (
        <ReportCommentDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          commentId={reportingComment.id}
          commentUsername={reportingComment.username}
        />
      )}
    </Dialog>
  );
}
