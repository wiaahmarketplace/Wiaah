'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users, CreditCard, Mail, Phone, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface BookingConfirmationDialogProps {
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
    price: number;
    nights: number;
    totalPrice: number;
  };
  onConfirm: (guestDetails: GuestDetails) => void;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  specialRequests?: string;
}

export function BookingConfirmationDialog({
  open,
  onOpenChange,
  bookingDetails,
  onConfirm,
}: BookingConfirmationDialogProps) {
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Partial<GuestDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<GuestDetails> = {};

    if (!guestDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!guestDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!guestDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestDetails.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!guestDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!guestDetails.address.trim()) newErrors.address = 'Address is required';
    if (!guestDetails.city.trim()) newErrors.city = 'City is required';
    if (!guestDetails.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(guestDetails);
    }
  };

  const handleInputChange = (field: keyof GuestDetails, value: string) => {
    setGuestDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Your Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">{bookingDetails.serviceName}</h3>
            <p className="text-sm text-gray-600">{bookingDetails.roomType}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Check-in</p>
                  <p className="font-medium">{format(bookingDetails.checkIn, 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Check-out</p>
                  <p className="font-medium">{format(bookingDetails.checkOut, 'MMM dd, yyyy')}</p>
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

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>${bookingDetails.price} x {bookingDetails.nights} night{bookingDetails.nights > 1 ? 's' : ''}</span>
                <span>${bookingDetails.price * bookingDetails.nights}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-emerald-600">${bookingDetails.totalPrice}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Guest Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      value={guestDetails.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-9 ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      value={guestDetails.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`pl-9 ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-9 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={guestDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-9 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={guestDetails.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`pl-9 ${errors.address ? 'border-red-500' : ''}`}
                      placeholder="123 Main Street"
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={guestDetails.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={guestDetails.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={errors.country ? 'border-red-500' : ''}
                    placeholder="United States"
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <textarea
                    id="specialRequests"
                    value={guestDetails.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Any special requests or requirements..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Payment
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
