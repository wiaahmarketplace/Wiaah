"use client";

import { useState } from "react";
import { ShopSidebar } from "@/components/shop-sidebar";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/optimized-image";
import { AddAffiliationDialog } from "@/components/add-affiliation-dialog";
import { EditAffiliationDialog } from "@/components/edit-affiliation-dialog";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/header";

const affiliationData = [
  {
    id: 1,
    productId: "test",
    productName: "product name",
    productImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=200",
    commission: 5,
    expiryDate: "Mon Oct 27 2025",
    affiliationLink: "https://example.com/aff/product1",
    status: "active",
  },
  {
    id: 2,
    productId: "test",
    productName: "product name",
    productImage: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=200",
    commission: 5,
    expiryDate: "Mon Oct 27 2025",
    affiliationLink: "https://example.com/aff/product2",
    status: "active",
  },
  {
    id: 3,
    productId: "test",
    productName: "product name",
    productImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=200",
    commission: 5,
    expiryDate: "Mon Oct 27 2025",
    affiliationLink: "https://example.com/aff/product3",
    status: "active",
  },
  {
    id: 4,
    productId: "test",
    productName: "product name",
    productImage: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=200",
    commission: 5,
    expiryDate: "Mon Oct 27 2025",
    affiliationLink: "https://example.com/aff/product4",
    status: "active",
  },
  {
    id: 5,
    productId: "test",
    productName: "product name",
    productImage: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=200",
    commission: 5,
    expiryDate: "Mon Oct 27 2025",
    affiliationLink: "https://example.com/aff/product5",
    status: "active",
  },
  {
    id: 6,
    productId: "test",
    productName: "product name",
    productImage: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=200",
    commission: 4,
    expiryDate: "Mon Oct 27 2025",
    affiliationLink: "https://example.com/aff/product6",
    status: "active",
  },
];

export default function AffiliationManagementPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAffiliation, setEditingAffiliation] = useState<typeof affiliationData[0] | null>(null);

  const handleCopyLink = async (link: string, id: number) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      toast.success("Affiliation link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error("Failed to copy link. Please try again.");
      console.error("Failed to copy:", error);
    }
  };

  const handleEdit = (affiliation: typeof affiliationData[0]) => {
    setEditingAffiliation(affiliation);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this affiliation?')) {
      console.log('Deleting affiliation:', id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="affiliation-management" />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Affiliation List</h1>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-green-400 hover:bg-green-500 text-white px-8 py-6 text-base font-medium"
              >
                Add New Affiliation
              </Button>
            </div>

            <AddAffiliationDialog
              isOpen={isAddDialogOpen}
              onClose={() => setIsAddDialogOpen(false)}
            />

            <EditAffiliationDialog
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              affiliation={editingAffiliation}
            />

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Product Image</th>
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Product Id</th>
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Product Name</th>
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Commission %</th>
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Expiry Date</th>
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Affiliation Link</th>
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Status</th>
                      <th className="text-left py-6 px-6 text-base font-bold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliationData.map((item, index) => (
                      <tr key={item.id} className={index !== affiliationData.length - 1 ? "border-b border-gray-100" : ""}>
                        <td className="py-6 px-6">
                          <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={item.productImage}
                              alt={item.productName}
                              width={128}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-6 px-6 text-base text-gray-900">{item.productId}</td>
                        <td className="py-6 px-6 text-base text-gray-900">{item.productName}</td>
                        <td className="py-6 px-6 text-base text-gray-900">{item.commission}</td>
                        <td className="py-6 px-6 text-base text-gray-900 whitespace-nowrap">{item.expiryDate}</td>
                        <td className="py-6 px-6">
                          <Button
                            onClick={() => handleCopyLink(item.affiliationLink, item.id)}
                            className="bg-green-400 hover:bg-green-500 text-white p-3 h-auto transition-all"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </Button>
                        </td>
                        <td className="py-6 px-6">
                          <div className="inline-block px-6 py-2 border-2 border-green-400 text-green-400 rounded-lg text-base font-medium">
                            {item.status}
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-gray-900 hover:text-gray-700 transition-colors text-base font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-600 transition-colors text-base font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
