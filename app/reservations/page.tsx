"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookingDetailsDialog } from "@/components/booking-details-dialog";
import { ServiceSidebar } from "@/components/service-sidebar";
import { Pagination } from "@/components/pagination";
import { Header } from "@/components/header";

interface Booking {
  id: string;
  location: string;
  status: "confirmed" | "cancelled" | "pending";
  dateRange: string;
  nights: string;
  price: string;
  image: string;
}

const mockBookings: Booking[] = [
  {
    id: "1",
    location: "New York, USA",
    status: "confirmed",
    dateRange: "Oct 12 – 15",
    nights: "3 nights",
    price: "$1,200",
    image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "2",
    location: "Paris, France",
    status: "cancelled",
    dateRange: "Nov 20 – 25",
    nights: "5 nights",
    price: "$800",
    image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "3",
    location: "Tokyo, Japan",
    status: "confirmed",
    dateRange: "Dec 1 – 7",
    nights: "6 nights",
    price: "$1,500",
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: "4",
    location: "London, UK",
    status: "pending",
    dateRange: "Dec 15 – 20",
    nights: "5 nights",
    price: "$1,100",
    image: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "finished">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch = booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "upcoming") return matchesSearch && booking.status === "confirmed";
    if (activeTab === "finished") return matchesSearch && booking.status === "cancelled";
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ServiceSidebar activePage="reservations" />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">My Bookings</h1>

              <div className="mb-6">
                <div className="relative max-w-2xl">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                </div>
              </div>

              <div className="flex gap-6 mb-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === "all"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All
                  {activeTab === "all" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === "upcoming"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upcoming
                  {activeTab === "upcoming" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("finished")}
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === "finished"
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Finished
                  {activeTab === "finished" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              </div>

              <div className="space-y-6">
                {currentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6 p-6">
                      <div className="flex-shrink-0">
                        <img
                          src={booking.image}
                          alt={booking.location}
                          className="w-64 h-48 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {booking.location}
                            </h3>
                            <Badge
                              variant={booking.status === "confirmed" ? "default" : booking.status === "cancelled" ? "destructive" : "secondary"}
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : booking.status === "cancelled"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-1">
                          {booking.dateRange} · {booking.nights}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-4">
                          {booking.price}
                        </p>
                        <div className="mt-auto">
                          <Button
                            onClick={() => handleViewDetails(booking)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No bookings found</p>
                </div>
              )}

              {filteredBookings.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
          </div>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          booking={selectedBooking}
        />
      )}
    </div>
  );
}
