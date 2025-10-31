'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface GuestsCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  guests: { adults: number; children: number; infants: number };
  onSelectRange: (start: Date | null, end: Date | null) => void;
  onGuestsChange: (guests: { adults: number; children: number; infants: number }) => void;
  minDate?: Date;
  maxGuests?: number;
  className?: string;
}

export function GuestsCalendar({
  startDate,
  endDate,
  guests,
  onSelectRange,
  onGuestsChange,
  minDate = new Date(),
  maxGuests = 10,
  className = '',
}: GuestsCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    if (prev >= new Date(minDate.getFullYear(), minDate.getMonth())) {
      setCurrentMonth(prev);
    }
  };

  const isDateDisabled = (date: Date) => {
    return date < minDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!startDate || (startDate && endDate)) {
      onSelectRange(date, null);
    } else {
      if (date < startDate) {
        onSelectRange(date, startDate);
      } else {
        onSelectRange(startDate, date);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!startDate) return false;
    const compareEnd = endDate || hoverDate;
    if (!compareEnd) return false;
    return date > startDate && date < compareEnd;
  };

  const isStartDate = (date: Date) => {
    if (!startDate) return false;
    return (
      date.getDate() === startDate.getDate() &&
      date.getMonth() === startDate.getMonth() &&
      date.getFullYear() === startDate.getFullYear()
    );
  };

  const isEndDate = (date: Date) => {
    if (!endDate) return false;
    return (
      date.getDate() === endDate.getDate() &&
      date.getMonth() === endDate.getMonth() &&
      date.getFullYear() === endDate.getFullYear()
    );
  };

  const updateGuests = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const newValue = Math.max(0, guests[type] + delta);
    const totalGuests = (type === 'adults' ? newValue : guests.adults) +
                        (type === 'children' ? newValue : guests.children) +
                        (type === 'infants' ? newValue : guests.infants);

    if (totalGuests <= maxGuests && (type === 'adults' ? newValue >= 1 : true)) {
      onGuestsChange({ ...guests, [type]: newValue });
    }
  };

  const totalGuests = guests.adults + guests.children + guests.infants;

  return (
    <div className={className}>
      <div className="border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-sm">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs font-semibold text-gray-600 text-center py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const disabled = isDateDisabled(date);
            const isStart = isStartDate(date);
            const isEnd = isEndDate(date);
            const inRange = isInRange(date);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => !disabled && setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
                disabled={disabled}
                className={`
                  py-2 text-sm transition-colors relative
                  ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                  ${isStart || isEnd ? 'bg-emerald-500 text-white hover:bg-emerald-600 rounded' : ''}
                  ${inRange ? 'bg-emerald-100' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-sm">Guests</h3>
          <span className="text-xs text-gray-500 ml-auto">
            {totalGuests}/{maxGuests}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Adults</Label>
              <p className="text-xs text-gray-500">Ages 13+</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateGuests('adults', -1)}
                disabled={guests.adults <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{guests.adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateGuests('adults', 1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Children</Label>
              <p className="text-xs text-gray-500">Ages 2-12</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateGuests('children', -1)}
                disabled={guests.children <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{guests.children}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateGuests('children', 1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Infants</Label>
              <p className="text-xs text-gray-500">Under 2</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateGuests('infants', -1)}
                disabled={guests.infants <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{guests.infants}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateGuests('infants', 1)}
                disabled={totalGuests >= maxGuests}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
