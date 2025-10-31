"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { generateOrderDetailsPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";
import { WriteReviewDialog } from "@/components/write-review-dialog";
import { ReturnItemsDialog } from "@/components/return-items-dialog";

interface OrderItem {
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  orderNumber: string;
  clientName: string;
  shippingAddress: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  fees: number;
  total: number;
  paymentMethod: string;
  estimatedDelivery: string;
  trackingNumber: string;
  status: string;
  lastUpdated: string;
}

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderDetails | null;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: OrderDetailsDialogProps) {
  const router = useRouter();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

  if (!order) return null;

  const handleAskForReturn = () => {
    setIsReturnDialogOpen(true);
  };

  const handleDownloadPDF = () => {
    try {
      generateOrderDetailsPDF(order);
      toast.success("Order details downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download order details. Please try again.");
      console.error("Failed to generate PDF:", error);
    }
  };

  const handleContactShop = () => {
    router.push("/messages");
  };

  const handleWriteReview = () => {
    setIsReviewDialogOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order informations</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Client Information</span>
                <span className="font-medium">{order.clientName}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Shipping Address</span>
                <span className="font-medium">{order.shippingAddress}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">{order.orderDate}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold">Item</th>
                    <th className="text-left p-4 font-semibold">Image</th>
                    <th className="text-left p-4 font-semibold">Color</th>
                    <th className="text-left p-4 font-semibold">Size</th>
                    <th className="text-left p-4 font-semibold">Price</th>
                    <th className="text-left p-4 font-semibold">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">{item.color}</td>
                      <td className="p-4">{item.size}</td>
                      <td className="p-4">${item.price.toFixed(2)}</td>
                      <td className="p-4">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Discount / Promo Code</span>
                <span className="font-medium text-red-600">- ${order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Fees</span>
                <span className="font-medium">${order.fees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-900 font-semibold">Total</span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Delivery estimation</h3>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Estimated Delivery Date</span>
              <span className="font-medium">{order.estimatedDelivery}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Tracking Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Tracking number</span>
                <span className="font-medium">{order.trackingNumber}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Status</span>
                <span className="font-medium">{order.status}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Last updated</span>
                <span className="font-medium">{order.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleAskForReturn}
            >
              Ask for Return
            </Button>
            <Button
              variant="default"
              className="bg-black hover:bg-gray-800"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleContactShop}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Shop
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleWriteReview}
            >
              Write a Review
            </Button>
          </div>
        </div>
      </DialogContent>

      <WriteReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        item={order.items[0] ? {
          name: order.items[0].name,
          price: order.items[0].price,
          image: order.items[0].image
        } : null}
      />

      <ReturnItemsDialog
        open={isReturnDialogOpen}
        onOpenChange={setIsReturnDialogOpen}
        orderNumber={order.orderNumber}
        items={order.items.map(item => ({
          name: item.name,
          size: item.size,
          image: item.image
        }))}
      />
    </Dialog>
  );
}
