'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Users, MapPin, Mail, Phone, Download, Share2, Home, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = sessionStorage.getItem('orderConfirmation');
    if (data) {
      setOrderData(JSON.parse(data));
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleDownload = () => {
    console.log('Downloading confirmation...');
  };

  const handleShare = () => {
    console.log('Sharing confirmation...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  const nights = differenceInDays(new Date(orderData.check_out), new Date(orderData.check_in));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-100 p-4">
              <CheckCircle className="h-20 w-20 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600">Your reservation has been successfully confirmed</p>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 inline-block">
            <p className="text-sm text-gray-600 mb-2">Booking Reference</p>
            <p className="text-3xl font-bold text-emerald-600">{orderData.booking_id}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{orderData.service_name}</h3>
                <p className="text-gray-600">{orderData.room_type}</p>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-semibold text-lg">{format(new Date(orderData.check_in), 'EEEE, MMMM dd, yyyy')}</p>
                    <p className="text-sm text-gray-600">After 3:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-semibold text-lg">{format(new Date(orderData.check_out), 'EEEE, MMMM dd, yyyy')}</p>
                    <p className="text-sm text-gray-600">Before 11:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-500" />
                <span className="font-medium">
                  {orderData.adults} Adult{orderData.adults > 1 ? 's' : ''}
                  {orderData.children > 0 && `, ${orderData.children} Child${orderData.children > 1 ? 'ren' : ''}`}
                  {orderData.infants > 0 && `, ${orderData.infants} Infant${orderData.infants > 1 ? 's' : ''}`}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total for {nights} night{nights > 1 ? 's' : ''}</p>
                  <p className="text-2xl font-bold text-emerald-600">${orderData.total_price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-semibold text-emerald-600">Paid</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Guest Information</h2>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-semibold">{orderData.guest_name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-lg">{orderData.guest_name}</p>
                  <p className="text-sm text-gray-600">Primary Guest</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{orderData.guest_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{orderData.guest_phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <span className="text-gray-700">{orderData.guest_address}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold capitalize flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {orderData.payment_method?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction Status</span>
                <span className="font-semibold text-emerald-600">Completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Confirmation Sent To</span>
                <span className="font-medium">{orderData.guest_email}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 text-lg">What's Next?</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span>A confirmation email has been sent to {orderData.guest_email}</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span>You can view and manage your booking in "My Bookings" section</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span>Check-in time is 3:00 PM, check-out time is 11:00 AM</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span>Contact the property directly for any special requests or questions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                <span>Free cancellation available up to 24 hours before check-in</span>
              </li>
            </ul>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Link href="/orders-perks/my-bookings" className="w-full">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                View My Bookings
              </Button>
            </Link>
          </div>

          <div className="text-center pt-6">
            <Link href="/">
              <Button variant="ghost" size="lg">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
