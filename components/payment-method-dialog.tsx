"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  existingCard?: {
    type: string;
    lastFour: string;
  };
}

export function PaymentMethodDialog({
  open,
  onOpenChange,
  mode = "add",
  existingCard,
}: PaymentMethodDialogProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {mode === "add" ? "Add Payment Method" : "Edit Payment Method"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <div className="w-12 h-8 bg-white border rounded flex items-center justify-center">
                <svg
                  className="w-8 h-5"
                  viewBox="0 0 48 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.1 28.7L7.4 19L17.1 9.3L14.9 7.1L2.9 19.1L15 31.1L17.1 28.7Z"
                    fill="#1434CB"
                  />
                  <path
                    d="M30.9 28.7L40.6 19L30.9 9.3L33.1 7.1L45.1 19.1L33 31.1L30.9 28.7Z"
                    fill="#F7981D"
                  />
                </svg>
              </div>
              <div className="w-12 h-8 bg-white border rounded flex items-center justify-center">
                <svg
                  className="w-8 h-5"
                  viewBox="0 0 48 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="16" r="10" fill="#EB001B" />
                  <circle cx="30" cy="16" r="10" fill="#F79E1B" />
                  <path
                    d="M24 9C21.5 11 20 13.8 20 16.5C20 19.2 21.5 22 24 24C26.5 22 28 19.2 28 16.5C28 13.8 26.5 11 24 9Z"
                    fill="#FF5F00"
                  />
                </svg>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          <div>
            <h3 className="font-semibold text-base mb-4">
              Add Credit or Debit Card
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber" className="text-sm font-medium mb-2 block">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="Enter card number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="h-11"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-sm font-medium mb-2 block">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="h-11"
                    maxLength={5}
                  />
                </div>

                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium mb-2 block">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="Enter CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="h-11"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cardName" className="text-sm font-medium mb-2 block">
                  Name on Card
                </Label>
                <Input
                  id="cardName"
                  type="text"
                  placeholder="Enter name on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
          >
            {mode === "add" ? "Add Payment Method" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
