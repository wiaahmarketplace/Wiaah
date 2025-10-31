"use client";

import { useState } from "react";
import { ChevronDown, Package } from "lucide-react";
import Link from "next/link";

interface ShopSidebarProps {
  activePage: "product-catalog" | "product-presentation" | "orders" | "sales-statistics" | "affiliation-management" | "affiliation-history" | "returns" | "shipping" | "reviews" | "opening-time";
}

export function ShopSidebar({ activePage }: ShopSidebarProps) {
  const [productManagementOpen, setProductManagementOpen] = useState(
    activePage === "product-catalog" || activePage === "product-presentation" || activePage === "opening-time"
  );
  const [affiliationSystemOpen, setAffiliationSystemOpen] = useState(
    activePage === "affiliation-management" || activePage === "affiliation-history"
  );
  const [salesStatisticsOpen, setSalesStatisticsOpen] = useState(false);

  return (
    <div className="w-80 border-r bg-white min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Shop Management</h2>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Package className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <nav className="space-y-1">
        <div>
          <button
            onClick={() => setProductManagementOpen(!productManagementOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-lg">🛍️</span>
            <span className="flex-1 font-normal text-gray-900">Product Management</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${productManagementOpen ? 'rotate-180' : ''}`} />
          </button>
          {productManagementOpen && (
            <div className="mt-1 space-y-1">
              <Link
                href="/product-catalog"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "product-catalog" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">📦</span>
                <span className={`text-sm ${activePage === "product-catalog" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Product Catalog
                </span>
              </Link>
              <Link
                href="/product-presentation"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "product-presentation" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">🖼️</span>
                <span className={`text-sm ${activePage === "product-presentation" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Presentation
                </span>
              </Link>
              <Link
                href="/opening-time-management"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "opening-time" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">🕒</span>
                <span className={`text-sm ${activePage === "opening-time" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Opening Time
                </span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/orders"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "orders" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">📋</span>
          <span className={activePage === "orders" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Orders
          </span>
        </Link>

        <Link
          href="/returned-orders"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "returns" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">↩️</span>
          <span className={activePage === "returns" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Returned Orders
          </span>
        </Link>

        <Link
          href="/sales-statistics"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "sales-statistics" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">📊</span>
          <span className={activePage === "sales-statistics" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Sales Statistics
          </span>
        </Link>

        <div>
          <button
            onClick={() => setAffiliationSystemOpen(!affiliationSystemOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-lg">👥</span>
            <span className="flex-1 font-normal text-gray-900">Affiliation System</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${affiliationSystemOpen ? 'rotate-180' : ''}`} />
          </button>
          {affiliationSystemOpen && (
            <div className="mt-1 space-y-1">
              <Link
                href="/affiliation-management"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "affiliation-management" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">⚙️</span>
                <span className={`text-sm ${activePage === "affiliation-management" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Affiliation Management
                </span>
              </Link>
              <Link
                href="/affiliation-history"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "affiliation-history" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">📜</span>
                <span className={`text-sm ${activePage === "affiliation-history" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Affiliation History
                </span>
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/shipping-settings"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "shipping" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">🚚</span>
          <span className={activePage === "shipping" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Shipping Settings
          </span>
        </Link>

        <Link
          href="/reviews?context=shop"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "reviews" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">⭐</span>
          <span className={activePage === "reviews" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Reviews
          </span>
        </Link>
      </nav>
    </div>
  );
}
