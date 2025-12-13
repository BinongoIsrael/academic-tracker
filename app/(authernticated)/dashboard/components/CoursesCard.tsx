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
    <div className="w-full bg-white border-2 border-black rounded-[45px] shadow-[0_5px_0_0_#191A23] p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-[30px] font-medium mb-4 sm:mb-0">
          My Courses
        </h2>
        <div className="flex gap-4">
           <AddCourseButton onClick={() => router.push('/courses')} />
           {hasCourses && (
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-brand-green focus:outline-none text-sm bg-white cursor-pointer"
            >
                <option value="course_name-asc">Name (A-Z)</option>
                <option value="course_name-desc">Name (Z-A)</option>
                <option value="grade-desc">GPA (High-Low)</option>
                <option value="grade-asc">GPA (Low-High)</option>
            </select>
           )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden space-y-4">
        {!hasCourses ? (
          <div className="text-center py-8 text-gray-500">
            You currently have no courses added.
          </div>
        ) : (
          sortedCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => router.push(`/courses/${course.id}`)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: course.course_color || "#3B82F6" }}
                  ></div>
                  <span className="font-bold text-base text-slate-900">
                    {course.course_name}
                  </span>
                </div>
                <span className="font-bold text-base text-slate-900 ml-2">
                  {course.grade ? course.grade.toFixed(2) : "-.--"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-4 px-4 font-bold text-base">Course Name</th>
              <th className="text-left py-4 px-4 font-bold text-base">GPA</th>
            </tr>
          </thead>
          <tbody>
            {!hasCourses ? (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-500">
                  You currently have no courses added.
                </td>
              </tr>
            ) : (
              sortedCourses.map((course) => (
                <tr
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.course_color || "#3B82F6" }}
                      ></div>
                      <span className="font-bold text-sm text-slate-900">
                        {course.course_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-sm">
                    {course.grade ? course.grade.toFixed(2) : "-.--"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}