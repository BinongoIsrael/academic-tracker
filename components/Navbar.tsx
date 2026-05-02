import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(26,27,36,0.06)] border-b border-zinc-100">
      <div className="flex justify-between items-center h-16 px-8 max-w-[1440px] mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-900 uppercase hover:opacity-80 transition-opacity flex items-center gap-2">
          <Image 
            src="/starlogo.svg" 
            alt="Gradient Logo" 
            width={24} 
            height={24}
            className="w-6 h-6"
          />
          Gradient
        </Link>
        
        {!user && (
          <div className="hidden md:flex items-center space-x-8 font-['Inter'] tracking-tight text-sm font-semibold">
            <Link href="#features" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              How it Works
            </Link>
            <Link href="#about" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              About
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link href="/signin" className="px-4 py-2 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100/50">
                Sign In
              </Link>
              <Link href="/signup" className="px-5 py-2 text-sm font-bold bg-primary-container text-on-primary-container rounded hover:translate-y-[-1px] active:scale-95 transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}