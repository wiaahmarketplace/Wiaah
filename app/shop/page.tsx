'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { useWishlist } from '@/hooks/use-wishlist';
import { toast } from 'sonner';

const mockProducts = [
  {
    id: '1',
    name: 'Eulalia Ankunding-Leannon',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 50,
    originalPrice: 71,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'green', 'red', 'black', 'yellow', 'white'],
    rating: 4.5,
    reviews: 100,
    username: 'fashion_store',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'New York, USA',
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: '2',
    name: 'Josiah Lowe',
    image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 55,
    originalPrice: 76,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'pink', 'red', 'black', 'yellow', 'white'],
    rating: 4.6,
    reviews: 110,
    username: 'trendy_boutique',
    userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Los Angeles, USA',
    lat: 34.0522,
    lng: -118.2437,
  },
  {
    id: '3',
    name: 'Orlando Luelwitz',
    image: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 60,
    originalPrice: 82,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'green', 'red', 'black', 'yellow', 'white'],
    rating: 4.7,
    reviews: 120,
    username: 'style_hub',
    userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Chicago, USA',
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    id: '4',
    name: 'Estella Dickens',
    image: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 65,
    originalPrice: 88,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'green', 'red', 'black', 'yellow', 'white'],
    rating: 4.8,
    reviews: 130,
    username: 'chic_closet',
    userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Miami, USA',
    lat: 25.7617,
    lng: -80.1918,
  },
  {
    id: '5',
    name: 'Oral Farrell',
    image: 'https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 70,
    originalPrice: 94,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'green', 'red', 'black', 'yellow', 'white'],
    rating: 4.9,
    reviews: 140,
    username: 'urban_fashion',
    userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Seattle, USA',
    lat: 47.6062,
    lng: -122.3321,
  },
  {
    id: '6',
    name: 'Meaghan Hessel',
    image: 'https://images.pexels.com/photos/1619569/pexels-photo-1619569.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 75,
    originalPrice: 100,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'pink', 'red', 'black', 'yellow', 'white'],
    rating: 4.5,
    reviews: 150,
    username: 'vogue_store',
    userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'San Francisco, USA',
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: '7',
    name: 'Manley Leffler',
    image: 'https://images.pexels.com/photos/3551227/pexels-photo-3551227.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 80,
    originalPrice: 106,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'green', 'red', 'black', 'yellow', 'white'],
    rating: 4.6,
    reviews: 160,
    username: 'modern_wear',
    userAvatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Boston, USA',
    lat: 42.3601,
    lng: -71.0589,
  },
  {
    id: '8',
    name: 'Leland Dibbert',
    image: 'https://images.pexels.com/photos/1037994/pexels-photo-1037994.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 85,
    originalPrice: 112,
    discount: '15%',
    cashback: '5% Cashback',
    sizes: ['S', 'M', 'L'],
    colors: ['blue', 'green', 'red', 'black', 'yellow', 'white'],
    rating: 4.7,
    reviews: 170,
    username: 'elite_boutique',
    userAvatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Austin, USA',
    lat: 30.2672,
    lng: -97.7431,
  },
];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  red: 'bg-red-500',
  black: 'bg-black',
  yellow: 'bg-yellow-400',
  white: 'bg-white border border-gray-300',
  pink: 'bg-pink-500',
};

export default function ShopPage() {
  const router = useRouter();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const toggleFavorite = async (product: typeof mockProducts[0]) => {
    const isInList = isInWishlist(product.id);

    if (isInList) {
      const success = await removeFromWishlist(product.id);
      if (success) {
        toast.success('Removed from wishlist');
      } else {
        toast.error('Failed to remove from wishlist');
      }
    } else {
      const success = await addToWishlist(
        product.id,
        product.name,
        product.price,
        product.image
      );
      if (success) {
        toast.success('Added to wishlist', {
          description: 'This item will be saved for 24 hours',
        });
      } else {
        toast.error('Failed to add to wishlist');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded">
                {product.cashback}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(product);
                }}
                className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isInWishlist(product.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-600'
                  }`}
                />
              </button>
            </div>

            <div className="p-4">
              {product.username && product.userAvatar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/profile/${product.username}`);
                  }}
                  className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={product.userAvatar} />
                    <AvatarFallback>{product.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-gray-900">@{product.username}</span>
                </button>
              )}

              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-xs text-red-500 font-medium">
                  Save {product.discount}
                </span>
              </div>

              <div className="text-xs text-gray-600 mb-3">
                Sizes: {product.sizes.join(', ')}
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-5 h-5 rounded-full ${colorClasses[color]}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs mb-3">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : index < product.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-none text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-gray-900 font-medium ml-1">
                  {product.rating}
                </span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>

              {product.location && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/map?lat=${product.lat}&lng=${product.lng}&type=shop&id=${product.id}&name=${encodeURIComponent(product.name)}`);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Show on map
                </Button>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
