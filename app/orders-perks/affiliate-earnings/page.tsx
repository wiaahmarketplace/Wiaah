'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OptimizedImage } from '@/components/optimized-image';
import { Search, Download, Eye } from 'lucide-react';
import { generateAffiliateEarningsPDF } from '@/lib/pdf-generator';

const mockAffiliateEarnings = [
  {
    id: '1',
    product: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Product Name',
    price: 50,
    commissionRate: 10,
    commissionEarned: 5,
    purchaseDate: '01/10/2023',
    contractId: 'W7M4XN2H',
    affiliationOwner: 'Ethan Carter',
    type: 'product' as const,
  },
  {
    id: '2',
    product: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Product Name',
    price: 100,
    commissionRate: 5,
    commissionEarned: 5,
    purchaseDate: '02/10/2023',
    contractId: 'X8N5YO3I',
    affiliationOwner: 'Emma Wilson',
    type: 'product' as const,
  },
  {
    id: '3',
    product: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Luxury Spa Package',
    price: 200,
    commissionRate: 7.5,
    commissionEarned: 15,
    purchaseDate: '03/10/2023',
    contractId: 'Y9O6ZP4J',
    affiliationOwner: 'Oliver Smith',
    type: 'service' as const,
  },
  {
    id: '4',
    product: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Product Name',
    price: 75,
    commissionRate: 12,
    commissionEarned: 9,
    purchaseDate: '04/10/2023',
    contractId: 'Z1P7AQ5K',
    affiliationOwner: 'Sophia Brown',
    type: 'product' as const,
  },
  {
    id: '5',
    product: 'https://images.pexels.com/photos/3065171/pexels-photo-3065171.jpeg?auto=compress&cs=tinysrgb&w=100',
    productName: 'Hair Styling Service',
    price: 150,
    commissionRate: 8,
    commissionEarned: 12,
    purchaseDate: '05/10/2023',
    contractId: 'A2Q8BR6L',
    affiliationOwner: 'James Taylor',
    type: 'service' as const,
  },
];

export default function AffiliateEarningsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEarning, setSelectedEarning] = useState<typeof mockAffiliateEarnings[0] | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const totalPages = 5;

  const handleViewDetails = (item: typeof mockAffiliateEarnings[0]) => {
    setSelectedEarning(item);
    setIsDetailDialogOpen(true);
  };

  const handleDownloadPDF = () => {
    if (selectedEarning) {
      generateAffiliateEarningsPDF(selectedEarning);
    }
  };

  const filteredEarnings = mockAffiliateEarnings.filter((item) => {
    if (searchQuery) {
      return (
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.price.toString().includes(searchQuery)
      );
    }
    return true;
  });

  const totalCommission = filteredEarnings.reduce((sum, item) => sum + item.commissionEarned, 0);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Affiliate Earnings</h1>
              <p className="text-sm text-gray-500 mt-1">Track your earnings from affiliate links</p>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search affiliations"
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
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Commission Rate</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Commission Earned</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredEarnings.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={item.product}
                              alt={item.productName}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">${item.price}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.commissionRate}%</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">${item.commissionEarned}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t py-4 px-4">
                <p className="text-center text-sm font-medium text-gray-900">
                  Total Commission Earned: ${totalCommission}
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
            <DialogTitle>My affiliation History Detail</DialogTitle>
          </DialogHeader>

          {selectedEarning && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Purchase Details</h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Purchase Date</p>
                    <p className="text-gray-900 font-medium">{selectedEarning.purchaseDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Contract ID</p>
                    <p className="text-gray-900 font-medium">{selectedEarning.contractId}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{selectedEarning.type === 'service' ? 'Service' : 'Product'} Information</h3>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={selectedEarning.product}
                      alt={selectedEarning.type === 'service' ? 'Service' : 'Product'}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedEarning.productName}</p>
                    <p className="text-sm text-gray-500 capitalize">{selectedEarning.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="text-gray-900 font-medium">${selectedEarning.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Affiliation Owner</p>
                    <p className="text-gray-900 font-medium">{selectedEarning.affiliationOwner}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Commission Percentage</p>
                    <p className="text-gray-900 font-medium">{selectedEarning.commissionRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Commission Amount</p>
                    <p className="text-gray-900 font-medium">${selectedEarning.commissionEarned}</p>
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
