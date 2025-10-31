'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OptimizedImage } from '@/components/optimized-image';
import { ReturnOrderDetailsDialog } from '@/components/return-order-details-dialog';
import { Search, Plus } from 'lucide-react';

const mockReturns = [
  {
    id: '1',
    status: 'Return Initiated',
    orderId: '#987654321D',
    items: 2,
    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '2',
    status: 'Return Completed',
    orderId: '#1023384756',
    items: 1,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    status: 'Refund Issued',
    orderId: '#6547382910',
    items: 3,
    image: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '4',
    status: 'Return Initiated',
    orderId: '#987654321D',
    items: 2,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '5',
    status: 'Return Completed',
    orderId: '#1023384756',
    items: 1,
    image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '6',
    status: 'Refund Issued',
    orderId: '#6547382910',
    items: 3,
    image: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '7',
    status: 'Refund Issued',
    orderId: '#6547382910',
    items: 3,
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState<typeof mockReturns[0] | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const totalPages = 5;

  const filteredReturns = mockReturns.filter((returnItem) => {
    if (searchQuery) {
      return (
        returnItem.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnItem.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">My Returns Orders</h1>
              <Button className="bg-gray-900 hover:bg-gray-800 gap-2">
                <Plus className="w-4 h-4" />
                Add a Return
              </Button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search Returned Order"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden">
              <div className="divide-y">
                {filteredReturns.map((returnItem) => (
                  <div
                    key={returnItem.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedReturn(returnItem);
                      setIsDetailsDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <OptimizedImage
                          src={returnItem.image}
                          alt={returnItem.status}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{returnItem.status}</h3>
                        <p className="text-sm text-gray-500">Order {returnItem.orderId}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600">{returnItem.items} item{returnItem.items > 1 ? 's' : ''}</p>
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

      <ReturnOrderDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        returnOrder={selectedReturn}
      />
    </div>
  );
}
