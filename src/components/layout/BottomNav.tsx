"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {layoutConfig} from "@/config/layout.config";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full border-t bg-white shadow-md z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {layoutConfig.navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center text-sm transition",
                active ? "text-black" : "text-gray-500 hover:text-gray-800"
              )}
            >
              <Icon size={22} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
