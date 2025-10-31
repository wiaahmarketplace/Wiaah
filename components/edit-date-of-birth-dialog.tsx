"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditDateOfBirthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDate: string;
  onSave: (date: string) => void;
}

export function EditDateOfBirthDialog({
  open,
  onOpenChange,
  currentDate,
  onSave,
}: EditDateOfBirthDialogProps) {
  const [date, setDate] = useState(currentDate);

  const handleSave = () => {
    onSave(date);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Date of Birth
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-900">
              Date of Birth
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="dateOfBirth"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
