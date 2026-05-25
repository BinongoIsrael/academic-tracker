"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { UserMenuProps } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";


export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsOpen(false);
    

    await supabase.auth.signOut();
    
    router.push("/");
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30 group-hover:border-primary transition-colors relative">
          {user.user_metadata?.avatar_url ? (
            <Image 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.full_name || "User"} 
              fill
              className="object-cover"
              sizes="32px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-lg">account_circle</span>
            </div>
          )}
        </div>
        <span className={`material-symbols-outlined text-zinc-400 group-hover:text-primary transition-all text-lg ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-3 w-64 bg-surface border border-outline-variant/20 rounded-xl shadow-[0_20px_40px_rgba(26,27,36,0.08)] z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-outline-variant/10">
              <p className="text-sm font-bold text-on-surface truncate">
                {user.user_metadata?.full_name || "Student"}
              </p>
              <p className="text-xs text-on-surface-variant truncate mt-0.5">{user.email}</p>
            </div>
            
            <div className="py-2">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-symbols-outlined text-lg text-on-surface-variant/60">settings</span>
                Profile Settings
              </Link>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}