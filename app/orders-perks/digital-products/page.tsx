'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/optimized-image';
import { DigitalProductDetailsDialog } from '@/components/digital-product-details-dialog';

const mockProducts = [
  {
    id: '1',
    name: 'Product A',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    name: 'Product A',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    name: 'Product A',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '4',
    name: 'Product B',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '5',
    name: 'Product B',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '6',
    name: 'Product B',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '7',
    name: 'Product B',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '8',
    name: 'Product B',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '9',
    name: 'Product B',
    orderId: '8124567890',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function DigitalProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const totalPages = 5;

  const handleDownload = (product: typeof mockProducts[0]) => {
    const link = document.createElement('a');
    link.href = product.image;
    link.download = `${product.name.replace(/\s+/g, '-').toLowerCase()}-${product.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Digital Products</h1>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="divide-y">
                {mockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <OptimizedImage
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">Order #{product.orderId}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gray-900 hover:bg-gray-800"
                        onClick={() => handleDownload(product)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      <DigitalProductDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        product={selectedProduct}
        onDownload={handleDownload}
      />
    </div>
  );
}
