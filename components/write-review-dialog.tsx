"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface ReviewItem {
  name: string;
  price: number;
  image: string;
}

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ReviewItem | null;
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  item,
}: WriteReviewDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");

  if (!item) return null;

  const handleSubmitReview = () => {
    console.log("Submit review:", { rating, review });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">Write a review</h2>

          <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.name}
              width={600}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
            <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-center">How would you rate this product?</h3>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setRating(stars)}
                  className={`flex items-center gap-0.5 px-3 py-2 rounded-lg border-2 transition-all ${
                    rating === stars
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gray-900 text-gray-900"
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Write your review</h3>
            <Textarea
              placeholder="Share your thoughts..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px] resize-none text-sm"
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2.5 text-sm rounded-lg"
          >
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
