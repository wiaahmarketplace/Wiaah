"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditLanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLanguage: string;
  onSave: (language: string) => void;
}

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Hindi",
];

export function EditLanguageDialog({
  open,
  onOpenChange,
  currentLanguage,
  onSave,
}: EditLanguageDialogProps) {
  const [language, setLanguage] = useState(currentLanguage);

  const handleSave = () => {
    onSave(language);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Edit Language
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium text-gray-900">
              Language
            </Label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
