"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/terms", label: "Terms", icon: "article" },
  { href: "/courses", label: "Courses", icon: "auto_stories" },
  { href: "/calculate", label: "Calculate", icon: "calculate" },
  { href: "/recommendation", label: "Recommendation", icon: "lightbulb" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden md:flex flex-col h-screen w-64 bg-slate-50 py-8 px-4 border-r border-zinc-100 shrink-0 sticky top-0">
        <div className="mb-10 px-4 flex items-center gap-2">
          <Image 
            src="/starlogo.svg" 
            alt="Gradient" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
          <h1 className="text-lg font-bold tracking-tight text-zinc-900 uppercase">Gradient</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 rounded-lg ${
                  isActive
                    ? "text-zinc-900 font-semibold border-r-4 border-lime-400 bg-slate-200/30"
                    : "text-slate-500 hover:text-zinc-900 hover:bg-slate-200/50"
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl flex items-center justify-around px-4 border-t border-slate-200 shadow-2xl z-50">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-colors ${
                isActive ? "text-lime-600" : "text-slate-400 hover:text-zinc-900"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
