'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

export function SimpleCalendar({
  selectedDate,
  onSelectDate,
  minDate = new Date(),
  disabledDates = [],
  className = '',
}: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    if (date < minDate) return true;
    return disabledDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className={`border rounded-lg p-4 ${className}`}>
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
              onClick={() => !disabled && onSelectDate(date)}
              disabled={disabled}
              className={`
                py-2 text-sm rounded transition-colors relative
                ${disabled ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${selected ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}
              `}
              title={disabled ? 'Not available' : ''}
            >
              <span className={disabled && !selected ? 'line-through' : ''}>{day}</span>
              {disabled && !selected && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
