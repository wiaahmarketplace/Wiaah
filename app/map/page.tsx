'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Hotel, Home, UtensilsCrossed, Car, Scissors, Heart, Users, Palette, Plane, Wrench, PartyPopper, ShoppingBag } from 'lucide-react';
import { Star } from 'lucide-react';

interface ServiceLocation {
  id: string;
  name: string;
  category: string;
  location: string;
  dateRange: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  lat: number;
  lng: number;
}

const mockLocations: ServiceLocation[] = [
  {
    id: '1',
    name: 'Metropolis Hotel',
    category: 'hotels',
    location: 'Metropolis, Countryland',
    dateRange: 'July 30 - July 30',
    price: 'From $250',
    rating: 4.7,
    reviews: 230,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.4268,
    lng: 8.9160,
  },
  {
    id: '2',
    name: 'Seaside Resort',
    category: 'hotels',
    location: 'Smalltown, Countryland',
    dateRange: 'Aug 5 - Aug 12',
    price: 'From $220',
    rating: 4.5,
    reviews: 198,
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.3268,
    lng: 8.8160,
  },
  {
    id: '3',
    name: 'Mountain View Inn',
    category: 'hotels',
    location: 'Highlands, Countryland',
    dateRange: 'Sept 1 - Sept 5',
    price: 'From $310',
    rating: 4.8,
    reviews: 342,
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.5268,
    lng: 9.0160,
  },
  {
    id: '4',
    name: 'Lakeside Retreat',
    category: 'holiday-rentals',
    location: 'Lakeshore, Countryland',
    dateRange: 'Aug 15 - Aug 20',
    price: 'From $280',
    rating: 4.6,
    reviews: 275,
    image: 'https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.4500,
    lng: 8.9500,
  },
  {
    id: '5',
    name: 'Trattoria Bella Vista',
    category: 'restaurants',
    location: 'Downtown, Countryland',
    dateRange: 'Open Daily',
    price: 'From $35',
    rating: 4.9,
    reviews: 512,
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.4100,
    lng: 8.9300,
  },
  {
    id: '6',
    name: 'Luxury Sedan Rental',
    category: 'vehicle',
    location: 'City Center, Countryland',
    dateRange: 'Available Now',
    price: 'From $80/day',
    rating: 4.7,
    reviews: 189,
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.4400,
    lng: 8.9400,
  },
  {
    id: '7',
    name: 'Beauty Spa & Salon',
    category: 'beauty-centers',
    location: 'Plaza District, Countryland',
    dateRange: 'Book Appointment',
    price: 'From $60',
    rating: 4.8,
    reviews: 324,
    image: 'https://images.pexels.com/photos/3997986/pexels-photo-3997986.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.4600,
    lng: 8.9600,
  },
  {
    id: '8',
    name: 'Wellness Health Center',
    category: 'health-centers',
    location: 'Medical District, Countryland',
    dateRange: 'Open Mon-Fri',
    price: 'From $120',
    rating: 4.9,
    reviews: 428,
    image: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.4200,
    lng: 8.9200,
  },
  {
    id: '9',
    name: 'Fashion Boutique',
    category: 'shop',
    location: 'Shopping District, Countryland',
    dateRange: 'Open Daily',
    price: 'From $25',
    rating: 4.6,
    reviews: 267,
    image: 'https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&w=400',
    lat: 44.4350,
    lng: 8.9350,
  },
];

const serviceCategories = [
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'holiday-rentals', label: 'Holiday Rentals', icon: Home },
  { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { id: 'vehicle', label: 'Vehicle', icon: Car },
  { id: 'beauty-centers', label: 'Beauty Centers', icon: Scissors },
  { id: 'health-centers', label: 'Health Centers', icon: Heart },
  { id: 'coaching-personal-growth', label: 'Coaching', icon: Users },
  { id: 'lifestyle-creative', label: 'Creative', icon: Palette },
  { id: 'local-tourism', label: 'Tourism', icon: Plane },
  { id: 'tradespeople', label: 'Trades', icon: Wrench },
  { id: 'weddings', label: 'Weddings', icon: PartyPopper },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
];

function MapContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [highlightedServiceId, setHighlightedServiceId] = useState<string | null>(null);

  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      setHighlightedServiceId(serviceId);
      const service = mockLocations.find(loc => loc.id === serviceId);
      if (service) {
        setHoveredLocation(serviceId);
        setTimeout(() => {
          const element = document.getElementById(`service-${serviceId}`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [searchParams]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredLocations = mockLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(location.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-[500px] bg-white border-r overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 border-b">
            <div className="p-4 space-y-4">
              {/* Category Filter Buttons - Top Section */}
              <div className="flex flex-wrap gap-2">
                {serviceCategories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategory(category.id)}
                      className={`rounded-full border-gray-300 ${
                        isSelected
                          ? 'bg-black text-white border-black hover:bg-gray-800'
                          : 'bg-white text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>

              {/* Search Bar - Below Categories */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="where to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 h-12 text-base rounded-full border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                id={`service-${location.id}`}
                className={`bg-white rounded-lg border transition-all cursor-pointer ${
                  highlightedServiceId === location.id ? 'ring-2 ring-red-500 shadow-lg' :
                  hoveredLocation === location.id ? 'ring-2 ring-black shadow-lg' : 'hover:shadow-md'
                }`}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <div className="relative">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-black text-white">{location.price}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{location.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{location.location}</p>
                  <p className="text-sm text-gray-500 mb-3">{location.dateRange}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm">{location.rating}</span>
                      <span className="text-sm text-gray-500">({location.reviews} reviews)</span>
                    </div>
                    <Button variant="link" className="text-red-500 hover:text-red-600 p-0 h-auto">
                      Show on Map
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredLocations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No services found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="w-full h-full bg-gray-200 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d181684.87149712308!2d8.733771749999999!3d44.42677695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d343f1f1234567%3A0x1234567890abcdef!2sGenoa%2C%20Italy!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />

            <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-gray-50">
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-1" />
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-1" />
              </div>
            </div>
          </div>

          {hoveredLocation && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl p-2 animate-in slide-in-from-bottom-4">
              {(() => {
                const location = filteredLocations.find(l => l.id === hoveredLocation);
                if (!location) return null;
                return (
                  <div className="flex items-center gap-3 max-w-sm">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{location.name}</h4>
                      <p className="text-xs text-gray-600">{location.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{location.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}
