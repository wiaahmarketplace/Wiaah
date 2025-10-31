"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface ReturnItem {
  name: string;
  size?: string;
  image: string;
}

interface ReturnItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  items: ReturnItem[];
}

export function ReturnItemsDialog({
  open,
  onOpenChange,
  orderNumber,
  items,
}: ReturnItemsDialogProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmitReturn = () => {
    console.log("Submit return:", { reason, details });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Return Items</h2>
            <p className="text-gray-500 text-sm mt-1">Order #{orderNumber}</p>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                  {item.size && <p className="text-xs text-gray-600">Size {item.size}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Reason for Return</h3>
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="grid grid-cols-2 gap-2">
                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="too-small" id="too-small" />
                    <Label htmlFor="too-small" className="text-sm font-normal cursor-pointer flex-1">
                      Too small
                    </Label>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="too-big" id="too-big" />
                    <Label htmlFor="too-big" className="text-sm font-normal cursor-pointer flex-1">
                      Too big
                    </Label>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="damaged" id="damaged" />
                    <Label htmlFor="damaged" className="text-sm font-normal cursor-pointer flex-1">
                      Damaged
                    </Label>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wrong-item" id="wrong-item" />
                    <Label htmlFor="wrong-item" className="text-sm font-normal cursor-pointer flex-1">
                      Wrong Item
                    </Label>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors col-span-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="text-sm font-normal cursor-pointer flex-1">
                      Other
                    </Label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Tell more about the situation"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[80px] resize-none text-sm"
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSubmitReturn}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 text-sm rounded-lg"
            >
              Submit Return
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
