"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookingDetailsDialog } from "@/components/booking-details-dialog";
import { ApproveReservationDialog } from "@/components/approve-reservation-dialog";
import { ServiceSidebar } from "@/components/service-sidebar";
import { Header } from "@/components/header";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PendingReservation {
  id: string;
  customer: {
    name: string;
    avatar: string;
    initials: string;
  };
  date: string;
  time: string;
  service: string;
  status: "pending";
}

const mockReservations: PendingReservation[] = [
  {
    id: "1",
    customer: {
      name: "Julia Smith",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
      initials: "JS"
    },
    date: "July 15, 2024",
    time: "10:00 AM",
    service: "Haircut",
    status: "pending"
  },
  {
    id: "2",
    customer: {
      name: "David Lee",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
      initials: "DL"
    },
    date: "July 16, 2024",
    time: "2:00 PM",
    service: "Manicure",
    status: "pending"
  },
  {
    id: "3",
    customer: {
      name: "Emily Carter",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
      initials: "EC"
    },
    date: "July 17, 2024",
    time: "11:30 AM",
    service: "Facial",
    status: "pending"
  },
  {
    id: "4",
    customer: {
      name: "John Brown",
      avatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100",
      initials: "JB"
    },
    date: "July 18, 2024",
    time: "9:00 AM",
    service: "Massage",
    status: "pending"
  },
  {
    id: "5",
    customer: {
      name: "Sarah Wilson",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      initials: "SW"
    },
    date: "July 19, 2024",
    time: "3:30 PM",
    service: "Pedicure",
    status: "pending"
  }
];

export default function PendingReservationsPage() {
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [reservationToAction, setReservationToAction] = useState<PendingReservation | null>(null);
  const [reservations, setReservations] = useState(mockReservations);

  const handleViewDetails = (reservation: PendingReservation) => {
    setSelectedReservation({
      id: reservation.id,
      clientName: reservation.customer.name,
      bookingDate: reservation.date,
      bookingTime: reservation.time,
      serviceDuration: "1 hour",
      locationName: "Wiaah Salon & Spa",
      locationAddress: "123 Main Street, City, State 12345",
      contact: "+1 (555) 123-4567",
      instructions: "Please arrive 10 minutes early for your appointment.",
      serviceFee: 50,
      bookingFee: 5,
      cancellationFee: 0,
      total: 55,
      paymentMethod: "Credit Card ending in 4242",
      status: "Pending Approval",
      statusDate: "Waiting for your approval",
      cancellationPolicy: "Free cancellation up to 24 hours before the appointment.",
      servicesBooked: [
        {
          image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=100",
          description: reservation.service
        }
      ]
    });
    setDetailsOpen(true);
  };

  const handleApprove = (reservation: PendingReservation) => {
    setReservationToAction(reservation);
    setApproveDialogOpen(true);
  };

  const handleConfirmAction = (action: "approve" | "refuse", message?: string) => {
    if (!reservationToAction) return;

    if (action === "approve") {
      toast.success(`Reservation approved for ${reservationToAction.customer.name}`);
      setReservations(reservations.filter(r => r.id !== reservationToAction.id));
    } else {
      toast.success(`Reservation refused for ${reservationToAction.customer.name}`);
      setReservations(reservations.filter(r => r.id !== reservationToAction.id));
    }

    setReservationToAction(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ServiceSidebar activePage="pending" />

        <div className="flex-1 p-8">
          <h1 className="text-2xl font-semibold mb-6">Pending Reservations</h1>

          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-900">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900">Time</TableHead>
                  <TableHead className="font-semibold text-gray-900">Service</TableHead>
                  <TableHead className="font-semibold text-gray-900">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={reservation.customer.avatar} />
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {reservation.customer.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-normal text-gray-900">
                          {reservation.customer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">{reservation.date}</TableCell>
                    <TableCell className="text-gray-900">{reservation.time}</TableCell>
                    <TableCell className="text-gray-900">{reservation.service}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleApprove(reservation)}
                          className="bg-black hover:bg-gray-800 text-white text-sm h-9 px-6"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(reservation)}
                          className="h-9"
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {reservations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No pending reservations</p>
            </div>
          )}
        </div>
      </div>

      {selectedReservation && (
        <BookingDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          booking={selectedReservation}
        />
      )}

      <ApproveReservationDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        reservation={reservationToAction}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
