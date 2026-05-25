"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUser, useProfile } from "@/lib/hooks/useAcademicData";
import { Loader2 } from "lucide-react";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/terms", label: "Terms", icon: "article" },
  { href: "/courses", label: "Courses", icon: "auto_stories" },
  { href: "/calculate", label: "Calculate", icon: "calculate" },
  { href: "/recommendation", label: "Recommendation", icon: "lightbulb" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex shrink-0">
      <aside className="hidden md:flex flex-col h-screen w-56 lg:w-64 bg-surface-container-low border-r border-border shrink-0 sticky top-0">
        <div className="h-16 px-4 lg:px-8 flex items-center border-b border-transparent">
          <Link href="/dashboard" className="flex items-center gap-2 group transition-all">
            <div className="relative w-6 h-6 group-hover:scale-110 group-hover:opacity-80 transition-all duration-200">
              <Image 
                src="/starlogo.svg" 
                alt="Gradient" 
                width={24} 
                height={24}
                className="w-full h-full object-contain dark:invert"
                sizes="24px"
              />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-on-surface uppercase group-hover:opacity-80 transition-opacity duration-200">
              Gradient
            </h1>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 pt-4 pb-8 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 rounded-lg ${
                  isActive
                    ? "text-on-surface font-semibold border-r-4 border-lime-400 bg-surface-container-high/30"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl flex items-center justify-around px-4 border-t border-border shadow-2xl z-50">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center transition-colors ${
                isActive ? "text-lime-600" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
