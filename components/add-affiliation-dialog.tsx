'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface AddAffiliationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockProducts = [
  { id: '1', name: 'Product 1' },
  { id: '2', name: 'Product 2' },
  { id: '3', name: 'Product 3' },
  { id: '4', name: 'Product 4' },
  { id: '5', name: 'Product 5' },
];

const commissionPercentages = ['5', '10', '15', '20', '25', '30'];

export function AddAffiliationDialog({ isOpen, onClose }: AddAffiliationDialogProps) {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [commissionPercent, setCommissionPercent] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleCreate = () => {
    console.log('Creating affiliation:', {
      product: selectedProduct,
      commission: commissionPercent,
      expiryDate,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white p-0 gap-0 max-w-4xl">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Create New Affiliation</h2>
          </div>

          <div className="border-t border-gray-200 pt-8 space-y-6">
            <div className="space-y-3">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full h-16 text-lg text-gray-500 bg-white border-2 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-xl font-semibold text-gray-900">
                Set Commission Percent
              </label>
              <Select value={commissionPercent} onValueChange={setCommissionPercent}>
                <SelectTrigger className="w-full h-16 text-lg text-gray-500 bg-white border-2 border-gray-200 rounded-xl">
                  <SelectValue placeholder="Commission %" />
                </SelectTrigger>
                <SelectContent>
                  {commissionPercentages.map((percent) => (
                    <SelectItem key={percent} value={percent}>
                      {percent}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={expiryDate ? format(expiryDate, 'PPP') : ''}
                      placeholder="Choose Expiry Date"
                      className="w-full h-16 px-6 text-lg text-gray-500 bg-white border-2 border-gray-200 rounded-xl outline-none cursor-pointer"
                    />
                    <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-900 pointer-events-none" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={expiryDate}
                    onSelect={(date) => {
                      setExpiryDate(date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleCreate}
                className="bg-green-400 hover:bg-green-500 text-white px-12 py-6 text-lg font-medium rounded-lg"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
