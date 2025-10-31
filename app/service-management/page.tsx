/**
 * Service Management Page (Service Catalog)
 *
 * This page displays all services in a comprehensive table format with the following features:
 * - Service listing with images, details, and status
 * - Search functionality across service names and IDs
 * - Multi-filter support (status, category, sort)
 * - CRUD operations (Create, Read, Update, Delete)
 * - Responsive design for mobile, tablet, and desktop
 *
 * Actions available:
 * - Add New Service: Opens category-specific form
 * - Edit: Modify existing service details
 * - Delete: Remove service with confirmation
 * - View Details: See complete service information
 */

"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceSidebar } from "@/components/service-sidebar";
import { Header } from "@/components/header";
import { AddServiceDialog } from "@/components/add-service-dialog";
import { EditServiceDialog } from "@/components/edit-service-dialog";
import { DeleteServiceDialog } from "@/components/delete-service-dialog";
import { ServiceDetailsDialog } from "@/components/service-details-dialog";
import { useToast } from "@/hooks/use-toast";

/**
 * Service Interface
 * Defines the structure of a service item
 */
interface Service {
  id: string;
  serviceId: string;
  name: string;
  category: string;
  price: string;
  availability: string;
  duration: string;
  lastUpdated: string;
  image: string;
}

/**
 * Mock Services Data
 * In production, this would be fetched from Supabase database
 * TODO: Replace with actual database queries
 */
const mockServices: Service[] = [
  {
    id: "1",
    serviceId: "#SERV-1047",
    name: "Digital Marketing",
    category: "Digital Marketing",
    price: "50 € per hour",
    availability: "Available",
    duration: "2 hours",
    lastUpdated: "Updated on June 21, 2025",
    image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "2",
    serviceId: "#SERV-2058",
    name: "Home Repair",
    category: "Home Repair",
    price: "Fixed price",
    availability: "Booked",
    duration: "3 days",
    lastUpdated: "Updated on June 15, 2025",
    image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "3",
    serviceId: "#SERV-3069",
    name: "IT Services",
    category: "IT Services",
    price: "30 € per hour",
    availability: "Pending Approval",
    duration: "1 hour",
    lastUpdated: "Updated on June 10, 2025",
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "4",
    serviceId: "#SERV-4070",
    name: "Fitness",
    category: "Fitness",
    price: "40 € per session",
    availability: "Available",
    duration: "1 hour",
    lastUpdated: "Updated on June 5, 2025",
    image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: "5",
    serviceId: "#SERV-5081",
    name: "Event Management",
    category: "Event Management",
    price: "Fixed price",
    availability: "Available",
    duration: "5 days",
    lastUpdated: "Updated on May 30, 2025",
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=100"
  }
];

/**
 * ServiceManagementPage Component
 * Main component for managing service catalog
 */
export default function ServiceManagementPage() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Dialog states for different actions
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Selected service for operations
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // User's service category (would come from user profile in production)
  const [userServiceCategory] = useState("hotels");

  // Toast notification hook
  const { toast } = useToast();

  /**
   * Filter services based on search query, status, and category
   * Uses case-insensitive matching for search
   */
  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      service.availability.toLowerCase().includes(statusFilter.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      service.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  /**
   * Handle Edit Action
   * Opens edit dialog with selected service data
   */
  const handleEdit = (id: string) => {
    const service = mockServices.find(s => s.id === id);
    if (service) {
      setSelectedService(service);
      setEditDialogOpen(true);
    }
  };

  /**
   * Handle Delete Action
   * Opens confirmation dialog before deleting
   */
  const handleDelete = (id: string) => {
    const service = mockServices.find(s => s.id === id);
    if (service) {
      setSelectedService(service);
      setDeleteDialogOpen(true);
    }
  };

  /**
   * Handle View Details Action
   * Opens detailed view of service information
   */
  const handleViewDetails = (id: string) => {
    const service = mockServices.find(s => s.id === id);
    if (service) {
      setSelectedService(service);
      setDetailsDialogOpen(true);
    }
  };

  /**
   * Confirm Delete Operation
   * Executes deletion and shows success notification
   * In production, this would call Supabase delete mutation
   */
  const confirmDelete = () => {
    if (selectedService) {
      // TODO: Add actual database deletion
      // await supabase.from('service_items').delete().eq('id', selectedService.id)

      toast({
        title: "Service Deleted",
        description: `${selectedService.name} has been successfully deleted.`,
      });
      setDeleteDialogOpen(false);
      setSelectedService(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with search and navigation */}
      <Header />

      <div className="flex">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <ServiceSidebar activePage="service-management" />

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-full">
            {/* Page Header with Title and Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Service Catalog
              </h1>
              <Button
                className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add New service</span>
                <span className="sm:hidden">Add Service</span>
              </Button>
            </div>

            {/* Dialogs for CRUD Operations */}
            <AddServiceDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              serviceCategory={userServiceCategory}
            />

            <EditServiceDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              serviceCategory={userServiceCategory}
              serviceId={selectedService?.id || ''}
            />

            <DeleteServiceDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              serviceId={selectedService?.serviceId || ''}
              serviceName={selectedService?.name || ''}
              onConfirm={confirmDelete}
            />

            <ServiceDetailsDialog
              open={detailsDialogOpen}
              onOpenChange={setDetailsDialogOpen}
              service={selectedService}
            />

            {/* Search and Filter Section */}
            <div className="mb-6 space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>

              {/* Filter Controls - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="Home Repair">Home Repair</SelectItem>
                    <SelectItem value="IT Services">IT Services</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Event Management">Event Management</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price">Price Low-High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Service Table - Desktop View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Availability
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Last Updated
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service, index) => (
                      <tr
                        key={service.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === filteredServices.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-lg">
                              <AvatarImage src={service.image} className="object-cover" />
                              <AvatarFallback className="bg-gray-100 text-gray-600 rounded-lg">
                                {service.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{service.serviceId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            {service.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{service.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{service.availability}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">{service.duration}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{service.lastUpdated}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm">
                            <button
                              onClick={() => handleEdit(service.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Delete
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleViewDetails(service.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View - TikTok Style */}
            <div className="lg:hidden space-y-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Service Image */}
                  <div className="relative h-48">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full">
                        {service.availability}
                      </span>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-base text-gray-900">{service.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">{service.serviceId}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{service.price}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{service.category}</span>
                      <span>{service.duration}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service.id)}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(service.id)}
                        className="flex-1"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No services found</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
