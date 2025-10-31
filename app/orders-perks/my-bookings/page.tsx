'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/optimized-image';
import { BookingDetailsDialog } from '@/components/booking-details-dialog';
import { Search } from 'lucide-react';

const mockBookings = [
  {
    id: '12345',
    name: 'Yoga Class',
    time: '10:00 AM - 11:00 AM',
    location: 'Fitness First',
    image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'upcoming',
    details: {
      bookingId: '2324567',
      clientName: 'Julia Smith',
      bookingDate: 'July 20, 2024',
      bookingTime: '2:00 PM',
      serviceDuration: '2 hours',
      checkOut: 'Oct 27, 2024',
      guestsAllowed: 2,
      servicesBooked: [
        {
          image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Personalized Fitness Training'
        },
        {
          image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Hotel'
        }
      ],
      locationName: 'Clean Sweep Services',
      locationAddress: '123 Fitness Ave, Anytown, USA',
      contact: '555-123-4567',
      instructions: 'Please arrive 15 minutes early for a brief consultation. Wear comfortable workout attire and bring a water bottle.',
      serviceFee: 80.00,
      bookingFee: 5.00,
      cancellationFee: 5.00,
      total: 90.00,
      paymentMethod: 'Visa **** 1234',
      status: 'Completed',
      statusDate: 'July 18, 2024',
      cancellationPolicy: 'The guest may cancel the booking only up to 24 hours before the reservation time, unless they have paid a cancellation fee.'
    }
  },
  {
    id: '67890',
    name: 'Pilates Class',
    time: '10:00 AM - 11:00 AM',
    location: 'Pilates Pro',
    image: 'https://images.pexels.com/photos/4498154/pexels-photo-4498154.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'upcoming',
    details: {
      bookingId: '2324568',
      clientName: 'Julia Smith',
      bookingDate: 'July 25, 2024',
      bookingTime: '10:00 AM',
      serviceDuration: '1 hour',
      checkOut: 'Oct 25, 2024',
      guestsAllowed: 1,
      servicesBooked: [
        {
          image: 'https://images.pexels.com/photos/4498154/pexels-photo-4498154.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Pilates Class'
        }
      ],
      locationName: 'Pilates Pro',
      locationAddress: '456 Wellness St, Anytown, USA',
      contact: '555-987-6543',
      instructions: 'Bring your own mat. We provide all other equipment.',
      serviceFee: 60.00,
      bookingFee: 5.00,
      cancellationFee: 5.00,
      total: 70.00,
      paymentMethod: 'Visa **** 1234',
      status: 'Confirmed',
      statusDate: 'July 20, 2024',
      cancellationPolicy: 'The guest may cancel the booking only up to 24 hours before the reservation time, unless they have paid a cancellation fee.'
    }
  },
  {
    id: '12323',
    name: 'Zumba Class',
    time: '10:00 AM - 11:00 AM',
    location: 'Dance Studio',
    image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'upcoming',
    details: {
      bookingId: '2324569',
      clientName: 'Julia Smith',
      bookingDate: 'August 1, 2024',
      bookingTime: '10:00 AM',
      serviceDuration: '1 hour',
      checkOut: 'Aug 1, 2024',
      guestsAllowed: 1,
      servicesBooked: [
        {
          image: 'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Zumba Class'
        }
      ],
      locationName: 'Dance Studio',
      locationAddress: '789 Dance Blvd, Anytown, USA',
      contact: '555-456-7890',
      instructions: 'Wear comfortable clothing and bring water.',
      serviceFee: 40.00,
      bookingFee: 5.00,
      cancellationFee: 0.00,
      total: 45.00,
      paymentMethod: 'Visa **** 1234',
      status: 'Confirmed',
      statusDate: 'July 28, 2024',
      cancellationPolicy: 'The guest may cancel the booking only up to 24 hours before the reservation time, unless they have paid a cancellation fee.'
    }
  },
  {
    id: '44564',
    name: 'Hotel Booking',
    time: 'Check-in 3:00 PM',
    location: 'The Grand Resort',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'upcoming',
    details: {
      bookingId: '2324570',
      clientName: 'Julia Smith',
      bookingDate: 'August 15, 2024',
      bookingTime: '3:00 PM',
      serviceDuration: '3 nights',
      checkOut: 'Aug 18, 2024',
      guestsAllowed: 2,
      servicesBooked: [
        {
          image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Deluxe Room - 3 nights'
        }
      ],
      locationName: 'The Grand Resort',
      locationAddress: '999 Resort Way, Anytown, USA',
      contact: '555-111-2222',
      instructions: 'Check-in starts at 3:00 PM. Early check-in available upon request.',
      serviceFee: 450.00,
      bookingFee: 25.00,
      cancellationFee: 0.00,
      total: 475.00,
      paymentMethod: 'Visa **** 1234',
      status: 'Confirmed',
      statusDate: 'August 1, 2024',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in. After that, a one-night charge will apply.'
    }
  },
];

export default function MyBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0]['details'] | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const filteredBookings = mockBookings.filter((booking) => {
    if (booking.status !== activeTab) {
      return false;
    }
    if (searchQuery) {
      return (
        booking.id.includes(searchQuery) ||
        booking.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search bookings"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-6 mb-6 border-b bg-white px-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'past'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'cancelled'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Cancelled
              </button>
            </div>

            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Booking ID: {booking.id}</p>
                      <h3 className="font-bold text-lg mb-1">{booking.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {booking.time} • {booking.location}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking.details);
                          setIsBookingDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                    <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 ml-6">
                      <OptimizedImage
                        src={booking.image}
                        alt={booking.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600">No bookings found</p>
              </div>
            )}

            {filteredBookings.length > 0 && (
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
            )}
          </div>
        </div>
      </div>

      <BookingDetailsDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        booking={selectedBooking}
      />
    </div>
  );
}
