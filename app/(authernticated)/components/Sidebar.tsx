"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/terms", label: "Terms" },
  { href: "/courses", label: "Courses" },
  { href: "/calculate", label: "Calculate" },
  { href: "/recommendation", label: "Recommendation" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[88px] w-[325px] h-[calc(100vh-88px)] bg-white p-4">
      <nav className="flex flex-col gap-4 pt-8">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-12 px-5 font-medium text-2xl rounded-[50px] transition-colors ${
                isActive
                  ? "bg-green text-slate-900"
                  : "text-slate-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}