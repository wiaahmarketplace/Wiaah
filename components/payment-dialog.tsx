'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Wallet, Lock, Calendar, User } from 'lucide-react';
import { GuestDetails } from './booking-confirmation-dialog';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingDetails: {
    serviceName: string;
    roomType: string;
    totalPrice: number;
  };
  guestDetails: GuestDetails;
  onPaymentComplete: (paymentInfo: PaymentInfo) => void;
  onBack: () => void;
}

export interface PaymentInfo {
  method: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
}

export function PaymentDialog({
  open,
  onOpenChange,
  bookingDetails,
  guestDetails,
  onPaymentComplete,
  onBack,
}: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay' | 'google_pay'>('card');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<{
    number?: string;
    name?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const validateCardForm = () => {
    const newErrors: typeof errors = {};

    if (!cardDetails.number.replace(/\s/g, '')) {
      newErrors.number = 'Card number is required';
    } else if (cardDetails.number.replace(/\s/g, '').length < 13) {
      newErrors.number = 'Invalid card number';
    }

    if (!cardDetails.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    if (!cardDetails.expiry) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      newErrors.expiry = 'Invalid expiry date';
    }

    if (!cardDetails.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardDetails.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card' && !validateCardForm()) {
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      const paymentInfo: PaymentInfo = {
        method: paymentMethod,
        ...(paymentMethod === 'card' && {
          cardDetails: {
            ...cardDetails,
            number: cardDetails.number.slice(-4),
          },
        }),
      };

      onPaymentComplete(paymentInfo);
      setProcessing(false);
    }, 2000);
  };

  const handleCardInputChange = (field: keyof typeof cardDetails, value: string) => {
    let formattedValue = value;

    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Payment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">{bookingDetails.serviceName}</h3>
            <p className="text-sm text-gray-600">{bookingDetails.roomType}</p>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-emerald-600">${bookingDetails.totalPrice}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Select Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="space-y-3">
                <label
                  htmlFor="card"
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="card" id="card" />
                  <CreditCard className="h-5 w-5" />
                  <span className="flex-1 font-medium">Credit / Debit Card</span>
                </label>

                <label
                  htmlFor="paypal"
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'paypal' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Wallet className="h-5 w-5" />
                  <span className="flex-1 font-medium">PayPal</span>
                </label>

                <label
                  htmlFor="apple_pay"
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'apple_pay' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="apple_pay" id="apple_pay" />
                  <Smartphone className="h-5 w-5" />
                  <span className="flex-1 font-medium">Apple Pay</span>
                </label>

                <label
                  htmlFor="google_pay"
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'google_pay' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value="google_pay" id="google_pay" />
                  <Smartphone className="h-5 w-5" />
                  <span className="flex-1 font-medium">Google Pay</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4 pt-4">
              <h3 className="font-semibold text-lg">Card Details</h3>

              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cardNumber"
                    value={cardDetails.number}
                    onChange={(e) => handleCardInputChange('number', e.target.value)}
                    className={`pl-9 ${errors.number ? 'border-red-500' : ''}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cardName"
                    value={cardDetails.name}
                    onChange={(e) => handleCardInputChange('name', e.target.value)}
                    className={`pl-9 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="expiry"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      className={`pl-9 ${errors.expiry ? 'border-red-500' : ''}`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>

                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="cvv"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      className={`pl-9 ${errors.cvv ? 'border-red-500' : ''}`}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <Lock className="h-4 w-4 text-blue-600" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={processing}>
              Back
            </Button>
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              {processing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay ${bookingDetails.totalPrice}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
