# Booking Availability System

## Overview

The calendar system now displays unavailable dates and time slots with clear visual indicators to help users understand when bookings cannot be made.

## Visual Indicators

### Calendar Dates

**Available Dates:**
- Normal appearance with white/light background
- Hover effect shows they're clickable
- Can be selected

**Unavailable Dates:**
- Grayed out background (light gray)
- Text has line-through styling
- Small red dot at bottom center
- Tooltip shows "Not available"
- Cannot be clicked

**Selected Dates:**
- Emerald green background
- White text
- Clear visual distinction

### Time Slots (for appointment-based services)

**Available Time Slots:**
- White background with gray border
- Hover shows emerald border
- Clickable

**Unavailable Time Slots:**
- Red/pink background (bg-red-50)
- Red text and border
- Line-through text
- Small "✕" icon in top-right corner
- Tooltip: "This time slot is not available"
- Cannot be clicked

## Current Demo Setup

The system demonstrates unavailability with:

1. **Sundays are automatically blocked** - Shows closed/unavailable days
2. **Random dates (15% chance)** - Simulates fully booked dates
3. **Time slots** - Some slots marked as booked (shown in TimeSlotCalendar)

## Database Schema

### Tables Created

**`bookings`**
- Stores all confirmed bookings
- Tracks service_id, dates, time slots, guests
- Status: pending, confirmed, cancelled, completed

**`service_unavailable_dates`**
- Stores dates when service is not available
- Can specify full day or specific time slots
- Includes reason for unavailability
- Public read access for availability checking

### Security

- Row Level Security (RLS) enabled on both tables
- Users can only see their own bookings
- Everyone can view unavailable dates
- Service owners can manage their unavailable dates

## How It Works

### On Page Load

1. System generates mock unavailable dates (Sundays + random dates)
2. Passes dates to calendar components via `disabledDates` prop
3. Calendars render unavailable dates with special styling

### For Production Use

Replace mock data with real database queries:

```typescript
import { getUnavailableDates } from '@/lib/booking-utils';

// Fetch real unavailable dates
const unavailableDates = await getUnavailableDates(serviceId, category);
```

## API Functions Available

**`getUnavailableDates(serviceId, category)`**
- Fetches all unavailable dates for a service
- Returns array of Date objects

**`getBookingsForDateRange(serviceId, category, startDate, endDate)`**
- Gets confirmed bookings in date range
- Useful for checking capacity

**`isDateAvailable(serviceId, category, date, timeSlot?)`**
- Checks if specific date/time is available
- Returns boolean
- Considers both unavailable dates and confirmed bookings

**`generateMockUnavailableDates(serviceId)`**
- Demo function for testing
- Creates realistic unavailable dates pattern

## Calendar Legend

Each calendar shows a legend explaining:
- **Green box** = Selected date(s)
- **Gray crossed-out** = Not available
- **Light green** = In selected range (for range/guests calendars)
- Note: "Sundays and some dates are fully booked"

## Testing Different Scenarios

### Simple Calendar (Classes, Tours)
- View: `/booking/family-childcare/1`
- Shows: Single date selection with unavailable dates crossed out

### Time Slot Calendar (Beauty, Health, Restaurants)
- View: `/booking/beauty-centers/1`
- Shows: Date picker + time slot grid with booked slots in red

### Range Calendar (Vehicle Rentals)
- View: `/booking/vehicle/1`
- Shows: Start/end date selection with unavailable dates blocked

### Guests Calendar (Hotels, Rentals)
- View: `/booking/hotels/1`
- Shows: Check-in/out dates + guest counter, unavailable dates grayed out

## Customization

### Change Unavailable Days Pattern

Edit in `/app/booking/[category]/[id]/page.tsx`:

```typescript
const generateUnavailableDates = () => {
  // Modify logic to match your business rules
  // e.g., block Mondays, holidays, maintenance days
};
```

### Add Capacity Management

Use the bookings table to track capacity:
- Count bookings per date
- Compare against max capacity
- Mark as unavailable when full

### Service-Specific Rules

Different services can have different availability rules:
- Hotels: Check room availability
- Restaurants: Table capacity
- Doctors: Appointment slots per day
- Vehicles: Single booking per date range

## Future Enhancements

- Real-time availability updates
- Capacity indicators (e.g., "Only 2 spots left")
- Partially available days (morning/afternoon)
- Recurring unavailable patterns (weekly/monthly)
- Holiday calendar integration
- Block booking for multiple dates

---

**Note:** The system currently uses mock data for demonstration. Connect to the Supabase database to use real booking data and manage availability through an admin interface.
