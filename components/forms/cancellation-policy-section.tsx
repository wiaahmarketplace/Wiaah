'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

interface CancellationPolicySectionProps {
  policy: any;
  onPolicyChange: (policy: any) => void;
}

const POLICY_TEMPLATES = [
  {
    id: 'flexible',
    name: 'Flexible',
    description: 'Full refund up to 24 hours before check-in',
    details: 'Guests can cancel their booking up to 24 hours before check-in for a full refund. Cancellations made within 24 hours of check-in are non-refundable.'
  },
  {
    id: 'moderate',
    name: 'Moderate',
    description: 'Full refund up to 5 days before check-in',
    details: 'Guests can cancel their booking up to 5 days before check-in for a full refund. Cancellations made within 5 days of check-in will receive a 50% refund.'
  },
  {
    id: 'strict',
    name: 'Strict',
    description: 'Full refund up to 7 days before check-in',
    details: 'Guests can cancel their booking up to 7 days before check-in for a full refund. Cancellations made within 7 days of check-in are non-refundable.'
  },
  {
    id: 'custom',
    name: 'Custom Policy',
    description: 'Create your own cancellation terms',
    details: ''
  }
];

export function CancellationPolicySection({ policy, onPolicyChange }: CancellationPolicySectionProps) {
  const [selectedPolicy, setSelectedPolicy] = useState('flexible');
  const [customPolicy, setCustomPolicy] = useState('');
  const [refundPercentage, setRefundPercentage] = useState('100');
  const [cancellationDeadline, setCancellationDeadline] = useState('24');

  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicy(policyId);
    const template = POLICY_TEMPLATES.find(p => p.id === policyId);

    if (template && policyId !== 'custom') {
      onPolicyChange({
        type: policyId,
        description: template.details
      });
    }
  };

  const handleCustomPolicyUpdate = () => {
    onPolicyChange({
      type: 'custom',
      description: customPolicy,
      refund_percentage: parseInt(refundPercentage),
      cancellation_hours: parseInt(cancellationDeadline)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-4 block">Cancellation Policy</Label>
        <p className="text-sm text-gray-600">
          Choose how flexible you want to be with cancellations
        </p>
      </div>

      <RadioGroup value={selectedPolicy} onValueChange={handlePolicySelect}>
        <div className="space-y-4">
          {POLICY_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors ${
                selectedPolicy === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
              <div className="flex-1">
                <Label htmlFor={template.id} className="font-semibold cursor-pointer">
                  {template.name}
                </Label>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                {template.details && selectedPolicy === template.id && (
                  <p className="text-sm text-gray-700 mt-2 p-3 bg-white rounded border border-gray-200">
                    {template.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      {selectedPolicy === 'custom' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="refundPercentage">Refund Percentage (%)</Label>
              <Input
                id="refundPercentage"
                type="number"
                min="0"
                max="100"
                value={refundPercentage}
                onChange={(e) => {
                  setRefundPercentage(e.target.value);
                  handleCustomPolicyUpdate();
                }}
              />
            </div>

            <div>
              <Label htmlFor="cancellationDeadline">Cancellation Deadline (hours)</Label>
              <Input
                id="cancellationDeadline"
                type="number"
                min="0"
                value={cancellationDeadline}
                onChange={(e) => {
                  setCancellationDeadline(e.target.value);
                  handleCustomPolicyUpdate();
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customPolicy">Policy Description</Label>
            <Textarea
              id="customPolicy"
              value={customPolicy}
              onChange={(e) => {
                setCustomPolicy(e.target.value);
                handleCustomPolicyUpdate();
              }}
              placeholder="Describe your cancellation policy in detail..."
              rows={4}
            />
          </div>
        </div>
      )}
    </div>
  );
}
