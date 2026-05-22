"use client";

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
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ courses: Course[]; terms: Term[] }>({
    courses: [],
    terms: [],
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const staticActions = [
    {
      id: "act-dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: <Zap className="w-3 h-3" />,
      keywords: ["home", "main", "dashboard"],
    },
    {
      id: "act-courses",
      name: "My Courses",
      href: "/courses",
      icon: <Book className="w-3 h-3" />,
      keywords: ["courses", "subjects", "classes"],
    },
    {
      id: "act-terms",
      name: "Academic Terms",
      href: "/terms",
      icon: <Calendar className="w-3 h-3" />,
      keywords: ["terms", "semesters", "years"],
    },
    {
      id: "act-calc",
      name: "GWA Calculator",
      href: "/calculate",
      icon: <Search className="w-3 h-3" />,
      keywords: ["calculate", "gpa", "gwa", "grades"],
    },
    {
      id: "act-recommend",
      name: "AI Recommendations",
      href: "/recommendation",
      icon: <Zap className="w-3 h-3" />,
      keywords: ["ai", "insights", "recommend", "advice"],
    },
    {
      id: "act-settings",
      name: "Settings",
      href: "/settings",
      icon: <Zap className="w-3 h-3" />,
      keywords: ["settings", "profile", "account", "avatar"],
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    let subscription: any;

    const getUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }

        subscription = supabase
          .channel(`profile:${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`
            },
            (payload) => {
              if (payload.eventType === 'DELETE') {
                setProfile(null);
              } else {
                setProfile({
                  full_name: payload.new.full_name,
                  avatar_url: payload.new.avatar_url
                });
              }
            }
          )
          .subscribe();
      }
    };

    getUserAndProfile();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const fetchIndex = useCallback(async () => {
    if (results.courses.length > 0) return;
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [coursesRes, termsRes] = await Promise.all([
        supabase.from("courses").select("*").eq("user_id", user.id),
        supabase.from("terms").select("*").eq("user_id", user.id),
      ]);

      setResults({
        courses: coursesRes.data || [],
        terms: (termsRes.data || []).map((t) => ({
          id: t.id,
          user_id: t.user_id,
          academicYear: t.academic_year,
          semester: t.semester,
          startDate: t.start_date,
          endDate: t.end_date,
          courses: 0,
          units: 0,
          gpa: 0,
          isActive: t.is_active,
        })),
      });
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [results.courses.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 1024) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredActions = staticActions.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())),
  );
  const filteredCourses = results.courses.filter(
    (c) =>
      c.course_name.toLowerCase().includes(query.toLowerCase()) ||
      c.course_code?.toLowerCase().includes(query.toLowerCase()),
  );
  const filteredTerms = results.terms.filter(
    (t) =>
      t.academicYear.toLowerCase().includes(query.toLowerCase()) ||
      t.semester.toLowerCase().includes(query.toLowerCase()),
  );

  const allResults = [
    ...filteredActions.map((a) => ({ ...a, type: "action" })),
    ...filteredCourses.map((c) => ({
      ...c,
      type: "course",
      name: c.course_name,
      href: `/courses/${c.id}`,
    })),
    ...filteredTerms.map((t) => ({
      ...t,
      type: "term",
      name: `${t.semester} ${t.academicYear}`,
      href: `/terms`,
    })),
  ];

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + allResults.length) % allResults.length,
      );
    } else if (e.key === "Enter") {
      if (allResults[selectedIndex]) handleSelect(allResults[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (!isMounted || !user) return null;

  const pageTitle = pathname.split("/").filter(Boolean)[0] || "Dashboard";
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);

  return (
    <header className="flex justify-between items-center h-16 px-4 md:px-6 lg:px-8 sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
          {formattedTitle}
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3 lg:gap-6">
        <div className="relative hidden lg:block" ref={dropdownRef}>
          <div
            className={cn(
              "flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border transition-all w-64 focus-within:w-80",
              isOpen
                ? "border-primary/50 ring-2 ring-primary/10"
                : "border-outline-variant/20",
            )}
          >
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
            {loading && (
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
            )}
          </div>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-surface-container border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="max-h-80 overflow-y-auto p-1.5">
                {renderResults()}
              </div>
              <div className="px-3 py-2 bg-surface-container-low border-t border-outline-variant/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter">
                    ↑↓ Navigate
                  </span>
                  <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter">
                    ↵ Select
                  </span>
                </div>
                <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-tighter">
                  ESC Close
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setIsOpen(true);
            fetchIndex();
          }}
          className="lg:hidden p-1.5 hover:bg-surface-container rounded-full transition-colors"
        >
          <Search className="w-5 h-5 text-on-surface-variant" />
        </button>

        {isOpen && (
          <div className="fixed top-0 bottom-0 right-0 left-0 md:left-48 z-[100] bg-surface flex flex-col lg:hidden h-[100dvh] animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4 border-b border-outline-variant/10 bg-surface shrink-0">
              <div className="flex-1 flex items-center bg-surface-container-low rounded-xl px-4 py-2.5">
                <Search className="w-5 h-5 text-on-surface-variant mr-3 shrink-0" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-on-surface placeholder:text-on-surface-variant/60 text-[16px] outline-none font-medium"
                  placeholder="Search courses, terms..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={onKeyDown}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="flex items-center justify-center p-1.5 rounded-full text-on-surface-variant hover:text-on-surface bg-surface-container-highest/50 shrink-0 ml-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors shrink-0 md:mr-2"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-xl">
                  close
                </span>
              </button>
              </div>

            <div className="flex-1 overflow-y-auto overscroll-contain bg-surface">
              <div className="px-4 py-2">{renderResults(true)}</div>
            </div>

            <div className="shrink-0 p-4 bg-surface-container-low border-t border-outline-variant/10 flex justify-center pb-safe">
              <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">
                Gradient Academic Search
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <UserMenu 
            user={{
              email: user.email,
              user_metadata: {
                full_name: profile?.full_name || user.user_metadata?.full_name,
                avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
              }
            }} 
          />
        </div>
      </div>
    </header>
  );

  function renderResults(isMobile = false) {
    if (allResults.length === 0) {
      return (
        <div className="py-12 md:py-8 text-center">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            No results found
          </p>
        </div>
      );
    }

    return (
      <>
        {["action", "course", "term"].map((type) => {
          const typeResults = allResults.filter((r) => r.type === type);
          if (typeResults.length === 0) return null;

          return (
            <div key={type} className={cn("last:mb-0", isMobile ? "mb-4" : "mb-2")}>
              <h3 className={cn(
                "px-3 font-black uppercase tracking-widest text-on-surface-variant/40",
                isMobile ? "text-[9px] mb-1" : "text-[9px] py-1"
              )}>
                {type === "action"
                  ? "Quick Actions"
                  : type === "course"
                    ? "Courses"
                    : "Academic Terms"}
              </h3>
              {typeResults.map((item: any) => {
                const globalIdx = allResults.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-xl transition-all text-left",
                      isMobile ? "px-4 py-2 mb-0.5" : "px-3 py-2 md:rounded-lg",
                      selectedIndex === globalIdx
                        ? "bg-primary text-on-primary shadow-lg"
                        : "hover:bg-surface-container-high text-on-surface",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "rounded flex items-center justify-center shrink-0",
                          isMobile ? "w-6 h-6" : "w-6 h-6",
                          selectedIndex === globalIdx
                            ? "bg-on-primary/20"
                            : "bg-surface-container-highest",
                        )}
                      >
                        {type === "action" ? (
                          item.icon
                        ) : type === "course" ? (
                          <Book className={isMobile ? "w-3 h-3" : "w-3 h-3"} />
                        ) : (
                          <Calendar className={isMobile ? "w-3 h-3" : "w-3 h-3"} />
                        )}
                      </div>
                      <div>
                        <span className={cn(
                          "font-bold block leading-tight",
                          isMobile ? "text-[13px]" : "text-xs"
                        )}>
                          {item.name}
                        </span>
                        {type === "course" && (
                          <span
                            className={cn(
                              "font-bold uppercase",
                              isMobile ? "text-[8px]" : "text-[9px]",
                              selectedIndex === globalIdx
                                ? "text-on-primary/70"
                                : "text-on-surface-variant",
                            )}
                          >
                            {item.course_code || "No Code"}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight
                      className={cn(
                        "transition-transform shrink-0",
                        isMobile ? "w-3 h-3" : "w-3 h-3",
                        selectedIndex === globalIdx
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
      </>
    );
  }
}
