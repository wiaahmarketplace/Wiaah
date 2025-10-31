'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, X } from 'lucide-react';

interface Product {
  id: string;
  productId: string;
  name: string;
  description?: string;
  metaTag?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  stock: number;
  status: string;
  image: string;
  images?: string[];
  video?: string;
  colors?: string[];
  sizes?: string[];
  material?: string;
  department?: string;
  dimensions?: string;
  weight?: string;
  modelNumber?: string;
  ean?: string;
  productType?: string;
  condition?: string;
  discounts?: Array<{ id: number; name: string; endDate: string; percentage: number }>;
  shipping?: string;
  lastUpdated: string;
}

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave?: (product: Product) => void;
}

const colors = [
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Yellow', value: 'yellow', hex: '#EAB308' },
];

const sizes = ['S', 'M', 'L', 'XL'];

export function EditProductDialog({ open, onOpenChange, product, onSave }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        colors: product.colors || [],
        sizes: product.sizes || [],
        images: product.images || [],
        discounts: product.discounts || [],
      });
    }
  }, [product]);

  if (!product || !formData) return null;

  const handleSave = () => {
    if (onSave && formData) {
      onSave(formData);
    }
    onOpenChange(false);
  };

  const toggleColor = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors?.includes(color)
        ? formData.colors.filter(c => c !== color)
        : [...(formData.colors || []), color]
    });
  };

  const toggleSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes?.includes(size)
        ? formData.sizes.filter(s => s !== size)
        : [...(formData.sizes || []), size]
    });
  };

  const addDiscount = () => {
    setFormData({
      ...formData,
      discounts: [...(formData.discounts || []), { id: Date.now(), name: '', endDate: '', percentage: 0 }]
    });
  };

  const removeDiscount = (id: number) => {
    setFormData({
      ...formData,
      discounts: formData.discounts?.filter(d => d.id !== id) || []
    });
  };

  const updateDiscount = (id: number, field: string, value: string | number) => {
    setFormData({
      ...formData,
      discounts: formData.discounts?.map(d =>
        d.id === id ? { ...d, [field]: value } : d
      ) || []
    });
  };

  const handleFileUpload = (file: File, type: 'image' | 'video') => {
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'image') {
        setFormData({
          ...formData,
          images: [...(formData.images || []), result]
        });
      } else {
        setFormData({ ...formData, video: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFileUpload(file, 'image'));
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file, 'video');
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <div className="px-8 py-6 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-sm text-gray-500 mt-1">{product.productId}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Title & Description</h3>

            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium text-gray-900">
                Product Name
              </Label>
              <Input
                id="productName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                value={formData.metaTag || ''}
                onChange={(e) => setFormData({ ...formData, metaTag: e.target.value })}
                placeholder="e.g., Handcrafted Leather Wallet"
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Images & Video</h3>

            <div className="space-y-4">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => handleFileUpload(file, 'image'));
                }}
                className="hidden"
              />

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group">
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={() => imageInputRef.current?.click()}
                onDrop={handleImageDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                onDragLeave={() => setIsDraggingImage(false)}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                  isDraggingImage ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 bg-white">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-base font-medium text-gray-900 mb-1">
                    Drag and drop image files here
                  </p>
                  <p className="text-sm text-gray-500">Or click to select files</p>
                </div>
              </div>

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'video');
                }}
                className="hidden"
              />

              <div
                onClick={() => videoInputRef.current?.click()}
                onDrop={handleVideoDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true); }}
                onDragLeave={() => setIsDraggingVideo(false)}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                  isDraggingVideo ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
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
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
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
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-900">
                Category
              </Label>
              <Select
                value={formData.category.toLowerCase()}
                onValueChange={(value) => setFormData({ ...formData, category: value.charAt(0).toUpperCase() + value.slice(1) })}
              >
                <SelectTrigger id="category" className="bg-white">
                  <SelectValue />
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
              <Select
                value={formData.subcategory || ''}
                onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
              >
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
                      formData.colors?.includes(color.value)
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
                      formData.sizes?.includes(size)
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
              <Select
                value={formData.material || ''}
                onValueChange={(value) => setFormData({ ...formData, material: value })}
              >
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
              <Select
                value={formData.department || ''}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
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
                value={formData.dimensions || ''}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
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
                value={formData.weight || ''}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
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
                value={formData.modelNumber || ''}
                onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
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
                value={formData.ean || ''}
                onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                placeholder="Enter EAN/UPC"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType" className="text-sm font-medium text-gray-900">
                Product Type
              </Label>
              <Select
                value={formData.productType || ''}
                onValueChange={(value) => setFormData({ ...formData, productType: value })}
              >
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
              <Select
                value={formData.condition || 'new'}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
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

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status" className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Special Discount (%)</h3>

            {formData.discounts && formData.discounts.map((discount) => (
              <div key={discount.id} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-gray-900">Discount Details</Label>
                  <button
                    onClick={() => removeDiscount(discount.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  placeholder="Discount name"
                  value={discount.name}
                  onChange={(e) => updateDiscount(discount.id, 'name', e.target.value)}
                  className="bg-white"
                />
                <Input
                  placeholder="End date"
                  value={discount.endDate}
                  onChange={(e) => updateDiscount(discount.id, 'endDate', e.target.value)}
                  className="bg-white"
                />
                <Input
                  type="number"
                  placeholder="Percentage"
                  value={discount.percentage}
                  onChange={(e) => updateDiscount(discount.id, 'percentage', parseFloat(e.target.value) || 0)}
                  className="bg-white"
                />
              </div>
            ))}

            <button
              onClick={addDiscount}
              className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Add discount
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping" className="text-sm font-medium text-gray-900">
              Shipping Settings
            </Label>
            <Select
              value={formData.shipping || ''}
              onValueChange={(value) => setFormData({ ...formData, shipping: value })}
            >
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black hover:bg-gray-800 text-white px-8"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
