# Booking Calendar System Guide

## How It Works

The booking system automatically displays the appropriate calendar type based on the service category you're viewing.

## Calendar Types by Service

### 🏨 Hotels & Holiday Rentals
**Calendar Type:** Guests Calendar
- **Features:**
  - Check-in and check-out date selection
  - Guest counter (Adults, Children, Infants)
  - Visual date range selection
  - Max capacity enforcement
- **How to access:** Visit any hotel or holiday rental service booking page
- **Example URL:** `/booking/hotels/1`

### 🍽️ Restaurants
**Calendar Type:** Time Slot Calendar
- **Features:**
  - Date selection
  - Available time slots grid
  - Guest counter for table reservation
  - Disabled unavailable times
- **How to access:** Visit any restaurant booking page
- **Example URL:** `/booking/restaurants/1`

### 🏥 Health Centers & Beauty Centers
**Calendar Type:** Time Slot Calendar
- **Features:**
  - Appointment date picker
  - Available time slots (9:00 AM - 5:00 PM)
  - 30-minute interval slots
  - Shows booked vs available times
- **How to access:** Visit health-centers or beauty-centers booking page
- **Example URL:** `/booking/health-centers/1` or `/booking/beauty-centers/1`

### 🚗 Vehicle Rental
**Calendar Type:** Range Calendar
- **Features:**
  - Pickup date selection
  - Return date selection
  - Visual range highlighting
  - Hover preview for date ranges
- **How to access:** Visit vehicle rental booking page
- **Example URL:** `/booking/vehicle/1`

### 👨‍🏫 Classes & Programs
**Calendar Type:** Simple Calendar
- **Features:**
  - Single date selection
  - Clean, simple interface
  - Perfect for one-time events
- **How to access:** Visit lifestyle-creative or family-childcare booking pages
- **Example URLs:** `/booking/lifestyle-creative/1`, `/booking/family-childcare/1`

### 💼 Professional Services
**Calendar Type:** Time Slot Calendar
- **Services:** Tradespeople, Coaching, Mobile Beauty
- **Features:**
  - Appointment scheduling
  - Hourly time slots
  - Date and time selection
- **Example URLs:**
  - `/booking/tradespeople/1`
  - `/booking/coaching-personal-growth/1`
  - `/booking/mobile-beauty/1`

### 🎭 Tours & Events
**Calendar Type:** Simple Calendar
- **Services:** Local Tourism, Weddings
- **Features:**
  - Single date picker
  - Optional guest counter
- **Example URLs:** `/booking/local-tourism/1`, `/booking/weddings/1`

## Testing Different Calendars

To see different calendar types in action:

1. **Guest Calendar with Check-in/out:**
   - Go to: `/booking/hotels/1`
   - You'll see: Date range picker + guest counter

2. **Time Slot Booking:**
   - Go to: `/booking/beauty-centers/1`
   - You'll see: Date picker + time slot grid

3. **Range Selection:**
   - Go to: `/booking/vehicle/1`
   - You'll see: Start/end date picker with visual range

4. **Simple Date Picker:**
   - Go to: `/booking/family-childcare/1`
   - You'll see: Basic single date selection

## Technical Details

- Calendar types are configured in `/lib/service-config.ts`
- Calendar components are in `/components/calendars/`
- Each service category is mapped to the most appropriate calendar type
- The booking page automatically renders the correct calendar based on the category

## Visual Indicators

Each calendar shows a helpful label:
- **Guests Calendar:** "Select check-in/out dates and guests"
- **Time Slot:** "Choose date and time slot"
- **Range Calendar:** "Select start and end dates"
- **Simple Calendar:** "Pick a date"

## Summary Display

The booking summary automatically adjusts based on calendar type:
- **Hotels:** Shows check-in, check-out, and guest count
- **Time Slots:** Shows selected date and time
- **Range:** Shows start and end dates
- **Simple:** Shows selected date

---

**Note:** Make sure to clear your browser cache if you don't see the new calendars immediately. The system is fully functional and dynamically switches between calendar types based on the service category.
