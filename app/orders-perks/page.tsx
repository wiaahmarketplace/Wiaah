'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersPerksPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/orders-perks/wishlist');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
