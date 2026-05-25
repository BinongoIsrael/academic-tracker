"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoursesCardProps } from "@/types";
import AddCourseButton from "./AddCourseButton";

interface ExtendedCoursesCardProps extends CoursesCardProps {
  onAddCourse: () => void;
}

export default function CoursesCard({ courses = [], onAddCourse, activeTermName }: ExtendedCoursesCardProps) {
  const [sortBy, setSortBy] = useState<string>("course_name-asc");
  const router = useRouter();
  const hasCourses = courses.length > 0;

  const sortedCourses = [...courses].sort((a, b) => {
    // ... rest of sort logic ...
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
      <div className="p-5 sm:p-8 lg:p-10 pb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-on-surface tracking-tight">Active Curriculum</h3>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest font-semibold">{activeTermName || "All Terms"}</p>
        </div>
        <div className="flex items-center">
          <AddCourseButton onClick={onAddCourse} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low/50">
            <tr>
              <th className="px-6 sm:px-10 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/70">Course Code</th>
              <th className="px-4 sm:px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/70">Description</th>
              <th className="px-4 sm:px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 text-right">Grade</th>
              <th className="px-6 sm:px-10 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {!hasCourses ? (
              <tr>
                <td colSpan={4} className="px-6 sm:px-10 py-12 text-center text-sm text-on-surface-variant italic">
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
                  <td className="px-6 sm:px-10 py-5 sm:py-6 text-sm font-bold text-on-surface">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: course.course_color || "#3f6900" }} />
                      {course.course_code || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-5 sm:py-6 text-sm text-on-surface-variant font-medium">{course.course_name}</td>
                  <td className="px-4 sm:px-6 py-5 sm:py-6 text-right font-bold text-on-surface">{course.grade ? course.grade.toFixed(2) : "---"}</td>
                  <td className="px-6 sm:px-10 py-5 sm:py-6 text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      course.grade ? "bg-primary/10 text-primary" : "bg-surface-container-high text-on-surface-variant"
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
      
      <div className="p-6 bg-surface-container-low/50 border-t border-outline-variant/10 flex justify-center">
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
