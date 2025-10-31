"use client";

import { useState } from "react";
import { ShopSidebar } from "@/components/shop-sidebar";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { Header } from "@/components/header";

const earningsData = [
  { day: "Mon", value: 800 },
  { day: "Tue", value: 1200 },
  { day: "Wed", value: 950 },
  { day: "Thu", value: 1100 },
  { day: "Fri", value: 1800 },
  { day: "Sat", value: 1400 },
  { day: "Sun", value: 1600 },
];

const ageData = [
  { name: "18-24", value: 45, max: 100 },
  { name: "25-34", value: 70, max: 100 },
  { name: "35-44", value: 85, max: 100 },
  { name: "45-54", value: 60, max: 100 },
  { name: "55+", value: 40, max: 100 },
];

const genderData = [
  { name: "Male", value: 55, max: 100 },
  { name: "Female", value: 75, max: 100 },
  { name: "Other", value: 40, max: 100 },
];

const bestBookedServices = [
  {
    name: "Photography Session",
    price: 200,
    revenue: 4000,
    quantity: 20,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=100&h=100&fit=crop"
  },
  {
    name: "Event Planning",
    price: 500,
    revenue: 5000,
    quantity: 10,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=100&h=100&fit=crop"
  },
  {
    name: "Catering Services",
    price: 300,
    revenue: 3000,
    quantity: 10,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=100&h=100&fit=crop"
  },
];

const recentBookings = [
  {
    name: "Landscape Photography",
    price: 250,
    date: "July 14, 2024",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop"
  },
  {
    name: "House Cleaning",
    price: 150,
    date: "July 13, 2024",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop"
  },
  {
    name: "Aerospace Classes",
    price: 500,
    date: "July 12, 2024",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop"
  },
  {
    name: "Sea Water Cinema",
    price: 50,
    date: "July 11, 2024",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100&h=100&fit=crop"
  },
];

export default function SalesStatisticsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <ShopSidebar activePage="sales-statistics" />

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Affiliation System</h1>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Earnings</h2>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="p-4 border-0 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Last 24 Hours</p>
                  <p className="text-2xl font-bold mb-1">$1,250</p>
                  <p className="text-sm text-green-600">+10%</p>
                </Card>
                <Card className="p-4 border-0 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Booking Earnings</p>
                  <p className="text-2xl font-bold mb-1">$1,100</p>
                  <p className="text-sm text-red-600">-5%</p>
                </Card>
                <Card className="p-4 border-0 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Refunds</p>
                  <p className="text-2xl font-bold mb-1">$50</p>
                  <p className="text-sm text-green-600">+2%</p>
                </Card>
                <Card className="p-4 border-0 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Affiliate Earnings</p>
                  <p className="text-2xl font-bold mb-1">$100</p>
                  <p className="text-sm text-green-600">+8%</p>
                </Card>
              </div>

              <Card className="p-6 border-0 shadow-sm">
                <div className="mb-6">
                  <p className="text-lg font-semibold text-gray-900 mb-2">Earnings</p>
                  <p className="text-3xl font-bold">$1,250</p>
                  <p className="text-sm text-gray-600">Daily</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis hide />
                      <Tooltip />
                      <Line
                        type="natural"
                        dataKey="value"
                        stroke="#64748b"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Statistics</h2>

              <Card className="p-6 border-0 shadow-sm">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Customer Statistics</p>
                  <p className="text-3xl font-bold mb-1">100%</p>
                  <p className="text-sm text-green-600">Weekly +12%</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">New Customers</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">Current Customers</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">Retargeted Customers</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-300 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Demographics</h2>

              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6 border-0 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">Age Distribution</p>
                    <p className="text-3xl font-bold mb-1">100%</p>
                    <p className="text-sm text-green-600">Weekly +12%</p>
                  </div>

                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageData}>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 11 }}
                        />
                        <YAxis hide />
                        <Bar dataKey="value" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6 border-0 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-1">Gender Distribution</p>
                    <p className="text-3xl font-bold mb-1">100%</p>
                    <p className="text-sm text-green-600">Weekly +5%</p>
                  </div>

                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={genderData}>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6b7280', fontSize: 11 }}
                        />
                        <YAxis hide />
                        <Bar dataKey="value" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Best Booked Services</h2>

              <Card className="border-0 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Service</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Revenue</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bestBookedServices.map((service, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={service.image}
                                alt={service.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm text-gray-900">{service.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">${service.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">${service.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{service.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>

              <Card className="border-0 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Service</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.map((booking, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={booking.image}
                                alt={booking.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-sm text-gray-900">{booking.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">${booking.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
