'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddDiscountDialog } from '@/components/add-discount-dialog';

interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'amount';
  value: number;
  startDate: Date;
  endDate: Date;
}

interface DiscountSectionProps {
  discounts: Discount[];
  onDiscountsChange: (discounts: Discount[]) => void;
}

export function DiscountSection({ discounts, onDiscountsChange }: DiscountSectionProps) {
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | undefined>();

  const handleAddDiscount = (discount: Discount) => {
    if (editingDiscount) {
      onDiscountsChange(discounts.map(d => d.id === editingDiscount.id ? discount : d));
      setEditingDiscount(undefined);
    } else {
      onDiscountsChange([...discounts, discount]);
    }
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setDiscountDialogOpen(true);
  };

  const handleRemoveDiscount = (discountId: string) => {
    onDiscountsChange(discounts.filter(d => d.id !== discountId));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDialogClose = (open: boolean) => {
    setDiscountDialogOpen(open);
    if (!open) {
      setEditingDiscount(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-2xl font-bold">Discount List</h2>
        <Button
          type="button"
          onClick={() => setDiscountDialogOpen(true)}
          className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-lg px-6"
        >
          Add New Discount
        </Button>
      </div>

      {discounts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-bold text-base">Discount Name</th>
                <th className="text-left py-4 px-4 font-bold text-base">Type</th>
                <th className="text-left py-4 px-4 font-bold text-base">Value</th>
                <th className="text-left py-4 px-4 font-bold text-base">Start Date</th>
                <th className="text-left py-4 px-4 font-bold text-base">End Date</th>
                <th className="text-left py-4 px-4 font-bold text-base">Status</th>
                <th className="text-left py-4 px-4 font-bold text-base">Action</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => {
                const now = new Date();
                const start = new Date(discount.startDate);
                const end = new Date(discount.endDate);
                const isActive = now >= start && now <= end;

                return (
                  <tr key={discount.id} className="border-b">
                    <td className="py-6 px-4">
                      <span className="text-base">{discount.name}</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-base capitalize">{discount.type}</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-base font-semibold">
                        {discount.type === 'percentage'
                          ? `${discount.value}%`
                          : `$${discount.value.toFixed(2)}`}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-base">{formatDate(discount.startDate)}</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-base">{formatDate(discount.endDate)}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="inline-flex items-center justify-center px-6 py-2 rounded-lg border-2 border-emerald-400 bg-emerald-50">
                        <span className="text-base font-medium">
                          {isActive ? 'active' : 'inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleEditDiscount(discount)}
                          className="text-base font-medium hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDiscount(discount.id)}
                          className="text-base font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-lg text-gray-600 font-medium">No discounts added yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Click "Add New Discount" to create your first discount
          </p>
        </div>
      )}

      <AddDiscountDialog
        open={discountDialogOpen}
        onOpenChange={handleDialogClose}
        onAddDiscount={handleAddDiscount}
        existingDiscount={editingDiscount}
      />
    </div>
  );
}
