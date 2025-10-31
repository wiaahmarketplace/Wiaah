"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShopSidebar } from "@/components/shop-sidebar";
import { OptimizedImage } from "@/components/optimized-image";
import { OrderDetailsDialog } from "@/components/order-details-dialog";
import { Header } from "@/components/header";

const mockOrders = [
  {
    id: "12345",
    shop: "Sarah Miller",
    total: 150,
    image: "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=300",
    status: "all"
  },
  {
    id: "67890",
    shop: "Sarah Miller",
    total: 200,
    image: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=300",
    status: "to_ship"
  },
  {
    id: "11223",
    shop: "Sarah Miller",
    total: 75,
    image: "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=300",
    status: "shipped"
  },
  {
    id: "44556",
    shop: "Sarah Miller",
    total: 300,
    image: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=300",
    status: "delivered"
  }
];

const mockOrderDetails = {
  orderNumber: "9876543210",
  clientName: "Olivia Bennett",
  shippingAddress: "456 Oak Avenue, Anytown, USA",
  orderDate: "01/15/2023",
  items: [
    {
      name: "Handmade Leather Wallet",
      image: "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=150",
      color: "Brown",
      size: "M",
      price: 50.0,
      quantity: 1,
    },
    {
      name: "Artisan Soap Set",
      image: "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=150",
      color: "Black",
      size: "S",
      price: 50.0,
      quantity: 2,
    },
  ],
  subtotal: 60.0,
  shipping: 5.0,
  discount: 5.0,
  fees: 5.0,
  total: 65.0,
  paymentMethod: "Visa **** 4321",
  estimatedDelivery: "12/05/2026",
  trackingNumber: "9876543210",
  status: "Shipped",
  lastUpdated: "July 16, 2024",
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "to_ship" | "shipped" | "delivered">("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrderDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  const handleViewDetails = () => {
    setSelectedOrder(mockOrderDetails);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="orders" />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders</h1>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="flex gap-8 mb-6 border-b">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === "all"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("to_ship")}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === "to_ship"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                To Ship
              </button>
              <button
                onClick={() => setActiveTab("shipped")}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === "shipped"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setActiveTab("delivered")}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === "delivered"
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Delivered
              </button>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">Shop: {order.shop} | Total: ${order.total}</p>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="bg-white"
                          onClick={handleViewDetails}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="w-36 h-36 rounded-lg overflow-hidden bg-white flex-shrink-0 ml-6">
                      <OptimizedImage
                        src={order.image}
                        alt={`Order ${order.id}`}
                        width={144}
                        height={144}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OrderDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
}
