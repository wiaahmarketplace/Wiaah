'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OptimizedImage } from '@/components/optimized-image';
import { Star, ThumbsUp, Pencil, Search } from 'lucide-react';

const mockProducts = [
  {
    id: '1',
    name: 'Classic White Sneakers',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'product' as const,
  },
  {
    id: '2',
    name: 'Leather Handbag',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'product' as const,
  },
  {
    id: '3',
    name: 'Luxury Spa Package',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'service' as const,
  },
  {
    id: '4',
    name: 'Hair Styling Service',
    image: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'service' as const,
  },
];

const mockReviews = [
  {
    id: '1',
    productId: '1',
    productName: 'Classic White Sneakers',
    productImage: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Absolutely love this product! The quality is fantastic, and it fits perfectly. Highly recommend!',
    date: '2 weeks ago',
    likes: 12,
    isService: false,
  },
  {
    id: '2',
    productId: '2',
    productName: 'Leather Handbag',
    productImage: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 4,
    comment: 'Great product overall. The design is stylish, and the material feels durable.',
    date: '1 month ago',
    likes: 8,
    isService: false,
  },
  {
    id: '3',
    productId: '3',
    productName: 'Luxury Spa Package',
    productImage: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 3,
    comment: "It's an okay service. The functionality is decent, but it doesn't stand out.",
    date: '2 months ago',
    likes: 5,
    isService: true,
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 40 },
  { stars: 4, percentage: 30 },
  { stars: 3, percentage: 15 },
  { stars: 2, percentage: 10 },
  { stars: 1, percentage: 5 },
];

export default function ReviewsPage() {
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isSelectProductOpen, setIsSelectProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [reviewLikes, setReviewLikes] = useState<Record<string, number>>(
    mockReviews.reduce((acc, review) => ({ ...acc, [review.id]: review.likes }), {})
  );

  const handleWriteReviewClick = () => {
    setIsSelectProductOpen(true);
  };

  const handleProductSelect = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setIsSelectProductOpen(false);
    setIsWriteReviewOpen(true);
    setRating(0);
    setComment('');
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', { selectedProduct, rating, comment });
    setIsWriteReviewOpen(false);
    setSelectedProduct(null);
    setRating(0);
    setComment('');
  };

  const handleLikeReview = (reviewId: string) => {
    const isLiked = likedReviews[reviewId];
    setLikedReviews((prev) => ({ ...prev, [reviewId]: !isLiked }));
    setReviewLikes((prev) => ({
      ...prev,
      [reviewId]: isLiked ? prev[reviewId] - 1 : prev[reviewId] + 1,
    }));
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${interactive ? 'cursor-pointer' : ''} ${
              star <= (interactive ? hoveredRating || rating : currentRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
              <Button
                onClick={handleWriteReviewClick}
                className="bg-gray-900 hover:bg-gray-800 gap-2"
              >
                <Pencil className="w-4 h-4" />
                Write a Review
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 mb-8">
              <div className="text-6xl font-bold text-gray-900 mb-2">4.5</div>
              <div className="text-sm text-gray-500 mb-6">Based on {mockReviews.length} reviews</div>

              <div className="space-y-3">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900 w-3">{item.stars}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500 ml-3">{review.date}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => handleLikeReview(review.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${
                        likedReviews[review.id]
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <ThumbsUp
                        className={`w-4 h-4 ${likedReviews[review.id] ? 'fill-blue-600' : ''}`}
                      />
                      <span className="font-medium">{reviewLikes[review.id]}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <OptimizedImage
                        src={review.productImage}
                        alt={review.productName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">
                        {review.isService ? 'Service' : 'Product'}
                      </p>
                      <p className="text-sm font-medium text-gray-900">{review.productName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isSelectProductOpen} onOpenChange={setIsSelectProductOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Product/Service to Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{product.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <OptimizedImage
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{selectedProduct.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{selectedProduct.type}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">Your Rating</label>
                {renderStars(rating, true)}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">Your Review</label>
                <Textarea
                  placeholder="Share your experience with this product/service..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || !comment.trim()}
                  className="flex-1 bg-gray-900 hover:bg-gray-800"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
