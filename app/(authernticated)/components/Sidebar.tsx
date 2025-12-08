"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Calculator, Lightbulb, FileText } from "lucide-react";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/terms", label: "Terms", icon: FileText },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/calculate", label: "Calculate", icon: Calculator },
  { href: "/recommendation", label: "Recommendation", icon: Lightbulb },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:block fixed left-0 top-[88px] w-[325px] h-[calc(100vh-88px)] bg-white p-4 border-r border-gray-200">
        <nav className="flex flex-col gap-4 pt-8">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center h-12 px-5 font-medium text-2xl rounded-[50px] transition-colors ${
                  isActive
                    ? "bg-brand-green text-slate-900"
                    : "text-slate-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? "bg-brand-green text-black"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={2} />
                <span className="text-[8px] font-medium leading-tight text-center px-1">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}