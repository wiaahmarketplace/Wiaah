"use client";

import { useState } from "react";
import { ShopSidebar } from "@/components/shop-sidebar";
import { Input } from "@/components/ui/input";
import { OptimizedImage } from "@/components/optimized-image";
import { ReturnDetailsPopup } from "@/components/return-details-popup";
import { Search } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { Header } from "@/components/header";

const returnedOrdersData = [
  {
    id: 1,
    status: "Return Initiated",
    orderNumber: "9876543210",
    itemCount: 2,
    productImage: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=100",
    returnDate: "October 25, 2025",
    reason: "Product damaged during shipping. The item arrived with visible dents and scratches on the surface.",
    refundAmount: 149.98,
    refundStatus: "Processing",
    items: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "Standard",
        quantity: 1,
        price: 79.99,
      },
      {
        id: 2,
        name: "USB-C Charging Cable",
        image: "https://images.pexels.com/photos/163141/circuit-circuit-board-resistor-computer-163141.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "2M",
        quantity: 2,
        price: 34.99,
      },
    ],
  },
  {
    id: 2,
    status: "Return Completed",
    orderNumber: "1029384756",
    itemCount: 1,
    productImage: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=100",
    returnDate: "October 22, 2025",
    reason: "Wrong size ordered. I need a larger size for this product.",
    refundAmount: 59.99,
    refundStatus: "Completed",
    items: [
      {
        id: 1,
        name: "Cotton T-Shirt",
        image: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "M",
        quantity: 1,
        price: 59.99,
      },
    ],
  },
  {
    id: 3,
    status: "Refund Issued",
    orderNumber: "6547382910",
    itemCount: 3,
    productImage: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=100",
    returnDate: "October 20, 2025",
    reason: "Products did not match description. The color and material were different from what was advertised.",
    refundAmount: 224.97,
    refundStatus: "Refunded",
    items: [
      {
        id: 1,
        name: "Leather Wallet",
        image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "Standard",
        quantity: 1,
        price: 89.99,
      },
      {
        id: 2,
        name: "Sunglasses",
        image: "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "Standard",
        quantity: 1,
        price: 69.99,
      },
      {
        id: 3,
        name: "Watch Band",
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "22mm",
        quantity: 1,
        price: 64.99,
      },
    ],
  },
  {
    id: 4,
    status: "Return Initiated",
    orderNumber: "9876543210",
    itemCount: 2,
    productImage: "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=100",
    returnDate: "October 26, 2025",
    reason: "Changed my mind about the purchase.",
    refundAmount: 119.98,
    refundStatus: "Pending",
    items: [
      {
        id: 1,
        name: "Bluetooth Speaker",
        image: "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "Standard",
        quantity: 2,
        price: 59.99,
      },
    ],
  },
  {
    id: 5,
    status: "Return Completed",
    orderNumber: "1029384756",
    itemCount: 1,
    productImage: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=100",
    returnDate: "October 18, 2025",
    reason: "Product quality below expectations.",
    refundAmount: 39.99,
    refundStatus: "Completed",
    items: [
      {
        id: 1,
        name: "Phone Case",
        image: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=200",
        size: "iPhone 15",
        quantity: 1,
        price: 39.99,
      },
    ],
  },
];

export default function ReturnedOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState<typeof returnedOrdersData[0] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const itemsPerPage = 5;

  const filteredData = returnedOrdersData.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handleReturnClick = (order: typeof returnedOrdersData[0]) => {
    setSelectedReturn(order);
    setIsPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="returns" />

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Returns Orders</h1>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 bg-gray-100 border-0 text-base"
                />
              </div>
            </div>

            <div className="space-y-4">
              {currentItems.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleReturnClick(order)}
                  className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <OptimizedImage
                        src={order.productImage}
                        alt={order.status}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {order.status}
                      </h3>
                      <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                  </div>
                </div>
              ))}
            </div>

            <ReturnDetailsPopup
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              returnOrder={selectedReturn}
            />

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
