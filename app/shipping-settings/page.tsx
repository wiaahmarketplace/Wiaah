"use client";

import { useState } from "react";
import { ShopSidebar } from "@/components/shop-sidebar";
import { Button } from "@/components/ui/button";
import { AddShippingDialog } from "@/components/add-shipping-dialog";
import { EditShippingDialog } from "@/components/edit-shipping-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { Header } from "@/components/header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const shippingOptions = [
  {
    id: 1,
    name: "Free Shipping",
    description: "4-8 business days",
  },
  {
    id: 2,
    name: "Click & Collect",
    description: "Collect at Shop in 30 minutes",
  },
  {
    id: 3,
    name: "Express",
    description: "1-2 business days",
  },
  {
    id: 4,
    name: "Economy",
    description: "3-5 business days",
  },
  {
    id: 5,
    name: "Priority",
    description: "1-2 business days",
  },
];

export default function ShippingSettingsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<typeof shippingOptions[0] | null>(null);
  const [deleteShippingId, setDeleteShippingId] = useState<number | null>(null);
  const [options, setOptions] = useState(shippingOptions);

  const handleEdit = (option: typeof shippingOptions[0]) => {
    setSelectedShipping(option);
    setIsEditDialogOpen(true);
  };

  const handleSave = (updatedShipping: typeof shippingOptions[0]) => {
    setOptions(options.map(opt =>
      opt.id === updatedShipping.id ? updatedShipping : opt
    ));
  };

  const handleDelete = (id: number) => {
    setOptions(options.filter(opt => opt.id !== id));
    setDeleteShippingId(null);
  };

  const totalPages = Math.ceil(options.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = options.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="shipping" />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Shipping Settings</h1>
                <p className="text-gray-600">Define Your Shipping Region and rates</p>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-6 text-base font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New shipping
              </Button>
            </div>

            <div className="space-y-4">
              {currentItems.map((option) => (
                <div
                  key={option.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(option)}
                      className="hover:bg-gray-100"
                    >
                      <Pencil className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteShippingId(option.id)}
                      className="hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <AddShippingDialog
              isOpen={isAddDialogOpen}
              onClose={() => setIsAddDialogOpen(false)}
            />

            <EditShippingDialog
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              shipping={selectedShipping}
              onSave={handleSave}
            />

            <AlertDialog open={deleteShippingId !== null} onOpenChange={() => setDeleteShippingId(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Shipping Method</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this shipping method? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteShippingId && handleDelete(deleteShippingId)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
