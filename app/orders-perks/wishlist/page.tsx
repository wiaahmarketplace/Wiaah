'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/optimized-image';
import { useWishlist } from '@/hooks/use-wishlist';
import { toast } from 'sonner';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = wishlistItems.slice(startIndex, endIndex);

  const handleRemove = async (productId: string, productName: string) => {
    const success = await removeFromWishlist(productId);
    if (success) {
      toast.success('Removed from wishlist');
    } else {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = (productId: string) => {
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex">
          <OrdersPerksSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <p className="text-gray-600 mb-6">Your wishlist is empty</p>
                <Button onClick={() => router.push('/shop')}>
                  Browse Products
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-medium text-gray-700">
                    <div className="col-span-1">Image</div>
                    <div className="col-span-4">Product Title</div>
                    <div className="col-span-2 text-center">Unit Price</div>
                    <div className="col-span-2 text-center">Stock</div>
                    <div className="col-span-3 text-center">Action</div>
                  </div>

                  <div className="divide-y">
                    {currentItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                        <div className="col-span-1">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={item.productImage}
                              alt={item.productName}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="col-span-4">
                          <h3 className="font-medium text-gray-900">{item.productName}</h3>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="font-semibold text-gray-900">${item.productPrice}</span>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Available
                          </span>
                        </div>

                        <div className="col-span-3 flex gap-2 justify-center">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(item.productId)}
                            className="bg-gray-900 hover:bg-gray-800"
                          >
                            Add to cart
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemove(item.productId, item.productName)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      &lt;
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded ${
                          currentPage === page
                            ? 'bg-gray-900 text-white'
                            : 'border hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
