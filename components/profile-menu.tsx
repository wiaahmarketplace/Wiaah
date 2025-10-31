'use client';

import { CircleUser as UserCircle, Settings, Bookmark, Store, List, ShoppingBag, Wallet, LogOut } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    icon: <UserCircle className="w-5 h-5" />,
    label: 'My Profile',
    href: '/myprofile',
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: 'Account Settings',
    href: '/account-settings',
  },
  {
    icon: <Bookmark className="w-5 h-5" />,
    label: 'Saved',
    href: '/saved',
  },
  {
    icon: <Store className="w-5 h-5" />,
    label: 'Shop Management',
    href: '/product-catalog',
  },
  {
    icon: <List className="w-5 h-5" />,
    label: 'Service Management',
    href: '/service',
  },
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    label: 'Orders & Perks',
    href: '/orders-perks/wishlist',
  },
  {
    icon: <Wallet className="w-5 h-5" />,
    label: 'Wallet',
    href: '/wallet',
  },
];

export function ProfileMenu() {
  return (
    <div className="w-72 bg-white rounded-lg shadow-lg border">
      <div className="py-2">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-gray-700">{item.icon}</div>
              <span className="text-base font-normal text-gray-900">{item.label}</span>
            </div>
          </Link>
        ))}

        <div className="border-t border-gray-200 my-2" />

        <button className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer w-full">
          <LogOut className="w-5 h-5 text-gray-700" />
          <span className="text-base font-normal text-gray-900">Log Out</span>
        </button>
      </div>
    </div>
  );
}
