'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OptimizedImage } from '@/components/optimized-image';
import { Search, Download } from 'lucide-react';
import { generateCashbackHistoryPDF } from '@/lib/pdf-generator';

const mockCashback = [
  {
    id: '1',
    property: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Wireless Headphones',
    originalPrice: 430,
    percentage: 5,
    amount: 21.50,
    date: '27/12/2025',
    recipient: 'Henry Nelson',
    purchaseDate: '01/12/2025',
    contractId: 'W7M4XN2H',
    price: 430,
    shop: 'Direct Center',
    commissionPercentage: 5,
    commissionAmount: 21.50,
    type: 'product' as const,
  },
  {
    id: '2',
    property: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Designer Handbag',
    originalPrice: 250,
    percentage: 5,
    amount: 12.50,
    date: '27/12/2025',
    recipient: 'Liam Harper',
    purchaseDate: '02/12/2025',
    contractId: 'X8N5YO3I',
    price: 250,
    shop: 'Central Shop',
    commissionPercentage: 5,
    commissionAmount: 12.50,
    type: 'product' as const,
  },
  {
    id: '3',
    property: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Spa Massage Package',
    originalPrice: 190,
    percentage: 5,
    amount: 9.50,
    date: '27/12/2025',
    recipient: 'Noah Foster',
    purchaseDate: '03/12/2025',
    contractId: 'Y9O6ZP4J',
    price: 190,
    shop: 'Premium Store',
    commissionPercentage: 5,
    commissionAmount: 9.50,
    type: 'service' as const,
  },
  {
    id: '4',
    property: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Smart Watch',
    originalPrice: 280,
    percentage: 5,
    amount: 14.00,
    date: '27/12/2025',
    recipient: 'Olivia Hayes',
    purchaseDate: '04/12/2025',
    contractId: 'Z1P7AQ5K',
    price: 280,
    shop: 'Elite Mall',
    commissionPercentage: 5,
    commissionAmount: 14.00,
    type: 'product' as const,
  },
  {
    id: '5',
    property: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Designer Shoes',
    originalPrice: 350,
    percentage: 5,
    amount: 17.50,
    date: '27/12/2025',
    recipient: 'Ethan Reed',
    purchaseDate: '05/12/2025',
    contractId: 'A2Q8BR6L',
    price: 350,
    shop: 'Luxury Center',
    commissionPercentage: 5,
    commissionAmount: 17.50,
    type: 'product' as const,
  },
  {
    id: '6',
    property: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Hair Styling Session',
    originalPrice: 220,
    percentage: 5,
    amount: 11.00,
    date: '27/12/2025',
    recipient: 'Isabella Cole',
    purchaseDate: '06/12/2025',
    contractId: 'B3R9CS7M',
    price: 220,
    shop: 'Grand Plaza',
    commissionPercentage: 5,
    commissionAmount: 11.00,
    type: 'service' as const,
  },
];

export default function CashbackHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCashback, setSelectedCashback] = useState<typeof mockCashback[0] | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const totalPages = 5;

  const handleViewDetails = (item: typeof mockCashback[0]) => {
    setSelectedCashback(item);
    setIsDetailDialogOpen(true);
  };

  const handleDownloadPDF = () => {
    if (selectedCashback) {
      generateCashbackHistoryPDF(selectedCashback);
    }
  };

  const filteredCashback = mockCashback.filter((item) => {
    if (searchQuery) {
      return (
        item.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.includes(searchQuery)
      );
    }
    return true;
  });

  const totalCashback = filteredCashback.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Cashback History</h1>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search Cashback"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product/Service</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Original Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cashback Percentage</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cashback Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Recipient</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCashback.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                              <OptimizedImage
                                src={item.property}
                                alt={item.productName}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">${item.originalPrice}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.percentage}%</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.recipient}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t py-4 px-4">
                <p className="text-center text-sm font-medium text-gray-900">
                  Total Cashback Received: ${totalCashback.toFixed(2)}
                </p>
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

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>My Cashback History Detail</DialogTitle>
          </DialogHeader>

          {selectedCashback && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Purchase Details</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Purchase Date</p>
                    <p className="text-gray-900 font-medium">{selectedCashback.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contract ID</p>
                    <p className="text-gray-900 font-medium">{selectedCashback.contractId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{selectedCashback.type === 'service' ? 'Service' : 'Product'} Information</h3>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={selectedCashback.property}
                      alt={selectedCashback.productName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedCashback.productName}</p>
                    <p className="text-sm text-gray-500 capitalize">{selectedCashback.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="text-gray-900 font-medium">${selectedCashback.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Shop</p>
                    <p className="text-gray-900 font-medium">{selectedCashback.shop}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Commission Percentage</p>
                    <p className="text-gray-900 font-medium">{selectedCashback.commissionPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Commission Amount</p>
                    <p className="text-gray-900 font-medium">${selectedCashback.commissionAmount}</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleDownloadPDF}
                className="w-full bg-gray-900 hover:bg-gray-800 gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
