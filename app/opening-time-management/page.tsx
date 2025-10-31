"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShopSidebar } from "@/components/shop-sidebar";
import { Header } from "@/components/header";

interface TimeSlot {
  from: string;
  to: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

export default function OpeningTimeManagementPage() {
  const [timeZone, setTimeZone] = useState("eastern");
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [schedule, setSchedule] = useState<WeekSchedule>({
    monday: {
      enabled: true,
      slots: [
        { from: "12:00 AM", to: "12:00 PM" },
        { from: "12:00 AM", to: "12:00 AM" }
      ]
    },
    tuesday: {
      enabled: true,
      slots: [{ from: "12:00 AM", to: "12:00 PM" }]
    },
    wednesday: {
      enabled: true,
      slots: [{ from: "12:00 AM", to: "12:00 PM" }]
    },
    thursday: {
      enabled: true,
      slots: [{ from: "12:00 AM", to: "12:00 PM" }]
    },
    friday: {
      enabled: true,
      slots: [{ from: "12:00 AM", to: "12:00 PM" }]
    },
    saturday: {
      enabled: false,
      slots: []
    },
    sunday: {
      enabled: false,
      slots: []
    }
  });

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" }
  ];

  const timeOptions = [
    "12:00 AM", "12:30 AM", "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM",
    "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM", "5:00 AM", "5:30 AM",
    "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM"
  ];

  const toggleDay = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled: !schedule[day].enabled,
        slots: !schedule[day].enabled && schedule[day].slots.length === 0
          ? [{ from: "12:00 AM", to: "12:00 PM" }]
          : schedule[day].slots
      }
    });
  };

  const addTimeSlot = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: [...schedule[day].slots, { from: "12:00 AM", to: "12:00 PM" }]
      }
    });
  };

  const removeTimeSlot = (day: string, index: number) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: schedule[day].slots.filter((_, i) => i !== index)
      }
    });
  };

  const updateTimeSlot = (day: string, index: number, field: "from" | "to", value: string) => {
    const newSlots = [...schedule[day].slots];
    newSlots[index][field] = value;
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: newSlots
      }
    });
  };

  const handleSave = () => {
    console.log("Save changes:", schedule);
  };

  const handleCancel = () => {
    console.log("Cancel changes");
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const toggleDate = (dateStr: string) => {
    const newSelectedDates = new Set(selectedDates);
    if (newSelectedDates.has(dateStr)) {
      newSelectedDates.delete(dateStr);
    } else {
      newSelectedDates.add(dateStr);
    }
    setSelectedDates(newSelectedDates);
  };

  const renderMonthCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeks = [];
    let days = [];

    // Add empty cells for days before month starts
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div key={`prev-${i}`} className="text-center py-3 text-gray-400">
          {day}
        </div>
      );
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDates.has(dateStr);

      days.push(
        <button
          key={day}
          onClick={() => toggleDate(dateStr)}
          className={`text-center py-3 rounded-lg transition-colors ${
            isSelected
              ? 'bg-emerald-500 text-white font-semibold'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );

      if (days.length === 7) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-1">
            {days}
          </div>
        );
        days = [];
      }
    }

    // Add remaining days from next month
    if (days.length > 0) {
      const remainingDays = 7 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push(
          <div key={`next-${i}`} className="text-center py-3 text-gray-400">
            {i}
          </div>
        );
      }
      weeks.push(
        <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl p-6 text-white">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">{monthNames[month]} {year}</h3>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-semibold py-2 text-sm">
              {day}
            </div>
          ))}
        </div>
        {weeks}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="opening-time" />

        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Open Time Management</h1>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <Tabs defaultValue="week" className="mb-8">
                  <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full justify-start">
                    <TabsTrigger
                      value="week"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-gray-600 data-[state=active]:text-gray-900 font-medium"
                    >
                      Schedule for the week
                    </TabsTrigger>
                    <TabsTrigger
                      value="special"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-gray-600 data-[state=active]:text-gray-900 font-medium"
                    >
                      Special days schedule
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="week" className="mt-8 space-y-8">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Time zone
                      </label>
                      <Select value={timeZone} onValueChange={setTimeZone}>
                        <SelectTrigger className="w-64 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eastern">Eastern Time</SelectItem>
                          <SelectItem value="central">Central Time</SelectItem>
                          <SelectItem value="mountain">Mountain Time</SelectItem>
                          <SelectItem value="pacific">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <p className="text-sm text-gray-600">
                      Let people know when you are working and available for meetings.
                    </p>

                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm font-medium text-gray-700">
                        <div>Day</div>
                        <div>Availability</div>
                      </div>

                      <div className="space-y-6">
                        {days.map((day) => (
                          <div key={day.key} className="border-t border-gray-100 pt-6">
                            <div className="flex items-start gap-6">
                              <div className="flex items-center gap-3 w-32 pt-3">
                                <Checkbox
                                  id={day.key}
                                  checked={schedule[day.key].enabled}
                                  onCheckedChange={() => toggleDay(day.key)}
                                  className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                />
                                <label
                                  htmlFor={day.key}
                                  className="text-sm font-medium text-gray-900 cursor-pointer"
                                >
                                  {day.label}
                                </label>
                              </div>

                              <div className="flex-1 space-y-3">
                                {schedule[day.key].enabled && schedule[day.key].slots.map((slot, index) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="text-xs text-gray-500 w-10">From</span>
                                        <Select
                                          value={slot.from}
                                          onValueChange={(value) => updateTimeSlot(day.key, index, "from", value)}
                                        >
                                          <SelectTrigger className="flex-1 bg-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {timeOptions.map((time) => (
                                              <SelectItem key={time} value={time}>
                                                {time}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <span className="text-gray-400">-</span>

                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="text-xs text-gray-500 w-10">To</span>
                                        <Select
                                          value={slot.to}
                                          onValueChange={(value) => updateTimeSlot(day.key, index, "to", value)}
                                        >
                                          <SelectTrigger className="flex-1 bg-white">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {timeOptions.map((time) => (
                                              <SelectItem key={time} value={time}>
                                                {time}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <button
                                      onClick={() => removeTimeSlot(day.key, index)}
                                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                                      style={{ visibility: schedule[day.key].slots.length > 1 ? 'visible' : 'hidden' }}
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}

                                {schedule[day.key].enabled && schedule[day.key].slots.length < 2 && (
                                  <button
                                    onClick={() => addTimeSlot(day.key)}
                                    className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                                  >
                                    <Plus className="w-5 h-5 text-gray-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="special" className="mt-8 space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <X className="w-4 h-4 text-gray-600" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">Select Multiply Days</h2>
                    </div>

                    <div className="flex items-center justify-center gap-8 mb-8">
                      <button
                        onClick={() => setCurrentYear(currentYear - 1)}
                        className="text-emerald-500 font-semibold text-lg hover:text-emerald-600 transition-colors"
                      >
                        Previous year
                      </button>
                      <h2 className="text-5xl font-bold text-gray-900">{currentYear}</h2>
                      <button
                        onClick={() => setCurrentYear(currentYear + 1)}
                        className="text-emerald-500 font-semibold text-lg hover:text-emerald-600 transition-colors"
                      >
                        Next year
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {renderMonthCalendar(currentYear, 0)}
                      {renderMonthCalendar(currentYear, 1)}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {renderMonthCalendar(currentYear, 2)}
                      {renderMonthCalendar(currentYear, 3)}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {renderMonthCalendar(currentYear, 4)}
                      {renderMonthCalendar(currentYear, 5)}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {renderMonthCalendar(currentYear, 6)}
                      {renderMonthCalendar(currentYear, 7)}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {renderMonthCalendar(currentYear, 8)}
                      {renderMonthCalendar(currentYear, 9)}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {renderMonthCalendar(currentYear, 10)}
                      {renderMonthCalendar(currentYear, 11)}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
