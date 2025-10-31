"use client";

import { Download, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/optimized-image";

interface ReturnItem {
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

interface ReturnOrder {
  id: string;
  status: string;
  orderId: string;
  items: number;
  image: string;
}

interface ReturnOrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnOrder: ReturnOrder | null;
}

export function ReturnOrderDetailsDialog({
  open,
  onOpenChange,
  returnOrder,
}: ReturnOrderDetailsDialogProps) {
  if (!returnOrder) return null;

  const mockReturnData = {
    orderNumber: returnOrder.orderId.replace('#', ''),
    clientName: "Olivia Bennett",
    shippingAddress: "456 Oak Avenue, Anytown, USA",
    orderDate: "01/15/2023",
    items: [
      {
        name: "Handmade Leather Wallet",
        image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=100",
        color: "Brown",
        size: "M",
        price: 50.00,
        quantity: 1,
      },
      {
        name: "Artisan Soap Set",
        image: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=100",
        color: "Black",
        size: "S",
        price: 55.00,
        quantity: 2,
      },
    ],
    subtotal: 55.00,
    shipping: 5.00,
    discount: -5.00,
    fees: 5.00,
    total: 55.00,
    returnReason: "Damaged",
    otherReason: "N/A",
    paymentMethod: "Visa ****-4321",
    deliveryDate: "12/05/2026",
    trackingNumber: "987654321D",
    trackingStatus: "Delivered",
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF for return order:", returnOrder.orderId);
  };

  const handleUpdateStatus = () => {
    console.log("Update status for return order:", returnOrder.orderId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          <DialogHeader className="px-8 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl font-bold">My Return Order Detail</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Informations</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Order Number</span>
                    <span className="font-medium text-gray-900">{mockReturnData.orderNumber}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Client Information</span>
                    <span className="font-medium text-gray-900">{mockReturnData.clientName}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping Address</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">
                      {mockReturnData.shippingAddress}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Order Date</span>
                    <span className="font-medium text-gray-900">{mockReturnData.orderDate}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Item</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Image</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Color</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockReturnData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.name}</td>
                          <td className="py-3 px-4">
                            <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                              <OptimizedImage
                                src={item.image}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.color}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.size}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">${mockReturnData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">${mockReturnData.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Discount / Promo Code</span>
                    <span className="font-medium text-red-600">${mockReturnData.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Fees</span>
                    <span className="font-medium text-gray-900">${mockReturnData.fees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">${mockReturnData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Returned nformation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Return Reason</span>
                    <span className="font-medium text-gray-900">{mockReturnData.returnReason}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Other Reason</span>
                    <span className="font-medium text-gray-900">{mockReturnData.otherReason}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Information</h3>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">{mockReturnData.paymentMethod}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Date</h3>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Delivery Date</span>
                  <span className="font-medium text-gray-900">{mockReturnData.deliveryDate}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tracking Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tracking number</span>
                    <span className="font-medium text-gray-900">{mockReturnData.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-gray-900">{mockReturnData.trackingStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-200 bg-white flex-shrink-0">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleUpdateStatus}
            >
              <FileText className="w-4 h-4" />
              Update Status
            </Button>
            <Button
              variant="default"
              className="bg-black hover:bg-gray-800 text-white gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
