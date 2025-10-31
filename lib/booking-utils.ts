import { supabase } from './supabase';

export interface UnavailableDate {
  date: Date;
  timeSlot?: string;
  reason?: string;
}

export interface Booking {
  id: string;
  serviceId: number;
  serviceCategory: string;
  bookingDate: Date;
  startDate?: Date;
  endDate?: Date;
  timeSlot?: string;
  guests?: {
    adults: number;
    children: number;
    infants: number;
  };
  status: string;
}

export async function getUnavailableDates(
  serviceId: number,
  serviceCategory: string
): Promise<UnavailableDate[]> {
  const { data, error } = await supabase
    .from('service_unavailable_dates')
    .select('*')
    .eq('service_id', serviceId)
    .eq('service_category', serviceCategory);

  if (error) {
    console.error('Error fetching unavailable dates:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    date: new Date(item.unavailable_date),
    timeSlot: item.time_slot,
    reason: item.reason,
  }));
}

export async function getBookingsForDateRange(
  serviceId: number,
  serviceCategory: string,
  startDate: Date,
  endDate: Date
): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('service_id', serviceId)
    .eq('service_category', serviceCategory)
    .eq('status', 'confirmed')
    .gte('booking_date', startDate.toISOString().split('T')[0])
    .lte('booking_date', endDate.toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    serviceId: item.service_id,
    serviceCategory: item.service_category,
    bookingDate: new Date(item.booking_date),
    startDate: item.start_date ? new Date(item.start_date) : undefined,
    endDate: item.end_date ? new Date(item.end_date) : undefined,
    timeSlot: item.time_slot,
    guests: item.guests,
    status: item.status,
  }));
}

export async function isDateAvailable(
  serviceId: number,
  serviceCategory: string,
  date: Date,
  timeSlot?: string
): Promise<boolean> {
  const dateStr = date.toISOString().split('T')[0];

  // Check unavailable dates
  const unavailableQuery = supabase
    .from('service_unavailable_dates')
    .select('id')
    .eq('service_id', serviceId)
    .eq('service_category', serviceCategory)
    .eq('unavailable_date', dateStr);

  if (timeSlot) {
    unavailableQuery.eq('time_slot', timeSlot);
  }

  const { data: unavailableData } = await unavailableQuery;

  if (unavailableData && unavailableData.length > 0) {
    return false;
  }

  // Check bookings (fully booked check)
  const { data: bookingsData, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('service_id', serviceId)
    .eq('service_category', serviceCategory)
    .eq('booking_date', dateStr)
    .eq('status', 'confirmed');

  if (error) {
    console.error('Error checking bookings:', error);
    return true;
  }

  // For time slots, check if specific time is booked
  if (timeSlot && bookingsData) {
    const timeSlotBookings = bookingsData.filter(
      (b: any) => b.time_slot === timeSlot
    );
    return timeSlotBookings.length === 0;
  }

  // For date-based bookings, you might want to implement capacity limits
  return true;
}

export function generateMockUnavailableDates(serviceId: number): Date[] {
  const today = new Date();
  const unavailable: Date[] = [];

  // Add some random unavailable dates for demo
  for (let i = 0; i < 30; i++) {
    const randomDay = Math.floor(Math.random() * 60) + 1;
    const date = new Date(today);
    date.setDate(today.getDate() + randomDay);

    // Make some days unavailable (e.g., Sundays and random dates)
    if (date.getDay() === 0 || Math.random() > 0.8) {
      unavailable.push(date);
    }
  }

  return unavailable;
}
