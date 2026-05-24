"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(26,27,36,0.06)] border-b border-border">
      {mounted ? (
        <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-[1440px] mx-auto animate-in fade-in duration-500">
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tighter text-on-surface uppercase hover:opacity-80 transition-opacity flex items-center gap-2">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <Image 
                src="/starlogo.svg" 
                alt="Gradient Logo" 
                fill
                className="object-contain dark:invert"
                sizes="24px"
              />
            </div>
            <span className="hidden xs:inline">Gradient</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 font-['Inter'] tracking-tight text-sm font-semibold">
            <Link href="#features" className="text-on-surface-variant hover:text-on-surface transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-on-surface-variant hover:text-on-surface transition-colors">
              How it Works
            </Link>
            <Link href="#about" className="text-on-surface-variant hover:text-on-surface transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <Link href="/signin" className="px-3 sm:px-4 py-2 text-[10px] sm:text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high/50 rounded-lg">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-3 xs:px-4 sm:px-5 py-2 text-[10px] sm:text-sm font-bold bg-primary-container text-on-primary-container rounded hover:translate-y-[-1px] active:scale-95 transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-16" />
      )}
    </nav>
  );
}
