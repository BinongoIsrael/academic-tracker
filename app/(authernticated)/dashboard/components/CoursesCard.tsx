"use client";

import { useState } from "react";
import { CoursesCardProps } from "@/types";
import AddCourseButton from "./AddCourseButton";

const vibrantColors = [
  "bg-blue-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-red-400",
  "bg-indigo-400",
  "bg-teal-400",
  "bg-cyan-400",
];

export default function CoursesCard({ courses = [], onAddCourse }: CoursesCardProps) {
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "grade-asc" | "grade-desc">("name-asc");
  
  const hasCourses = courses.length > 0;

  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.course_name.localeCompare(b.course_name);
      case "name-desc":
        return b.course_name.localeCompare(a.course_name);
      case "grade-asc":
        return (a.grade || 0) - (b.grade || 0);
      case "grade-desc":
        return (b.grade || 0) - (a.grade || 0);
      default:
        return 0;
    }
  });

  const getColorForCourse = (courseId: string) => {
    const index = parseInt(courseId) % vibrantColors.length;
    return vibrantColors[index];
  };

  return (
    <div className="w-full max-w-full lg:w-[1006px] bg-white border-2 border-black rounded-3xl sm:rounded-[45px] shadow-brand p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Title and Icon */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl lg:text-[30px] leading-tight font-medium text-black mb-1 break-words">
              Courses
            </h3>
            <p className="text-sm sm:text-base lg:text-xl leading-relaxed font-medium text-gray-subtle break-words">
              Add and monitor your grades in each course
            </p>
          </div>
        </div>

        {/* Add Course Button */}
        <div className="w-full sm:w-auto sm:self-end sm:-mt-16">
          <AddCourseButton onClick={onAddCourse} />
        </div>
      </div>

      {/* Sort Dropdown */}
      {hasCourses && (
        <div className="mb-4 sm:mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full sm:w-auto h-10 sm:h-12 px-3 sm:px-4 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-brand-green focus:outline-none text-xs sm:text-sm bg-white cursor-pointer"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="grade-asc">GPA (Low to High)</option>
            <option value="grade-desc">GPA (High to Low)</option>
          </select>
        </div>
      )}

      {/* Courses List */}
      {hasCourses ? (
        <div className="space-y-3 sm:space-y-4">
          {sortedCourses.map((course) => (
            <div
              key={course.id}
              className="w-full min-h-[70px] sm:min-h-[80px] lg:h-[101px] border-2 border-black bg-white rounded-lg sm:rounded-xl flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-0 gap-3 hover:shadow-[0_3px_0_#191A23] transition-shadow"
            >
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 rounded-full flex-shrink-0 ${getColorForCourse(course.id)}`}></div>
                
                <span className="text-sm sm:text-base lg:text-2xl font-medium text-black break-words line-clamp-2">
                  {course.course_name}
                </span>
              </div>
              
              {course.grade && (
                <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 flex-shrink-0">
                  {course.grade.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full min-h-[100px] sm:min-h-[80px] lg:h-[101px] border border-black bg-white rounded-lg sm:rounded-xl flex items-center justify-center px-4 py-4">
          <p className="text-base sm:text-lg lg:text-[30px] leading-tight lg:leading-[38px] font-medium text-black text-center">
            You currently have no courses added
          </p>
        </div>
      )}
    </div>
  );
}