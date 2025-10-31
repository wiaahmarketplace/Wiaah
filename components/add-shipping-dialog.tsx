'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X } from 'lucide-react';

interface AddShippingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddShippingDialog({ isOpen, onClose }: AddShippingDialogProps) {
  const [shippingName, setShippingName] = useState('');
  const [shippingType, setShippingType] = useState<'Free' | 'Paid' | 'Click & Collect'>('Free');
  const [companyName, setCompanyName] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [shippingRegion, setShippingRegion] = useState<'national' | 'international'>('national');
  const [nationalPrice, setNationalPrice] = useState('');
  const [internationalPrice, setInternationalPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      shippingName,
      shippingType,
      companyName,
      deliveryTime,
      shippingRegion,
      nationalPrice,
      internationalPrice,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 gap-0 max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Add Shipping Method</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shipping-name" className="text-base font-semibold text-gray-900">
              Shipping Name
            </Label>
            <Input
              id="shipping-name"
              placeholder="Enter shipping name"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-900">Shipping Type</Label>
            <Select value={shippingType} onValueChange={(value: 'Free' | 'Paid' | 'Click & Collect') => setShippingType(value)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select shipping type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Click & Collect">Click & Collect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-name" className="text-base font-semibold text-gray-900">
              Shipping Company Name
            </Label>
            <Input
              id="company-name"
              placeholder="Enter shipping company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          {shippingType === 'Paid' && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">Shipping Region</Label>
                <RadioGroup value={shippingRegion} onValueChange={(value: 'national' | 'international') => setShippingRegion(value)} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="national" id="national" className="w-5 h-5" />
                    <Label htmlFor="national" className="text-base font-normal cursor-pointer">
                      National
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="international" id="international" className="w-5 h-5" />
                    <Label htmlFor="international" className="text-base font-normal cursor-pointer">
                      International
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="national-price" className="text-base font-semibold text-gray-900">
                  National Shipping Price
                </Label>
                <Input
                  id="national-price"
                  type="number"
                  step="0.01"
                  placeholder="Enter national shipping price"
                  value={nationalPrice}
                  onChange={(e) => setNationalPrice(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="international-price" className="text-base font-semibold text-gray-900">
                  International Shipping Price
                </Label>
                <Input
                  id="international-price"
                  type="number"
                  step="0.01"
                  placeholder="Enter international shipping price"
                  value={internationalPrice}
                  onChange={(e) => setInternationalPrice(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="delivery-time" className="text-base font-semibold text-gray-900">
              Delivery Time
            </Label>
            <Input
              id="delivery-time"
              placeholder="e.g., 3-5 business days"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-medium bg-black hover:bg-gray-800 text-white"
            >
              Add Shipping Method
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
