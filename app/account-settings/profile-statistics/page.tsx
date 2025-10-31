"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { MapPin, Users, Heart, MessageCircle, Bookmark, Settings, Key, ShieldCheck, Bell, BarChart3, Share2, CreditCard, Ban, Database, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const overviewData = [
  { month: "Jan", reached: 400000, engaged: 350000, activity: 150000 },
  { month: "Feb", reached: 350000, engaged: 500000, activity: 300000 },
  { month: "Mar", reached: 200000, engaged: 150000, activity: 100000 },
  { month: "Apr", reached: 250000, engaged: 200000, activity: 180000 },
  { month: "May", reached: 180000, engaged: 500000, activity: 280000 },
  { month: "Jun", reached: 220000, engaged: 100000, activity: 120000 },
  { month: "Jul", reached: 400000, engaged: 300000, activity: 200000 },
  { month: "Aug", reached: 200000, engaged: 450000, activity: 250000 },
  { month: "Sep", reached: 350000, engaged: 280000, activity: 150000 },
  { month: "Oct", reached: 200000, engaged: 480000, activity: 220000 },
  { month: "Nov", reached: 100000, engaged: 280000, activity: 80000 },
  { month: "Dec", reached: 400000, engaged: 650000, activity: 300000 },
];

const dailyAudienceData = [
  { month: "Jan", men: 150000, women: 100000, other: 20000 },
  { month: "Feb", men: 180000, women: 200000, other: 30000 },
  { month: "Mar", men: 120000, women: 90000, other: 15000 },
  { month: "Apr", men: 140000, women: 120000, other: 25000 },
  { month: "May", men: 90000, women: 160000, other: 22000 },
  { month: "Jun", men: 50000, women: 80000, other: 10000 },
  { month: "Jul", men: 180000, women: 120000, other: 28000 },
  { month: "Aug", men: 200000, women: 280000, other: 35000 },
  { month: "Sep", men: 140000, women: 110000, other: 20000 },
  { month: "Oct", men: 90000, women: 220000, other: 30000 },
];

const countryData = [
  { no: 1, country: "USA", visits: 1000, percentage: "0.3", contribution: 0 },
  { no: 2, country: "Canada", visits: 800, percentage: "0.25", contribution: 0 },
  { no: 3, country: "UK", visits: 600, percentage: "0.2", contribution: 0 },
  { no: 4, country: "Australia", visits: 500, percentage: "0.15", contribution: 0 },
  { no: 5, country: "", visits: 400, percentage: "0.1", contribution: 0 },
];

const postsData = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1972115/pexels-photo-1972115.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    date: "Oct 28, 2025",
    name: "Post name",
    views: 2324477,
    likes: 36538,
    visits: 19308331,
    comments: 3438667,
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    date: "Oct 28, 2025",
    name: "Post name",
    views: 55199753,
    likes: 408950,
    visits: 86225792,
    comments: 2422132,
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    date: "Oct 28, 2025",
    name: "Post name",
    views: 14073873,
    likes: 444445,
    visits: 86769276,
    comments: 9089788,
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1972115/pexels-photo-1972115.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    date: "Oct 28, 2025",
    name: "Post name",
    views: 62089863,
    likes: 14631,
    visits: 9168064,
    comments: 13077062,
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/1246875/pexels-photo-1246875.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    date: "Oct 28, 2025",
    name: "Post name",
    views: 44602943,
    likes: 228409,
    visits: 49827642,
    comments: 822553,
  },
];

const actionsData = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1972115/pexels-photo-1972115.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    name: "Post name",
    date: "Oct 28, 2025",
    views: 2324477,
    likes: 36538,
    visits: 19308331,
    comments: 3438667,
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    name: "Post name",
    date: "Oct 28, 2025",
    views: 55199753,
    likes: 408950,
    visits: 86225792,
    comments: 2422132,
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    name: "Post name",
    date: "Oct 28, 2025",
    views: 14073873,
    likes: 444445,
    visits: 86769276,
    comments: 9089788,
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/1972115/pexels-photo-1972115.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    name: "Post name",
    date: "Oct 28, 2025",
    views: 62089863,
    likes: 14631,
    visits: 9168064,
    comments: 13077062,
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/1246875/pexels-photo-1246875.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
    name: "Post name",
    date: "Oct 28, 2025",
    views: 44602943,
    likes: 228409,
    visits: 49827642,
    comments: 822553,
  },
];

export default function ProfileStatisticsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Profile Statistics</h2>
            <Link href="/account-settings" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to account</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Total of Visits</div>
                </div>
              </div>
              <div className="text-xs text-red-500">± 0%</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Total of Followers</div>
                </div>
              </div>
              <div className="text-xs text-red-500">± 0%</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Total of Likes</div>
                </div>
              </div>
              <div className="text-xs text-red-500">± 0%</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Total of Comments</div>
                </div>
              </div>
              <div className="text-xs text-red-500">± 0%</div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Total of Saved</div>
                </div>
              </div>
              <div className="text-xs text-red-500">± 0%</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Overview Chart */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Overview</h3>

              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="text-sm text-gray-700">Account Reached</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-600"></div>
                  <span className="text-sm text-gray-700">Account Engaged</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Profile Activity</span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="reached" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="engaged" stackId="a" fill="#22c55e" />
                  <Bar dataKey="activity" stackId="a" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Reached Audience */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Reached Audience</h3>

              <div className="text-center mb-6">
                <div className="text-sm text-gray-600 mb-2">Total of audience</div>
                <div className="text-4xl font-bold text-gray-900">0</div>
              </div>

              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600"></div>
                  <span className="text-sm text-gray-700">Total of Men</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Total of Women</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <span className="text-sm text-gray-700">Other</span>
                </div>
              </div>
            </div>
          </div>

          {/* Age & Gender + Daily Audience */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Age & Gender */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900">Age & Gender</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm text-gray-700">Homme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-gray-700">Femmes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-700">Other</span>
                  </div>
                </div>
              </div>
              <div className="h-48 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-green-400"></div>
              </div>
            </div>

            {/* Daily Audience */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Daily audience</h3>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyAudienceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="men" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="women" stackId="a" fill="#f97316" />
                  <Bar dataKey="other" stackId="a" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details Level Table */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Details Level</h3>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">No.</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Country/Terrorist</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Visits</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Visit Percentage</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-900">Contribution Total</th>
                </tr>
              </thead>
              <tbody>
                {countryData.map((item) => (
                  <tr key={item.no} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-sm text-gray-900">{item.no}</td>
                    <td className="py-4 px-4 text-sm text-cyan-500 font-medium">{item.country || "-"}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{item.visits}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">%{item.percentage}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{item.contribution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Most Popular Post */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Most Popular Post</h3>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Post Image</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total Views</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total Likes</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Number of Visits</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Comments</th>
                </tr>
              </thead>
              <tbody>
                {postsData.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <img src={post.image} alt="Post" className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{post.date}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{post.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{post.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{post.likes.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{post.visits.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{post.comments.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                ‹
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    page === currentPage
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                ›
              </button>
            </div>
          </div>

          {/* Most Popular Actions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Most Popular Actions</h3>

            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Post Image</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total Views</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total Likes</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Number of Visits</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Comments</th>
                </tr>
              </thead>
              <tbody>
                {actionsData.map((action) => (
                  <tr key={action.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <img src={action.image} alt="Action" className="w-16 h-16 object-cover rounded" />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">{action.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{action.date}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{action.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{action.likes.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{action.visits.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{action.comments.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                ‹
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    page === currentPage
                      ? "bg-gray-200 text-gray-900 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
