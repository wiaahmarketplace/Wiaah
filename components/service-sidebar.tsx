"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface ServiceSidebarProps {
  activePage: "service" | "reservations" | "pending" | "service-management" | "service-presentation" | "opening-time" | "affiliation-management" | "affiliation-history" | "reviews" | "sales-statistics";
}

export function ServiceSidebar({ activePage }: ServiceSidebarProps) {
  const [serviceSetupOpen, setServiceSetupOpen] = useState(
    activePage === "service-management" ||
    activePage === "service-presentation" ||
    activePage === "opening-time"
  );
  const [affiliationSystemOpen, setAffiliationSystemOpen] = useState(
    activePage === "affiliation-management" || activePage === "affiliation-history"
  );

  return (
    <div className="w-80 border-r bg-white min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Service Management</h2>
        <button className="p-2 hover:bg-gray-100 rounded">
          <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
        </button>
      </div>

      <nav className="space-y-1">
        <Link
          href="/service"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "service" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">📅</span>
          <span className={activePage === "service" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Reservation Agenda
          </span>
        </Link>
        <Link
          href="/reservations"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "reservations" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">📑</span>
          <span className={activePage === "reservations" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Reservations
          </span>
        </Link>
        <Link
          href="/pending-reservations"
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            activePage === "pending" ? "bg-gray-100" : "hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">⏰</span>
          <span className={activePage === "pending" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>
            Pending Reservations
          </span>
        </Link>
        <div>
          <button
            onClick={() => setServiceSetupOpen(!serviceSetupOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-gray-50"
          >
            <span className="text-lg">⚙️</span>
            <span className="flex-1 font-normal text-gray-900">Service Management</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${serviceSetupOpen ? 'rotate-180' : ''}`} />
          </button>
          {serviceSetupOpen && (
            <div className="mt-1 space-y-1">
              <Link
                href="/service-management"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "service-management" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">🔲</span>
                <span className={`text-sm ${activePage === "service-management" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Service Catalog
                </span>
              </Link>
              <Link
                href="/service-presentation"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "service-presentation" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">🖼️</span>
                <span className={`text-sm ${activePage === "service-presentation" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Presentation
                </span>
              </Link>
              <Link
                href="/opening-time-management"
                className={`w-full flex items-center gap-3 px-4 py-3 pl-12 rounded-lg text-left transition-colors ${
                  activePage === "opening-time" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <span className="text-base">⏱️</span>
                <span className={`text-sm ${activePage === "opening-time" ? "font-medium text-gray-900" : "font-normal text-gray-900"}`}>
                  Opening time management
                </span>
              </Link>
            </div>
          )}
        </div>

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
                href="/service-affiliation-management"
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

        <Link
          href="/reviews?context=service"
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
