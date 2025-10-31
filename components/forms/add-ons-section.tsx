'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface AddOn {
  name: string;
  description: string;
  price: string;
  required: boolean;
}

interface AddOnsSectionProps {
  addOns: AddOn[];
  onAddOnsChange: (addOns: AddOn[]) => void;
}

export function AddOnsSection({ addOns, onAddOnsChange }: AddOnsSectionProps) {
  const addNewAddOn = () => {
    onAddOnsChange([
      ...addOns,
      { name: '', description: '', price: '', required: false }
    ]);
  };

  const removeAddOn = (index: number) => {
    onAddOnsChange(addOns.filter((_, i) => i !== index));
  };

  const updateAddOn = (index: number, field: keyof AddOn, value: any) => {
    const updated = [...addOns];
    updated[index] = { ...updated[index], [field]: value };
    onAddOnsChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-2 block">Add-ons & Extras</Label>
        <p className="text-sm text-gray-600">
          Offer additional services or items that guests can add to their booking
        </p>
      </div>

      <div className="space-y-4">
        {addOns.map((addOn, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white space-y-4">
            <div className="flex items-start justify-between">
              <Label className="text-sm font-medium">Add-on {index + 1}</Label>
              <button
                type="button"
                onClick={() => removeAddOn(index)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`addon-name-${index}`}>Name *</Label>
                <Input
                  id={`addon-name-${index}`}
                  value={addOn.name}
                  onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                  placeholder="e.g., Airport Transfer"
                />
              </div>

              <div>
                <Label htmlFor={`addon-price-${index}`}>Price (USD)</Label>
                <Input
                  id={`addon-price-${index}`}
                  type="number"
                  step="0.01"
                  value={addOn.price}
                  onChange={(e) => updateAddOn(index, 'price', e.target.value)}
                  placeholder="25.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`addon-description-${index}`}>Description</Label>
              <Input
                id={`addon-description-${index}`}
                value={addOn.description}
                onChange={(e) => updateAddOn(index, 'description', e.target.value)}
                placeholder="Brief description of this add-on"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`addon-required-${index}`}
                checked={addOn.required}
                onCheckedChange={(checked) => updateAddOn(index, 'required', checked)}
              />
              <Label htmlFor={`addon-required-${index}`} className="font-normal cursor-pointer">
                Required add-on (guests must include this)
              </Label>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addNewAddOn}
        className="w-full border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Add-on
      </Button>
    </div>
  );
}
