"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingOption {
  id: number;
  name: string;
  description: string;
  type?: string;
  companyName?: string;
  nationalPrice?: string;
  internationalPrice?: string;
}

interface EditShippingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipping: ShippingOption | null;
  onSave: (shipping: ShippingOption) => void;
}

export function EditShippingDialog({
  isOpen,
  onClose,
  shipping,
  onSave,
}: EditShippingDialogProps) {
  const [shippingName, setShippingName] = useState("");
  const [shippingType, setShippingType] = useState("free");
  const [companyName, setCompanyName] = useState("");
  const [nationalPrice, setNationalPrice] = useState("");
  const [internationalPrice, setInternationalPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    if (shipping) {
      setShippingName(shipping.name);
      setShippingType(shipping.type || "free");
      setCompanyName(shipping.companyName || "");
      setNationalPrice(shipping.nationalPrice || "");
      setInternationalPrice(shipping.internationalPrice || "");
      setDeliveryTime(shipping.description);
    }
  }, [shipping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shipping) {
      onSave({
        ...shipping,
        name: shippingName,
        description: deliveryTime,
        type: shippingType,
        companyName,
        nationalPrice,
        internationalPrice,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Shipping Method</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="shipping-name">Shipping Name</Label>
            <Input
              id="shipping-name"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
              placeholder="e.g., Free Shipping, Express"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping-type">Shipping Type</Label>
            <Select value={shippingType} onValueChange={setShippingType}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipping type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="click-collect">Click & Collect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name">Shipping Company Name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., FedEx, UPS, DHL"
            />
          </div>

          {shippingType === "paid" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="national-price">National Shipping Price</Label>
                <Input
                  id="national-price"
                  type="number"
                  step="0.01"
                  value={nationalPrice}
                  onChange={(e) => setNationalPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="international-price">International Shipping Price</Label>
                <Input
                  id="international-price"
                  type="number"
                  step="0.01"
                  value={internationalPrice}
                  onChange={(e) => setInternationalPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="delivery-time">Delivery Time</Label>
            <Input
              id="delivery-time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              placeholder="e.g., 4-8 business days"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
