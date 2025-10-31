'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/optimized-image';
import Link from 'next/link';
import { Pagination } from '@/components/pagination';

const savedHotels = [
  {
    id: '1',
    title: 'Mountain View Lodge',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'traveler_john',
    location: 'Swiss Alps',
    likes: 1245,
    comments: 89,
    shares: 34,
    time: '2h ago',
    description: 'Waking up to this breathtaking mountain view! The Swiss Alps never disappoint. #travel #mountains #switzerland'
  },
  {
    id: '2',
    title: 'Lakeside Resort',
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'lakeside_adventures',
    location: 'Lake Como, Italy',
    likes: 2156,
    comments: 124,
    shares: 67,
    time: '5h ago',
    description: 'Peaceful mornings by the lake. Perfect getaway destination! #lakeside #resort #italy #vacation'
  },
  {
    id: '3',
    title: 'Desert Oasis Hotel',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'desert_explorer',
    location: 'Dubai, UAE',
    likes: 3421,
    comments: 201,
    shares: 112,
    time: '1d ago',
    description: 'Luxury in the heart of the desert. An unforgettable experience! #dubai #luxury #desert #hotel'
  },
  {
    id: '4',
    title: 'Coastal Paradise Inn',
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'beach_lover',
    location: 'Maldives',
    likes: 4567,
    comments: 289,
    shares: 178,
    time: '2d ago',
    description: 'Paradise found! Crystal clear waters and white sandy beaches. #maldives #beach #paradise #tropical'
  },
  {
    id: '5',
    title: 'Winter Retreat',
    image: 'https://images.pexels.com/photos/70441/pexels-photo-70441.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'winter_wanderer',
    location: 'Aspen, Colorado',
    likes: 2890,
    comments: 156,
    shares: 89,
    time: '3d ago',
    description: 'Cozy winter escape in the mountains. Perfect for skiing and hot chocolate! #winter #skiing #aspen #snow'
  },
  {
    id: '6',
    title: 'Misty Forest Lodge',
    image: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'forest_dreamer',
    location: 'Pacific Northwest',
    likes: 1876,
    comments: 98,
    shares: 45,
    time: '4d ago',
    description: 'Surrounded by ancient trees and morning mist. Nature at its finest! #forest #nature #pnw #peaceful'
  },
  {
    id: '7',
    title: 'Aurora Hotel',
    image: 'https://images.pexels.com/photos/1907642/pexels-photo-1907642.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'northern_lights',
    location: 'Reykjavik, Iceland',
    likes: 5234,
    comments: 312,
    shares: 234,
    time: '5d ago',
    description: 'Best place to watch the Northern Lights! Magical experience! #iceland #aurora #northernlights #travel'
  },
  {
    id: '8',
    title: 'Valley View Resort',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600',
    author: 'valley_explorer',
    location: 'Yosemite, California',
    likes: 3145,
    comments: 187,
    shares: 94,
    time: '6d ago',
    description: 'Stunning valley views from every angle. A photographers paradise! #yosemite #valley #california #nature'
  }
];

export default function SavedHotelsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<typeof savedHotels[0] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(savedHotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHotels = savedHotels.slice(startIndex, endIndex);

  const handleHotelClick = (hotel: typeof savedHotels[0]) => {
    setSelectedPost(hotel);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedPost(null);
  };

  const handleNext = () => {
    if (selectedPost) {
      const currentIndex = savedHotels.findIndex(h => h.id === selectedPost.id);
      if (currentIndex < savedHotels.length - 1) {
        setSelectedPost(savedHotels[currentIndex + 1]);
      }
    }
  };

  const handlePrevious = () => {
    if (selectedPost) {
      const currentIndex = savedHotels.findIndex(h => h.id === selectedPost.id);
      if (currentIndex > 0) {
        setSelectedPost(savedHotels[currentIndex - 1]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>
          <Link href="/saved">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          </Link>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {currentHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group cursor-pointer"
              onClick={() => handleHotelClick(hotel)}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <OptimizedImage
                  src={hotel.image}
                  alt={hotel.title}
                  width={400}
                  height={400}
                  className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

    </div>
  );
}
