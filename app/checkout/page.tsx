'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, CreditCard, Check, Plus, Edit2, Trash2, Lock, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';

interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

interface BookingData {
  serviceId: string;
  serviceName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  price: number;
  totalPrice: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [newAddress, setNewAddress] = useState({
    label: '',
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  useEffect(() => {
    loadBookingData();
    loadAddresses();
  }, []);

  const loadBookingData = () => {
    try {
      const data = sessionStorage.getItem('checkoutData');
      if (data) {
        setBookingData(JSON.parse(data));
      } else {
        toast.error('No booking data found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading booking data:', error);
      toast.error('Failed to load booking data');
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedAddresses = data.map((addr: any) => ({
          id: addr.id,
          label: addr.label,
          name: addr.name,
          street: addr.street,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          country: addr.country,
          phone: addr.phone,
          isDefault: addr.is_default,
        }));
        setAddresses(formattedAddresses);
        const defaultAddress = formattedAddresses.find((a) => a.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } else {
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.country || !newAddress.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const addressData = {
        label: newAddress.label || 'Home',
        name: newAddress.name,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zip: newAddress.zip,
        country: newAddress.country,
        phone: newAddress.phone,
        is_default: addresses.length === 0,
      };

      if (editingAddress) {
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddress.id);

        if (error) throw error;
        toast.success('Address updated successfully');
      } else {
        const { data, error } = await supabase
          .from('addresses')
          .insert([addressData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSelectedAddressId(data.id);
        }
        toast.success('Address added successfully');
      }

      setShowAddressForm(false);
      setEditingAddress(null);
      setNewAddress({
        label: '',
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
      });
      loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      toast.success('Address deleted');
      loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      label: address.label,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone,
    });
    setShowAddressForm(true);
  };

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
  };

  const validatePayment = () => {
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 13) {
      toast.error('Invalid card number');
      return false;
    }
    if (!cardDetails.name) {
      toast.error('Cardholder name is required');
      return false;
    }
    if (!cardDetails.expiry || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
      toast.error('Invalid expiry date');
      return false;
    }
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      toast.error('Invalid CVV');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!validatePayment()) {
      return;
    }

    setProcessing(true);

    setTimeout(async () => {
      try {
        const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
        const bookingId = `BK${Date.now().toString().slice(-8)}`;

        const orderData = {
          booking_id: bookingId,
          service_id: bookingData?.serviceId,
          service_name: bookingData?.serviceName,
          room_type: bookingData?.roomType,
          check_in: bookingData?.checkIn,
          check_out: bookingData?.checkOut,
          adults: bookingData?.adults,
          children: bookingData?.children,
          infants: bookingData?.infants,
          total_price: bookingData?.totalPrice,
          guest_name: selectedAddress?.name,
          guest_email: 'user@example.com',
          guest_phone: selectedAddress?.phone,
          guest_address: `${selectedAddress?.street}, ${selectedAddress?.city}, ${selectedAddress?.state} ${selectedAddress?.zip}, ${selectedAddress?.country}`,
          payment_method: 'card',
          payment_status: 'paid',
          booking_status: 'confirmed',
          created_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('bookings')
          .insert([orderData]);

        if (error) {
          console.error('Error saving booking:', error);
        }

        sessionStorage.setItem('orderConfirmation', JSON.stringify({
          bookingId,
          ...orderData,
          address: selectedAddress,
        }));

        sessionStorage.removeItem('checkoutData');

        toast.success('Booking confirmed!');
        router.push(`/order-confirmation?id=${bookingId}`);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to complete booking');
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!bookingData) {
    return null;
  }

  const nights = differenceInDays(new Date(bookingData.checkOut), new Date(bookingData.checkIn));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold">Checkout</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentStep >= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                <span className="text-sm font-medium">Address</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentStep >= 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Delivery Address</h2>
                  {addresses.length > 0 && !showAddressForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAddress(null);
                        setNewAddress({
                          label: '',
                          name: '',
                          street: '',
                          city: '',
                          state: '',
                          zip: '',
                          country: '',
                          phone: '',
                        });
                        setShowAddressForm(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  )}
                </div>

                {!showAddressForm && addresses.length > 0 ? (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          htmlFor={address.id}
                          className={`flex items-start gap-3 border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{address.label}</span>
                              {address.isDefault && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Default</span>
                              )}
                            </div>
                            <p className="text-sm font-medium">{address.name}</p>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.city}, {address.state} {address.zip}
                            </p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleEditAddress(address);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit2 className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (confirm('Delete this address?')) {
                                  handleDeleteAddress(address.id);
                                }
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="label">Label (e.g., Home, Work)</Label>
                        <Input
                          id="label"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          placeholder="Home"
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zip">ZIP/Postal Code</Label>
                        <Input
                          id="zip"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                          placeholder="10001"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                          placeholder="United States"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      {addresses.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddressForm(false);
                            setEditingAddress(null);
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button onClick={handleSaveAddress} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </Button>
                    </div>
                  </div>
                )}

                {!showAddressForm && addresses.length > 0 && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={!selectedAddressId}
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                      size="lg"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Payment Details</h2>

                <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.number}
                        onChange={(e) => handleCardInputChange('number', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={cardDetails.name}
                        onChange={(e) => handleCardInputChange('name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={cardDetails.expiry}
                          onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg mt-6">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                    Back to Address
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Complete Booking
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Booking Summary</h3>

              <div className="space-y-3 mb-4">
                <h4 className="font-semibold">{bookingData.serviceName}</h4>
                <p className="text-sm text-gray-600">{bookingData.roomType}</p>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-gray-600">Check-in</p>
                      <p className="font-medium">{format(new Date(bookingData.checkIn), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-gray-600">Check-out</p>
                      <p className="font-medium">{format(new Date(bookingData.checkOut), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>
                      {bookingData.adults} Adult{bookingData.adults > 1 ? 's' : ''}
                      {bookingData.children > 0 && `, ${bookingData.children} Child${bookingData.children > 1 ? 'ren' : ''}`}
                      {bookingData.infants > 0 && `, ${bookingData.infants} Infant${bookingData.infants > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">${bookingData.price} x {nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="font-medium">${bookingData.price * nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-emerald-600">${bookingData.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-emerald-500 mt-0.5" />
                  <span>Free cancellation up to 24h before check-in</span>
                </p>
                <p className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-emerald-500 mt-0.5" />
                  <span>Instant booking confirmation</span>
                </p>
                <p className="flex items-start gap-2">
                  <Check className="h-3 w-3 text-emerald-500 mt-0.5" />
                  <span>24/7 customer support</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
