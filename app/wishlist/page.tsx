'use client';

import { useRouter } from 'next/navigation';
import { Heart, Star, Trash2, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, loading, removeFromWishlist, cleanupExpired } = useWishlist();

  const handleRemove = async (productId: string, productName: string) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      toast.success(`${productName} removed from wishlist`);
    } else {
      toast.error('Failed to remove item');
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-600 mt-1">
              Items saved for 24 hours ({wishlistItems.length} items)
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button
              onClick={cleanupExpired}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Clock className="w-4 h-4" />
              Cleanup Expired
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding items to your wishlist and they'll appear here
            </p>
            <Button onClick={() => router.push('/shop')}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-56 object-cover cursor-pointer"
                    onClick={() => router.push(`/product/${item.productId}`)}
                  />
                  <button
                    onClick={() => handleRemove(item.productId, item.productName)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-xs font-medium px-3 py-2 rounded">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeRemaining(item.expiresAt)}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3
                    className="font-semibold text-gray-900 mb-2 text-sm cursor-pointer hover:text-gray-700"
                    onClick={() => router.push(`/product/${item.productId}`)}
                  >
                    {item.productName}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.productPrice}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => router.push(`/product/${item.productId}`)}
                      className="flex-1"
                      size="sm"
                    >
                      View Product
                    </Button>
                    <Button
                      onClick={() => handleRemove(item.productId, item.productName)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
