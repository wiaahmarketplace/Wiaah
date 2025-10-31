'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { X } from 'lucide-react';

interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'amount';
  value: number;
  startDate: Date;
  endDate: Date;
}

interface AddDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDiscount: (discount: Discount) => void;
  existingDiscount?: Discount;
}

export function AddDiscountDialog({
  open,
  onOpenChange,
  onAddDiscount,
  existingDiscount
}: AddDiscountDialogProps) {
  const [discountName, setDiscountName] = useState(existingDiscount?.name || '');
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>(
    existingDiscount?.type || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState(
    existingDiscount?.value?.toString() || ''
  );
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: existingDiscount?.startDate || new Date(),
    to: existingDiscount?.endDate || new Date()
  });
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const handleSave = () => {
    if (!discountName || !discountValue || selectedDates.length === 0) {
      return;
    }

    const discount: Discount = {
      id: existingDiscount?.id || `discount-${Date.now()}`,
      name: discountName,
      type: discountType,
      value: parseFloat(discountValue),
      startDate: selectedDates[0],
      endDate: selectedDates[selectedDates.length - 1]
    };

    onAddDiscount(discount);
    handleClose();
  };

  const handleClose = () => {
    setDiscountName('');
    setDiscountType('percentage');
    setDiscountValue('');
    setSelectedDates([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add Discounts</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="discountName" className="text-base font-semibold mb-2 block">
              Name
            </Label>
            <Input
              id="discountName"
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
              placeholder="Discount name"
              className="bg-gray-50 border-0"
            />
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">
              Discount Type
            </Label>
            <RadioGroup value={discountType} onValueChange={(value: 'percentage' | 'amount') => setDiscountType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="font-normal cursor-pointer">
                  Percentage (%)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amount" id="amount" />
                <Label htmlFor="amount" className="font-normal cursor-pointer">
                  Fixed Amount ($)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {discountType === 'percentage' ? (
            <div>
              <Label htmlFor="discountPercent" className="text-base font-semibold mb-2 block">
                Discount percent
              </Label>
              <div className="relative">
                <Input
                  id="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="%"
                  className="bg-gray-50 border-0 pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="discountPrice" className="text-base font-semibold mb-2 block">
                Price
              </Label>
              <div className="relative">
                <Input
                  id="discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="$0.00"
                  className="bg-gray-50 border-0 pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
              </div>
            </div>
          )}

          <div>
            <Label className="text-base font-semibold mb-3 block">
              Select dates
            </Label>
            <div className="border rounded-lg bg-white">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                numberOfMonths={2}
                className="rounded-md"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
            {selectedDates.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={!discountName || !discountValue || selectedDates.length === 0}
            className="w-full h-12 text-base font-semibold rounded-full"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
