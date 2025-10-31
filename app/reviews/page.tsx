"use client";

import { useState, useEffect } from "react";
import { ShopSidebar } from "@/components/shop-sidebar";
import { ServiceSidebar } from "@/components/service-sidebar";
import { OptimizedImage } from "@/components/optimized-image";
import { Star, ThumbsUp } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { Header } from "@/components/header";
import { useSearchParams } from "next/navigation";

const reviewsData = [
  {
    id: 1,
    name: "Sophia Carter",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 5,
    timeAgo: "2 weeks ago",
    comment: "Absolutely love this product! The quality is fantastic, and it fits perfectly. Highly recommend!",
    likes: 12,
    productImage: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100",
    productName: "Classic White Sneakers",
    isService: false,
  },
  {
    id: 2,
    name: "Ethan Bennett",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 4,
    timeAgo: "1 month ago",
    comment: "Great product overall. The design is stylish, and the material feels durable.",
    likes: 8,
    productImage: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100",
    productName: "Leather Handbag",
    isService: false,
  },
  {
    id: 3,
    name: "Olivia Hayes",
    avatar: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100",
    rating: 3,
    timeAgo: "2 months ago",
    comment: "It's an okay product. The functionality is decent, but it doesn't stand out.",
    likes: 5,
    productImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=100",
    productName: "Luxury Spa Package",
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
  const searchParams = useSearchParams();
  const context = searchParams.get('context') || 'service';
  const [currentPage, setCurrentPage] = useState(1);
  const [likedReviews, setLikedReviews] = useState<Record<number, boolean>>({});
  const [reviewLikes, setReviewLikes] = useState<Record<number, number>>(
    reviewsData.reduce((acc, review) => ({ ...acc, [review.id]: review.likes }), {})
  );
  const itemsPerPage = 3;

  const totalPages = Math.ceil(reviewsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = reviewsData.slice(startIndex, endIndex);

  const handleLikeReview = (reviewId: number) => {
    const isLiked = likedReviews[reviewId];
    setLikedReviews(prev => ({ ...prev, [reviewId]: !isLiked }));
    setReviewLikes(prev => ({
      ...prev,
      [reviewId]: isLiked ? prev[reviewId] - 1 : prev[reviewId] + 1
    }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        {context === 'shop' ? (
          <ShopSidebar activePage="reviews" />
        ) : (
          <ServiceSidebar activePage="reviews" />
        )}

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Reviews</h1>

            <div className="mb-12">
              <div className="text-6xl font-bold text-gray-900 mb-2">4.5</div>
              <div className="text-sm text-gray-500 mb-6">120 reviews</div>

              <div className="space-y-3">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900 w-3">
                      {item.stars}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full"
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

            <div className="space-y-8">
              {currentItems.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <OptimizedImage
                        src={review.avatar}
                        alt={review.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {review.name}
                          </h3>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.timeAgo}</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{review.comment}</p>

                      <div className="flex items-center gap-4 mb-3">
                        <button
                          onClick={() => handleLikeReview(review.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            likedReviews[review.id]
                              ? 'text-blue-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 ${
                              likedReviews[review.id] ? 'fill-blue-600' : ''
                            }`}
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
                          <p className="text-sm font-medium text-gray-900">
                            {review.productName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
