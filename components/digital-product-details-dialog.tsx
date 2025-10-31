"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptimizedImage } from "@/components/optimized-image";

interface DigitalProduct {
  id: string;
  name: string;
  orderId: string;
  image: string;
  description?: string;
  author?: string;
  authorImage?: string;
  purchaseDate?: string;
  totalCost?: number;
  downloaded?: boolean;
  fileUrl?: string;
}

interface DigitalProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: DigitalProduct | null;
  onDownload?: (product: DigitalProduct) => void;
}

export function DigitalProductDetailsDialog({
  open,
  onOpenChange,
  product,
  onDownload,
}: DigitalProductDetailsDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!product) return null;

  const mockProductData = {
    name: "Abstract Art",
    description: "This abstract art piece is a vibrant explosion of color and form, designed to evoke emotion and spark imagination. Perfect for adding a modern touch to any space.",
    author: "Sophie Carter",
    authorImage: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
    purchaseDate: "May 16, 2024",
    totalCost: 29.99,
    downloaded: true,
    image: product.image,
    orderId: product.orderId,
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = product.image;
      link.download = `${mockProductData.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
      if (onDownload) {
        onDownload(product);
      }
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="px-8 pt-6 pb-4">
            <DialogTitle className="text-2xl font-bold">My Digital Product Detail</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 pb-8">
            <div className="space-y-6">
              <div className="bg-[#f5e6d3] rounded-lg p-8 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-4 w-64 h-64">
                  <OptimizedImage
                    src={mockProductData.image}
                    alt={mockProductData.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{mockProductData.name}</h3>
                <p className="text-gray-700 leading-relaxed">{mockProductData.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={mockProductData.authorImage} />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-gray-900 font-medium">{mockProductData.author}</p>
                  <p className="text-xs text-gray-500">Artist/Author</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Purchase Date</span>
                  <span className="font-medium text-gray-900">{mockProductData.purchaseDate}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Cost</span>
                  <span className="font-medium text-gray-900">${mockProductData.totalCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Downloaded</span>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gray-900 h-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-6"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  'Downloading...'
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
