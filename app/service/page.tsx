"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ServiceSidebar } from "@/components/service-sidebar";
import { BookingDetailsDialog } from "@/components/booking-details-dialog";
import { Pagination } from "@/components/pagination";
import { Header } from "@/components/header";

interface Appointment {
  date: number;
  time: string;
  client: string;
  service: string;
  duration: string;
  status: "confirmed" | "cancelled" | "pending";
}

const mockAppointments: Appointment[] = [
  {
    date: 28,
    time: "9:00 AM",
    client: "Sophia Clark",
    service: "Yoga Session",
    duration: "1 hour",
    status: "confirmed"
  },
  {
    date: 28,
    time: "10:30 AM",
    client: "Ethan Bennett",
    service: "Personal Training",
    duration: "30 Minutes",
    status: "confirmed"
  },
  {
    date: 28,
    time: "1:00 PM",
    client: "Emily Carter",
    service: "Nutrition Consultation",
    duration: "45 Minutes",
    status: "pending"
  },
  {
    date: 28,
    time: "3:00 PM",
    client: "Liam Foster",
    service: "Pilates Class",
    duration: "1 hour",
    status: "confirmed"
  },
  {
    date: 28,
    time: "5:00 PM",
    client: "Ava Morgan",
    service: "Massage Therapy",
    duration: "2 hours",
    status: "cancelled"
  },
  {
    date: 15,
    time: "8:00 AM",
    client: "Oliver James",
    service: "Cardio Training",
    duration: "45 Minutes",
    status: "confirmed"
  },
  {
    date: 15,
    time: "11:00 AM",
    client: "Isabella Brown",
    service: "Spa Treatment",
    duration: "2 hours",
    status: "confirmed"
  },
  {
    date: 15,
    time: "2:30 PM",
    client: "Noah Wilson",
    service: "Boxing Class",
    duration: "1 hour",
    status: "pending"
  },
  {
    date: 10,
    time: "9:30 AM",
    client: "Emma Davis",
    service: "Swimming Lesson",
    duration: "45 Minutes",
    status: "confirmed"
  },
  {
    date: 10,
    time: "12:00 PM",
    client: "James Miller",
    service: "Physiotherapy",
    duration: "1 hour",
    status: "confirmed"
  },
  {
    date: 10,
    time: "4:00 PM",
    client: "Charlotte Garcia",
    service: "Meditation Session",
    duration: "30 Minutes",
    status: "cancelled"
  }
];

export default function ServicePage() {
  const [selectedDate, setSelectedDate] = useState(28);
  const [currentMonth, setCurrentMonth] = useState("October 2025");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const itemsPerPage = 5;

  const filteredAppointments = mockAppointments.filter(apt => apt.date === selectedDate);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  const handleViewBooking = (appointment: Appointment) => {
    setSelectedBooking(appointment);
    setIsBookingDialogOpen(true);
  };

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const daysInMonth = [
    [28, 29, 30, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 1]
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ServiceSidebar activePage="service" />

        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Reservation Agenda</h1>
            <p className="text-gray-600">Daily overview of booking appointments for all service providers.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900">{currentMonth}</h3>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.flat().map((day, index) => {
                const isCurrentMonth = (index < 3 && day > 20) || (index > 3 && day < 20) ? false : true;
                const isSelected = day === selectedDate && isCurrentMonth;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isCurrentMonth) {
                        setSelectedDate(day);
                        setCurrentPage(1);
                      }
                    }}
                    className={`
                      aspect-square flex items-center justify-center rounded-full text-sm
                      ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                      ${!isSelected && isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : ''}
                      ${!isCurrentMonth ? 'text-gray-400' : ''}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Appointments for October {selectedDate}, 2025
              </h2>
              {filteredAppointments.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No appointments scheduled for this day</p>
              )}
            </div>

            {filteredAppointments.length > 0 && (
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentAppointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{appointment.time}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{appointment.client}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{appointment.service}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{appointment.duration}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={appointment.status === "confirmed" ? "default" : appointment.status === "pending" ? "secondary" : "destructive"}
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="link"
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                          onClick={() => handleViewBooking(appointment)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}

            {filteredAppointments.length > 0 && totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingDetailsDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        booking={selectedBooking}
      />
    </div>
  );
}
