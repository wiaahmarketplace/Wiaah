export type CalendarType = 'simple' | 'range' | 'double' | 'time-slot' | 'guests';

export const serviceConfig: Record<string, {
  tabName: string;
  contentType: string;
  calendarType: CalendarType;
  needsGuests?: boolean;
  needsTime?: boolean;
}> = {
  "hotels": {
    tabName: "Rooms",
    contentType: "rooms",
    calendarType: "guests",
    needsGuests: true
  },
  "holiday-rentals": {
    tabName: "Properties",
    contentType: "properties",
    calendarType: "guests",
    needsGuests: true
  },
  "restaurants": {
    tabName: "Menus",
    contentType: "menus",
    calendarType: "time-slot",
    needsGuests: true,
    needsTime: true
  },
  "health-centers": {
    tabName: "Doctors",
    contentType: "doctors",
    calendarType: "time-slot",
    needsTime: true
  },
  "beauty-centers": {
    tabName: "Treatments",
    contentType: "treatments",
    calendarType: "time-slot",
    needsTime: true
  },
  "vehicle": {
    tabName: "Vehicles",
    contentType: "vehicles",
    calendarType: "range"
  },
  "tradespeople": {
    tabName: "Services",
    contentType: "trade-services",
    calendarType: "time-slot",
    needsTime: true
  },
  "family-childcare": {
    tabName: "Programs",
    contentType: "programs",
    calendarType: "simple"
  },
  "lifestyle-creative": {
    tabName: "Classes",
    contentType: "classes",
    calendarType: "simple"
  },
  "coaching-personal-growth": {
    tabName: "Sessions",
    contentType: "sessions",
    calendarType: "time-slot",
    needsTime: true
  },
  "local-tourism": {
    tabName: "Tours",
    contentType: "tours",
    calendarType: "simple",
    needsGuests: true
  },
  "weddings": {
    tabName: "Packages",
    contentType: "packages",
    calendarType: "simple",
    needsGuests: true
  },
  "legal-admin-consulting": {
    tabName: "Services",
    contentType: "consulting-services",
    calendarType: "time-slot",
    needsTime: true
  },
  "mobile-beauty": {
    tabName: "Treatments",
    contentType: "mobile-treatments",
    calendarType: "time-slot",
    needsTime: true
  }
};

export function getServiceConfig(category: string) {
  return serviceConfig[category] || {
    tabName: "Options",
    contentType: "generic",
    calendarType: "simple" as CalendarType
  };
}
