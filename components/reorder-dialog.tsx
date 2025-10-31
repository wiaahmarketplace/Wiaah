"use client";

import { ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReorderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
}

export function ReorderDialog({
  open,
  onOpenChange,
  orderNumber,
}: ReorderDialogProps) {
  const handleAddToCart = () => {
    console.log("Item added to cart");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Reorder Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-center py-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Add to Cart?</h3>
            <p className="text-gray-600">
              Would you like to add this item from order #{orderNumber} to your cart?
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1 bg-black hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
