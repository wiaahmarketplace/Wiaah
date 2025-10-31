'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShopSidebar } from '@/components/shop-sidebar';
import { OptimizedImage } from '@/components/optimized-image';
import { AddProductDialog } from '@/components/add-product-dialog';
import { ViewProductDialog } from '@/components/view-product-dialog';
import { EditProductDialog } from '@/components/edit-product-dialog';
import { Header } from '@/components/header';

const mockProducts = [
  {
    id: '1',
    productId: '#PROD-1000',
    name: 'Wireless Headphones',
    category: 'Accessories',
    price: 7,
    currency: '€',
    stock: 0,
    status: 'inactive',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastUpdated: '27 Oct 2025 at 05:54 pm'
  },
  {
    id: '2',
    productId: '#PROD-1001',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: 14,
    currency: '€',
    stock: 0,
    status: 'draft',
    image: 'https://images.pexels.com/photos/1688219/pexels-photo-1688219.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastUpdated: '27 Oct 2025 at 05:54 pm'
  },
  {
    id: '3',
    productId: '#PROD-1002',
    name: 'Designer Jacket',
    category: 'Clothing',
    price: 28,
    currency: '€',
    stock: 0,
    status: 'out_of_stock',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastUpdated: '24 Oct 2025 at 06:54 pm'
  },
  {
    id: '4',
    productId: '#PROD-1003',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 35,
    currency: '€',
    stock: 0,
    status: 'active',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastUpdated: '21 Oct 2025 at 06:54 pm'
  },
  {
    id: '5',
    productId: '#PROD-1004',
    name: 'Luxury Watch',
    category: 'Watches',
    price: 20,
    currency: '€',
    stock: 0,
    status: 'active',
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastUpdated: '27 Oct 2025 at 05:54 pm'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>;
    case 'inactive':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>;
    case 'draft':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Draft</span>;
    case 'out_of_stock':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Out of Stock</span>;
    default:
      return null;
  }
};

export default function ProductCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<typeof mockProducts[0] | null>(null);
  const [editProduct, setEditProduct] = useState<typeof mockProducts[0] | null>(null);
  const [products, setProducts] = useState(mockProducts);

  const handleSaveProduct = (updatedProduct: typeof mockProducts[0]) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="product-catalog" />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
              <Button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>

            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>

              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="watches">Watches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                      Product
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                      Product ID
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                      Price
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                      Stock
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Last Updated
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-medium text-gray-700 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === products.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <OptimizedImage
                              src={product.image}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-gray-900">{product.productId}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{product.category}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{product.price} {product.currency}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">{product.stock}</span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{product.lastUpdated}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm">
                          <button
                            onClick={() => setViewProduct(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => setEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AddProductDialog
        open={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
      />

      <ViewProductDialog
        open={!!viewProduct}
        onOpenChange={(open) => !open && setViewProduct(null)}
        product={viewProduct}
      />

      <EditProductDialog
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        product={editProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
