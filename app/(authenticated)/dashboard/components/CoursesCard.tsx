"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoursesCardProps } from "@/types";
import AddCourseButton from "./AddCourseButton";

export default function CoursesCard({ courses = [] }: CoursesCardProps) {
  const [sortBy, setSortBy] = useState<string>("course_name-asc");
  const router = useRouter();
  const hasCourses = courses.length > 0;

  const sortedCourses = [...courses].sort((a, b) => {
    const [field, direction] = sortBy.split('-');
    const asc = direction === 'asc' ? 1 : -1;

    let aVal: any;
    let bVal: any;

    switch (field) {
      case 'course_name':
        aVal = a.course_name || "";
        bVal = b.course_name || "";
        return aVal.localeCompare(bVal) * asc;
      case 'grade':
        aVal = a.grade || 0;
        bVal = b.grade || 0;
        return (aVal - bVal) * asc;
      default:
        return 0;
    }
  });

  return (
    <div className="col-span-12 bg-surface-container-lowest p-0 rounded-xl overflow-hidden border border-outline-variant/10 shadow-[0_20px_40px_rgba(26,27,36,0.02)]">
      <div className="p-8 lg:p-10 pb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Active Curriculum</h3>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Academic Year {new Date().getFullYear()}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/courses')}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Course
          </button>
          {hasCourses && (
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 border border-outline-variant/30 rounded-lg focus:ring-2 focus:ring-primary/20 focus:outline-none text-[10px] font-bold uppercase tracking-widest bg-white cursor-pointer custom-select pr-10"
            >
                <option value="course_name-asc">Name (A-Z)</option>
                <option value="course_name-desc">Name (Z-A)</option>
                <option value="grade-desc">GPA (High-Low)</option>
                <option value="grade-asc">GPA (Low-High)</option>
            </select>
           )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="px-10 py-4 text-[10px] font-extrabold uppercase tracking-widest text-outline">Course Code</th>
              <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-outline">Description</th>
              <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-outline text-right">Grade</th>
              <th className="px-10 py-4 text-[10px] font-extrabold uppercase tracking-widest text-outline text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {!hasCourses ? (
              <tr>
                <td colSpan={4} className="px-10 py-12 text-center text-sm text-slate-500 italic">
                  No courses found for this curriculum cycle.
                </td>
              </tr>
            ) : (
              sortedCourses.map((course) => (
                <tr 
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="hover:bg-primary-container/5 transition-colors group cursor-pointer"
                >
                  <td className="px-10 py-6 text-sm font-bold text-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: course.course_color || "#3f6900" }} />
                      {course.course_code || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-slate-600 font-medium">{course.course_name}</td>
                  <td className="px-6 py-6 text-right font-bold text-zinc-900">{course.grade ? course.grade.toFixed(2) : "---"}</td>
                  <td className="px-10 py-6 text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      course.grade ? "bg-lime-100 text-lime-700" : "bg-surface-container-high text-outline"
                    }`}>
                      {course.grade ? "Completed" : "Ongoing"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-slate-50/50 border-t border-outline-variant/10 flex justify-center">
        <button 
          onClick={() => router.push('/courses')}
          className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
        >
          View All Courses
        </button>
      </div>
    </div>
  );
}