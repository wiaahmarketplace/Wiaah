"use client";

import { Download, Package, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ReturnDetails {
  id: string;
  orderNumber: string;
  itemName: string;
  itemImage: string;
  itemColor?: string;
  itemSize?: string;
  price: number;
  quantity: number;
  returnRequestedDate: string;
  returnApprovedDate?: string;
  returnCompletedDate?: string;
  returnRejectedDate?: string;
  reason: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  refundAmount: number;
  refundMethod: string;
  trackingNumber?: string;
  notes?: string;
}

interface ReturnDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnItem: ReturnDetails | null;
  onCancelRequest?: (id: string) => void;
  onPrintLabel?: (id: string) => void;
}

export function ReturnDetailsDialog({
  open,
  onOpenChange,
  returnItem,
  onCancelRequest,
  onPrintLabel,
}: ReturnDetailsDialogProps) {
  if (!returnItem) return null;

  const handleCancelRequest = () => {
    if (onCancelRequest) {
      onCancelRequest(returnItem.id);
    }
    onOpenChange(false);
  };

  const handlePrintLabel = () => {
    if (onPrintLabel) {
      onPrintLabel(returnItem.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Return Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Return Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Return ID</p>
                <p className="font-medium">{returnItem.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Order Number</p>
                <p className="font-medium">{returnItem.orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(returnItem.status)}`}>
                  {returnItem.status}
                </span>
              </div>
              <div>
                <p className="text-gray-600">Return Requested</p>
                <p className="font-medium">{returnItem.returnRequestedDate}</p>
              </div>
              {returnItem.returnApprovedDate && (
                <div>
                  <p className="text-gray-600">Return Approved</p>
                  <p className="font-medium">{returnItem.returnApprovedDate}</p>
                </div>
              )}
              {returnItem.returnCompletedDate && (
                <div>
                  <p className="text-gray-600">Return Completed</p>
                  <p className="font-medium">{returnItem.returnCompletedDate}</p>
                </div>
              )}
              {returnItem.returnRejectedDate && (
                <div>
                  <p className="text-gray-600">Return Rejected</p>
                  <p className="font-medium">{returnItem.returnRejectedDate}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Item Details</h3>
            <div className="flex gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={returnItem.itemImage}
                  alt={returnItem.itemName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">{returnItem.itemName}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {returnItem.itemColor && (
                    <div>
                      <span className="text-gray-600">Color: </span>
                      <span className="font-medium">{returnItem.itemColor}</span>
                    </div>
                  )}
                  {returnItem.itemSize && (
                    <div>
                      <span className="text-gray-600">Size: </span>
                      <span className="font-medium">{returnItem.itemSize}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Quantity: </span>
                    <span className="font-medium">{returnItem.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Price: </span>
                    <span className="font-medium">${returnItem.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Return Reason</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">{returnItem.reason}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Refund Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Refund Amount</p>
                <p className="font-semibold text-lg">${returnItem.refundAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Refund Method</p>
                <p className="font-medium">{returnItem.refundMethod}</p>
              </div>
            </div>
          </div>

          {returnItem.trackingNumber && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Tracking Number</span>
                </div>
                <p className="text-sm font-mono">{returnItem.trackingNumber}</p>
              </div>
            </div>
          )}

          {returnItem.notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{returnItem.notes}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-6 flex gap-3">
            {returnItem.status === "Pending" && onCancelRequest && (
              <Button
                variant="destructive"
                onClick={handleCancelRequest}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel Return Request
              </Button>
            )}
            {returnItem.status === "Approved" && onPrintLabel && (
              <Button
                variant="default"
                className="bg-black hover:bg-gray-800 flex items-center gap-2"
                onClick={handlePrintLabel}
              >
                <Download className="w-4 h-4" />
                Print Return Label
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
