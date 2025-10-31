# Service Management System Guide

## Overview

The Service Management system provides dynamic "Add New Service" dialogs that adapt based on the user's chosen service category during signup. Each service type has a customized form optimized for its specific needs.

## Service Types & Forms

### 1. Hotels - "Add New Room"
**Form Fields:**
- General Information (name, description, SEO meta tags)
- Room Type (Single, Double, Suite)
- Bed Configuration (Single beds, Double beds)
- Bathroom Type (Private, Shared)
- Capacity (Rooms, Bedrooms, Bathrooms, Guests, Adults, Children)
- Room Size (m²)
- ATV Number & Guest Registration
- Photos (3-6 required) & Video
- Pricing (Extra bed, Breakfast, Cleaning fee)
- Discounts (Early bird, Weekly)
- Availability Calendar
- Amenities (Swimming pool, Beach access, Spa, Gym, etc.)
- Add-ons
- House Rules
- Deposit Requirement
- Cancellation Terms & Fee
- Policy Terms
- Pet Terms
- Damages Terms

### 2. Holiday Rentals - "Add New Property"
**Form Fields:**
- General Information (property name, description, SEO)
- Property Type (House, Apartment, Villa)
- Bedroom Type (Double, Single)
- Bathroom Type (Private, Shared)
- Capacity (Bedrooms, Bathrooms, Beds, Guests)
- Property Size (m²)
- Photos & Video
- Pricing (Per night, Seasonal rates, Extra guest, Cleaning fee)
- Discounts (Early bird, Weekly)
- Availability Calendar
- Amenities (Pool, WiFi, Spa, Kitchen, etc.)
- Add-ons
- House Rules
- Deposit Requirement
- Cancellation Terms
- Pet Terms
- Damages Terms

### 3. Restaurants - "Add New Dish"
**Form Fields:**
- General Information (dish name, SEO)
- Dish Type (Starter, Main Course, Dessert, Drink)
- Ingredients (with tags)
- Photos & Video
- Price
- Discounts
- Availability Calendar
- Cancellation Terms & Fee
- Policy Terms

### 4. Vehicle Rental - "Add New Vehicle"
**Form Fields:**
- General Information (vehicle name, description, SEO)
- Vehicle Type & Model
- Year
- Photos & Video
- Pricing (Per hour, Per day, Per week)
- Time Slots Availability
- Availability Calendar
- Deposit Requirement
- Cancellation Terms
- Damages Terms

### 5. Beauty Centers & Mobile Beauty - "Add New Beauty Service"
**Form Fields:**
- General Information (service name, description, SEO)
- Service Duration (Hours, Minutes)
- Photos & Video
- Price
- Available Time Slots
- Availability Calendar
- Cancellation Policy

### 6. Health Centers - "Add New Health Service"
**Form Fields:**
- General Information (service name, description, SEO)
- Specialization
- Consultation Duration
- Photos
- Price (Consultation fee)
- Available Time Slots
- Availability Calendar
- Cancellation Policy

### 7. Coaching & Personal Growth - "Add New Coaching Session"
**Form Fields:**
- General Information (session name, description, SEO)
- Session Type (Individual, Group, Online)
- Session Duration
- Maximum Participants
- Photos
- Pricing (Per session, Package of 5, Package of 10)
- Availability Calendar
- Cancellation Policy

### 8. Other Service Types
For service types not explicitly designed (Family & Childcare, Lifestyle & Creative, Local Tourism, Tradespeople, Weddings), the system uses a generic beauty service form that can be adapted.

## Database Schema

### Tables

**`user_service_type`**
- Stores the service category chosen by user during signup
- Links user to their business type

**`service_items`**
- Stores all service offerings created by users
- Uses JSONB fields for flexible data storage:
  - `seo_meta` - SEO optimization data
  - `photos` - Array of photo URLs
  - `videos` - Array of video URLs
  - `pricing` - Pricing structure (varies by service type)
  - `specifications` - Service-specific details
  - `amenities` - Available features/amenities
  - `availability` - Availability settings
  - `cancellation_policy` - Cancellation terms
  - `add_ons` - Additional services/options

## How It Works

### 1. Opening the Dialog

```typescript
// In service-setup page
const [dialogOpen, setDialogOpen] = useState(false);
const [userServiceCategory] = useState("hotels"); // From user signup data

<Button onClick={() => setDialogOpen(true)}>
  Add New service
</Button>

<AddServiceDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  serviceCategory={userServiceCategory}
/>
```

### 2. Service Category Detection

The dialog automatically displays the correct form based on `serviceCategory`:

```typescript
// AddServiceDialog component
const SERVICE_TITLES: Record<string, string> = {
  'hotels': 'Add New Room',
  'holiday-rentals': 'Add New Property',
  'restaurants': 'Add New Dish',
  'vehicle': 'Add New Vehicle',
  // ... etc
};
```

### 3. Form Submission

Each form has an `onSuccess` callback that:
1. Saves data to Supabase `service_items` table
2. Closes the dialog
3. Refreshes the service list

## Customization

### Adding a New Service Type

1. **Create the form component:**
```typescript
// components/forms/add-your-service-form.tsx
export function AddYourServiceForm({ onSuccess }: Props) {
  // Form implementation
}
```

2. **Update the dialog:**
```typescript
// components/add-service-dialog.tsx
case 'your-service-category':
  return <AddYourServiceForm onSuccess={() => onOpenChange(false)} />;
```

3. **Add title mapping:**
```typescript
const SERVICE_TITLES: Record<string, string> = {
  'your-service-category': 'Add New [Your Service]',
};
```

### Modifying Existing Forms

Each form is independent and can be customized:
- Add/remove fields as needed
- Modify validation rules
- Customize pricing structures
- Update availability options

## Security

All operations are protected by Row Level Security (RLS):
- Users can only create/edit/delete their own services
- Service category must match user's registered type
- All mutations require authentication

## Best Practices

1. **Photos:** Always require 3-6 high-quality photos
2. **Videos:** Optional but recommended, under 5 minutes
3. **Pricing:** Clear breakdown of all fees
4. **Availability:** Use calendar for date selection
5. **Cancellation:** Always specify cancellation terms
6. **SEO:** Encourage users to add meta tags for better visibility

## Future Enhancements

- Image upload functionality with cloud storage
- Video upload and processing
- AI-powered description generation
- Automatic SEO optimization
- Multi-language support
- Batch import for multiple services
- Templates for common service types
- Analytics for each service

---

**Note:** The current implementation uses mock data for the service category. In production, fetch the user's service category from the `user_service_type` table based on their authenticated user ID.
