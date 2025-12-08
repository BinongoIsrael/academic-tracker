"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { signout } from "@/lib/auth-actions";
import { UserMenuProps } from "@/types";


export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group"
      >
        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden border-2 border-transparent group-hover:border-accent transition-colors">
          {user.user_metadata?.avatar_url ? (
            <Image 
              src={user.user_metadata.avatar_url} 
              alt={user.user_metadata?.full_name || "User"} 
              width={48} 
              height={48}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent text-slate-900 font-semibold text-lg">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-black group-hover:text-accent transition-all ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            
            <button
              onClick={() => signout()}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}