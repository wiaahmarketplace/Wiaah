'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, MoreVertical, Heart, MessageCircle, Share2, Play, ShoppingBag, Briefcase, Users, Flag, UserX, Link as LinkIcon, Ban, AlertTriangle, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChangeProfilePhotoDialog } from '@/components/change-profile-photo-dialog';
import { FollowersDialog } from '@/components/followers-dialog';
import { ShareDialog } from '@/components/share-dialog';
import { ReportProfileDialog } from '@/components/report-profile-dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { followUser, unfollowUser, getFollowStats } from '@/lib/follow-service';
import { OptimizedImage } from '@/components/optimized-image';
import { OptimizedVideo } from '@/components/optimized-video';
import { Header } from '@/components/header';
import { MediaPopup } from '@/components/media-popup';
import { Image as ImageType } from '@/lib/mock-data';

const mockProfile = {
  username: 'sampleuser',
  verified: true,
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  bio: 'This is a a bit long bio smaple to check the design .',
  posts: 143,
  following: 1500,
  followers: 1100,
};

const mockGalleryPosts = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'User 1',
    time: '2 hours ago',
    location: 'New York, United States',
    likes: 24,
    comments: 3,
    shares: 2,
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'User 2',
    time: '5 hours ago',
    location: 'Berlin, Germany',
    likes: 32,
    comments: 7,
    shares: 4,
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'User 3',
    time: '1 day ago',
    location: 'Sydney, Australia',
    likes: 45,
    comments: 12,
    shares: 8,
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'User 4',
    time: '2 days ago',
    location: 'Toronto, Canada',
    likes: 18,
    comments: 5,
    shares: 3,
  },
  {
    id: '5',
    image: 'https://images.pexels.com/photos/1183099/pexels-photo-1183099.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'User 5',
    time: '3 days ago',
    location: 'Amsterdam, Netherlands',
    likes: 67,
    comments: 15,
    shares: 11,
  },
  {
    id: '6',
    image: 'https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'User 6',
    time: '4 days ago',
    location: 'Singapore, Singapore',
    likes: 89,
    comments: 23,
    shares: 17,
  },
];

const mockShopPosts = [
  {
    id: '7',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    name: 'Product 1',
    price: 49.99,
  },
  {
    id: '8',
    image: 'https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg?auto=compress&cs=tinysrgb&w=800',
    name: 'Product 2',
    price: 79.99,
  },
  {
    id: '9',
    image: 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=800',
    name: 'Product 3',
    price: 129.99,
  },
];

const mockServicePosts = [
  {
    id: '10',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Photography Service',
    description: 'Professional photography',
  },
  {
    id: '11',
    image: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Design Service',
    description: 'Creative design solutions',
  },
];

const mockAffiliationPosts = [
  {
    id: '12',
    image: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Partner Brand',
    description: 'Official partner',
  },
  {
    id: '13',
    image: 'https://images.pexels.com/photos/1535162/pexels-photo-1535162.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Collaboration',
    description: 'Brand collaboration',
  },
];

const mockActionPosts = [
  {
    id: '14',
    video_url: 'https://videos.pexels.com/video-files/3843433/3843433-uhd_1440_2560_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    views: 1234,
  },
  {
    id: '15',
    video_url: 'https://videos.pexels.com/video-files/3255275/3255275-uhd_1440_2560_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg',
    views: 5678,
  },
];

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(mockProfile.avatar);
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followersDialogType, setFollowersDialogType] = useState<'followers' | 'following'>('followers');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(mockProfile.followers);
  const [followingCount, setFollowingCount] = useState(mockProfile.following);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [profileUserId, setProfileUserId] = useState<string>('');

  const currentUsername = 'sampleuser';
  const isOwnProfile = params.username === currentUsername;

  useEffect(() => {
    loadFollowStats();
  }, [params.username]);

  const loadFollowStats = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', params.username)
        .maybeSingle();

      if (profile) {
        setProfileUserId(profile.id);
        const stats = await getFollowStats(profile.id);
        setIsFollowing(stats.isFollowing);
        setFollowersCount(stats.followersCount);
        setFollowingCount(stats.followingCount);
      }
    } catch (error) {
      console.error('Error loading follow stats:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!profileUserId) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        const result = await unfollowUser(profileUserId);
        if (result.success) {
          setIsFollowing(false);
          setFollowersCount(prev => Math.max(0, prev - 1));
          toast.success('Unfollowed successfully');
        } else {
          toast.error(result.error || 'Failed to unfollow');
        }
      } else {
        const result = await followUser(profileUserId);
        if (result.success) {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
          toast.success('Following successfully');
        } else {
          toast.error(result.error || 'Failed to follow');
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('An error occurred');
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handlePostClick = (post: any) => {
    const imageData: ImageType = {
      id: post.id,
      title: post.description || post.name || post.title || '',
      image_url: post.image,
      description: post.description || null,
      category_id: null,
      user_id: profileUserId,
      views: post.views || 0,
      created_at: new Date().toISOString(),
    };
    setSelectedPost(imageData);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  const handlePhotoChange = (newPhotoUrl: string | null) => {
    if (newPhotoUrl) {
      setProfilePhotoUrl(newPhotoUrl);
    } else {
      setProfilePhotoUrl('https://ui-avatars.com/api/?name=' + mockProfile.username + '&size=200');
    }
  };

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/profile/${mockProfile.username}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Profile URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  const handleBlockUser = async () => {
    try {
      // In a real app, you would get the current user's ID from auth
      const currentUserId = 'mock-current-user-id';
      const targetUserId = 'mock-target-user-id'; // Would come from profile data

      const { error } = await supabase
        .from('blocked_users')
        .insert({
          user_id: currentUserId,
          blocked_user_id: targetUserId,
          blocked_username: mockProfile.username,
        });

      if (error) throw error;

      setIsBlocked(true);
      toast.success(`@${mockProfile.username} has been blocked`);
    } catch (error) {
      console.error('Failed to block user:', error);
      toast.error('Failed to block user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div
              className={isOwnProfile ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
              onClick={() => isOwnProfile && setIsPhotoDialogOpen(true)}
            >
              <OptimizedImage
                src={profilePhotoUrl}
                alt={mockProfile.username}
                className="w-32 h-32 rounded-full object-cover"
                width={128}
                height={128}
                priority
              />
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setIsPhotoDialogOpen(true)}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors shadow-lg"
                aria-label="Change profile photo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{mockProfile.username}</h1>
            {mockProfile.verified && (
              <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {isOwnProfile ? (
              <>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6">
                  Edit Profile
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleCopyUrl}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/account-settings/share-qr')}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Share QR Code
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  className={isFollowing ? "bg-gray-900 hover:bg-gray-800 text-white px-6" : "bg-emerald-500 hover:bg-emerald-600 text-white px-6"}
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                >
                  {isFollowLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 px-6"
                  onClick={() => router.push('/messages')}
                >
                  Message
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleCopyUrl}>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)} className="text-yellow-600">
                      <Flag className="mr-2 h-4 w-4" />
                      Report Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBlockUser} className="text-red-600" disabled={isBlocked}>
                      <UserX className="mr-2 h-4 w-4" />
                      {isBlocked ? 'User Blocked' : 'Block User'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 sm:gap-8 mb-4 w-full max-w-md">
            <div className="text-center flex-shrink-0">
              <div className="text-xl font-bold text-gray-900">{mockProfile.posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div
              className="text-center cursor-pointer hover:text-gray-900 transition-colors flex-shrink-0"
              onClick={() => {
                setFollowersDialogType('following');
                setFollowersDialogOpen(true);
              }}
            >
              <div className="text-xl font-bold text-gray-900">{followingCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
            <div
              className="text-center cursor-pointer hover:text-gray-900 transition-colors flex-shrink-0"
              onClick={() => {
                setFollowersDialogType('followers');
                setFollowersDialogOpen(true);
              }}
            >
              <div className="text-xl font-bold text-gray-900">{followersCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
          </div>

          <div className="text-center max-w-lg">
            <h3 className="font-semibold text-gray-900 mb-1">Bio</h3>
            <p className="text-gray-600 text-sm">{mockProfile.bio}</p>
          </div>
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="gallery"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3"
            >
              <Image className="w-4 h-4 mr-2" />
              GALLERY
            </TabsTrigger>
            <TabsTrigger
              value="shop"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              SHOP
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              SERVICE
            </TabsTrigger>
            <TabsTrigger
              value="affiliation"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3"
            >
              <Users className="w-4 h-4 mr-2" />
              AFFILIATION
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3"
            >
              <Play className="w-4 h-4 mr-2" />
              ACTIONS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockGalleryPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <OptimizedImage
                    src={post.image}
                    alt=""
                    className="w-full h-full"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <OptimizedImage
                        src={mockProfile.avatar}
                        alt={post.author}
                        className="w-8 h-8 rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                      <span className="text-white font-semibold text-sm">{post.author}</span>
                      <MoreVertical className="w-4 h-4 text-white ml-auto" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-white text-xs">{post.time}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 mb-2 text-white text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{post.location}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <Heart className="w-5 h-5 text-white mb-1" />
                          <span className="text-white text-xs font-medium">{post.likes}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MessageCircle className="w-5 h-5 text-white mb-1" />
                          <span className="text-white text-xs font-medium">{post.comments}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Share2 className="w-5 h-5 text-white mb-1" />
                          <span className="text-white text-xs font-medium">{post.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {mockActionPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => router.push('/action')}
                >
                  <OptimizedVideo
                    src={post.video_url}
                    poster={post.thumbnail}
                    className="w-full h-full"
                    maxWidth={720}
                    maxHeight={1280}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" fill="white" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-white">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shop" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockShopPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => handlePostClick({ ...post, image: post.image, author: mockProfile.username, location: 'Shop', time: '1 week ago', likes: 34, comments: 8, shares: 15, description: `${post.name} - $${post.price}` })}
                >
                  <OptimizedImage
                    src={post.image}
                    alt={post.name}
                    className="w-full h-full"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold mb-1">{post.name}</h3>
                      <p className="text-white text-lg font-bold">${post.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="service" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockServicePosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => handlePostClick({ ...post, image: post.image, author: mockProfile.username, location: 'Services', time: '2 weeks ago', likes: 28, comments: 6, shares: 10 })}
                >
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold mb-1">{post.title}</h3>
                      <p className="text-white text-sm">{post.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="affiliation" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockAffiliationPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => handlePostClick({ ...post, image: post.image, author: mockProfile.username, location: 'Affiliations', time: '3 days ago', likes: 45, comments: 12, shares: 20 })}
                >
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full"
                    width={400}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold mb-1">{post.title}</h3>
                      <p className="text-white text-sm">{post.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockActionPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => router.push('/action')}
                >
                  <OptimizedVideo
                    src={post.video_url}
                    poster={post.thumbnail}
                    className="w-full h-full"
                    maxWidth={720}
                    maxHeight={1280}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" fill="white" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 text-white">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-medium">{post.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isOwnProfile && (
        <ChangeProfilePhotoDialog
          open={isPhotoDialogOpen}
          onOpenChange={setIsPhotoDialogOpen}
          currentPhotoUrl={profilePhotoUrl}
          userName={mockProfile.username}
          userId="mock-user-id-123"
          onPhotoChange={handlePhotoChange}
        />
      )}

      <FollowersDialog
        open={followersDialogOpen}
        onOpenChange={setFollowersDialogOpen}
        type={followersDialogType}
        username={mockProfile.username}
        userId={profileUserId}
      />

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${mockProfile.username}`}
        title={`Share ${mockProfile.username}'s profile`}
      />

      <ReportProfileDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        username={mockProfile.username}
      />

      {selectedPost && (
        <MediaPopup
          image={selectedPost}
          type="image"
          onClose={handleClosePost}
        />
      )}
    </div>
  );
}
