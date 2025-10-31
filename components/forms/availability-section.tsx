'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AvailabilitySectionProps {
  availability: any;
  onAvailabilityChange: (availability: any) => void;
}

export function AvailabilitySection({ availability, onAvailabilityChange }: AvailabilitySectionProps) {
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [minStay, setMinStay] = useState('1');
  const [maxStay, setMaxStay] = useState('');
  const [advanceBooking, setAdvanceBooking] = useState('365');
  const [instantBooking, setInstantBooking] = useState(true);

  const handleUpdate = (updates: any) => {
    const newAvailability = {
      blocked_dates: blockedDates.map(d => d.toISOString()),
      min_stay: parseInt(minStay) || 1,
      max_stay: maxStay ? parseInt(maxStay) : null,
      advance_booking_days: parseInt(advanceBooking) || 365,
      instant_booking: instantBooking,
      ...updates
    };
    onAvailabilityChange(newAvailability);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold mb-4 block">Availability Settings</Label>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="rules">Booking Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          <div>
            <Label className="mb-2 block">Block Unavailable Dates</Label>
            <p className="text-sm text-gray-600 mb-4">
              Select dates when this service is not available
            </p>
            <div className="border rounded-lg p-4 bg-white">
              <Calendar
                mode="multiple"
                selected={blockedDates}
                onSelect={(dates) => {
                  setBlockedDates(dates || []);
                  handleUpdate({ blocked_dates: (dates || []).map(d => d.toISOString()) });
                }}
                className="rounded-md"
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>

          {blockedDates.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Blocked Dates: {blockedDates.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {blockedDates.slice(0, 5).map((date, index) => (
                  <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    {date.toLocaleDateString()}
                  </span>
                ))}
                {blockedDates.length > 5 && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    +{blockedDates.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minStay">Minimum Stay (nights)</Label>
              <Input
                id="minStay"
                type="number"
                min="1"
                value={minStay}
                onChange={(e) => {
                  setMinStay(e.target.value);
                  handleUpdate({ min_stay: parseInt(e.target.value) || 1 });
                }}
              />
            </div>

            <div>
              <Label htmlFor="maxStay">Maximum Stay (nights)</Label>
              <Input
                id="maxStay"
                type="number"
                min="1"
                value={maxStay}
                onChange={(e) => {
                  setMaxStay(e.target.value);
                  handleUpdate({ max_stay: e.target.value ? parseInt(e.target.value) : null });
                }}
                placeholder="No limit"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="advanceBooking">Advance Booking (days)</Label>
            <Input
              id="advanceBooking"
              type="number"
              min="1"
              value={advanceBooking}
              onChange={(e) => {
                setAdvanceBooking(e.target.value);
                handleUpdate({ advance_booking_days: parseInt(e.target.value) || 365 });
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              How far in advance can guests book?
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="instantBooking"
              checked={instantBooking}
              onCheckedChange={(checked) => {
                setInstantBooking(checked as boolean);
                handleUpdate({ instant_booking: checked });
              }}
            />
            <Label htmlFor="instantBooking" className="font-normal cursor-pointer">
              Allow instant booking without approval
            </Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
