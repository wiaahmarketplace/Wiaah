'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Volume2, VolumeX, MapPin, Users, Flag, Eye, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VideoCommentsPopup } from '@/components/video-comments-popup';
import { ReportPostDialog } from '@/components/report-post-dialog';
import { ShareDialog } from '@/components/share-dialog';
import { supabase } from '@/lib/supabase';

const videos = [
  {
    id: 1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    username: 'beach_lover',
    timestamp: '9-1',
    caption: 'Beach vibes and summer nights @beachlife #summer #beach #sunset',
    location: 'Miami Beach, FL',
    locationId: 'miami-beach-fl',
    peopleCount: 1,
    mentionedUsers: [
      {
        id: 1,
        username: 'beachlife',
        name: 'Beach Life',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100',
        isFollowing: false,
      },
    ],
    likes: 23700,
    comments: 1834,
    bookmarks: 3130,
    shares: 1573,
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: true,
    audioName: 'Summer Vibes',
    audioId: 'summer-vibes-001',
  },
  {
    id: 2,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    username: 'explorer_life',
    timestamp: '10-2',
    caption: '#adventure #travel',
    location: 'Bali, Indonesia',
    locationId: 'bali-indonesia',
    peopleCount: 3,
    mentionedUsers: [
      {
        id: 2,
        username: 'traveler123',
        name: 'Travel Explorer',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        isFollowing: false,
      },
      {
        id: 3,
        username: 'wanderlust',
        name: 'Wanderlust',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        isFollowing: true,
      },
      {
        id: 4,
        username: 'adventurer',
        name: 'Adventure Time',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
        isFollowing: false,
      },
    ],
    likes: 45200,
    comments: 2341,
    bookmarks: 5230,
    shares: 2873,
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: false,
    audioName: 'Adventure Beats',
    audioId: 'adventure-beats-002',
  },
  {
    id: 3,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    username: 'creative_mind',
    timestamp: '10-3',
    caption: '#inspiration #art',
    location: 'Paris, France',
    locationId: 'paris-france',
    peopleCount: 2,
    audioName: 'Summer Vibes',
    audioId: 'summer-vibes-001',
    mentionedUsers: [
      {
        id: 5,
        username: 'artlover',
        name: 'Art Lover',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100',
        isFollowing: false,
      },
      {
        id: 6,
        username: 'designer',
        name: 'Creative Designer',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        isFollowing: false,
      },
    ],
    likes: 12300,
    comments: 892,
    bookmarks: 1890,
    shares: 743,
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    isOnline: true,
  },
];

const parseCaption = (caption: string, router: any) => {
  const parts = caption.split(/(#\w+|@\w+)/);

  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      const hashtag = part.slice(1).toLowerCase();
      return (
        <span
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/hashtag/${hashtag}`);
          }}
          className="text-white font-semibold cursor-pointer hover:text-white/80 transition-colors"
        >
          {part}
        </span>
      );
    } else if (part.startsWith('@')) {
      const username = part.slice(1);
      return (
        <span
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/profile/${username}`);
          }}
          className="text-white font-semibold cursor-pointer hover:text-white/80 transition-colors"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function ActionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likesState, setLikesState] = useState<{[key: number]: boolean}>({});
  const [bookmarksState, setBookmarksState] = useState<{[key: number]: boolean}>({});
  const [showMentionedUsers, setShowMentionedUsers] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [mentionedUsersFollowing, setMentionedUsersFollowing] = useState<{[key: number]: boolean}>({});
  const [expandedState, setExpandedState] = useState<{[key: number]: boolean}>({});
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const router = useRouter();
  const [videosList, setVideosList] = useState(videos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('media_type', 'video')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedVideos = data.map((post, index) => ({
          id: index + 1,
          videoUrl: post.media_url,
          username: 'user',
          timestamp: formatTimestamp(post.created_at),
          caption: post.caption || '',
          location: post.location || '',
          locationId: post.location?.toLowerCase().replace(/\s/g, '-') || '',
          peopleCount: (post.tagged_users as any[])?.length || 0,
          mentionedUsers: [],
          likes: post.like_count || 0,
          comments: post.comment_count || 0,
          bookmarks: 0,
          shares: 0,
          userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
          isOnline: true,
          audioName: 'Original Audio',
          audioId: `audio-${post.id}`,
        }));
        setVideosList([...formattedVideos, ...videos]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}-${day}`;
  };

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.play().catch(err => console.log('Video play error:', err));
    }

    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
      }
    });
  }, [currentIndex]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / containerHeight);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < videosList.length) {
        setCurrentIndex(newIndex);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showMoreMenu && !target.closest('.more-menu-container')) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreMenu]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const currentVideo = videosList[currentIndex];
  const isLiked = likesState[currentVideo?.id] || false;
  const isBookmarked = bookmarksState[currentVideo?.id] || false;
  const isExpanded = expandedState[currentVideo?.id] || false;

  return (
    <div className="h-screen bg-white flex flex-col">
      <Header />
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
          </div>
        ) : videosList.map((video, index) => (
          <div
            key={video.id}
            className="h-full snap-start snap-always flex items-center justify-center p-8 relative"
          >
            <div className="relative w-full max-w-[480px] h-full bg-black rounded-lg overflow-hidden">
              <video
                ref={el => videoRefs.current[index] = el}
                src={video.videoUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
              />

              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between z-10">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/30 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <div className="relative more-menu-container">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/30 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                  {showMoreMenu && index === currentIndex && (
                    <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-lg overflow-hidden z-50 min-w-[240px]">
                      <button
                        onClick={() => {
                          setShowMoreMenu(false);
                          router.push(`/post/${video.id}`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <ExternalLink className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Go to post</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreMenu(false);
                          setShowReportDialog(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Flag className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Report</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreMenu(false);
                          console.log('Not interested');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Eye className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Not interested</span>
                      </button>
                      <button
                        onClick={async () => {
                          setShowMoreMenu(false);
                          const url = window.location.href;
                          await navigator.clipboard.writeText(url);
                          alert('URL copied to clipboard!');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <ExternalLink className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Copy URL</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMoreMenu(false);
                          setShowShareDialog(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-t border-gray-100"
                      >
                        <Share2 className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Share</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="text-white space-y-1.5">
                  <button
                    onClick={() => router.push(`/profile/${video.username}`)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="relative">
                      <Avatar className="w-9 h-9 border-2 border-white">
                        <AvatarImage src={video.userAvatar} />
                        <AvatarFallback>{video.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {video.isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-white">{video.username}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => router.push(`/location/${video.locationId}`)}
                    className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{video.location}</span>
                  </button>

                  <button
                    onClick={() => setShowMentionedUsers(true)}
                    className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{video.peopleCount} {video.peopleCount === 1 ? 'Person' : 'People'}</span>
                  </button>

                  <div className="pt-1">
                    <p className={cn(
                      "text-sm leading-snug",
                      !isExpanded && "line-clamp-2"
                    )}>
                      {parseCaption(video.caption, router)}
                    </p>
                    <button
                      onClick={() => setExpandedState(prev => ({ ...prev, [video.id]: !prev[video.id] }))}
                      className="text-sm text-white/90 hover:text-white mt-0.5"
                    >
                      {isExpanded ? 'less' : 'more'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
              <button
                onClick={() => setLikesState(prev => ({ ...prev, [video.id]: !prev[video.id] }))}
                className="flex flex-col items-center gap-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors",
                  (likesState[video.id]) && "bg-red-500 hover:bg-red-600"
                )}>
                  <Heart className={cn(
                    "w-6 h-6",
                    (likesState[video.id]) ? "text-white fill-white" : "text-gray-800"
                  )} />
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {formatNumber(video.likes + ((likesState[video.id]) ? 1 : 0))}
                </span>
              </button>

              <button
                onClick={() => setShowComments(true)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <MessageCircle className="w-6 h-6 text-gray-800" />
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {formatNumber(video.comments)}
                </span>
              </button>

              <button
                onClick={() => setBookmarksState(prev => ({ ...prev, [video.id]: !prev[video.id] }))}
                className="flex flex-col items-center gap-1"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors",
                  (bookmarksState[video.id]) && "bg-yellow-500 hover:bg-yellow-600"
                )}>
                  <Bookmark className={cn(
                    "w-6 h-6",
                    (bookmarksState[video.id]) ? "text-white fill-white" : "text-gray-800"
                  )} />
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {formatNumber(video.bookmarks + ((bookmarksState[video.id]) ? 1 : 0))}
                </span>
              </button>

              <button
                onClick={() => setShowShareDialog(true)}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Share2 className="w-6 h-6 text-gray-800" />
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {formatNumber(video.shares)}
                </span>
              </button>

              <button
                onClick={() => router.push(`/audio/${video.audioId}`)}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mt-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={video.userAvatar}
                  alt="Audio"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <VideoCommentsPopup
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        videoData={{
          username: currentVideo.username,
          caption: currentVideo.caption,
          likes: currentVideo.likes,
          comments: currentVideo.comments,
          shares: currentVideo.shares,
        }}
      />

      <Dialog open={showMentionedUsers} onOpenChange={setShowMentionedUsers}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mentioned Users</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {currentVideo.mentionedUsers.map((user) => {
              const isFollowing = mentionedUsersFollowing[user.id] ?? user.isFollowing;
              return (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() => {
                      setMentionedUsersFollowing(prev => ({
                        ...prev,
                        [user.id]: !isFollowing,
                      }));
                    }}
                    className={cn(
                      "min-w-[90px]",
                      !isFollowing && "bg-black hover:bg-gray-800 text-white"
                    )}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <ReportPostDialog open={showReportDialog} onOpenChange={setShowReportDialog} />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        title={currentVideo.caption}
      />
    </div>
  );
}
