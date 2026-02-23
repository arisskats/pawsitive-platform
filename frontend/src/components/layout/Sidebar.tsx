"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MapPinned } from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Map",
    href: "/dashboard/map",
    icon: MapPinned,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white md:min-h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="px-4 py-4 md:px-6 md:py-8">
        <div className="mb-4 hidden md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pawsitive</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Platform</h1>
        </div>

        <nav className="flex gap-2 md:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition md:w-full ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
