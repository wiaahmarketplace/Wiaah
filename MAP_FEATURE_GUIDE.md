# Map Feature Implementation Guide

## Overview

The Map page provides an interactive geographic view of all services (Hotels, Restaurants, Shops, etc.) with filtering, search, and hover interactions. Users can access this page by clicking the location pin icon in the header search bar.

## Access Points

### Primary Navigation
- **Header Search Bar**: Click the map pin icon (📍) on the right side of the search input
- **Direct URL**: Navigate to `/map`

## Features

### 1. Interactive Map View

**Split-Screen Layout:**
- **Left Panel (500px)**: Service listings with cards
- **Right Panel (Flexible)**: Google Maps embed showing service locations

**Map Integration:**
- Embedded Google Maps showing the service area
- Interactive map with zoom and pan controls
- Location markers for each service
- Hover tooltip showing service preview

### 2. Service Type Filters

**Location:** Top of the left panel (above search bar)

**Available Categories:**
- 🏨 Hotels
- 🏠 Holiday Rentals
- 🍴 Restaurants
- 🚗 Vehicle Rental
- ✂️ Beauty Centers
- ❤️ Health Centers
- 👥 Coaching & Personal Growth
- 🎨 Lifestyle & Creative
- ✈️ Local Tourism
- 🔧 Tradespeople
- 🎊 Weddings
- 🛍️ Shop

**Filter Behavior:**
- Located at the top for easy access
- Click to toggle category selection
- Multiple categories can be selected simultaneously
- Selected filters show with black background and white text
- Unselected filters show with white background and border
- Rounded pill-style buttons
- Wraps to multiple rows on smaller screens
- Clear visual feedback on selection
- No selection shows all services

**Visual Design:**
- Rounded-full buttons matching modern design
- Icon + Label format for clarity
- Consistent spacing with gap-2
- Hover states for better UX

### 3. Search Functionality

**Search Bar:**
- Located below the category filters
- Placeholder text: "where to?"
- Rounded-full design matching filters
- Real-time search filtering
- Searches through:
  - Service names
  - Location names
  - Both fields simultaneously

**Clear Button:**
- X icon appears when search has text
- Click to clear search instantly
- Positioned on the right side of search bar

### 4. Service Cards

**Card Layout:**
Each service displays:
- **Image**: High-quality service photo (48px height)
- **Price Badge**: Overlay on top-left of image
- **Service Name**: Bold title
- **Location**: City and country
- **Date Range**: Availability or operating hours
- **Rating**: Star icon with numerical rating
- **Review Count**: Number of reviews in parentheses
- **"Show on Map" Button**: Red link to highlight on map

**Card Interactions:**
- **Hover Effect**:
  - Card gets ring border and shadow
  - Corresponding location on map shows preview tooltip
- **Click**: Navigate to service details

### 5. Map Hover Tooltips

**Tooltip Display:**
When hovering over a service card:
- Small preview card appears at bottom-center of map
- Shows:
  - Service thumbnail image
  - Service name
  - Price
  - Star rating
- Smooth slide-in animation
- Auto-dismisses when hover ends

### 6. Map Controls

**Zoom Controls:**
- Standard Google Maps controls
- Location button in top-right corner
- Custom styled control button

**Custom Controls:**
- Dot pattern button (top-right)
- Styled with white background and shadow
- Provides additional map options

## Technical Implementation

### Component Structure

```typescript
// Main page component
app/map/page.tsx

// State Management
- searchQuery: string
- selectedCategories: string[]
- hoveredLocation: string | null
```

### Service Data Structure

```typescript
interface ServiceLocation {
  id: string;
  name: string;
  category: string;
  location: string;
  dateRange: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  lat: number;
  lng: number;
}
```

### Filtering Logic

```typescript
// Multi-criteria filtering
const filteredLocations = locations.filter(location => {
  // Search term match
  const matchesSearch = name or location includes searchQuery

  // Category filter match
  const matchesCategory = no filters OR category in selectedCategories

  return matchesSearch && matchesCategory;
});
```

### Map Integration

```typescript
// Google Maps Embed
<iframe
  src="google maps embed URL"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
/>
```

## Responsive Design

### Layout
- Fixed left panel width (500px)
- Flexible right panel (remaining space)
- Full viewport height minus header (calc(100vh - 64px))
- Scrollable left panel for many services

### Breakpoints
Currently optimized for desktop. For mobile:
- Stack panels vertically
- Full-width service list
- Expandable map view
- Touch-friendly controls

## User Flows

### Finding a Service by Category

1. User clicks map pin in header
2. Map page opens showing all services
3. User clicks "Hotels" filter button
4. List updates to show only hotels
5. User hovers over a hotel card
6. Map shows hotel location preview
7. User clicks "Show on Map" or card
8. Service details displayed

### Finding a Service by Search

1. User navigates to map page
2. User types "Beach" in search
3. List filters to beach-related services
4. User sees filtered results on map
5. User clicks desired service
6. Service details page opens

### Browsing Multiple Categories

1. User opens map page
2. User selects "Restaurants" filter
3. User adds "Hotels" filter
4. Map shows both restaurants and hotels
5. User hovers over cards to preview locations
6. User makes selection

## Database Integration

### Fetching Service Locations

```typescript
// Query all services with location data
const { data: services, error } = await supabase
  .from('service_items')
  .select(`
    id,
    name,
    service_category,
    specifications,
    pricing,
    photos,
    status
  `)
  .eq('status', 'active');

// Transform to map format
const locations = services.map(service => ({
  id: service.id,
  name: service.name,
  category: service.service_category,
  location: service.specifications.location,
  lat: service.specifications.latitude,
  lng: service.specifications.longitude,
  price: formatPrice(service.pricing),
  rating: calculateRating(service),
  reviews: service.specifications.review_count,
  image: service.photos[0],
}));
```

### Adding Location Data to Services

When creating services, include location fields:

```typescript
specifications: {
  location: "City, Country",
  latitude: 44.4268,
  longitude: 8.9160,
  address: "123 Main St",
  postal_code: "12345"
}
```

## Performance Optimizations

### Image Optimization
- Use compressed images (Pexels auto-compress)
- Lazy load images in list
- Preload images for hovered items

### Map Performance
- Lazy load map iframe
- Cache map tiles
- Debounce search input
- Limit visible markers based on zoom

### List Rendering
- Virtual scrolling for long lists
- Pagination option
- Lazy load images below fold

## Future Enhancements

### Map Features
- **Clustering**: Group nearby markers
- **Custom Markers**: Category-specific icons
- **Info Windows**: Click markers for details
- **Drawing Tools**: Draw search area
- **Directions**: Route to service
- **Street View**: Preview location

### Filtering
- **Price Range**: Slider filter
- **Rating Filter**: Minimum rating
- **Availability**: Date picker
- **Distance**: Radius from location
- **Amenities**: Filter by features

### UI Improvements
- **Save Searches**: Bookmark filters
- **Compare**: Side-by-side comparison
- **Share**: Share map view with filters
- **Print**: Print map with listings
- **Mobile App**: Native map integration

### Data Enhancements
- **Real-time Updates**: Live availability
- **Popular Times**: Busy periods
- **User Location**: Distance calculations
- **Nearby Services**: Recommendations

## Accessibility

### Keyboard Navigation
- Tab through filters
- Arrow keys in list
- Enter to select
- Escape to close

### Screen Readers
- ARIA labels on buttons
- Alt text for images
- Descriptive link text
- Status announcements

### Visual Accessibility
- High contrast mode support
- Focus indicators
- Readable font sizes
- Color-blind friendly badges

## Testing Checklist

- [ ] Map loads correctly
- [ ] All filters work
- [ ] Search filters results
- [ ] Hover shows tooltips
- [ ] Cards display properly
- [ ] "Show on Map" works
- [ ] Mobile responsive
- [ ] Images load
- [ ] No console errors
- [ ] Performance acceptable

## Troubleshooting

### Map Not Loading
- Check Google Maps API key
- Verify embed URL format
- Check CORS settings
- Ensure iframe allowed

### Filters Not Working
- Verify category IDs match
- Check state updates
- Ensure filtering logic correct

### Search Not Filtering
- Check search query state
- Verify toLowerCase() usage
- Ensure includes() logic

### Hover Not Working
- Verify event handlers
- Check z-index stacking
- Ensure pointer events enabled

---

**Note:** Current implementation uses mock data and Google Maps embed. For production, integrate with real Supabase data and consider using Google Maps JavaScript API for advanced features.
