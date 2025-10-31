'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Button } from '@/components/ui/button';
import { AddressDialog } from '@/components/address-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2 } from 'lucide-react';

const initialAddresses = [
  {
    id: '1',
    type: 'Default delivery Address',
    name: 'Liam Parker',
    street: '123 Main Street',
    city: 'Springfield',
    state: 'CA',
    zip: '91234',
    country: 'United States',
    illustration: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    type: 'Other Addresses',
    name: 'Olivia Bennett',
    street: '456 Oak Avenue',
    city: 'Springfield',
    state: 'CA',
    zip: '91234',
    country: 'United States',
    illustration: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    type: 'Billing address',
    name: 'Noah Thompson',
    street: '789 Pine Lane',
    city: 'Springfield',
    state: 'CA',
    zip: '91234',
    country: 'United States',
    illustration: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<typeof initialAddresses[0] | null>(null);

  const handleEditAddress = (address: typeof initialAddresses[0]) => {
    setSelectedAddress(address);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAddress = (address: typeof initialAddresses[0]) => {
    setSelectedAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAddress = () => {
    if (selectedAddress) {
      setAddresses(addresses.filter(addr => addr.id !== selectedAddress.id));
      setIsDeleteDialogOpen(false);
      setSelectedAddress(null);
    }
  };

  const handleSaveAddress = (address: Partial<typeof initialAddresses[0]>) => {
    console.log('Address saved:', address);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Address Book</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your saved addresses for faster checkout</p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Shipping
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Addresses</h2>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="bg-white rounded-lg p-6 border">
                      <div className="flex justify-between gap-6">
                        <div className="flex-1">
                          <div className="mb-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{address.type}</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p className="font-medium">{address.name}</p>
                              <p>{address.street}</p>
                              <p>
                                {address.city}, {address.state} {address.zip}
                              </p>
                              <p>{address.country}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAddress(address)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAddress(address)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="w-48 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center flex-shrink-0">
                          <img
                            src={address.illustration}
                            alt="House illustration"
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
        </div>
      </div>

      <AddressDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
        onSave={handleSaveAddress}
      />

      <AddressDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        address={selectedAddress}
        mode="edit"
        onSave={handleSaveAddress}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
              {selectedAddress && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">{selectedAddress.type}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium">{selectedAddress.name}</p>
                        <p>{selectedAddress.street}</p>
                        <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
                        <p>{selectedAddress.country}</p>
                      </div>
                    </div>
                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={selectedAddress.illustration}
                        alt="Address illustration"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAddress}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
