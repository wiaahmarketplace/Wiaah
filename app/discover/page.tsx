'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { mockImages } from '@/lib/mock-data';
import { OptimizedImage } from '@/components/optimized-image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Hash } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';
import dynamic from 'next/dynamic';
import { Header } from '@/components/header';
import { MediaPopup } from '@/components/media-popup';

const StoryViewer = dynamic(() => import('@/components/story-viewer').then(mod => ({ default: mod.StoryViewer })), {
  loading: () => <div className="flex items-center justify-center p-8"><LoadingSpinner /></div>,
});

const tabs = ['Discover', 'Stories', 'Users', 'Places', 'Location', 'Hashtag'];

const mockUsers = [
  {
    id: '1',
    name: 'Alice Elizabeth',
    username: '@Alice Elizabeth',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: true,
  },
  {
    id: '2',
    name: 'Bob Simpson',
    username: '@Bob Simpson',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: false,
  },
  {
    id: '3',
    name: 'Charlie Cramer',
    username: '@Charlie Cramer',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: true,
  },
  {
    id: '4',
    name: 'Diana',
    username: '@Diana',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: false,
  },
  {
    id: '5',
    name: 'Edward',
    username: '@Edward',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: true,
  },
  {
    id: '6',
    name: 'Alice',
    username: '@Alice',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: true,
  },
  {
    id: '7',
    name: 'Bob',
    username: '@Bob',
    avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: false,
  },
  {
    id: '8',
    name: 'Charlie',
    username: '@Charlie',
    avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: true,
  },
  {
    id: '9',
    name: 'David',
    username: '@David',
    avatar: 'https://images.pexels.com/photos/1516983/pexels-photo-1516983.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: false,
  },
  {
    id: '10',
    name: 'Emma',
    username: '@Emma',
    avatar: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=100',
    isFollowed: true,
  },
];

const mockLocations = [
  {
    id: '1',
    city: 'New York',
    country: 'United States',
    image_url: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '2.5M',
  },
  {
    id: '2',
    city: 'Los Angeles',
    country: 'United States',
    image_url: 'https://images.pexels.com/photos/1575833/pexels-photo-1575833.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '1.5M',
  },
  {
    id: '3',
    city: 'Chicago',
    country: 'United States',
    image_url: 'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '17K',
  },
  {
    id: '4',
    city: 'San Antonio',
    country: 'United States',
    image_url: 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '3.5K',
  },
  {
    id: '5',
    city: 'Paris',
    country: 'France',
    image_url: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '3.2M',
  },
  {
    id: '6',
    city: 'London',
    country: 'United Kingdom',
    image_url: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '2.8M',
  },
  {
    id: '7',
    city: 'Tokyo',
    country: 'Japan',
    image_url: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '4.1M',
  },
  {
    id: '8',
    city: 'Dubai',
    country: 'United Arab Emirates',
    image_url: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=200',
    post_count: '1.9M',
  },
];

const mockHashtags = [
  { id: '1', name: 'Fashion', post_count: '200 k Posts' },
  { id: '2', name: 'Car', post_count: '100 k Posts' },
  { id: '3', name: 'Rolex', post_count: '50 k Posts' },
  { id: '4', name: 'Jewellery', post_count: '1 M Posts' },
  { id: '5', name: 'Adidas', post_count: '100 k Posts' },
  { id: '6', name: 'Nike', post_count: '90 k Posts' },
  { id: '7', name: 'Movie', post_count: '40 k Posts' },
  { id: '8', name: 'Covid-19', post_count: '4 M Posts' },
  { id: '9', name: 'UFC', post_count: '10 k Posts' },
  { id: '10', name: 'FIFA', post_count: '18 M Posts' },
];

const mockPlaces = [
  {
    id: '1',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Bar',
  },
  {
    id: '2',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Bank',
  },
  {
    id: '3',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Hospital',
  },
  {
    id: '4',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Hospital',
  },
  {
    id: '5',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Bar',
  },
  {
    id: '6',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Hospital',
  },
  {
    id: '7',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Bank',
  },
  {
    id: '8',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Bar',
  },
  {
    id: '9',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Barbershop',
  },
  {
    id: '10',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Groceries',
  },
  {
    id: '11',
    name: 'The Blushing Crate',
    address: '3807 Ruckman Road, Oklahoma City',
    type: 'Barbershop',
  },
];

const mockStories = [
  {
    id: '1',
    image_url: 'https://images.pexels.com/photos/1707823/pexels-photo-1707823.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'johndoe',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '2h ago',
    type: 'image' as const,
  },
  {
    id: '2',
    image_url: 'https://images.pexels.com/photos/1721936/pexels-photo-1721936.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'janedoe',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '5h ago',
    type: 'image' as const,
  },
  {
    id: '3',
    image_url: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'alexsmith',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '8h ago',
    type: 'image' as const,
  },
  {
    id: '4',
    image_url: 'https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'emilyjones',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '10h ago',
    type: 'image' as const,
  },
  {
    id: '5',
    image_url: 'https://images.pexels.com/photos/2539462/pexels-photo-2539462.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'mikebrown',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '12h ago',
    type: 'image' as const,
  },
  {
    id: '6',
    image_url: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'sarahwilson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '15h ago',
    type: 'image' as const,
  },
  {
    id: '7',
    image_url: 'https://images.pexels.com/photos/1387037/pexels-photo-1387037.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'davidlee',
    avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '18h ago',
    type: 'image' as const,
  },
  {
    id: '8',
    image_url: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'lisachen',
    avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '1d ago',
    type: 'image' as const,
  },
  {
    id: '9',
    image_url: 'https://images.pexels.com/photos/1459495/pexels-photo-1459495.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'tomharris',
    avatar: 'https://images.pexels.com/photos/1516983/pexels-photo-1516983.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '1d ago',
    type: 'image' as const,
  },
  {
    id: '10',
    image_url: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800',
    username: 'amandakim',
    avatar: 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=100',
    timestamp: '2d ago',
    type: 'image' as const,
  },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Discover');
  const [selectedImage, setSelectedImage] = useState<typeof mockImages[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyOpen, setStoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [hashtagSearchQuery, setHashtagSearchQuery] = useState('');
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>(
    mockUsers.reduce((acc, user) => ({ ...acc, [user.id]: user.isFollowed }), {})
  );

  const handleImageClick = (image: typeof mockImages[0], index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setDialogOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % mockImages.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(mockImages[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (selectedIndex - 1 + mockImages.length) % mockImages.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(mockImages[prevIndex]);
  };

  const handleStoryClick = (index: number) => {
    setStoryIndex(index);
    setStoryOpen(true);
  };

  const toggleFollow = (userId: string) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return mockUsers;

    const query = searchQuery.toLowerCase();
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredPlaces = useMemo(() => {
    if (!placeSearchQuery.trim()) return mockPlaces;

    const query = placeSearchQuery.toLowerCase();
    return mockPlaces.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.address.toLowerCase().includes(query) ||
        place.type.toLowerCase().includes(query)
    );
  }, [placeSearchQuery]);

  const filteredLocations = useMemo(() => {
    if (!locationSearchQuery.trim()) return mockLocations;

    const query = locationSearchQuery.toLowerCase();
    return mockLocations.filter(
      (location) =>
        location.city.toLowerCase().includes(query) ||
        location.country.toLowerCase().includes(query)
    );
  }, [locationSearchQuery]);

  const filteredHashtags = useMemo(() => {
    if (!hashtagSearchQuery.trim()) return mockHashtags;

    const query = hashtagSearchQuery.toLowerCase();
    return mockHashtags.filter((hashtag) =>
      hashtag.name.toLowerCase().includes(query)
    );
  }, [hashtagSearchQuery]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="border-b sticky top-20 bg-white z-30">
          <div className="flex items-center justify-center gap-8 px-8 h-16">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 py-6">
          {activeTab === 'Discover' && (
            <div className="masonry-grid">
              {mockImages.map((image, index) => (
                <div
                  key={image.id}
                  className="masonry-item group cursor-pointer relative overflow-hidden rounded-2xl"
                  onClick={() => handleImageClick(image, index)}
                >
                  <OptimizedImage
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    width={600}
                    height={400}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Stories' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {mockStories.map((story, index) => (
                <div
                  key={story.id}
                  className="relative cursor-pointer group"
                  onClick={() => handleStoryClick(index)}
                >
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-black">
                    <OptimizedImage
                      src={story.image_url}
                      alt={story.username}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      width={400}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-500 to-teal-500 blur-sm opacity-75"></div>
                        <div className="relative rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-500 to-teal-500 p-[3px]">
                          <div className="rounded-full bg-white p-[3px]">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                              <img
                                src={story.avatar}
                                alt={story.username}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-gray-300"
                />
              </div>

              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <button
                      onClick={() => router.push(`/profile/${user.username.replace('@', '').replace(/\s+/g, '')}`)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.username}</p>
                      </div>
                    </button>

                    <Button
                      onClick={() => toggleFollow(user.id)}
                      variant={followedUsers[user.id] ? 'default' : 'outline'}
                      className={
                        followedUsers[user.id]
                          ? 'bg-black text-white hover:bg-gray-800 px-6'
                          : 'border-gray-300 hover:bg-gray-50 px-6'
                      }
                    >
                      {followedUsers[user.id] ? 'Followed' : 'Follow'}
                    </Button>
                  </div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No users found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Places' && (
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Type to search..."
                  value={placeSearchQuery}
                  onChange={(e) => setPlaceSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-gray-300"
                />
              </div>

              <div className="space-y-3">
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => router.push(`/place/${place.id}`)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <MapPin className="h-5 w-5 text-emerald-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{place.name}</p>
                        <p className="text-sm text-gray-500 truncate">{place.address}</p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
                        {place.type}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredPlaces.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No places found matching "{placeSearchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Location' && (
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Type to search..."
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-gray-300"
                />
              </div>

              <div className="space-y-3">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => router.push(`/location/${location.id}`)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full overflow-hidden">
                          <img
                            src={location.image_url}
                            alt={location.city}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{location.city}</p>
                        <p className="text-sm text-gray-500">{location.country}</p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {location.post_count}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredLocations.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No locations found matching "{locationSearchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Hashtag' && (
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Type to search..."
                  value={hashtagSearchQuery}
                  onChange={(e) => setHashtagSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-gray-300"
                />
              </div>

              <div className="space-y-3">
                {filteredHashtags.map((hashtag) => (
                  <div
                    key={hashtag.id}
                    className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => router.push(`/hashtag/${hashtag.id}`)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                          <Hash className="w-7 h-7 text-emerald-500" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{hashtag.name}</p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {hashtag.post_count}
                      </span>
                    </div>
                  </div>
                ))}

                {filteredHashtags.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No hashtags found matching "{hashtagSearchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <StoryViewer
        stories={mockStories}
        initialIndex={storyIndex}
        open={storyOpen}
        onOpenChange={setStoryOpen}
      />

      <style jsx>{`
        .masonry-grid {
          column-count: 3;
          column-gap: 1rem;
        }

        @media (max-width: 1024px) {
          .masonry-grid {
            column-count: 2;
          }
        }

        @media (max-width: 640px) {
          .masonry-grid {
            column-count: 1;
          }
        }

        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1rem;
          display: inline-block;
          width: 100%;
        }

        .masonry-item img {
          display: block;
          width: 100%;
        }
      `}</style>

      {dialogOpen && selectedImage && (
        <MediaPopup
          image={selectedImage}
          type="image"
          onClose={() => setDialogOpen(false)}
          onNext={selectedIndex < mockImages.length - 1 ? handleNext : undefined}
          onPrevious={selectedIndex > 0 ? handlePrevious : undefined}
          hasNext={selectedIndex < mockImages.length - 1}
          hasPrevious={selectedIndex > 0}
        />
      )}
    </>
  );
}
