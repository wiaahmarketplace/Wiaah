'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/optimized-image';
import { OrderDetailsDialog } from '@/components/order-details-dialog';
import { Search } from 'lucide-react';

const mockOrders = [
  {
    id: '12345',
    shop: 'Sarah Miller',
    total: 150,
    image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'all',
    details: {
      orderNumber: '0876543210',
      clientName: 'China Barnett',
      shippingAddress: '450 Oak Avenue, Anytown, USA',
      orderDate: '01/15/2023',
      items: [
        {
          name: 'Handmade Leather Wallet',
          image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400',
          color: 'Brown',
          size: 'M',
          price: 50.00,
          quantity: 1
        },
        {
          name: 'Artisan Soap Set',
          image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400',
          color: 'Black',
          size: 'S',
          price: 50.00,
          quantity: 2
        }
      ],
      subtotal: 150.00,
      shipping: 5.00,
      discount: 5.00,
      fees: 0.00,
      total: 150.00,
      paymentMethod: 'Visa **** 4320',
      estimatedDelivery: '10/25/2026',
      trackingNumber: '0876543210',
      status: 'Shipped',
      lastUpdated: 'July 18, 2024'
    }
  },
  {
    id: '67890',
    shop: 'Sarah Miller',
    total: 200,
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'to_ship',
    details: {
      orderNumber: '0876543211',
      clientName: 'China Barnett',
      shippingAddress: '450 Oak Avenue, Anytown, USA',
      orderDate: '01/16/2023',
      items: [
        {
          name: 'Designer Handbag',
          image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
          color: 'Beige',
          size: 'One Size',
          price: 200.00,
          quantity: 1
        }
      ],
      subtotal: 200.00,
      shipping: 10.00,
      discount: 10.00,
      fees: 0.00,
      total: 200.00,
      paymentMethod: 'Visa **** 4320',
      estimatedDelivery: '10/28/2026',
      trackingNumber: '0876543211',
      status: 'Processing',
      lastUpdated: 'July 19, 2024'
    }
  },
  {
    id: '11223',
    shop: 'Sarah Miller',
    total: 75,
    image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'shipped',
    details: {
      orderNumber: '0876543212',
      clientName: 'China Barnett',
      shippingAddress: '450 Oak Avenue, Anytown, USA',
      orderDate: '01/17/2023',
      items: [
        {
          name: 'Organic Cotton T-Shirt',
          image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=400',
          color: 'White',
          size: 'L',
          price: 75.00,
          quantity: 1
        }
      ],
      subtotal: 75.00,
      shipping: 5.00,
      discount: 5.00,
      fees: 0.00,
      total: 75.00,
      paymentMethod: 'Visa **** 4320',
      estimatedDelivery: '10/22/2026',
      trackingNumber: '0876543212',
      status: 'Shipped',
      lastUpdated: 'July 17, 2024'
    }
  },
  {
    id: '44556',
    shop: 'Sarah Miller',
    total: 300,
    image: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'delivered',
    details: {
      orderNumber: '0876543213',
      clientName: 'China Barnett',
      shippingAddress: '450 Oak Avenue, Anytown, USA',
      orderDate: '01/14/2023',
      items: [
        {
          name: 'Premium Sneakers',
          image: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=400',
          color: 'Black',
          size: '10',
          price: 300.00,
          quantity: 1
        }
      ],
      subtotal: 300.00,
      shipping: 15.00,
      discount: 15.00,
      fees: 0.00,
      total: 300.00,
      paymentMethod: 'Visa **** 4320',
      estimatedDelivery: '10/20/2026',
      trackingNumber: '0876543213',
      status: 'Delivered',
      lastUpdated: 'July 16, 2024'
    }
  },
];

export default function MyOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'to_ship' | 'shipped' | 'delivered'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0]['details'] | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab !== 'all' && order.status !== activeTab && order.status !== 'all') {
      return false;
    }
    if (searchQuery) {
      return (
        order.id.includes(searchQuery) ||
        order.shop.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const totalPages = 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search orders by ID, name, or status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-6 mb-6 border-b bg-white px-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('to_ship')}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'to_ship'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                To Ship
              </button>
              <button
                onClick={() => setActiveTab('shipped')}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'shipped'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'delivered'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Delivered
              </button>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Shop: {order.shop} | Total: ${order.total}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order.details);
                          setIsOrderDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                    <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ml-6">
                      <OptimizedImage
                        src={order.image}
                        alt={`Order ${order.id}`}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
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

      <OrderDetailsDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
