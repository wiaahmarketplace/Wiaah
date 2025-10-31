# Custom Calendar Components

This directory contains specialized calendar components for different service booking types.

## Calendar Types

### 1. SimpleCalendar
**Use Case:** Single date selection
- Best for: Classes, programs, tours, weddings
- Features: Single date picker with disabled dates support
- Services using it: family-childcare, lifestyle-creative, local-tourism, weddings

### 2. RangeCalendar
**Use Case:** Date range selection with visual range highlight
- Best for: Vehicle rentals, equipment bookings
- Features: Start/end date selection, hover preview, range visualization
- Services using it: vehicle

### 3. DoubleCalendar
**Use Case:** Date range selection with two-month view
- Best for: Long-term bookings, better date comparison
- Features: Two months displayed side by side, range selection
- Services using it: Can be configured for any service

### 4. TimeSlotCalendar
**Use Case:** Date selection with specific time slots
- Best for: Appointments, services requiring specific times
- Features: Date picker + available time slots grid
- Services using it: restaurants, health-centers, beauty-centers, tradespeople, coaching-personal-growth, mobile-beauty

### 5. GuestsCalendar
**Use Case:** Date range with guest count selection
- Best for: Hotels, rentals, accommodations
- Features: Date range + guest counter (adults, children, infants)
- Services using it: hotels, holiday-rentals

## Service-to-Calendar Mapping

| Service Category | Calendar Type | Needs Guests | Needs Time |
|-----------------|---------------|--------------|------------|
| Hotels | guests | ✓ | - |
| Holiday Rentals | guests | ✓ | - |
| Restaurants | time-slot | ✓ | ✓ |
| Health Centers | time-slot | - | ✓ |
| Beauty Centers | time-slot | - | ✓ |
| Vehicle Rental | range | - | - |
| Tradespeople | time-slot | - | ✓ |
| Family/Childcare | simple | - | - |
| Lifestyle/Creative | simple | - | - |
| Coaching | time-slot | - | ✓ |
| Local Tourism | simple | ✓ | - |
| Weddings | simple | ✓ | - |
| Mobile Beauty | time-slot | - | ✓ |

## Usage Example

```tsx
import { SimpleCalendar } from '@/components/calendars/simple-calendar';

function MyBooking() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <SimpleCalendar
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
      minDate={new Date()}
    />
  );
}
```

## Common Props

All calendars support:
- `minDate?: Date` - Minimum selectable date (default: today)
- `disabledDates?: Date[]` - Array of disabled dates
- `className?: string` - Additional CSS classes

## Customization

Each calendar can be customized by:
1. Modifying the calendar configuration in `/lib/service-config.ts`
2. Adjusting time slots in the TimeSlotCalendar component
3. Setting max guests in the GuestsCalendar component
