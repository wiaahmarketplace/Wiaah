"use client";

import { ShoppingBag, TrendingUp, ShoppingCart, Package, CreditCard, FileText, MapPin, Heart, RotateCcw, Coins, TrendingDown, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface OrdersPerksSidebarProps {
  activePage?: string;
}

export function OrdersPerksSidebar({ activePage }: OrdersPerksSidebarProps) {
  const pathname = usePathname();
  const currentPage = activePage || pathname;

  const menuItems = [
    {
      icon: Heart,
      label: "My Wishlist",
      href: "/orders-perks/wishlist"
    },
    {
      icon: TrendingUp,
      label: "My Shopping Statistics",
      href: "/orders-perks/shopping-statistics"
    },
    {
      icon: ShoppingCart,
      label: "My Orders",
      href: "/orders-perks/my-orders"
    },
    {
      icon: Package,
      label: "My Bookings",
      href: "/orders-perks/my-bookings"
    },
    {
      icon: FileText,
      label: "My Digital Products",
      href: "/orders-perks/digital-products"
    },
    {
      icon: RotateCcw,
      label: "My Returns",
      href: "/orders-perks/returns"
    },
    {
      icon: CreditCard,
      label: "My Payment Method",
      href: "/orders-perks/payment-method"
    },
    {
      icon: MapPin,
      label: "My Address Book",
      href: "/orders-perks/address-book"
    },
    {
      icon: Coins,
      label: "My Cashback History",
      href: "/orders-perks/cashback-history"
    },
    {
      icon: TrendingDown,
      label: "My Affiliate Earnings",
      href: "/orders-perks/affiliate-earnings"
    },
    {
      icon: Star,
      label: "My Reviews",
      href: "/orders-perks/reviews"
    },
  ];

  return (
    <div className="w-60 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.href || pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-normal">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
