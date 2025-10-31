'use client';

import { Header } from '@/components/header';
import { OrdersPerksSidebar } from '@/components/orders-perks-sidebar';

export default function EarningsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex">
        <OrdersPerksSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Shop & Book Earning</h1>
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-600">Your earnings will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
