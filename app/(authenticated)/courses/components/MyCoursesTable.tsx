"use client";

import { MyCoursesTableProps } from "@/types";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function MyCoursesTable({ courses }: MyCoursesTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedView = localStorage.getItem("coursesViewMode");
    if (savedView === "list" || savedView === "grid") {
      setViewMode(savedView);
    }
    setIsMounted(true);
  }, []);

  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("coursesViewMode", mode);
  };

  if (!isMounted) {
    return <div className="min-h-[400px]" />;
  }

  const averageGPA = courses.filter(c => c.grade && c.grade > 0).length > 0
    ? courses.filter(c => c.grade && c.grade > 0).reduce((sum, c) => sum + (c.grade || 0), 0) / courses.filter(c => c.grade && c.grade > 0).length
    : 0;
  
  const totalUnits = courses.reduce((sum, c) => sum + (c.units || 0), 0);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (!sortField) return 0;

    let aVal: any;
    let bVal: any;

    if (sortField === "course_name") {
      aVal = a.course_name;
      bVal = b.course_name;
    } else if (sortField === "terms") {
      aVal = a.term ? `${a.term.academicYear} ${a.term.semester}` : "";
      bVal = b.term ? `${b.term.academicYear} ${b.term.semester}` : "";
    } else if (sortField === "units") {
      aVal = a.units;
      bVal = b.units;
    } else if (sortField === "gpa") {
      aVal = a.grade || 0;
      bVal = b.grade || 0;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Academic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary-container p-6 rounded-lg relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-primary opacity-10 text-7xl rotate-12 group-hover:scale-125 transition-transform duration-500">trending_up</span>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-on-primary-container/60 mb-1">Average GPA</p>
            <h4 className="text-4xl font-black text-on-primary-container">{averageGPA.toFixed(2)}</h4>
          </div>
        </div>
        <div className="bg-brand-dark p-6 rounded-lg relative overflow-hidden group shadow-lg">
          <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-white opacity-10 text-7xl rotate-12 group-hover:scale-125 transition-transform duration-500">analytics</span>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-white/60 mb-1">Total Units</p>
            <h4 className="text-4xl font-black text-white">{totalUnits.toFixed(1)}</h4>
          </div>
        </div>
        <div className="bg-surface-container-high p-6 rounded-lg border border-outline-variant/10">
          <p className="text-[10px] font-black uppercase text-on-surface-variant mb-1">Total Courses</p>
          <h4 className="text-4xl font-black text-on-surface">{courses.length.toString().padStart(2, '0')}</h4>
        </div>
        <div className="bg-surface-container-high p-6 rounded-lg border border-outline-variant/10">
          <p className="text-[10px] font-black uppercase text-on-surface-variant mb-1">Completed</p>
          <h4 className="text-4xl font-black text-on-surface">{courses.filter(c => c.grade !== null).length.toString().padStart(2, '0')}</h4>
        </div>
      </div>

      {/* My Courses Portfolio */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-on-surface">Course Portfolio</h3>
          <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg">
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-2 rounded flex items-center gap-2 transition-all ${viewMode === "list" ? "bg-surface shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-xl">view_list</span>
              <span className="text-xs font-bold uppercase tracking-tighter">List</span>
            </button>
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`p-2 rounded flex items-center gap-2 transition-all ${viewMode === "grid" ? "bg-surface shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              <span className="material-symbols-outlined text-xl">grid_view</span>
              <span className="text-xs font-bold uppercase tracking-tighter">Grid</span>
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="bg-surface-container-low rounded-lg overflow-hidden border border-outline-variant/10 shadow-[0_4px_20px_rgba(26,27,36,0.06)]">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/50 border-b border-outline-variant/10">
                  <tr>
                    <th className="px-6 py-4">
                      <button onClick={() => handleSort("course_name")} className="text-[10px] font-black uppercase text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
                        Course & Identity
                        <span className="material-symbols-outlined text-xs">unfold_more</span>
                      </button>
                    </th>
                    <th className="px-6 py-4">
                      <button onClick={() => handleSort("terms")} className="text-[10px] font-black uppercase text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
                        Academic Term
                        <span className="material-symbols-outlined text-xs">unfold_more</span>
                      </button>
                    </th>
                    <th className="px-6 py-4">
                      <button onClick={() => handleSort("units")} className="text-[10px] font-black uppercase text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
                        Units
                        <span className="material-symbols-outlined text-xs">unfold_more</span>
                      </button>
                    </th>
                    <th className="px-6 py-4">
                      <button onClick={() => handleSort("gpa")} className="text-[10px] font-black uppercase text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
                        GPA
                        <span className="material-symbols-outlined text-xs">unfold_more</span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {sortedCourses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-on-surface-variant bg-surface">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20 block">library_books</span>
                        <p className="font-medium">No courses in your portfolio yet</p>
                      </td>
                    </tr>
                  ) : (
                    sortedCourses.map((course) => (
                      <tr
                        key={course.id}
                        onClick={() => router.push(`/courses/${course.id}`)}
                        className="hover:bg-surface transition-colors cursor-pointer group bg-surface/30"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: course.course_color || '#3B82F6' }}></div>
                            <div>
                              <div className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{course.course_name}</div>
                              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{course.course_code || 'COURSE UNIT'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-on-surface-variant uppercase">
                            {course.term ? `${course.term.academicYear} • ${course.term.semester}` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-on-surface">{course.units.toFixed(1)}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-primary">{course.grade ? course.grade.toFixed(2) : '-.--'}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile List View */}
            <div className="md:hidden divide-y divide-outline-variant/10 bg-surface">
              {sortedCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="p-4 hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 rounded-full" style={{ backgroundColor: course.course_color || '#3B82F6' }}></div>
                      <div>
                        <div className="font-bold text-sm text-on-surface">{course.course_name}</div>
                        <div className="text-[10px] font-bold text-on-surface-variant uppercase">{course.term?.semester} {course.term?.academicYear}</div>
                      </div>
                    </div>
                    <div className="text-right font-black text-primary text-sm">{course.grade ? course.grade.toFixed(2) : '-.--'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-surface-container-low rounded-lg border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-5xl mb-4 opacity-20 block">folder_open</span>
                <p className="font-bold text-on-surface-variant">Empty Portfolio</p>
              </div>
            ) : (
              sortedCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="group bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/10 hover:border-primary/40 transition-all cursor-pointer hover:shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: course.course_color || '#3B82F6' }}></div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-1">{course.course_name}</h4>
                      <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest">{course.course_code || 'ACADEMIC MODULE'}</p>
                    </div>
                    <div className="bg-primary-container text-on-primary-container p-2 rounded-md font-black text-sm">
                      {course.grade ? course.grade.toFixed(2) : '-.--'}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">event</span>
                      {course.term?.semester} {course.term?.academicYear}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">layers</span>
                      {course.units.toFixed(1)} Units
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-on-surface-variant">View Workspace</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}