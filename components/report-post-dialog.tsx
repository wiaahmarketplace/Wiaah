'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ReportPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reportReasons = [
  { id: 'spam', label: "It's spam" },
  { id: 'nudity', label: 'Nudity or sexual activity' },
  { id: 'hate-speech', label: 'Hate speech or symbols' },
  { id: 'violence', label: 'Violence or dangerous organizations' },
  { id: 'illegal-goods', label: 'Sale of illegal or regulated goods' },
  { id: 'bullying', label: 'Bullying or harassment' },
  { id: 'intellectual-property', label: 'Intellectual property violation' },
  { id: 'self-harm', label: 'Suicide, self-injury or eating disorders' },
  { id: 'illegal-goods-duplicate', label: 'Sale of illegal or regulated goods' },
  { id: 'other', label: 'Other' },
];

export function ReportPostDialog({ open, onOpenChange }: ReportPostDialogProps) {
  const [selectedReason, setSelectedReason] = useState('spam');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = () => {
    console.log('Report submitted:', { reason: selectedReason, info: additionalInfo });
    onOpenChange(false);
    setSelectedReason('spam');
    setAdditionalInfo('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-semibold">Report post</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <h3 className="font-semibold mb-4">Why are you reporting this post?</h3>

          <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="space-y-0">
            {reportReasons.map((reason) => (
              <div
                key={reason.id}
                className="flex items-center space-x-3 py-4 px-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                onClick={() => setSelectedReason(reason.id)}
              >
                <RadioGroupItem value={reason.id} id={reason.id} className="shrink-0" />
                <Label
                  htmlFor={reason.id}
                  className="flex-1 text-sm font-normal cursor-pointer"
                >
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === 'other' && (
            <div className="mt-6">
              <Textarea
                placeholder="Please provide more details about your report"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="min-h-[120px] resize-none border-gray-200 focus:border-gray-300 focus:ring-0"
              />
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full mt-6 bg-black hover:bg-black/90 text-white rounded-full h-12 text-base font-medium"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
