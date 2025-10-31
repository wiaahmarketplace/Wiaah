'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Users, MapPin, Mail, Phone, Download, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { GuestDetails } from './booking-confirmation-dialog';
import { PaymentInfo } from './payment-dialog';

interface BookingSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingDetails: {
    serviceName: string;
    roomType: string;
    checkIn: Date;
    checkOut: Date;
    adults: number;
    children: number;
    infants: number;
    totalPrice: number;
    nights: number;
  };
  guestDetails: GuestDetails;
  paymentInfo: PaymentInfo;
  bookingId: string;
}

export function BookingSuccessDialog({
  open,
  onOpenChange,
  bookingDetails,
  guestDetails,
  paymentInfo,
  bookingId,
}: BookingSuccessDialogProps) {
  const handleDownloadConfirmation = () => {
    console.log('Downloading confirmation...');
  };

  const handleShareConfirmation = () => {
    console.log('Sharing confirmation...');
  };

  const handleViewBooking = () => {
    window.location.href = '/orders-perks/my-bookings';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-4 py-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-100 p-3">
              <CheckCircle className="h-16 w-16 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-gray-600">Your reservation has been successfully confirmed</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold text-emerald-600">{bookingId}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Booking Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-base">{bookingDetails.serviceName}</h4>
                <p className="text-sm text-gray-600">{bookingDetails.roomType}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Check-in</p>
                    <p className="font-medium">{format(bookingDetails.checkIn, 'EEEE, MMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Check-out</p>
                    <p className="font-medium">{format(bookingDetails.checkOut, 'EEEE, MMM dd, yyyy')}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span>
                  {bookingDetails.adults} Adult{bookingDetails.adults > 1 ? 's' : ''}
                  {bookingDetails.children > 0 && `, ${bookingDetails.children} Child${bookingDetails.children > 1 ? 'ren' : ''}`}
                  {bookingDetails.infants > 0 && `, ${bookingDetails.infants} Infant${bookingDetails.infants > 1 ? 's' : ''}`}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Paid</span>
                <span className="text-xl font-bold text-emerald-600">${bookingDetails.totalPrice}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Guest Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 w-20">Name:</span>
                <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 w-20">Email:</span>
                <span>{guestDetails.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 w-20">Phone:</span>
                <span>{guestDetails.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-gray-600 w-20">Address:</span>
                <span>{guestDetails.address}, {guestDetails.city}, {guestDetails.country}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Payment Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium capitalize">{paymentInfo.method.replace('_', ' ')}</span>
              </div>
              {paymentInfo.method === 'card' && paymentInfo.cardDetails && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Card</span>
                  <span className="font-medium">**** **** **** {paymentInfo.cardDetails.number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-emerald-600">Paid</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-900 mb-1">What's Next?</p>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>A confirmation email has been sent to {guestDetails.email}</li>
              <li>You can view and manage your booking in "My Bookings"</li>
              <li>Check-in time is 3:00 PM, check-out time is 11:00 AM</li>
              <li>Contact the property for any special requests</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadConfirmation} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={handleShareConfirmation} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <Button onClick={handleViewBooking} className="w-full bg-emerald-500 hover:bg-emerald-600">
            View My Bookings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
