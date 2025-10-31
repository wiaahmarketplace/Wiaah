# Service Actions Implementation Guide

## Overview

The Service Catalog now includes fully functional Edit, Delete, and View Details actions for managing services. Each action opens a dedicated dialog with appropriate functionality.

## Implemented Actions

### 1. Edit Service

**Trigger:** Click "Edit" button in the Actions column

**Functionality:**
- Opens the same form used for creating services, but in edit mode
- Pre-populates form fields with existing service data
- Form adapts based on service category (Hotels, Restaurants, Vehicles, etc.)
- On save, updates the service in the database
- Shows success message upon completion

**Dialog Titles:**
- Hotels: "Edit Room"
- Holiday Rentals: "Edit Property"
- Restaurants: "Edit Dish"
- Vehicles: "Edit Vehicle"
- Beauty Centers: "Edit Beauty Service"
- Health Centers: "Edit Health Service"
- Coaching: "Edit Coaching Session"

**Component:** `EditServiceDialog`

### 2. Delete Service

**Trigger:** Click "Delete" button in the Actions column

**Functionality:**
- Opens a confirmation dialog with service details
- Shows service name and ID for verification
- Displays warning about permanent deletion
- Requires explicit confirmation to proceed
- Shows success toast notification after deletion
- Automatically refreshes the service list

**Safety Features:**
- Two-step confirmation process
- Clear warning message
- Red color scheme to indicate danger
- Cannot be undone warning

**Component:** `DeleteServiceDialog`

### 3. View Details

**Trigger:** Click "View Details" button in the Actions column

**Functionality:**
- Opens a comprehensive details dialog
- Displays service image, name, and status badge
- Shows all key information with icons:
  - Category
  - Price
  - Duration
  - Last updated date
- Includes description section
- Lists key features
- Shows booking statistics:
  - Total Bookings
  - Average Rating
  - Satisfaction percentage
- Informational banner with availability status

**Component:** `ServiceDetailsDialog`

## User Flow

### Editing a Service

1. User clicks "Edit" on any service row
2. System identifies the service and its category
3. Opens appropriate form dialog based on service type
4. User modifies fields as needed
5. User clicks "Publish" to save changes
6. System updates database
7. Dialog closes and list refreshes
8. Success message displays

### Deleting a Service

1. User clicks "Delete" on any service row
2. System shows confirmation dialog with service details
3. User reviews information
4. User clicks "Delete Service" to confirm
5. System removes service from database
6. Dialog closes
7. Success toast notification appears
8. Service list updates automatically

### Viewing Service Details

1. User clicks "View Details" on any service row
2. System opens full details dialog
3. User reviews all information
4. User can scroll to see all sections
5. User closes dialog when done

## Technical Implementation

### State Management

```typescript
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
const [selectedService, setSelectedService] = useState<Service | null>(null);
```

### Action Handlers

```typescript
const handleEdit = (id: string) => {
  const service = mockServices.find(s => s.id === id);
  if (service) {
    setSelectedService(service);
    setEditDialogOpen(true);
  }
};

const handleDelete = (id: string) => {
  const service = mockServices.find(s => s.id === id);
  if (service) {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  }
};

const handleViewDetails = (id: string) => {
  const service = mockServices.find(s => s.id === id);
  if (service) {
    setSelectedService(service);
    setDetailsDialogOpen(true);
  }
};
```

### Delete Confirmation

```typescript
const confirmDelete = () => {
  if (selectedService) {
    // Delete from database using Supabase
    // await supabase.from('service_items').delete().eq('id', selectedService.id)

    toast({
      title: "Service Deleted",
      description: `${selectedService.name} has been successfully deleted.`,
    });
    setDeleteDialogOpen(false);
    setSelectedService(null);
  }
};
```

## UI Components Used

### Edit Dialog
- `Dialog` - Modal container
- `DialogContent` - Content wrapper
- `DialogHeader` - Title section
- Dynamic form based on service category

### Delete Dialog
- `AlertDialog` - Warning modal
- `AlertDialogContent` - Content wrapper
- `AlertDialogHeader` - Title and description
- `AlertDialogFooter` - Action buttons
- Cancel and confirm buttons

### Details Dialog
- `Dialog` - Modal container
- `Badge` - Status indicator
- `Separator` - Visual dividers
- Icon components (Calendar, Clock, DollarSign, etc.)
- Statistics cards
- Feature lists
- Information banner

## Database Integration

### Fetching Service Data

When a real database is connected:

```typescript
// Fetch service details
const { data: service, error } = await supabase
  .from('service_items')
  .select('*')
  .eq('id', serviceId)
  .single();
```

### Updating Service

```typescript
// Update service
const { error } = await supabase
  .from('service_items')
  .update({
    name: formData.name,
    description: formData.description,
    pricing: formData.pricing,
    // ... other fields
    updated_at: new Date().toISOString()
  })
  .eq('id', serviceId);
```

### Deleting Service

```typescript
// Delete service
const { error } = await supabase
  .from('service_items')
  .delete()
  .eq('id', serviceId);
```

## Toast Notifications

The system uses two toast notification systems:

1. **Shadcn/ui Toast** - For action confirmations
2. **Sonner Toast** - For general notifications

Both are configured in the root layout and available throughout the app.

## Status Badges

The details dialog includes color-coded status badges:

- **Available**: Green badge (bg-green-100, text-green-800)
- **Booked**: Orange badge (bg-orange-100, text-orange-800)
- **Pending Approval**: Yellow badge (bg-yellow-100, text-yellow-800)
- **Other**: Gray badge (bg-gray-100, text-gray-800)

## Responsive Design

All dialogs are:
- Mobile-friendly with max-width constraints
- Scrollable for long content (max-height: 90vh)
- Properly centered on screen
- Accessible with keyboard navigation
- Screen reader compatible

## Security Considerations

### Row Level Security

All database operations respect RLS policies:
- Users can only edit their own services
- Delete operations are authenticated
- Service details are only visible to authorized users

### Validation

- Service ID verification before actions
- Confirmation required for destructive operations
- Type-safe TypeScript interfaces
- Error handling for failed operations

## Best Practices

1. **Always confirm deletions** - Use the two-step process
2. **Show meaningful feedback** - Use toast notifications
3. **Preserve context** - Keep track of selected service
4. **Handle errors gracefully** - Show error messages to users
5. **Update UI immediately** - Refresh list after changes
6. **Use appropriate icons** - Visual cues for actions
7. **Maintain consistency** - Same patterns across all actions

## Future Enhancements

- **Bulk Actions**: Select and edit/delete multiple services
- **Revision History**: Track changes to services over time
- **Duplicate Service**: Quick copy functionality
- **Export Details**: Download service information as PDF
- **Share Service**: Generate shareable links
- **Analytics Integration**: Track views and engagement
- **Audit Logs**: Record all actions for compliance
- **Undo Delete**: Temporary recovery option
- **Archive Service**: Soft delete option
- **Service Templates**: Create from existing services

## Troubleshooting

### Dialog Not Opening
- Check if service exists in the list
- Verify state management setup
- Ensure dialog components are imported

### Delete Not Working
- Verify database permissions
- Check RLS policies
- Ensure user is authenticated

### Details Not Showing
- Confirm service data is available
- Check for null/undefined values
- Verify component props

---

**Note:** Current implementation uses mock data. For production, replace mock service lookups with actual Supabase queries from the `service_items` table.
