"use client";

import { supabase } from "@/utils/supabase/client";
import UserMenu from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

import { supabase } from "@/utils/supabase/client";
import UserMenu from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { Search, Zap, Book, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Course, Term } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AuthenticatedHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ courses: Course[]; terms: Term[] }>({ courses: [], terms: [] });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const staticActions = [
    { id: "act-dashboard", name: "Dashboard", href: "/dashboard", icon: <Zap className="w-3 h-3" /> },
    { id: "act-calc", name: "Calculator", href: "/calculate", icon: <Search className="w-3 h-3" /> },
    { id: "act-recommend", name: "AI Insights", href: "/recommendation", icon: <Zap className="w-3 h-3" /> },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchIndex = useCallback(async () => {
    if (results.courses.length > 0) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [coursesRes, termsRes] = await Promise.all([
        supabase.from("courses").select("*").eq("user_id", user.id),
        supabase.from("terms").select("*").eq("user_id", user.id)
      ]);

      setResults({
        courses: coursesRes.data || [],
        terms: (termsRes.data || []).map(t => ({
          id: t.id,
          user_id: t.user_id,
          academicYear: t.academic_year,
          semester: t.semester,
          startDate: t.start_date,
          endDate: t.end_date,
          courses: 0,
          units: 0,
          gpa: 0,
          isActive: t.is_active
        }))
      });
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [results.courses.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredActions = staticActions.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const filteredCourses = results.courses.filter(c => 
    c.course_name.toLowerCase().includes(query.toLowerCase()) || 
    c.course_code?.toLowerCase().includes(query.toLowerCase())
  );
  const filteredTerms = results.terms.filter(t => 
    t.academicYear.toLowerCase().includes(query.toLowerCase()) || 
    t.semester.toLowerCase().includes(query.toLowerCase())
  );

  const allResults = [
    ...filteredActions.map(a => ({ ...a, type: 'action' })),
    ...filteredCourses.map(c => ({ ...c, type: 'course', name: c.course_name, href: `/courses/${c.id}` })),
    ...filteredTerms.map(t => ({ ...t, type: 'term', name: `${t.semester} ${t.academicYear}`, href: `/terms` }))
  ];

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === "Enter") {
      if (allResults[selectedIndex]) handleSelect(allResults[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (!user) return null;

  const pageTitle = pathname.split("/").filter(Boolean)[0] || "Dashboard";
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
          {formattedTitle}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <div className={cn(
            "hidden md:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border transition-all w-64 focus-within:w-80",
            isOpen ? "border-primary/50 ring-2 ring-primary/10" : "border-outline-variant/20"
          )}>
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input 
              ref={inputRef}
              className="bg-transparent border-none text-xs focus:ring-0 focus:outline-none flex-1 text-on-surface ml-2" 
              placeholder="Quick search..." 
              type="text"
              value={query}
              onFocus={() => {
                setIsOpen(true);
                fetchIndex();
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
                if (!isOpen) setIsOpen(true);
              }}
              onKeyDown={onKeyDown}
            />
            {loading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-surface-container border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="max-h-80 overflow-y-auto p-1.5">
                {allResults.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">No results found</p>
                  </div>
                ) : (
                  <>
                    {/* Sections */}
                    {["action", "course", "term"].map(type => {
                      const typeResults = allResults.filter(r => r.type === type);
                      if (typeResults.length === 0) return null;

                      return (
                        <div key={type} className="mb-2 last:mb-0">
                          <h3 className="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">
                            {type === 'action' ? 'Quick Actions' : type === 'course' ? 'Courses' : 'Academic Terms'}
                          </h3>
                          {typeResults.map((item) => {
                            const globalIdx = allResults.indexOf(item);
                            return (
                              <button
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className={cn(
                                  "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left",
                                  selectedIndex === globalIdx ? "bg-primary text-on-primary" : "hover:bg-surface-container-high text-on-surface"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-6 h-6 rounded flex items-center justify-center",
                                    selectedIndex === globalIdx ? "bg-on-primary/20" : "bg-surface-container-highest"
                                  )}>
                                    {type === 'action' ? item.icon : type === 'course' ? <Book className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold block leading-tight">{item.name}</span>
                                    {type === 'course' && (
                                      <span className={cn(
                                        "text-[9px] font-bold uppercase",
                                        selectedIndex === globalIdx ? "text-on-primary/70" : "text-on-surface-variant"
                                      )}>
                                        {(item as any).course_code || 'No Code'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ArrowRight className={cn(
                                  "w-3 h-3 transition-transform",
                                  selectedIndex === globalIdx ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                                )} />
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <div className="px-3 py-2 bg-surface-container-low border-t border-outline-variant/10 flex items-center justify-between">
                <div className="flex gap-2">
                   <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter">↑↓ Navigate</span>
                   <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter">↵ Select</span>
                </div>
                <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter">ESC Close</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
