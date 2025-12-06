import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-22 bg-white shadow-sm border-b border-gray-200 px-4 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full py-5">
        <Link href="/" className="flex items-center gap-1 text-3xl md:text-4xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          <Image 
            src="/starlogo.svg" 
            alt="Gradient Logo" 
            width={40} 
            height={40}
            quality={100}
            priority
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <span className="sm:inline">Gradient</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="#features"
            className="px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-md transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-md transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#about"
            className="px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-md transition-colors"
          >
            About
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="px-3 md:px-4 py-2 text-sm font-medium bg-brand-green rounded-md hover:bg-brand-green-dark transition-colors underline"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-block px-3 md:px-4 py-2 text-sm font-medium bg-white border border-gray-400 rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}