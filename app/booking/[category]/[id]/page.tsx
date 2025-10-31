"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Star, MapPin, Calendar, Clock, Users, Mail, Phone, Bed, Bath, PawPrint, Check, ChevronLeft, ChevronRight, Coffee, Wifi, Car, Home, DollarSign, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { servicesData } from "@/lib/services-data";
import { getServiceConfig } from "@/lib/service-config";
import { ServiceContent } from "@/components/service-content";
import { toast } from "sonner";
import { SimpleCalendar } from "@/components/calendars/simple-calendar";
import { RangeCalendar } from "@/components/calendars/range-calendar";
import { DoubleCalendar } from "@/components/calendars/double-calendar";
import { TimeSlotCalendar } from "@/components/calendars/time-slot-calendar";
import { GuestsCalendar } from "@/components/calendars/guests-calendar";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/loading-spinner";
import { differenceInDays } from "date-fns";
import { Header } from "@/components/header";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const id = params.id as string;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedCancellation, setSelectedCancellation] = useState("free-nov");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const config = getServiceConfig(category);

  useEffect(() => {
    loadService();
  }, [id, category]);

  const loadService = async () => {
    try {
      setLoading(true);

      const categoryServices = servicesData[category];
      if (!categoryServices) {
        toast.error('Category not found');
        router.push('/services');
        return;
      }

      const foundService = categoryServices.find(s => s.id.toString() === id);

      if (foundService) {
        setService(foundService);
      } else {
        toast.error('Service not found');
        router.push('/services');
      }
    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock unavailable dates
  const generateUnavailableDates = () => {
    const today = new Date();
    const unavailable: Date[] = [];

    for (let i = 1; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Make Sundays unavailable
      if (date.getDay() === 0) {
        unavailable.push(date);
      }

      // Make some random dates unavailable (fully booked)
      if (Math.random() > 0.85) {
        unavailable.push(date);
      }
    }

    return unavailable;
  };

  const unavailableDates = generateUnavailableDates();

  const calculateTotalPrice = () => {
    const basePrice = service?.price || 150;
    let nights = 1;

    if (startDate && endDate) {
      nights = differenceInDays(endDate, startDate);
    }

    const extrasPrice = selectedExtras.reduce((sum, extra) => {
      if (extra.includes('$20')) return sum + 20;
      if (extra.includes('$10')) return sum + 10;
      return sum;
    }, 0);

    return (basePrice * nights) + extrasPrice;
  };

  const handleBookNowClick = () => {
    if (!startDate || !endDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (guests.adults === 0) {
      toast.error('Please select at least one adult guest');
      return;
    }

    const checkoutData = {
      serviceId: service.id,
      serviceName: service.name,
      roomType: selectedRoom || 'Standard Room',
      checkIn: startDate.toISOString(),
      checkOut: endDate.toISOString(),
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants,
      price: service?.price || 150,
      totalPrice: calculateTotalPrice(),
    };

    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link href="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const servicePhotos = service.images && service.images.length > 0
    ? service.images
    : [service.image || 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'];

  // Mock rooms data
  const rooms = [
    {
      id: "standard",
      name: "Standard Room",
      image: servicePhotos[0],
      size: "20m² / 15ft²",
      price: service.hourlyRate || 90,
      originalPrice: 1100,
      amenities: ["Free Wi-Fi included", "Parking included"],
      features: [
        { icon: Coffee, label: "Breakfast" },
        { icon: Wifi, label: "Laundry" },
        { icon: Home, label: "Balcony" },
      ],
    },
    {
      id: "deluxe",
      name: "Deluxe Room",
      image: servicePhotos[0],
      size: "30m² / 23ft²",
      price: (service.hourlyRate || 90) + 100,
      originalPrice: 250,
    },
  ];

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "John Doberman",
      date: "Oct 28, 2025",
      rating: 3,
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bookedService: service.name,
      avatar: servicePhotos[0],
    },
    {
      id: 2,
      name: "John Doberman",
      date: "Oct 28, 2025",
      rating: 1,
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bookedService: service.name,
      avatar: servicePhotos[0],
    },
    {
      id: 3,
      name: "John Doberman",
      date: "Oct 28, 2025",
      rating: 4,
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bookedService: "Deluxe Spa Package...",
      avatar: service.image,
    },
    {
      id: 4,
      name: "John Doberman",
      date: "Oct 28, 2025",
      rating: 4,
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bookedService: "Deluxe Spa Package...",
      avatar: service.image,
    },
    {
      id: 5,
      name: "John Doberman",
      date: "Oct 28, 2025",
      rating: 2,
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      bookedService: "Deluxe Spa Package...",
      avatar: service.image,
    },
  ];

  const workingHours = [
    { day: "Friday", hours: "9:00 - 17:00", isToday: false, isClosed: false },
    { day: "Monday", hours: "9:00 - 17:00", isToday: false, isClosed: false },
    { day: "Saturday", hours: "10:00 - 14:00", isToday: false, isClosed: false },
    { day: "Sunday", hours: "10:00 - 14:00", isToday: false, isClosed: false },
    { day: "Thursday", hours: "9:00 - 17:00", isToday: false, isClosed: false },
    { day: "Tuesday", hours: "9:00 - 17:00", isToday: true, isClosed: false },
    { day: "Wednesday", hours: "9:00 - 17:00", isToday: false, isClosed: false },
  ];

  // Mock gallery images
  const galleryImages = [
    service.image,
    service.image,
    service.image,
    service.image,
  ];

  const renderCalendar = () => {
    switch (config.calendarType) {
      case 'simple':
        return (
          <SimpleCalendar
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setBookingDate(date.toLocaleDateString());
            }}
            disabledDates={unavailableDates}
          />
        );

      case 'range':
        return (
          <RangeCalendar
            startDate={startDate}
            endDate={endDate}
            onSelectRange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            disabledDates={unavailableDates}
          />
        );

      case 'double':
        return (
          <DoubleCalendar
            startDate={startDate}
            endDate={endDate}
            onSelectRange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            disabledDates={unavailableDates}
          />
        );

      case 'time-slot':
        return (
          <TimeSlotCalendar
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDateTime={(date, time) => {
              setSelectedDate(date);
              setSelectedTime(time);
              setBookingDate(date.toLocaleDateString());
              setBookingTime(time);
            }}
          />
        );

      case 'guests':
        return (
          <GuestsCalendar
            startDate={startDate}
            endDate={endDate}
            guests={guests}
            onSelectRange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onGuestsChange={setGuests}
          />
        );

      default:
        return (
          <SimpleCalendar
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setBookingDate(date.toLocaleDateString());
            }}
            disabledDates={unavailableDates}
          />
        );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingDate || !bookingTime) {
      toast.error("Please select date and time");
      return;
    }

    toast.success("Booking request submitted successfully!");
    setTimeout(() => {
      router.push("/reservations");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href={`/services/${category}`}>
          <Button variant="ghost" className="mb-6 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {category.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
          </Button>
        </Link>

        {/* Image Gallery */}
        <div className="mb-6 flex gap-3">
          {/* Thumbnail Gallery */}
          <div className="flex flex-col gap-3 w-48">
            {galleryImages.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedImageIndex === idx ? "border-emerald-500" : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`${service.name} ${idx + 1}`}
                  className="w-full h-24 object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative rounded-2xl overflow-hidden">
            <img
              src={galleryImages[selectedImageIndex]}
              alt={service.name}
              className="w-full h-full object-cover rounded-2xl"
              style={{ maxHeight: "420px" }}
            />
            <button
              onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        {service.username && service.userAvatar && (
          <button
            onClick={() => router.push(`/profile/${service.username}`)}
            className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={service.userAvatar} />
              <AvatarFallback>{service.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-base font-semibold text-gray-900">@{service.username}</span>
          </button>
        )}

        {/* Service Title */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.floor(service.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-base font-bold text-gray-900">{service.rating}/5</span>
            <span className="text-emerald-500 text-sm font-semibold">({service.reviews} Reviews)</span>
          </div>
        </div>

        {/* Tabs and Reservation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 px-3 py-2 text-sm"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 px-3 py-2 text-sm"
                >
                  Contact
                </TabsTrigger>
                <TabsTrigger
                  value="policies"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 px-3 py-2 text-sm"
                >
                  Policies
                </TabsTrigger>
                <TabsTrigger
                  value="hours"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 px-3 py-2 text-sm"
                >
                  Working hours
                </TabsTrigger>
                <TabsTrigger
                  value="rooms"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 px-3 py-2 text-sm"
                >
                  {config.tabName}
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 px-3 py-2 text-sm"
                >
                  Localization
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-500 px-3 py-2 text-sm"
                >
                  Customer reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <p className="text-gray-700 text-sm">
                  {service.description || service.specialty || "A great service in a prime location"}
                </p>
              </TabsContent>

              <TabsContent value="contact" className="mt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Phone</p>
                    <p className="text-gray-900 font-semibold">+123456789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">E-mail</p>
                    <p className="text-gray-900 font-semibold">email</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Address</p>
                    <p className="text-gray-900 font-semibold">123 Main St 12345, Anytown, USA</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="policies" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Check-in Checout Terms</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-semibold">Check-in and Check-out</p>
                    <p>Check-in time is after 3:00 PM</p>
                    <p>Check-out time is before 12:00 PM</p>
                    <p className="text-sm">Early check-in or late check-out may be available upon request and subject to availability</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cancellation</h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p>Cancellation policy varies depending on the rate plan booked</p>
                    <p>Some rate plans may be non-refundable</p>
                    <p>Cancellation requests must be made by 6:00 PM local time on the day prior to arrival to avoid cancellation fees</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pets</h3>
                  <p className="text-gray-700 text-sm">Pets are not allowed in the hotel</p>
                </div>
              </TabsContent>

              <TabsContent value="hours" className="mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Working Hours</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {workingHours.map((schedule, idx) => (
                    <div
                      key={idx}
                      className={`text-center ${
                        schedule.isToday ? "border-2 border-emerald-500 rounded-lg p-4" : "p-4"
                      }`}
                    >
                      <p className={`font-semibold mb-3 ${schedule.isToday ? "text-gray-900" : "text-gray-600"}`}>
                        {schedule.day}
                      </p>
                      {schedule.isToday && (
                        <p className="text-xs text-emerald-500 font-semibold mb-2">Today</p>
                      )}
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={schedule.isClosed ? "#d1d5db" : "#10b981"}
                            strokeWidth="8"
                          />
                          <circle cx="50" cy="50" r="3" fill={schedule.isClosed ? "#d1d5db" : "#10b981"} />
                          {!schedule.isClosed && (
                            <>
                              <line
                                x1="50"
                                y1="50"
                                x2="50"
                                y2="25"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <line
                                x1="50"
                                y1="50"
                                x2="65"
                                y2="50"
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </>
                          )}
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-emerald-600">{schedule.hours}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="mt-6">
                <ServiceContent category={category} service={service} />
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: "500px" }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555023719!2d-122.50764017785287!3d37.75781499192874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1635174736432!5m2!1sen!2s\"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                    <span className="text-lg font-bold text-emerald-500">5.0</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-gray-700 text-sm mb-4">{review.comment}</p>

                      <div className="border-t pt-4">
                        <p className="text-xs text-gray-500 mb-2">Booked service:</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg\"></div>
                          <p className="text-sm text-gray-600">{review.bookedService}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Reservation Card */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-8">
              <h3 className="text-lg font-bold text-center text-gray-900 mb-4">Start your reservation</h3>

              {/* Calendar Type Indicator */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {config.calendarType === 'guests' && (
                    <>
                      <Calendar className="w-3 h-3" />
                      <span>Select check-in/out dates and guests</span>
                    </>
                  )}
                  {config.calendarType === 'time-slot' && (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>Choose date and time slot</span>
                    </>
                  )}
                  {config.calendarType === 'range' && (
                    <>
                      <Calendar className="w-3 h-3" />
                      <span>Select start and end dates</span>
                    </>
                  )}
                  {config.calendarType === 'simple' && (
                    <>
                      <Calendar className="w-3 h-3" />
                      <span>Pick a date</span>
                    </>
                  )}
                </div>
              </div>

              {/* Date and Time Toggle */}
              {(config.calendarType === 'time-slot' || config.needsTime) && (
                <div className="flex items-center gap-2 mb-4">
                  <button className="flex-1 bg-emerald-500 text-white rounded-r-full py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </button>
                  <button className="p-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              )}

              {/* Calendar */}
              {renderCalendar()}

              {/* Calendar Legend */}
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded bg-emerald-500"></div>
                    <span className="text-gray-600">Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 line-through text-xs">15</span>
                    </div>
                    <span className="text-gray-600">Not available</span>
                  </div>
                  {config.calendarType === 'range' || config.calendarType === 'guests' ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded bg-emerald-100"></div>
                      <span className="text-gray-600">In range</span>
                    </div>
                  ) : null}
                </div>
                <p className="text-xs text-gray-500 italic">
                  * Sundays and some dates are fully booked
                </p>
              </div>

              {/* Summary Info */}
              <div className="space-y-2 mb-4 text-xs mt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold text-gray-900 text-right">{service.name}</span>
                </div>
                {config.calendarType === 'guests' && (startDate || endDate) && (
                  <>
                    {startDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in</span>
                        <span className="font-semibold text-gray-900">{startDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    {endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out</span>
                        <span className="font-semibold text-gray-900">{endDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-semibold text-gray-900">{guests.adults + guests.children + guests.infants} guests</span>
                    </div>
                  </>
                )}
                {config.calendarType === 'time-slot' && selectedDate && selectedTime && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-semibold text-gray-900">{selectedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-semibold text-gray-900">{selectedTime}</span>
                    </div>
                  </>
                )}
                {config.calendarType === 'range' && (startDate || endDate) && (
                  <>
                    {startDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start Date</span>
                        <span className="font-semibold text-gray-900">{startDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    {endDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">End Date</span>
                        <span className="font-semibold text-gray-900">{endDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </>
                )}
                {config.calendarType === 'simple' && selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold text-gray-900">{selectedDate.toLocaleDateString()}</span>
                  </div>
                )}
                {(service.priceRange || service.hourlyRate) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold text-gray-900">
                      {service.priceRange || `$${service.hourlyRate}/hr`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold text-gray-900 text-right">{service.location}</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 border-t pt-4 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Cancellation fee</span>
                  <span className="font-semibold text-gray-900">$100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deposit</span>
                  <span className="font-semibold text-gray-900">$250</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-emerald-700 mb-2">
                  <Star className="w-4 h-4 fill-emerald-700" />
                  <span className="font-semibold">{service.rating} Rating</span>
                </div>
                <p className="text-sm text-emerald-600">
                  Highly rated by {service.reviews} customers
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span>Instant booking confirmation</span>
                </p>
                <p className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span>Free cancellation up to 24h before</span>
                </p>
                <p className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <span>Customer support available</span>
                </p>
              </div>

              <Button
                onClick={handleBookNowClick}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-6"
                size="lg"
              >
                Book Now
              </Button>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
