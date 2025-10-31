'use client';

import { useState, useEffect } from 'react';
import { MapPin, MoveVertical as MoreVertical, Heart, MessageCircle, Share2, Users, Play, ShoppingBag, Briefcase, Image } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { FollowersDialog } from '@/components/followers-dialog';
import { ProfilePhotoViewer } from '@/components/profile-photo-viewer';
import { OptimizedImage } from '@/components/optimized-image';
import { OptimizedVideo } from '@/components/optimized-video';
import { Header } from '@/components/header';
import { AffiliationDetailsDialog } from '@/components/affiliation-details-dialog';
import { MediaPopup } from '@/components/media-popup';
import { supabase } from '@/lib/supabase';
import { Image as ImageType } from '@/lib/mock-data';

const mockProfile = {
  username: 'sampleuser',
  verified: true,
  avatar: 'https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=300',
  posts: 143,
  following: 1500,
  followers: 1100,
  bio: 'This is a a bit long bio smaple to check the design .',
};

const mockGalleryPosts = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 7,
    comments: 5,
    shares: 13,
    author: 'Wiaah',
    location: 'Los Angeles, USA',
    time: '3 years ago',
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 12,
    comments: 8,
    shares: 20,
    author: 'Wiaah',
    location: 'New York, USA',
    time: '2 years ago',
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 25,
    comments: 15,
    shares: 45,
    author: 'Wiaah',
    location: 'Paris, France',
    time: '1 year ago',
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/1697076/pexels-photo-1697076.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 18,
    comments: 10,
    shares: 30,
    author: 'Wiaah',
    location: 'Tokyo, Japan',
    time: '1 year ago',
  },
  {
    id: '5',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 9,
    comments: 4,
    shares: 16,
    author: 'Wiaah',
    location: 'London, UK',
    time: '6 months ago',
  },
  {
    id: '6',
    image: 'https://images.pexels.com/photos/2733659/pexels-photo-2733659.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 32,
    comments: 22,
    shares: 58,
    author: 'Wiaah',
    location: 'Barcelona, Spain',
    time: '3 months ago',
  },
  {
    id: '7',
    image: 'https://images.pexels.com/photos/1484771/pexels-photo-1484771.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 14,
    comments: 7,
    shares: 24,
    author: 'Wiaah',
    location: 'Rome, Italy',
    time: '2 months ago',
  },
  {
    id: '8',
    image: 'https://images.pexels.com/photos/3156482/pexels-photo-3156482.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 21,
    comments: 11,
    shares: 38,
    author: 'Wiaah',
    location: 'Dubai, UAE',
    time: '1 month ago',
  },
];

const mockShopProducts = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'Premium Watch',
    price: '$299',
    sales: 45,
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
    name: 'Laptop Stand',
    price: '$89',
    sales: 120,
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'Wireless Headphones',
    price: '$199',
    sales: 87,
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'Smart Speaker',
    price: '$149',
    sales: 63,
  },
];

const mockServices = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'Photography Sessions',
    price: '$200/hr',
    bookings: 35,
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'Web Development',
    price: '$150/hr',
    bookings: 52,
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'Consulting',
    price: '$180/hr',
    bookings: 28,
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    name: 'Design Services',
    price: '$120/hr',
    bookings: 41,
  },
];

const mockAffiliations = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=600',
    brand: 'Tech Brand',
    commission: '15%',
    clicks: 234,
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/821754/pexels-photo-821754.jpeg?auto=compress&cs=tinysrgb&w=600',
    brand: 'Fashion Store',
    commission: '12%',
    clicks: 189,
  },
  {
    id: '3',
    image: 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=600',
    brand: 'Home Decor',
    commission: '18%',
    clicks: 156,
  },
  {
    id: '4',
    image: 'https://images.pexels.com/photos/1036808/pexels-photo-1036808.jpeg?auto=compress&cs=tinysrgb&w=600',
    brand: 'Fitness Gear',
    commission: '20%',
    clicks: 298,
  },
];

const mockActionVideos = [
  {
    id: '14',
    video_url: 'https://videos.pexels.com/video-files/3843433/3843433-uhd_1440_2560_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    views: 2300,
  },
  {
    id: '15',
    video_url: 'https://videos.pexels.com/video-files/3255275/3255275-uhd_1440_2560_25fps.mp4',
    thumbnail: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg',
    views: 1800,
  },
];

export default function MyProfilePage() {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFollowersDialogOpen, setIsFollowersDialogOpen] = useState(false);
  const [followersDialogTab, setFollowersDialogTab] = useState<'followers' | 'following'>('followers');
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(mockProfile.avatar);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [selectedAffiliation, setSelectedAffiliation] = useState<any>(null);
  const [isAffiliationDialogOpen, setIsAffiliationDialogOpen] = useState(false);
  const [galleryPosts, setGalleryPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadGalleryPosts();
    }
  }, [currentUserId]);

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      setLoading(false);
    }
  };

  const loadGalleryPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', currentUserId)
        .in('media_type', ['image', 'video'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data?.map(post => ({
        id: post.id,
        image: post.media_url,
        video_url: post.media_type === 'video' ? post.media_url : null,
        thumbnail: post.thumbnail_url,
        media_type: post.media_type,
        likes: post.like_count,
        comments: post.comment_count,
        shares: 0,
        views: post.view_count || 0,
        author: mockProfile.username,
        location: post.location || 'Unknown',
        time: formatTimeAgo(post.created_at),
        caption: post.caption,
        hashtags: post.hashtags,
      })) || [];

      setGalleryPosts(formattedPosts);
    } catch (error) {
      console.error('Error loading gallery posts:', error);
      const combinedContent = [...mockGalleryPosts, ...mockActionVideos.map(video => ({
        ...video,
        media_type: 'video',
        author: mockProfile.username,
        location: 'Unknown',
        time: 'Recently',
        likes: 0,
        comments: 0,
        shares: 0,
      }))];
      setGalleryPosts(combinedContent);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handlePostClick = (post: any) => {
    const imageData: ImageType = {
      id: post.id,
      title: post.caption || post.description || '',
      image_url: post.image,
      description: post.caption || post.description || null,
      category_id: null,
      user_id: currentUserId,
      views: post.views || 0,
      created_at: new Date().toISOString(),
    };
    setSelectedPost(imageData);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="cursor-pointer mb-4" onClick={() => setIsPhotoViewerOpen(true)}>
            <OptimizedImage
              src={profilePhotoUrl}
              alt={mockProfile.username}
              className="w-32 h-32 rounded-full"
              width={128}
              height={128}
              priority
            />
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
            <Button
              onClick={() => setIsEditProfileOpen(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6"
            >
              Edit Profile
            </Button>
          </div>

          <div className="flex items-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{mockProfile.posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div
              className="text-center cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => {
                setFollowersDialogTab('following');
                setIsFollowersDialogOpen(true);
              }}
            >
              <div className="text-xl font-bold text-gray-900">{mockProfile.following.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
            <div
              className="text-center cursor-pointer hover:opacity-70 transition-opacity"
              onClick={() => {
                setFollowersDialogTab('followers');
                setIsFollowersDialogOpen(true);
              }}
            >
              <div className="text-xl font-bold text-gray-900">{mockProfile.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
          </div>

          <div className="text-center max-w-lg">
            <p className="text-gray-600 text-sm">{mockProfile.bio}</p>
          </div>
        </div>

        <Tabs defaultValue="newsfeed" className="w-full">

          <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="newsfeed"
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

          <TabsContent value="newsfeed" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : galleryPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No posts yet. Share your first photo!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleryPosts.map((post) => (
                <div
                  key={post.id}
                  className={`relative ${post.media_type === 'video' ? 'aspect-[9/16]' : 'aspect-square'} rounded-xl overflow-hidden group cursor-pointer`}
                  onClick={() => post.media_type === 'video' ? router.push('/action') : handlePostClick(post)}
                >
                  {post.media_type === 'video' ? (
                    <>
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
                          <span className="text-sm font-medium">{post.views?.toLocaleString()} views</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shop" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockShopProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => handlePostClick({ ...product, image: product.image, author: mockProfile.username, location: 'Shop', time: '2 weeks ago', likes: product.sales * 3, comments: product.sales, shares: product.sales * 2, description: `${product.name} - ${product.price}` })}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                      <p className="text-white text-lg font-bold">{product.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="service" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockServices.map((service) => (
                <div
                  key={service.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => handlePostClick({ ...service, image: service.image, author: mockProfile.username, location: 'Services', time: '1 week ago', likes: service.bookings * 4, comments: service.bookings * 2, shares: service.bookings * 3, description: `${service.name} - ${service.price}` })}
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold mb-1">{service.name}</h3>
                      <p className="text-white text-sm">{service.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="affiliation" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockAffiliations.map((affiliation) => (
                <div
                  key={affiliation.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => {
                    setSelectedAffiliation(affiliation);
                    setIsAffiliationDialogOpen(true);
                  }}
                >
                  <img
                    src={affiliation.image}
                    alt={affiliation.brand}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold mb-1">{affiliation.brand}</h3>
                      <p className="text-white text-sm">{affiliation.commission} commission</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mockActionVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => router.push('/action')}
                >
                  <OptimizedVideo
                    src={video.video_url}
                    poster={video.thumbnail}
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
                      <span className="text-sm font-medium">{video.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>


      <EditProfileDialog
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={mockProfile}
      />

      <FollowersDialog
        open={isFollowersDialogOpen}
        onOpenChange={setIsFollowersDialogOpen}
        type={followersDialogTab}
        username={mockProfile.username}
        userId={currentUserId}
      />

      <ProfilePhotoViewer
        open={isPhotoViewerOpen}
        onOpenChange={setIsPhotoViewerOpen}
        photoUrl={profilePhotoUrl}
        userName={mockProfile.username}
      />

      <AffiliationDetailsDialog
        open={isAffiliationDialogOpen}
        onOpenChange={setIsAffiliationDialogOpen}
        affiliation={selectedAffiliation}
      />

      {isPopupOpen && selectedPost && (
        <MediaPopup
          image={selectedPost}
          type="image"
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
