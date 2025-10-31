'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { OptimizedImage } from '@/components/optimized-image';

const earningsData = [
  { day: 'Mon', value: 800 },
  { day: 'Tue', value: 1250 },
  { day: 'Wed', value: 950 },
  { day: 'Thu', value: 1100 },
  { day: 'Fri', value: 600 },
  { day: 'Sat', value: 1400 },
  { day: 'Sun', value: 1050 },
];

const affiliationEarnings = [
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Product',
    date: 'Jul 12, 2024',
    price: 150,
    percentage: 10,
    earning: 15,
  },
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Service',
    date: 'Jul 10, 2024',
    price: 300,
    percentage: 10,
    earning: 30,
  },
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Service',
    date: 'Jul 08, 2024',
    price: 200,
    percentage: 10,
    earning: 20,
  },
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Service',
    date: 'Jul 05, 2024',
    price: 180,
    percentage: 10,
    earning: 18,
  },
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Product',
    date: 'Jul 04, 2024',
    price: 170,
    percentage: 10,
    earning: 17,
  },
];

const cashbackEarnings = [
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Product',
    date: 'Jul 12, 2024',
    price: 150,
    percentage: 10,
    earning: 15,
  },
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Service',
    date: 'Jul 10, 2024',
    price: 300,
    percentage: 10,
    earning: 30,
  },
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Service',
    date: 'Jul 08, 2024',
    price: 200,
    percentage: 10,
    earning: 20,
  },
  {
    id: '8898644',
    image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=100',
    type: 'Service',
    date: 'Jul 06, 2024',
    price: 180,
    percentage: 10,
    earning: 18,
  },
];

export default function ShoppingStatisticsPage() {
  const [activeTab, setActiveTab] = useState('last30');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Shopping Statistics</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="bg-white">
                <TabsTrigger value="last30">Last 30 days</TabsTrigger>
                <TabsTrigger value="last90">Last 90 days</TabsTrigger>
                <TabsTrigger value="alltime">All time</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">Earnings</div>
                <div className="text-2xl font-bold text-gray-900">$1,234</div>
                <div className="text-xs text-green-600">+12%</div>
              </Card>

              <Card className="p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">Spends</div>
                <div className="text-2xl font-bold text-gray-900">$1,234</div>
                <div className="text-xs text-red-600">-5%</div>
              </Card>

              <Card className="p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">Affiliation</div>
                <div className="text-2xl font-bold text-gray-900">$1,234</div>
                <div className="text-xs text-green-600">+8%</div>
              </Card>

              <Card className="p-4 bg-white">
                <div className="text-sm text-gray-600 mb-1">Cashback</div>
                <div className="text-2xl font-bold text-gray-900">$1,234</div>
                <div className="text-xs text-green-600">+3%</div>
              </Card>
            </div>

            <Card className="p-6 bg-white mb-8">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Earnings</div>
                <div className="text-3xl font-bold text-gray-900">$1,234</div>
                <div className="text-sm text-green-600">This month +12%</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Earnings</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">$1,250</div>
                <div className="text-xs text-gray-500">Daily</div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#374151"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-white mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Affiliation Earnings</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Image</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">ID</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Affiliation %</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {affiliationEarnings.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-3 px-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={item.image}
                              alt={item.type}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.type}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.date}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.id}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">${item.price}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.percentage}%</td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">${item.earning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-white">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Cashback Earnings</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Image</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">ID</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Price</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Cashback %</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Earning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashbackEarnings.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-3 px-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={item.image}
                              alt={item.type}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.type}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.date}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.id}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">${item.price}</td>
                        <td className="py-3 px-2 text-sm text-gray-700">{item.percentage}%</td>
                        <td className="py-3 px-2 text-sm font-medium text-gray-900">${item.earning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
