'use client';

import { useState } from 'react';
import { ArrowLeft, Upload, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DiscountSection } from '@/components/forms/discount-section';

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colors = [
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Yellow', value: 'yellow', hex: '#EAB308' },
];

const sizes = ['S', 'M', 'L', 'XL'];

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <div className="px-8 py-6 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Title & Description</h3>

            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium text-gray-900">
                Product Name
              </Label>
              <Input
                id="productName"
                placeholder="e.g., Handcrafted Leather Wallet"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Write product description..."
                rows={6}
                className="bg-white resize-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">SEO Meta Tag</h3>

            <div className="space-y-2">
              <Label htmlFor="metaTag" className="text-sm font-medium text-gray-900">
                Meta Tag
              </Label>
              <Input
                id="metaTag"
                placeholder="e.g., Handcrafted Leather Wallet"
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Images & Video</h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 bg-white">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-base font-medium text-gray-900 mb-1">
                    Drag and drop image files here
                  </p>
                  <p className="text-sm text-gray-500">Or click to select files</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 bg-white">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-base font-medium text-gray-900 mb-1">
                    Drag and drop video files here
                  </p>
                  <p className="text-sm text-gray-500">Or click to select files</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Product Attributes</h3>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-900">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                defaultValue="0"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory" className="text-sm font-medium text-gray-900">
                Inventory
              </Label>
              <Input
                id="inventory"
                type="number"
                defaultValue="0"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                Category
              </Label>
              <Select>
                <SelectTrigger id="category" className="bg-white">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="watches">Watches</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-sm font-medium text-gray-900">
                Subcategory
              </Label>
              <Select>
                <SelectTrigger id="subcategory" className="bg-white">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="wallets">Wallets</SelectItem>
                  <SelectItem value="belts">Belts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => toggleColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColors.includes(color.value)
                        ? 'border-gray-900 scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Size</Label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-12 h-12 rounded-full text-sm font-medium transition-all ${
                      selectedSizes.includes(size)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-medium text-gray-900">
                Material
              </Label>
              <Select>
                <SelectTrigger id="material" className="bg-white">
                  <SelectValue placeholder="Enter product material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leather">Leather</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="polyester">Polyester</SelectItem>
                  <SelectItem value="wool">Wool</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium text-gray-900">
                Department (Gender)
              </Label>
              <Select>
                <SelectTrigger id="department" className="bg-white">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions" className="text-sm font-medium text-gray-900">
                Product Dimensions
              </Label>
              <Input
                id="dimensions"
                placeholder="LxWxH (in)"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-900">
                Item Weight (lbs)
              </Label>
              <Input
                id="weight"
                placeholder="Enter weight"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelNumber" className="text-sm font-medium text-gray-900">
                Model Number
              </Label>
              <Input
                id="modelNumber"
                placeholder="Enter model number"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ean" className="text-sm font-medium text-gray-900">
                EAN / UPC
              </Label>
              <Input
                id="ean"
                placeholder="Enter EAN/UPC"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType" className="text-sm font-medium text-gray-900">
                Product Type
              </Label>
              <Select>
                <SelectTrigger id="productType" className="bg-white">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Product</SelectItem>
                  <SelectItem value="digital">Digital Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition" className="text-sm font-medium text-gray-900">
                Condition
              </Label>
              <Select defaultValue="new">
                <SelectTrigger id="condition" className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DiscountSection discounts={discounts} onDiscountsChange={setDiscounts} />

          <div className="space-y-2">
            <Label htmlFor="shipping" className="text-sm font-medium text-gray-900">
              Shipping Settings
            </Label>
            <Select>
              <SelectTrigger id="shipping" className="bg-white">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Shipping</SelectItem>
                <SelectItem value="express">Express Shipping</SelectItem>
                <SelectItem value="free">Free Shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-black hover:bg-gray-800 text-white px-8">
              Add Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
