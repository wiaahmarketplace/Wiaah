'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotCalendarProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDateTime: (date: Date, time: string) => void;
  minDate?: Date;
  availableSlots?: Record<string, TimeSlot[]>;
  className?: string;
}

export function TimeSlotCalendar({
  selectedDate,
  selectedTime,
  onSelectDateTime,
  minDate = new Date(),
  availableSlots,
  className = '',
}: TimeSlotCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(selectedDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const defaultTimeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: false },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: false },
    { time: '17:00', available: true },
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

  const isDateSelected = (date: Date) => {
    if (!tempSelectedDate) return false;
    return (
      date.getDate() === tempSelectedDate.getDate() &&
      date.getMonth() === tempSelectedDate.getMonth() &&
      date.getFullYear() === tempSelectedDate.getFullYear()
    );
  };

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const currentSlots = tempSelectedDate
    ? availableSlots?.[getDateKey(tempSelectedDate)] || defaultTimeSlots
    : [];

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
            const selected = isDateSelected(date);

            return (
              <button
                key={day}
                onClick={() => !disabled && setTempSelectedDate(date)}
                disabled={disabled}
                className={`
                  py-2 text-sm rounded transition-colors
                  ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                  ${selected ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {tempSelectedDate && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-sm">Available Times</h3>
          </div>
          <ScrollArea className="h-48">
            <div className="grid grid-cols-3 gap-2">
              {currentSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && onSelectDateTime(tempSelectedDate, slot.time)}
                  disabled={!slot.available}
                  className={`
                    py-2 px-3 text-sm rounded border transition-colors relative
                    ${!slot.available ? 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed' : 'hover:border-emerald-500 hover:bg-emerald-50'}
                    ${selectedTime === slot.time && selectedDate?.getTime() === tempSelectedDate.getTime() ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-200'}
                  `}
                  title={!slot.available ? 'This time slot is not available' : 'Available'}
                >
                  <span className={!slot.available ? 'line-through' : ''}>{slot.time}</span>
                  {!slot.available && (
                    <span className="absolute top-0.5 right-0.5 text-xs">✕</span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
