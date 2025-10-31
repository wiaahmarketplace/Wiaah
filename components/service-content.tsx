"use client";

import { Button } from "@/components/ui/button";
import { Check, Coffee, Wifi, Home, Maximize, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

interface ServiceContentProps {
  category: string;
  service: any;
}

export function ServiceContent({ category, service }: ServiceContentProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const incrementQuantity = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementQuantity = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) - 1) }));
  };

  const toggleDetails = (id: string) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectTreatment = (id: string) => {
    setSelectedTreatment(id);
  };

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicle(id);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.vehicle-card')?.clientWidth || 400;
      container.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('.vehicle-card')?.clientWidth || 400;
      container.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
    }
  };

  // Restaurants - Menus
  if (category === "restaurants") {
    const menuCourses = [
      {
        id: "aperitif",
        title: "Aperitif",
        items: [
          {
            id: "aperitif-1",
            name: "Champagne & Caviar",
            ingredients: "champagne, caviar, toast,",
            price: 25,
            image: service.image
          },
          {
            id: "aperitif-2",
            name: "Prosecco & Bruschetta",
            ingredients: "prosecco, tomato, basil, bread,",
            price: 18,
            image: service.image
          }
        ]
      },
      {
        id: "starter",
        title: "Starter",
        items: [
          {
            id: "starter-1",
            name: "French Onion Soup",
            ingredients: "onion, broth, cheese, croutons,",
            price: 22,
            image: service.image
          },
          {
            id: "starter-2",
            name: "Caesar Salad",
            ingredients: "romaine, parmesan, croutons, dressing,",
            price: 20,
            image: service.image
          }
        ]
      },
      {
        id: "main",
        title: "Main Course",
        items: [
          {
            id: "main-1",
            name: "Grilled Salmon",
            ingredients: "salmon, lemon, herbs, vegetables,",
            price: 45,
            image: service.image
          },
          {
            id: "main-2",
            name: "Beef Tenderloin",
            ingredients: "beef, potatoes, sauce, vegetables,",
            price: 52,
            image: service.image
          }
        ]
      },
      {
        id: "cheese",
        title: "Cheese Course",
        items: [
          {
            id: "cheese-1",
            name: "Cheese Platter",
            ingredients: "brie, gouda, cheddar, bread, fruit,",
            price: 28,
            image: service.image
          }
        ]
      },
      {
        id: "dessert",
        title: "Dessert",
        items: [
          {
            id: "dessert-1",
            name: "Chocolate Lava Cake",
            ingredients: "chocolate, cream, berries,",
            price: 18,
            image: service.image
          },
          {
            id: "dessert-2",
            name: "Crème Brûlée",
            ingredients: "cream, vanilla, caramel,",
            price: 16,
            image: service.image
          }
        ]
      },
      {
        id: "drink",
        title: "Drink",
        items: [
          {
            id: "drink-1",
            name: "French Wine Selection",
            ingredients: "red wine, white wine,",
            price: 35,
            image: service.image
          },
          {
            id: "drink-2",
            name: "Coffee & Digestif",
            ingredients: "espresso, liqueur,",
            price: 12,
            image: service.image
          }
        ]
      }
    ];

    return (
      <div className="space-y-8">
        {menuCourses.map((course) => (
          <div key={course.id}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{course.title}</h3>
            <div className="space-y-4">
              {course.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-6 py-4 border-b">
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.ingredients}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p className="text-2xl font-bold text-gray-900">${item.price}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="w-8 text-center font-semibold text-lg">
                        {quantities[item.id] || 0}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6">
          <h4 className="font-bold text-gray-900 mb-4">Cancelation policy</h4>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="cancellation" defaultChecked className="mt-1" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-gray-700">Fully refundable before Nov 22</p>
                <p className="text-emerald-600 font-bold">$10</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="cancellation" className="mt-1" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-gray-700">Fully refundable before Nov 22</p>
                <p className="text-emerald-600 font-bold">$20</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Health Centers - Doctors
  if (category === "health-centers") {
    const doctors = [
      {
        id: "dr-heart",
        name: "Dr. Heart",
        specialty: "Cardiology",
        price: 200,
        avatar: service.image
      },
      {
        id: "dr-brain",
        name: "Dr. Brain",
        specialty: "Neurology",
        price: 250,
        avatar: service.image
      }
    ];

    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-gray-900">Doctors</h3>
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                  <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900">{doctor.name}</h4>
                  <p className="text-gray-400 text-lg">{doctor.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-gray-900">${doctor.price}</p>
                <input
                  type="radio"
                  name="doctor"
                  className="w-6 h-6"
                  onChange={() => setSelectedOptions({ doctor: doctor.id })}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t">
          <h4 className="font-bold text-gray-900 mb-4">Cancelation policy</h4>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="cancellation" defaultChecked className="mt-1" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-gray-700">Fully refundable before Nov 22</p>
                <p className="text-emerald-600 font-bold">$50</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="cancellation" className="mt-1" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-gray-700">Fully refundable before Nov 10</p>
                <p className="text-emerald-600 font-bold">$100</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Beauty Centers - Treatments
  if (category === "beauty-centers" || category === "mobile-beauty") {
    const treatments = [
      {
        id: "massage",
        name: "Massage - Relaxing Massage",
        duration: "1 hrs",
        price: 100,
        originalPrice: 111,
        image: service.image,
        description: "A deeply relaxing full-body massage using aromatherapy oils. This treatment helps reduce stress, ease muscle tension, and promote overall wellbeing.",
        benefits: ["Reduces stress and anxiety", "Relieves muscle tension", "Improves circulation", "Promotes better sleep"]
      },
      {
        id: "facial",
        name: "Facial - Facial Treatment",
        duration: "30 mins",
        price: 50,
        originalPrice: 59,
        image: service.image,
        description: "A rejuvenating facial treatment that cleanses, exfoliates, and hydrates your skin. Perfect for achieving a healthy, glowing complexion.",
        benefits: ["Deep cleanses pores", "Exfoliates dead skin cells", "Hydrates and nourishes", "Improves skin texture"]
      }
    ];

    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-gray-900">Treatments</h3>
        <div className="space-y-6">
          {treatments.map((treatment) => (
            <div key={treatment.id} className="border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between gap-6 p-6">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={treatment.image}
                    alt={treatment.name}
                    className="w-32 h-32 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-xl text-gray-900 mb-2">{treatment.name}</h4>
                    <p className="text-gray-600">
                      {treatment.duration}{" "}
                      <button
                        onClick={() => toggleDetails(treatment.id)}
                        className="text-emerald-500 font-medium ml-2 hover:text-emerald-600"
                      >
                        {showDetails[treatment.id] ? "Hide Details" : "Show Details"}
                      </button>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">${treatment.price}</p>
                    <p className="text-gray-400 line-through">${treatment.originalPrice}</p>
                  </div>
                  <Button
                    onClick={() => handleSelectTreatment(treatment.id)}
                    className={`px-8 ${
                      selectedTreatment === treatment.id
                        ? "bg-gray-900 hover:bg-gray-800"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    } text-white`}
                  >
                    {selectedTreatment === treatment.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>

              {showDetails[treatment.id] && (
                <div className="px-6 pb-6 pt-0 border-t bg-gray-50">
                  <div className="mt-4 space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                      <p className="text-gray-700">{treatment.description}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Benefits</h5>
                      <ul className="space-y-2">
                        {treatment.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 border-t">
          <h4 className="font-bold text-gray-900 mb-4">Cancelation policy</h4>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="cancellation" defaultChecked className="mt-1" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-gray-700">Fully refundable before Nov 22</p>
                <p className="text-emerald-600 font-bold">$20</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="cancellation" className="mt-1" />
              <div className="flex-1 flex items-center justify-between">
                <p className="text-gray-700">Fully refundable before Nov 10</p>
                <p className="text-emerald-600 font-bold">$50</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Vehicle - Vehicles
  if (category === "vehicle") {
    const vehicles = [
      {
        id: "bugatti",
        name: "Bugatti Veyron",
        dailyRate: 500,
        totalPrice: 1500,
        features: ["A/C", "GPS"],
        specs: { luggage: 3, passengers: 5, doors: 4 },
        image: "https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?auto=compress&cs=tinysrgb&w=600",
        cancellationPolicies: [
          { text: "Fully refundable before Nov 10", price: 30 },
          { text: "Fully refundable before Nov 4", price: 15 }
        ]
      },
      {
        id: "koenigsegg",
        name: "Koenigsegg Jesko",
        dailyRate: 700,
        totalPrice: 2100,
        features: ["A/C", "GPS"],
        specs: { luggage: 3, passengers: 5, doors: 4 },
        image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600",
        cancellationPolicies: [
          { text: "Fully refundable before Nov 10", price: 30 },
          { text: "Fully refundable before Nov 4", price: 15 }
        ]
      },
      {
        id: "lamborghini",
        name: "Lamborghini Veneno",
        dailyRate: 450,
        totalPrice: 1350,
        features: ["A/C", "GPS"],
        specs: { luggage: 3, passengers: 5, doors: 4 },
        image: "https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=600",
        cancellationPolicies: [
          { text: "Fully refundable before Nov 10", price: 30 },
          { text: "Fully refundable before Nov 4", price: 15 }
        ]
      }
    ];

    return (
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {vehicles.map((vehicle, idx) => (
            <div key={vehicle.id} className="flex-shrink-0 w-96 snap-center vehicle-card">
              <div className={`border-2 rounded-lg p-6 transition-all ${
                selectedVehicle === vehicle.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900">{vehicle.name}</h4>
                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      name="vehicle-selection"
                      checked={selectedVehicle === vehicle.id}
                      onChange={() => handleSelectVehicle(vehicle.id)}
                      className="w-6 h-6 cursor-pointer accent-emerald-500"
                    />
                  </label>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-bold text-lg">${vehicle.dailyRate} | day</span>
                  </div>
                  <p className="text-gray-900 font-semibold">${vehicle.totalPrice} total</p>
                </div>

                <div className="flex gap-4 mb-4 text-gray-700">
                  {vehicle.features.map((feature, fidx) => (
                    <span key={fidx} className="flex items-center gap-1">
                      {feature === "A/C" && "❄️"} {feature === "GPS" && "🗺️"} {feature}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mb-6 text-gray-700">
                  <span>🧳 {vehicle.specs.luggage}</span>
                  <span>👥 {vehicle.specs.passengers}</span>
                  <span>🚪 {vehicle.specs.doors}</span>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-bold text-gray-900 mb-3">Cancelation policy</h5>
                  <div className="space-y-2">
                    {vehicle.cancellationPolicies.map((policy, pidx) => (
                      <label key={pidx} className="flex items-start gap-2 cursor-pointer text-sm">
                        <input
                          type="radio"
                          name={`cancellation-${vehicle.id}`}
                          defaultChecked={pidx === 0}
                          className="mt-1 accent-emerald-500"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-gray-700">{policy.text}</span>
                          <span className="text-emerald-600 font-semibold">${policy.price}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Previous vehicle"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Next vehicle"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    );
  }

  // Tradespeople - Home & Technical Services
  if (category === "tradespeople") {
    const services = [
      {
        id: "plumbing",
        name: "Plumbing Services",
        description: "Professional plumbing repairs, installations, and maintenance",
        hourlyRate: 75,
        image: "https://images.pexels.com/photos/8486915/pexels-photo-8486915.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Pipe repairs", "Fixture installation", "Drain cleaning", "Water heater service"],
        availability: "24/7 Emergency Available",
        estimatedDuration: "2-4 hours"
      },
      {
        id: "electrical",
        name: "Electrical Work",
        description: "Licensed electrical repairs, wiring, and installations",
        hourlyRate: 85,
        image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Wiring repairs", "Panel upgrades", "Lighting installation", "Safety inspections"],
        availability: "Same-day service",
        estimatedDuration: "2-6 hours"
      },
      {
        id: "carpentry",
        name: "Carpentry & Woodwork",
        description: "Custom woodwork, furniture repair, and installations",
        hourlyRate: 70,
        image: "https://images.pexels.com/photos/5974298/pexels-photo-5974298.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Furniture assembly", "Cabinet installation", "Door/window repairs", "Custom builds"],
        availability: "Next-day booking",
        estimatedDuration: "3-8 hours"
      },
      {
        id: "painting",
        name: "Painting & Decorating",
        description: "Interior and exterior painting services",
        hourlyRate: 60,
        image: "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Interior painting", "Exterior painting", "Wallpaper installation", "Surface prep"],
        availability: "Weekly scheduling",
        estimatedDuration: "1-3 days"
      }
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
        {services.map((svc) => (
          <div
            key={svc.id}
            className={`border rounded-lg p-6 transition-all cursor-pointer ${
              selectedService === svc.id ? 'ring-2 ring-emerald-500 border-emerald-500' : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedService(svc.id)}
          >
            <div className="flex gap-6 mb-4">
              <img
                src={svc.image}
                alt={svc.name}
                className="w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{svc.name}</h3>
                  <input
                    type="radio"
                    name="service-selection"
                    checked={selectedService === svc.id}
                    onChange={() => setSelectedService(svc.id)}
                    className="mt-1 w-5 h-5 accent-emerald-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <p className="text-gray-600 mb-3">{svc.description}</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Duration: {svc.estimatedDuration}</span>
                  <span className="text-emerald-600 font-bold">${svc.hourlyRate}/hour</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Availability:</span> {svc.availability}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Services Include:</h4>
              <div className="grid grid-cols-2 gap-2">
                {svc.services.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Cancellation Policy</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} defaultChecked className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Free cancellation 24hrs before</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Flexible cancellation</span>
                    <span className="text-emerald-600 font-semibold">$25</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Family & Childcare Services
  if (category === "family-childcare") {
    const services = [
      {
        id: "babysitting",
        name: "Babysitting Services",
        description: "Professional childcare for your little ones",
        hourlyRate: 18,
        services: ["Evening babysitting", "Weekend care", "Activity supervision", "Meal preparation"],
        ageRange: "6 months - 12 years",
        certified: true
      },
      {
        id: "nanny",
        name: "Full-Time Nanny",
        description: "Dedicated nanny services for comprehensive childcare",
        hourlyRate: 25,
        services: ["Daily care", "Educational activities", "Transportation", "Meal planning"],
        ageRange: "Newborn - 10 years",
        certified: true
      },
      {
        id: "tutoring",
        name: "Tutoring & Homework Help",
        description: "Educational support and academic tutoring",
        hourlyRate: 35,
        services: ["Math & Science", "Language arts", "Test prep", "Study skills"],
        ageRange: "5 - 18 years",
        certified: true
      },
      {
        id: "playcare",
        name: "Creative Play Sessions",
        description: "Fun, educational, and creative activities",
        hourlyRate: 20,
        services: ["Arts & crafts", "Music & movement", "Outdoor play", "Story time"],
        ageRange: "2 - 8 years",
        certified: false
      }
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Childcare Services</h2>
        {services.map((svc) => (
          <div key={svc.id} className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{svc.name}</h3>
                  {svc.certified && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      Certified
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{svc.description}</p>
                <div className="flex gap-4 text-sm mb-3">
                  <span className="text-gray-600">
                    <span className="font-semibold">Age Range:</span> {svc.ageRange}
                  </span>
                  <span className="text-emerald-600 font-bold">${svc.hourlyRate}/hour</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Services Include:</h4>
              <div className="grid grid-cols-2 gap-2">
                {svc.services.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Cancellation Policy</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} defaultChecked className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 12hrs before - Free</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 6hrs before</span>
                    <span className="text-emerald-600 font-semibold">$10</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Lifestyle & Creative Services
  if (category === "lifestyle-creative") {
    const services = [
      {
        id: "styling",
        name: "Personal Styling",
        description: "Wardrobe consulting and style makeover",
        sessionPrice: 150,
        duration: "2 hours",
        image: "https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Wardrobe audit", "Shopping assistance", "Style guide", "Color analysis"],
        includes: "Digital lookbook"
      },
      {
        id: "photography",
        name: "Photography Session",
        description: "Professional photo shoots for any occasion",
        sessionPrice: 250,
        duration: "3 hours",
        image: "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Portrait sessions", "Event coverage", "Product photography", "Editing included"],
        includes: "20 edited photos"
      },
      {
        id: "interior",
        name: "Interior Decoration",
        description: "Transform your space with professional design",
        sessionPrice: 200,
        duration: "Consultation + plan",
        image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Space planning", "Color schemes", "Furniture selection", "Decor sourcing"],
        includes: "3D visualization"
      },
      {
        id: "classes",
        name: "Creative Classes",
        description: "Art, dance, and music lessons",
        sessionPrice: 45,
        duration: "1 hour",
        image: "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600",
        services: ["Painting classes", "Dance lessons", "Music instruction", "Group workshops"],
        includes: "Materials provided"
      }
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Creative Services</h2>
        {services.map((svc) => (
          <div
            key={svc.id}
            className={`border rounded-lg p-6 transition-all cursor-pointer ${
              selectedService === svc.id ? 'ring-2 ring-emerald-500 border-emerald-500' : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedService(svc.id)}
          >
            <div className="flex gap-6 mb-4">
              <img
                src={svc.image}
                alt={svc.name}
                className="w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{svc.name}</h3>
                  <input
                    type="radio"
                    name="service-selection"
                    checked={selectedService === svc.id}
                    onChange={() => setSelectedService(svc.id)}
                    className="mt-1 w-5 h-5 accent-emerald-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <p className="text-gray-600 mb-3">{svc.description}</p>
                <div className="flex gap-4 text-sm mb-3">
                  <span className="text-gray-600">
                    <span className="font-semibold">Duration:</span> {svc.duration}
                  </span>
                  <span className="text-emerald-600 font-bold">${svc.sessionPrice}/session</span>
                </div>
                <p className="text-sm text-blue-600 font-semibold">Includes: {svc.includes}</p>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
              <div className="grid grid-cols-2 gap-2">
                {svc.services.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Cancellation Policy</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} defaultChecked className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 48hrs before</span>
                    <span className="text-emerald-600 font-semibold">Full refund</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 24hrs before</span>
                    <span className="text-emerald-600 font-semibold">50% refund</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Coaching & Personal Growth
  if (category === "coaching-personal-growth") {
    const services = [
      {
        id: "life-coaching",
        name: "Life Coaching",
        description: "Transform your life with personalized guidance",
        sessionPrice: 120,
        packagePrice: 500,
        duration: "60 minutes",
        services: ["Goal setting", "Mindset transformation", "Action plans", "Accountability"],
        sessionType: "1-on-1 or virtual"
      },
      {
        id: "career-coaching",
        name: "Career Coaching",
        description: "Advance your career with expert mentoring",
        sessionPrice: 150,
        packagePrice: 650,
        duration: "90 minutes",
        services: ["Resume review", "Interview prep", "Career strategy", "Leadership skills"],
        sessionType: "1-on-1 or virtual"
      },
      {
        id: "wellness-coaching",
        name: "Wellness Coaching",
        description: "Nutrition, fitness, and holistic health guidance",
        sessionPrice: 80,
        packagePrice: 350,
        duration: "60 minutes",
        services: ["Meal planning", "Fitness routines", "Stress management", "Progress tracking"],
        sessionType: "1-on-1 or virtual"
      },
      {
        id: "mindfulness",
        name: "Mindfulness & Meditation",
        description: "Find peace through guided meditation practices",
        sessionPrice: 90,
        packagePrice: 400,
        duration: "60 minutes",
        services: ["Meditation techniques", "Breathing exercises", "Stress relief", "Mind-body connection"],
        sessionType: "Group or private"
      }
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Coaching Services</h2>
        {services.map((svc) => (
          <div key={svc.id} className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{svc.name}</h3>
                <p className="text-gray-600 mb-3">{svc.description}</p>
                <div className="flex gap-4 text-sm mb-3">
                  <span className="text-gray-600">
                    <span className="font-semibold">Duration:</span> {svc.duration}
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold">Format:</span> {svc.sessionType}
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-600 font-bold">${svc.sessionPrice}/session</span>
                  <span className="text-blue-600 font-bold">5-pack: ${svc.packagePrice}</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Focus Areas:</h4>
              <div className="grid grid-cols-2 gap-2">
                {svc.services.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Cancellation Policy</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} defaultChecked className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Reschedule 24hrs before - Free</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${svc.id}`} className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Same-day cancellation</span>
                    <span className="text-red-600 font-semibold">No refund</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Local Tourism Services
  if (category === "local-tourism") {
    const tours = [
      {
        id: "city-tour",
        name: "Historic City Walking Tour",
        description: "Explore the rich history and culture of our city",
        price: 45,
        duration: "3 hours",
        groupSize: "Max 15 people",
        includes: ["Professional guide", "Entry tickets", "Refreshments", "Photo stops"],
        languages: ["English", "Spanish", "French"]
      },
      {
        id: "food-tour",
        name: "Local Food & Wine Tasting",
        description: "Discover authentic local cuisine and wines",
        price: 75,
        duration: "4 hours",
        groupSize: "Max 12 people",
        includes: ["5 food stops", "Wine tastings", "Local guide", "Recipe booklet"],
        languages: ["English", "Italian"]
      },
      {
        id: "adventure",
        name: "Outdoor Adventure Excursion",
        description: "Hiking, kayaking, and nature experiences",
        price: 95,
        duration: "6 hours",
        groupSize: "Max 10 people",
        includes: ["Equipment", "Safety gear", "Snacks", "Transport", "Guide"],
        languages: ["English"]
      },
      {
        id: "private-tour",
        name: "Private VIP Experience",
        description: "Customized tour with personal guide and transport",
        price: 250,
        duration: "Full day",
        groupSize: "Private (1-6 people)",
        includes: ["Private guide", "Luxury transport", "All entries", "Lunch", "Concierge"],
        languages: ["English", "Spanish", "French", "German"]
      }
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Available Tours</h2>
        {tours.map((tour) => (
          <div key={tour.id} className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
                <p className="text-gray-600 mb-3">{tour.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <span className="text-gray-600">
                    <span className="font-semibold">Duration:</span> {tour.duration}
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold">Group:</span> {tour.groupSize}
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold">Languages:</span> {tour.languages.join(", ")}
                  </span>
                  <span className="text-emerald-600 font-bold text-lg">${tour.price}/person</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Tour Includes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {tour.includes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Cancellation Policy</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${tour.id}`} defaultChecked className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 7 days before</span>
                    <span className="text-emerald-600 font-semibold">Full refund</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${tour.id}`} className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 3 days before</span>
                    <span className="text-emerald-600 font-semibold">50% refund</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Weddings Services
  if (category === "weddings") {
    const packages = [
      {
        id: "full-planning",
        name: "Full Wedding Planning",
        description: "Complete wedding planning from start to finish",
        startingPrice: 5000,
        services: ["Venue selection", "Vendor coordination", "Budget management", "Timeline creation", "Day-of coordination", "Design consultation"],
        duration: "12+ months planning"
      },
      {
        id: "coordination",
        name: "Day-of Coordination",
        description: "Professional coordination on your wedding day",
        startingPrice: 1500,
        services: ["Timeline management", "Vendor coordination", "Setup supervision", "Problem solving", "Guest assistance"],
        duration: "12 hours coverage"
      },
      {
        id: "photography",
        name: "Wedding Photography",
        description: "Capture your special day beautifully",
        startingPrice: 2500,
        services: ["8 hours coverage", "2 photographers", "400+ edited photos", "Online gallery", "Print rights"],
        duration: "Full day coverage"
      },
      {
        id: "catering",
        name: "Wedding Catering",
        description: "Exquisite dining experience for your guests",
        startingPrice: 75,
        services: ["Custom menus", "Appetizers", "Main courses", "Desserts", "Bar service", "Staff included"],
        duration: "Per person pricing"
      },
      {
        id: "florals",
        name: "Floral Design",
        description: "Beautiful floral arrangements and decor",
        startingPrice: 1200,
        services: ["Bridal bouquet", "Centerpieces", "Ceremony arch", "Reception decor", "Consultation"],
        duration: "Full venue styling"
      },
      {
        id: "venue-decor",
        name: "Venue & Decoration",
        description: "Transform your venue into a dream setting",
        startingPrice: 3000,
        services: ["Theme design", "Lighting", "Draping", "Furniture rental", "Setup & breakdown"],
        duration: "Complete transformation"
      }
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Wedding Services</h2>
        {packages.map((pkg) => (
          <div key={pkg.id} className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-3">{pkg.description}</p>
                <div className="flex gap-4 text-sm mb-3">
                  <span className="text-gray-600">
                    <span className="font-semibold">Coverage:</span> {pkg.duration}
                  </span>
                  <span className="text-emerald-600 font-bold text-lg">
                    From ${pkg.startingPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Package Includes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {pkg.services.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-gray-900 mb-3">Cancellation Policy</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${pkg.id}`} defaultChecked className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 90+ days before</span>
                    <span className="text-emerald-600 font-semibold">80% refund</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${pkg.id}`} className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 60-89 days before</span>
                    <span className="text-emerald-600 font-semibold">50% refund</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Mobile & On-demand Beauty
  if (category === "mobile-beauty") {
    const services = [
      {
        id: "hair-styling",
        name: "Mobile Hair Styling",
        description: "Professional hair services at your location",
        services: [
          { name: "Haircut & Style", price: 60, duration: "60 min" },
          { name: "Color Treatment", price: 120, duration: "120 min" },
          { name: "Blowout & Style", price: 45, duration: "45 min" },
          { name: "Special Event Styling", price: 80, duration: "90 min" }
        ]
      },
      {
        id: "nails",
        name: "Manicure & Pedicure",
        description: "Nail care services delivered to you",
        services: [
          { name: "Basic Manicure", price: 35, duration: "45 min" },
          { name: "Gel Manicure", price: 55, duration: "60 min" },
          { name: "Pedicure", price: 50, duration: "60 min" },
          { name: "Mani + Pedi Combo", price: 75, duration: "90 min" }
        ]
      },
      {
        id: "massage",
        name: "Mobile Massage Therapy",
        description: "Relaxing massage in the comfort of your home",
        services: [
          { name: "Swedish Massage", price: 90, duration: "60 min" },
          { name: "Deep Tissue", price: 110, duration: "60 min" },
          { name: "Hot Stone Massage", price: 130, duration: "90 min" },
          { name: "Couples Massage", price: 200, duration: "60 min" }
        ]
      },
      {
        id: "makeup",
        name: "Makeup Services",
        description: "Professional makeup for any occasion",
        services: [
          { name: "Natural Makeup", price: 70, duration: "45 min" },
          { name: "Glam Makeup", price: 100, duration: "60 min" },
          { name: "Bridal Makeup", price: 150, duration: "90 min" },
          { name: "Makeup Lesson", price: 120, duration: "90 min" }
        ]
      },
      {
        id: "facial",
        name: "Facial Treatments",
        description: "Skincare treatments at your location",
        services: [
          { name: "Basic Facial", price: 80, duration: "60 min" },
          { name: "Anti-Aging Facial", price: 120, duration: "75 min" },
          { name: "Deep Cleansing", price: 95, duration: "60 min" },
          { name: "Hydrating Treatment", price: 100, duration: "60 min" }
        ]
      },
      {
        id: "waxing",
        name: "Waxing Services",
        description: "Professional waxing at your home",
        services: [
          { name: "Eyebrow Shaping", price: 20, duration: "15 min" },
          { name: "Upper Lip", price: 15, duration: "10 min" },
          { name: "Full Leg", price: 70, duration: "45 min" },
          { name: "Brazilian", price: 60, duration: "30 min" }
        ]
      }
    ];

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Mobile Beauty Services</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <span className="font-semibold">Travel fee:</span> $15-25 depending on distance. All services performed at your location with professional equipment.
          </p>
        </div>
        {services.map((category) => (
          <div key={category.id} className="border rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="space-y-3">
              {category.services.map((svc, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{svc.name}</p>
                    <p className="text-sm text-gray-600">{svc.duration}</p>
                  </div>
                  <span className="text-emerald-600 font-bold text-lg">${svc.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <h4 className="font-bold text-gray-900 mb-3">Cancellation Policy</h4>
              <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${category.id}`} defaultChecked className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Cancel 6hrs before appointment</span>
                    <span className="text-emerald-600 font-semibold">FREE</span>
                  </div>
                </label>
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input type="radio" name={`cancellation-${category.id}`} className="mt-1 accent-emerald-500" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-700">Late cancellation (under 6hrs)</span>
                    <span className="text-red-600 font-semibold">50% charge</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default - Rooms (for hotels, holiday-rentals, etc.)
  const rooms = [
    {
      id: "standard",
      name: "Standard Room",
      image: service.image,
      size: "20m² / 15ft²",
      price: 90,
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
      image: service.image,
      size: "30m² / 23ft²",
      price: 200,
      originalPrice: 250,
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Rooms</h2>
      {rooms.map((room) => (
        <div key={room.id} className="border rounded-lg p-6">
          <div className="flex gap-6 mb-6">
            <img
              src={room.image}
              alt={room.name}
              className="w-48 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Maximize className="w-4 h-4" />
                  <span className="text-sm">{room.size}</span>
                </div>
              </div>
              {room.amenities && (
                <div className="flex gap-2 mb-3">
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
              {room.features && (
                <div className="flex gap-6">
                  {room.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <feature.icon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">{feature.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {room.id === "standard" && (
            <>
              <div className="grid grid-cols-2 gap-6 mb-6 text-sm text-gray-600">
                <div>
                  <p className="mb-2">Room cleaning</p>
                </div>
                <div>
                  <p className="mb-2">Towels</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Cancelation Policy</h4>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="cancellation" defaultChecked className="mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Fully refundable before Dec 27</p>
                        <p className="text-emerald-600 font-bold text-lg">$50</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="cancellation" className="mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Fully refundable before Nov 27</p>
                        <p className="text-emerald-600 font-bold text-lg">FREE</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="cancellation" className="mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Non-refundable</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-4">Extras</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" />
                        <span className="text-gray-700">Mini-bar</span>
                      </div>
                      <span className="text-emerald-600 font-semibold">$20</span>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" />
                        <span className="text-gray-700">Late check-out</span>
                      </div>
                      <span className="text-emerald-600 font-semibold">$10</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">${room.price}</p>
                    <p className="text-gray-500 line-through text-sm">${room.originalPrice} / night</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-semibold text-sm">Only 3 Tickets left at this price on our site</p>
                    <p className="text-xs text-gray-600">Include tax & fees</p>
                  </div>
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-6">
                  Book Now
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
