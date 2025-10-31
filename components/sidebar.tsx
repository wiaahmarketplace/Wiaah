'use client';

import { memo, useMemo } from 'react';
import { Home, Compass, Zap, ShoppingCart, Briefcase, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Compass, label: 'Discover', href: '/discover' },
  { icon: Zap, label: 'Action', href: '/action' },
  { icon: ShoppingCart, label: 'Shop', href: '/shop' },
  { icon: Briefcase, label: 'Service', href: '/services' },
  { icon: Users, label: 'Affiliation', href: '/affiliation' },
];

const NavItem = memo(({ item, isActive }: { item: typeof navItems[0]; isActive: boolean }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors',
        isActive
          ? 'bg-white text-emerald-500'
          : 'text-white hover:bg-white/10'
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="font-medium">{item.label}</span>
    </Link>
  );
});

NavItem.displayName = 'NavItem';

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-56 bg-gradient-to-br from-emerald-400 to-emerald-500 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8"
            fill="currentColor"
          >
            <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
          </svg>
          <span className="text-2xl font-bold">Wiaah</span>
        </Link>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} isActive={pathname === item.href} />
        ))}
      </nav>

      <div className="p-3">
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-white hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
});
