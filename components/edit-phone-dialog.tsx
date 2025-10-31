"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditPhoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhone: string;
  onSave: (phone: string) => void;
}

export function EditPhoneDialog({
  open,
  onOpenChange,
  currentPhone,
  onSave,
}: EditPhoneDialogProps) {
  const [phone, setPhone] = useState(currentPhone);

  const handleSave = () => {
    onSave(phone);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Phone Number
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-900 hover:bg-gray-100 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800 px-6"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
