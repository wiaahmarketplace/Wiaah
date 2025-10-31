'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
import { CreditCard, Plus, Trash2 } from 'lucide-react';

const initialPaymentMethods = [
  {
    id: '1',
    type: 'Credit Card',
    last4: '1234',
    brand: 'Visa',
  },
  {
    id: '2',
    type: 'Debit Card',
    last4: '5678',
    brand: 'Mastercard',
  },
];

export default function PaymentMethodPage() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<typeof initialPaymentMethods[0] | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handleAddPaymentMethod = () => {
    setIsAddDialogOpen(false);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardName('');
  };

  const handleEditPaymentMethod = () => {
    setIsEditDialogOpen(false);
    setSelectedMethod(null);
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardName('');
  };

  const openEditDialog = (method: typeof initialPaymentMethods[0]) => {
    setSelectedMethod(method);
    setCardNumber('**** **** **** ' + method.last4);
    setExpiryDate('');
    setCvv('');
    setCardName('');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (method: typeof initialPaymentMethods[0]) => {
    setSelectedMethod(method);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePaymentMethod = () => {
    if (selectedMethod) {
      setPaymentMethods(paymentMethods.filter(m => m.id !== selectedMethod.id));
      setIsDeleteDialogOpen(false);
      setSelectedMethod(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  My Payment Methods
                  <span className="inline-flex gap-1">
                    <span className="text-blue-600 text-xl">VISA</span>
                    <span className="text-orange-600 text-xl font-bold">mastercard</span>
                  </span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Manage your payment methods for purchases</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Available Payment Methods</h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
                        {method.brand === 'Visa' ? (
                          <span className="text-white text-xs font-bold">VISA</span>
                        ) : (
                          <span className="text-white text-xs font-bold">MC</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{method.type}</h3>
                        <p className="text-sm text-gray-500">
                          {method.brand} ending in {method.last4}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(method)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(method)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Add New Payment Method</h2>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-3 w-full p-4 border-2 border-dashed rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Add Credit or Debit Card</span>
                    <Plus className="w-5 h-5 text-gray-400 ml-auto" />
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      Add Payment Method
                      <span className="text-blue-600 text-sm">VISA</span>
                      <span className="text-orange-600 text-sm font-bold">mastercard</span>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div className="text-sm font-medium text-gray-900">Add Credit or Debit Card</div>

                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="Enter card number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiration Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="Enter CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="Enter name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleAddPaymentMethod}
                      className="w-full bg-gray-900 hover:bg-gray-800"
                    >
                      Add Payment Method
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Edit Payment Method
              <span className="text-blue-600 text-sm">VISA</span>
              <span className="text-orange-600 text-sm font-bold">mastercard</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="text-sm font-medium text-gray-900">
              Update {selectedMethod?.type}
            </div>

            <div>
              <Label htmlFor="editCardNumber">Card Number</Label>
              <Input
                id="editCardNumber"
                placeholder="Enter card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editExpiryDate">Expiration Date</Label>
                <Input
                  id="editExpiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="editCvv">CVV</Label>
                <Input
                  id="editCvv"
                  placeholder="Enter CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editCardName">Name on Card</Label>
              <Input
                id="editCardName"
                placeholder="Enter name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditPaymentMethod}
                className="flex-1 bg-gray-900 hover:bg-gray-800"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
              {selectedMethod && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center">
                      {selectedMethod.brand === 'Visa' ? (
                        <span className="text-white text-xs font-bold">VISA</span>
                      ) : (
                        <span className="text-white text-xs font-bold">MC</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{selectedMethod.type}</p>
                      <p className="text-xs text-gray-500">
                        {selectedMethod.brand} ending in {selectedMethod.last4}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePaymentMethod}
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
