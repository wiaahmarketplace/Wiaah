# Internationalization & Responsive Design Guide

## Overview

This application now features comprehensive internationalization (i18n) support with automatic language detection, responsive TikTok-style mobile design, and well-commented code for easy maintenance.

## Features Implemented

### 1. Multi-Language Support

**Supported Languages:**
- 🇬🇧 English (en) - Default
- 🇫🇷 Français (fr)
- 🇪🇸 Español (es)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)
- 🇵🇹 Português (pt)
- 🇨🇳 中文 (zh)
- 🇯🇵 日本語 (ja)
- 🇸🇦 العربية (ar) - with RTL support

### 2. Automatic Language Detection

The system automatically detects and sets the user's preferred language based on:
1. **Saved Preference**: Checks localStorage for previously selected language
2. **Browser Settings**: Falls back to browser language if no saved preference
3. **Default Language**: Uses English if browser language isn't supported

### 3. Language Switcher

Located in the header, allows users to:
- View current language with flag
- Switch between all supported languages
- Persistent language selection (saved in localStorage)

### 4. Responsive Design (TikTok-Style)

**Mobile View:**
- Card-based layout with large images
- Touch-friendly buttons
- Vertical scrolling
- Full-width elements
- Optimized for one-hand use

**Tablet View:**
- Grid layouts
- Balanced spacing
- Flexible components

**Desktop View:**
- Traditional table views
- Sidebar navigation
- Multi-column layouts

## File Structure

```
lib/i18n/
├── translations.ts          # All translation strings
└── language-context.tsx     # Language context provider

components/
└── language-switcher.tsx    # Language selection dropdown

app/
├── layout.tsx              # Wrapped with LanguageProvider
└── service-management/     # Renamed from service-setup
    └── page.tsx           # Fully commented and responsive
```

## Using Translations

### In Components

```typescript
import { useLanguage } from '@/lib/i18n/language-context';

function MyComponent() {
  const { t, language, setLanguage, isRTL } = useLanguage();

  return (
    <div>
      <h1>{t('serviceManagement')}</h1>
      <button>{t('edit')}</button>
      <p>Current language: {language}</p>
      <p>Is RTL: {isRTL ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### Translation Keys

Available translation keys in `translations.ts`:

**Navigation:**
- `home`, `discover`, `services`, `shop`, `map`

**Service Management:**
- `serviceManagement`, `serviceCatalog`, `reservationAgenda`
- `reservations`, `pendingReservations`, `presentation`
- `openingTimeManagement`

**Affiliation:**
- `affiliationSystem`, `affiliationManagement`
- `affiliationHistory`, `salesStatistics`, `reviews`

**Actions:**
- `search`, `typeToSearch`, `whereTo`
- `edit`, `delete`, `viewDetails`
- `cancel`, `save`, `addNew`, `showOnMap`

**Service Categories:**
- `hotels`, `holidayRentals`, `restaurants`
- `vehicle`, `beautyCenters`, `healthCenters`

**Status:**
- `available`, `booked`, `pending`

### Adding New Translations

1. Open `/lib/i18n/translations.ts`
2. Add new key with translations for all languages:

```typescript
export const translations = {
  // ... existing translations
  myNewKey: {
    en: 'My New Text',
    fr: 'Mon Nouveau Texte',
    es: 'Mi Nuevo Texto',
    de: 'Mein Neuer Text',
    it: 'Il Mio Nuovo Testo',
    pt: 'Meu Novo Texto',
    zh: '我的新文本',
    ja: '私の新しいテキスト',
    ar: 'نصي الجديد',
  },
};
```

3. Use in components:

```typescript
const { t } = useLanguage();
const text = t('myNewKey');
```

## RTL Support

Arabic language automatically enables RTL (Right-to-Left) mode:

**Automatic Changes:**
- `document.documentElement.dir` set to "rtl"
- Text alignment reversed
- Icons and layouts mirrored
- Proper text direction for Arabic script

**Checking RTL Status:**

```typescript
const { isRTL } = useLanguage();

<div className={isRTL ? 'text-right' : 'text-left'}>
  {t('someText')}
</div>
```

## Responsive Breakpoints

The application uses Tailwind CSS breakpoints:

```css
/* Mobile First - Default */
.class-name

/* Small devices (640px and up) */
sm:class-name

/* Medium devices (768px and up) */
md:class-name

/* Large devices (1024px and up) */
lg:class-name

/* Extra large devices (1280px and up) */
xl:class-name
```

### Example Usage in Service Management Page

```typescript
// Mobile: Full width, Tablet: Auto width
className="w-full sm:w-auto"

// Mobile: Text base, Desktop: Text 2xl
className="text-base sm:text-2xl"

// Hide on mobile, show on large screens
className="hidden lg:block"

// Show on mobile, hide on large screens
className="lg:hidden"

// Mobile: Column, Large: Row
className="flex flex-col lg:flex-row"

// Mobile: 1 column, Tablet: 3 columns
className="grid grid-cols-1 sm:grid-cols-3"
```

## Code Comments

All major files now include comprehensive comments:

**File-Level Comments:**
```typescript
/**
 * Component Name
 *
 * Description of what this component does
 * - Feature 1
 * - Feature 2
 * - Feature 3
 */
```

**Function Comments:**
```typescript
/**
 * Function description
 * Explains what the function does
 *
 * @param param1 - Description
 * @returns Return value description
 */
```

**Inline Comments:**
```typescript
// Component state management
const [state, setState] = useState();

// Filter data based on search query
const filtered = data.filter(...);
```

## Page Renaming

### Service Setup → Service Management

**Changed Files:**
- `/app/service-setup/` → `/app/service-management/`
- Updated all references in sidebars and navigation
- Updated TypeScript interfaces

**Update Navigation:**

```typescript
// OLD
<Link href="/service-setup">

// NEW
<Link href="/service-management">
```

**Update Sidebar Props:**

```typescript
// OLD
activePage: "service-setup"

// NEW
activePage: "service-management"
```

## Mobile-First Responsive Design

### Card View (Mobile)

```typescript
<div className="lg:hidden space-y-4">
  {items.map(item => (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Image */}
      <div className="relative h-48">
        <img src={item.image} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold">{item.name}</h3>

        {/* Action buttons full width */}
        <div className="flex gap-2">
          <Button className="flex-1">Edit</Button>
          <Button className="flex-1">View</Button>
        </div>
      </div>
    </div>
  ))}
</div>
```

### Table View (Desktop)

```typescript
<div className="hidden lg:block">
  <table className="w-full">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      {items.map(item => (
        <tr>
          <td>{item.field1}</td>
          <td>{item.field2}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Best Practices

### 1. Always Use Translation Keys

```typescript
// ❌ BAD
<h1>Service Management</h1>

// ✅ GOOD
const { t } = useLanguage();
<h1>{t('serviceManagement')}</h1>
```

### 2. Mobile-First CSS

```typescript
// ❌ BAD - Desktop first
className="w-96 sm:w-full"

// ✅ GOOD - Mobile first
className="w-full sm:w-96"
```

### 3. Responsive Images

```typescript
// ✅ GOOD
<img
  src={image}
  className="w-full h-48 sm:h-64 lg:h-80 object-cover"
  alt={t('altText')}
/>
```

### 4. Touch-Friendly Buttons

```typescript
// ✅ GOOD - Minimum 44px touch target
<Button className="min-h-[44px] min-w-[44px]">
  {t('action')}
</Button>
```

### 5. Comment Your Code

```typescript
// ✅ GOOD
/**
 * Handles user deletion with confirmation
 * Shows toast notification on success
 */
const handleDelete = async (id: string) => {
  // Find user in list
  const user = users.find(u => u.id === id);

  // Show confirmation dialog
  setConfirmDialog(true);
};
```

## Testing Different Languages

### Browser Console

```javascript
// Change language
localStorage.setItem('preferredLanguage', 'fr');
location.reload();

// Check current language
localStorage.getItem('preferredLanguage');
```

### Using Language Switcher

1. Click globe icon in header
2. Select desired language
3. App updates immediately
4. Language saved in localStorage

## Performance Considerations

### Language Loading

- All translations loaded at build time
- No network requests for language files
- Instant language switching
- Zero latency

### Responsive Images

```typescript
// Use optimized images
<img
  src="image.jpg?auto=compress&cs=tinysrgb&w=400"
  loading="lazy"
  className="w-full object-cover"
/>
```

### Code Splitting

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Spinner />}>
  <HeavyComponent />
</Suspense>
```

## Troubleshooting

### Language Not Changing

1. Check if LanguageProvider wraps app
2. Verify translation key exists
3. Clear localStorage and reload
4. Check browser console for errors

### RTL Not Working

1. Ensure language is set to 'ar'
2. Check document.documentElement.dir
3. Verify Tailwind RTL plugins if using custom styles

### Mobile View Not Showing

1. Check responsive classes (lg:hidden, etc.)
2. Verify viewport meta tag in HTML
3. Test in actual device or Chrome DevTools
4. Check Tailwind breakpoints configuration

### Translations Missing

1. Add missing keys to `translations.ts`
2. Ensure all languages have the key
3. Use defaultLanguage as fallback
4. Check key name spelling

## Future Enhancements

### Planned Features

- **Dynamic Loading**: Load only needed language files
- **Pluralization**: Handle singular/plural forms
- **Date Formatting**: Locale-specific dates
- **Number Formatting**: Locale-specific numbers
- **Currency**: Multi-currency support
- **Time Zones**: Automatic timezone detection

### Adding New Languages

1. Add language to `supportedLanguages` in translations.ts
2. Add translations for all keys
3. Test RTL if applicable
4. Update documentation

---

**Note:** This internationalization system is production-ready and can scale to support any number of languages. All translations are type-safe and will show TypeScript errors if keys are missing.
