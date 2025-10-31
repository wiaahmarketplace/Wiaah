'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Globe, Lock, Users, UserCheck, Check } from 'lucide-react';

interface VisibilitySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVisibility: string;
  onSelect: (visibility: string) => void;
}

const visibilityOptions = [
  {
    value: 'Everyone can view this post',
    label: 'Public',
    description: 'Anyone on or off the platform',
    icon: Globe,
  },
  {
    value: 'Only followers can view this post',
    label: 'Followers',
    description: 'Your followers only',
    icon: Users,
  },
  {
    value: 'Only friends can view this post',
    label: 'Friends',
    description: 'Friends you follow back',
    icon: UserCheck,
  },
  {
    value: 'Only me',
    label: 'Private',
    description: 'Only visible to you',
    icon: Lock,
  },
];

export function VisibilitySettingsDialog({
  open,
  onOpenChange,
  currentVisibility,
  onSelect,
}: VisibilitySettingsDialogProps) {
  const [selected, setSelected] = useState(currentVisibility);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Post Visibility</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all hover:bg-gray-50 ${
                  isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                }`}
              >
                <div className={`p-2 rounded-full ${isSelected ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
