'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { OptimizedImage } from '@/components/optimized-image';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { generateReturnedOrderPDF } from '@/lib/pdf-generator';

interface ReturnItem {
  id: number;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

interface ReturnDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  returnOrder: {
    id: number;
    status: string;
    orderNumber: string;
    itemCount: number;
    items: ReturnItem[];
    returnDate: string;
    reason: string;
    refundAmount: number;
    refundStatus: string;
  } | null;
}

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  orderNumber: string;
  onStatusUpdate: (newStatus: string) => void;
}

function UpdateStatusDialog({ isOpen, onClose, currentStatus, orderNumber, onStatusUpdate }: UpdateStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    'Return Initiated',
    'Return In Transit',
    'Return Received',
    'Return Completed',
    'Refund Issued',
    'Refund Processing',
    'Refund Completed'
  ];

  const handleUpdate = () => {
    onStatusUpdate(selectedStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Status</h2>
            <p className="text-gray-600">Order #{orderNumber}</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Select New Status</label>
            <div className="space-y-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                    selectedStatus === status
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{status}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              className="w-full bg-gray-900 hover:bg-gray-800"
              onClick={handleUpdate}
            >
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ReturnDetailsPopup({ isOpen, onClose, returnOrder }: ReturnDetailsPopupProps) {
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(returnOrder?.status || '');

  if (!returnOrder) return null;

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus);
  };

  const mockOrderData = {
    clientName: 'Ossie Bennett',
    shippingAddress: '456 Oak Avenue, Anytown, USA',
    orderDate: '01/15/2024',
    subtotal: 50.00,
    shipping: 0.00,
    discount: -5.00,
    fees: 5.00,
    total: 50.00,
    paymentMethod: 'Visa *** 4321',
    deliveryDate: '12/05/2026',
    trackingNumber: '9876543210',
    otherReason: 'N/A'
  };

  const handleDownloadPDF = () => {
    generateReturnedOrderPDF(returnOrder, mockOrderData);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white p-0 gap-0 max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">Returned Order Detail</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-8 py-6 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium text-gray-900">{returnOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Client Information</span>
                  <span className="font-medium text-gray-900">{mockOrderData.clientName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Shipping Address</span>
                  <span className="font-medium text-gray-900 text-right max-w-xs">{mockOrderData.shippingAddress}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium text-gray-900">{mockOrderData.orderDate}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Item</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Image</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Color</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Size</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnOrder.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-2 text-sm text-gray-900">{item.name}</td>
                        <td className="py-4 px-2">
                          <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-4 px-2 text-sm text-gray-900">Brown</td>
                        <td className="py-4 px-2 text-sm text-gray-900">{item.size}</td>
                        <td className="py-4 px-2 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="py-4 px-2 text-sm text-gray-900">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${mockOrderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">${mockOrderData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount / Promo Code</span>
                  <span className="font-medium text-red-600">${mockOrderData.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees</span>
                  <span className="font-medium text-gray-900">${mockOrderData.fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${mockOrderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Returned Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Return Reason</span>
                  <span className="font-medium text-gray-900">Damaged</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Other Reason</span>
                  <span className="font-medium text-gray-900">{mockOrderData.otherReason}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">{mockOrderData.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery Date</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Delivery Date</span>
                  <span className="font-medium text-gray-900">{mockOrderData.deliveryDate}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tracking Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tracking number</span>
                  <span className="font-medium text-gray-900">{mockOrderData.trackingNumber}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-gray-900">Delivered</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-center gap-3">
            <Button
              variant="default"
              className="bg-gray-900 hover:bg-gray-800 px-8"
              onClick={() => setIsUpdateStatusOpen(true)}
            >
              Update Status
            </Button>
            <Button
              variant="outline"
              className="px-8 gap-2"
              onClick={handleDownloadPDF}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="px-8"
              onClick={() => {}}
            >
              Contact Shop
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpdateStatusDialog
        isOpen={isUpdateStatusOpen}
        onClose={() => setIsUpdateStatusOpen(false)}
        currentStatus={currentStatus}
        orderNumber={returnOrder.orderNumber}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}
