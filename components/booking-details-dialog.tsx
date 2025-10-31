"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Users, MapPin, Phone, Download, CreditCard, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateBookingDetailsPDF, generateBookingQRCodeJPG } from "@/lib/pdf-generator";
import { WriteReviewDialog } from "@/components/write-review-dialog";

interface ServiceBooked {
  image: string;
  description: string;
}

interface BookingDetails {
  bookingId?: string;
  clientName?: string;
  bookingDate?: string;
  bookingTime?: string;
  serviceDuration?: string;
  checkOut?: string;
  guestsAllowed?: number;
  servicesBooked?: ServiceBooked[];
  locationName?: string;
  locationAddress?: string;
  contact?: string;
  instructions?: string;
  serviceFee?: number;
  bookingFee?: number;
  cancellationFee?: number;
  total?: number;
  paymentMethod?: string;
  status?: string;
  statusDate?: string;
  cancellationPolicy?: string;
  id?: string;
  location?: string;
  dateRange?: string;
  nights?: string;
  price?: string;
  image?: string;
}

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingDetails | null;
}

export function BookingDetailsDialog({
  open,
  onOpenChange,
  booking,
}: BookingDetailsDialogProps) {
  const router = useRouter();
  const qrCodeRef = useRef<SVGSVGElement>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  if (!booking) return null;

  const handleDownloadPDF = () => {
    generateBookingDetailsPDF(mockBookingData);
  };

  const handleDownloadJPG = () => {
    if (qrCodeRef.current) {
      generateBookingQRCodeJPG(qrCodeRef.current, mockBookingData.bookingId);
    }
  };

  const handleContactCustomer = () => {
    router.push("/messages");
  };

  const handleWriteReview = () => {
    setIsReviewDialogOpen(true);
  };

  const handleCancelBooking = () => {
    setIsCancelDialogOpen(true);
  };

  const mockBookingData = {
    bookingId: "2324567",
    clientName: "Julia Smith",
    bookingDate: "July 20, 2024",
    bookingTime: "2:00 PM",
    serviceDuration: "2 hours",
    checkOut: "Oct 27, 2024",
    guestsAllowed: 2,
    servicesBooked: [
      {
        image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "1"
      },
      {
        image: "https://images.pexels.com/photos/261101/pexels-photo-261101.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "1 night"
      }
    ],
    locationName: "Clean Sweep Services",
    locationAddress: "123 Fitness Ave, Anytown, USA",
    contact: "555-123-4567",
    instructions: "Please arrive 15 minutes early for a brief consultation. Wear comfortable workout attire and bring a water bottle.",
    serviceFee: 80.00,
    bookingFee: 5.00,
    cancellationFee: 5.00,
    total: 85.00,
    paymentMethod: "Visa **** 1234",
    status: "Cancelled",
    statusDate: "July 18, 2024",
    cancellationPolicy: "The guest may cancel the booking only up to 24 hours before the reservation time, unless they have paid a cancellation fee."
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="px-8 py-6 space-y-8 pb-24">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">My Booking Details</h1>
                <p className="text-gray-600">Booking ID: {mockBookingData.bookingId}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-600">Client: {mockBookingData.clientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Booking Date & Time: {mockBookingData.bookingDate}, {mockBookingData.bookingTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Service Duration: {mockBookingData.serviceDuration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Check-out: {mockBookingData.checkOut}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">Guests Allowed: {mockBookingData.guestsAllowed}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services Booked</h2>
                <div className="space-y-3">
                  {mockBookingData.servicesBooked.map((service, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={service.image}
                          alt="Service"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-900">{service.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Service Location</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{mockBookingData.locationName}</p>
                      <p className="text-gray-600">{mockBookingData.locationAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Contact</p>
                  </div>
                </div>
                <p className="text-gray-900 ml-13">{mockBookingData.contact}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
                <p className="text-gray-700">{mockBookingData.instructions}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Service Fee</span>
                    <span className="text-gray-900 font-medium">${mockBookingData.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Booking Fee</span>
                    <span className="text-gray-900 font-medium">${mockBookingData.bookingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Cancellation Fee</span>
                    <span className="text-gray-900 font-medium">${mockBookingData.cancellationFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">${mockBookingData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Info</h2>
                <p className="text-gray-900">{mockBookingData.paymentMethod}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
                <p className="text-gray-900 font-medium">{mockBookingData.status}</p>
                <p className="text-gray-600">{mockBookingData.statusDate}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
                <p className="text-gray-700">{mockBookingData.cancellationPolicy}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Info</h2>
                <p className="text-gray-900">{mockBookingData.paymentMethod}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
                <p className="text-gray-900">{mockBookingData.status} — {mockBookingData.statusDate}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
                <p className="text-gray-700">{mockBookingData.cancellationPolicy}</p>
              </div>

              <div className="pb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Verification</h2>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-64 h-64 bg-white border-4 border-gray-900 rounded-lg flex items-center justify-center mb-4 relative">
                    <svg ref={qrCodeRef} viewBox="0 0 200 200" className="w-full h-full p-4">
                      <rect x="20" y="20" width="30" height="30" fill="black"/>
                      <rect x="60" y="20" width="10" height="10" fill="black"/>
                      <rect x="80" y="20" width="10" height="10" fill="black"/>
                      <rect x="100" y="20" width="10" height="10" fill="black"/>
                      <rect x="120" y="20" width="10" height="10" fill="black"/>
                      <rect x="150" y="20" width="30" height="30" fill="black"/>

                      <rect x="20" y="30" width="10" height="10" fill="black"/>
                      <rect x="40" y="30" width="10" height="10" fill="black"/>
                      <rect x="150" y="30" width="10" height="10" fill="black"/>
                      <rect x="170" y="30" width="10" height="10" fill="black"/>

                      <rect x="20" y="40" width="10" height="10" fill="black"/>
                      <rect x="40" y="40" width="10" height="10" fill="black"/>
                      <rect x="70" y="40" width="10" height="10" fill="black"/>
                      <rect x="90" y="40" width="10" height="10" fill="black"/>
                      <rect x="110" y="40" width="10" height="10" fill="black"/>
                      <rect x="150" y="40" width="10" height="10" fill="black"/>
                      <rect x="170" y="40" width="10" height="10" fill="black"/>

                      <rect x="20" y="50" width="30" height="30" fill="black"/>
                      <rect x="60" y="50" width="10" height="10" fill="black"/>
                      <rect x="80" y="50" width="10" height="10" fill="black"/>
                      <rect x="100" y="50" width="10" height="10" fill="black"/>
                      <rect x="120" y="50" width="10" height="10" fill="black"/>
                      <rect x="150" y="50" width="30" height="30" fill="black"/>

                      <rect x="20" y="60" width="10" height="10" fill="black"/>
                      <rect x="40" y="60" width="10" height="10" fill="black"/>
                      <rect x="150" y="60" width="10" height="10" fill="black"/>
                      <rect x="170" y="60" width="10" height="10" fill="black"/>

                      <rect x="20" y="70" width="10" height="10" fill="black"/>
                      <rect x="40" y="70" width="10" height="10" fill="black"/>
                      <rect x="150" y="70" width="10" height="10" fill="black"/>
                      <rect x="170" y="70" width="10" height="10" fill="black"/>

                      <rect x="60" y="90" width="10" height="10" fill="black"/>
                      <rect x="80" y="90" width="20" height="10" fill="black"/>
                      <rect x="110" y="90" width="10" height="10" fill="black"/>
                      <rect x="130" y="90" width="10" height="10" fill="black"/>

                      <rect x="20" y="100" width="10" height="10" fill="black"/>
                      <rect x="40" y="100" width="20" height="10" fill="black"/>
                      <rect x="70" y="100" width="10" height="10" fill="black"/>
                      <rect x="100" y="100" width="20" height="10" fill="black"/>
                      <rect x="140" y="100" width="10" height="10" fill="black"/>
                      <rect x="160" y="100" width="10" height="10" fill="black"/>

                      <rect x="20" y="120" width="30" height="30" fill="black"/>
                      <rect x="60" y="120" width="10" height="10" fill="black"/>
                      <rect x="80" y="120" width="10" height="10" fill="black"/>
                      <rect x="110" y="120" width="20" height="10" fill="black"/>
                      <rect x="150" y="120" width="10" height="10" fill="black"/>
                      <rect x="170" y="120" width="10" height="10" fill="black"/>

                      <rect x="20" y="130" width="10" height="10" fill="black"/>
                      <rect x="40" y="130" width="10" height="10" fill="black"/>
                      <rect x="70" y="130" width="10" height="10" fill="black"/>
                      <rect x="100" y="130" width="10" height="10" fill="black"/>
                      <rect x="130" y="130" width="20" height="10" fill="black"/>
                      <rect x="160" y="130" width="10" height="10" fill="black"/>

                      <rect x="20" y="140" width="10" height="10" fill="black"/>
                      <rect x="40" y="140" width="10" height="10" fill="black"/>
                      <rect x="60" y="140" width="20" height="10" fill="black"/>
                      <rect x="90" y="140" width="10" height="10" fill="black"/>
                      <rect x="120" y="140" width="10" height="10" fill="black"/>
                      <rect x="150" y="140" width="20" height="10" fill="black"/>

                      <rect x="20" y="150" width="30" height="30" fill="black"/>
                      <rect x="70" y="150" width="10" height="10" fill="black"/>
                      <rect x="100" y="150" width="10" height="10" fill="black"/>
                      <rect x="130" y="150" width="10" height="10" fill="black"/>
                      <rect x="160" y="150" width="10" height="10" fill="black"/>

                      <rect x="20" y="160" width="10" height="10" fill="black"/>
                      <rect x="40" y="160" width="10" height="10" fill="black"/>
                      <rect x="60" y="160" width="10" height="10" fill="black"/>
                      <rect x="90" y="160" width="10" height="10" fill="black"/>
                      <rect x="120" y="160" width="10" height="10" fill="black"/>
                      <rect x="150" y="160" width="10" height="10" fill="black"/>

                      <rect x="20" y="170" width="10" height="10" fill="black"/>
                      <rect x="40" y="170" width="10" height="10" fill="black"/>
                      <rect x="70" y="170" width="30" height="10" fill="black"/>
                      <rect x="120" y="170" width="20" height="10" fill="black"/>
                      <rect x="160" y="170" width="10" height="10" fill="black"/>
                    </svg>
                  </div>
                  <div className="flex gap-2 mb-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-emerald-100 hover:bg-emerald-200 text-gray-900 border-0 font-medium"
                      onClick={handleDownloadJPG}
                    >
                      .JPG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white border-0 font-medium"
                      onClick={handleDownloadPDF}
                    >
                      .PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 px-8 py-4 border-t border-gray-200 bg-white flex-shrink-0">
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6"
              onClick={handleCancelBooking}
            >
              Cancel Booking
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                className="bg-black hover:bg-gray-800 text-white font-medium px-6"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 font-medium px-6"
                onClick={handleContactCustomer}
              >
                Contact Provider
              </Button>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                onClick={handleWriteReview}
              >
                Write a Review
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      <WriteReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        item={mockBookingData.servicesBooked[0] ? {
          name: mockBookingData.locationName,
          price: mockBookingData.serviceFee,
          image: mockBookingData.servicesBooked[0].image
        } : null}
      />

      <CancelBookingDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
        bookingId={mockBookingData.bookingId}
        cancellationFee={mockBookingData.cancellationFee}
        total={mockBookingData.total}
        cancellationPolicy={mockBookingData.cancellationPolicy}
      />
    </Dialog>
  );
}

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  cancellationFee: number;
  total: number;
  cancellationPolicy: string;
}

function CancelBookingDialog({
  open,
  onOpenChange,
  bookingId,
  cancellationFee,
  total,
  cancellationPolicy,
}: CancelBookingDialogProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const refundAmount = total - cancellationFee;
  const willReceiveRefund = refundAmount > 0;

  const handleConfirmCancellation = async () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      router.push('/orders-perks/my-bookings');
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Cancel Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Confirm Cancellation</h3>
                <p className="text-sm text-gray-700">
                  You are about to cancel booking <span className="font-semibold">#{bookingId}</span>.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
            <p className="text-sm text-gray-700 mb-4">{cancellationPolicy}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Refund Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Amount</span>
                <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
              </div>

              {cancellationFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancellation Fee</span>
                  <span className="font-medium text-red-600">-${cancellationFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-900">
                  {willReceiveRefund ? 'Refund Amount' : 'No Refund'}
                </span>
                <span className={`font-bold ${willReceiveRefund ? 'text-green-600' : 'text-red-600'}`}>
                  {willReceiveRefund ? `$${refundAmount.toFixed(2)}` : '$0.00'}
                </span>
              </div>
            </div>

            {willReceiveRefund ? (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  You will receive a refund of <span className="font-semibold">${refundAmount.toFixed(2)}</span> to
                  your original payment method within 5-10 business days.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">
                  According to the provider's cancellation policy, no refund will be issued for this cancellation.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleConfirmCancellation}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
