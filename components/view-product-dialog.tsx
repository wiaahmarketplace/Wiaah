'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/optimized-image';
import { X } from 'lucide-react';

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

interface ViewProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>;
    case 'draft':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Draft</Badge>;
    case 'out_of_stock':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Out of Stock</Badge>;
    default:
      return null;
  }
};

const colors = [
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Green', value: 'green', hex: '#10B981' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Yellow', value: 'yellow', hex: '#EAB308' },
];

export function ViewProductDialog({ open, onOpenChange, product }: ViewProductDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          <div className="w-full h-64 bg-gray-100">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              width={800}
              height={256}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{product.productId}</p>
                </div>
                {getStatusBadge(product.status)}
              </div>
              {product.description && (
                <p className="text-gray-600 mt-4">{product.description}</p>
              )}
            </div>

            {product.metaTag && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Meta Tag</h3>
                <p className="text-gray-600">{product.metaTag}</p>
              </div>
            )}

            {(product.images && product.images.length > 0) || product.video ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
                <div className="space-y-4">
                  {product.images && product.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {product.images.map((img, idx) => (
                        <OptimizedImage
                          key={idx}
                          src={img}
                          alt={`Product ${idx + 1}`}
                          width={200}
                          height={200}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  {product.video && (
                    <div className="text-sm text-gray-600">Video: {product.video}</div>
                  )}
                </div>
              </div>
            ) : null}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Attributes</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-base font-medium text-gray-900">{product.category}</p>
                </div>
                {product.subcategory && (
                  <div>
                    <p className="text-sm text-gray-500">Subcategory</p>
                    <p className="text-base font-medium text-gray-900">{product.subcategory}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-base font-medium text-gray-900">{product.price} {product.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="text-base font-medium text-gray-900">{product.stock}</p>
                </div>
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Colors</p>
                    <div className="flex gap-2">
                      {product.colors.map((color) => {
                        const colorObj = colors.find(c => c.value === color);
                        return colorObj ? (
                          <div
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: colorObj.hex }}
                            title={colorObj.name}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Sizes</p>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <span key={size} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.material && (
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="text-base font-medium text-gray-900">{product.material}</p>
                  </div>
                )}
                {product.department && (
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-base font-medium text-gray-900">{product.department}</p>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="text-base font-medium text-gray-900">{product.dimensions}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="text-base font-medium text-gray-900">{product.weight}</p>
                  </div>
                )}
                {product.modelNumber && (
                  <div>
                    <p className="text-sm text-gray-500">Model Number</p>
                    <p className="text-base font-medium text-gray-900">{product.modelNumber}</p>
                  </div>
                )}
                {product.ean && (
                  <div>
                    <p className="text-sm text-gray-500">EAN / UPC</p>
                    <p className="text-base font-medium text-gray-900">{product.ean}</p>
                  </div>
                )}
                {product.productType && (
                  <div>
                    <p className="text-sm text-gray-500">Product Type</p>
                    <p className="text-base font-medium text-gray-900">{product.productType}</p>
                  </div>
                )}
                {product.condition && (
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="text-base font-medium text-gray-900">{product.condition}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-base font-medium text-gray-900">{product.lastUpdated}</p>
                </div>
              </div>
            </div>

            {product.discounts && product.discounts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Discounts</h3>
                <div className="space-y-3">
                  {product.discounts.map((discount) => (
                    <div key={discount.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{discount.name}</p>
                        <p className="text-xs text-gray-500">End date: {discount.endDate}</p>
                      </div>
                      <span className="text-lg font-semibold text-gray-900">{discount.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.shipping && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping</h3>
                <p className="text-base text-gray-900">{product.shipping}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
