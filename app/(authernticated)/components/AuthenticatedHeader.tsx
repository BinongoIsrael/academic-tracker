"use client";

import { supabase } from "@/utils/supabase/client";
import UserMenu from "@/components/UserMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function AuthenticatedHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  if (!user) return null;

  // Derive page title from pathname
  const pageTitle = pathname.split("/").filter(Boolean)[0] || "Dashboard";
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-zinc-900 uppercase tracking-tighter">
          {formattedTitle}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/20 focus-within:ring-0 focus-within:border-primary/30 transition-all">
          <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
          <input 
            className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none w-48 text-on-surface ml-2" 
            placeholder="Search dashboard..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-4">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
