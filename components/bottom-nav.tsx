'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tags, PlusCircle, CalendarDays, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/add', label: 'Add', icon: PlusCircle, isCenter: true },
  { href: '/history', label: 'History', icon: CalendarDays },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide on category detail pages to avoid visual clutter
  const showNav = !pathname.startsWith('/category/');

  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-end justify-around px-2 h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-5 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform">
                  <PlusCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] mt-1 font-medium text-emerald-500">Add</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 group"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10'
                    : 'group-active:bg-secondary'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-emerald-500' : 'text-muted-foreground'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 font-medium transition-colors ${
                  isActive ? 'text-emerald-500' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
