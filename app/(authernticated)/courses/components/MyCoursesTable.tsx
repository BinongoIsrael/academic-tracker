"use client";

import { MyCoursesTableProps } from "@/types";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MyCoursesTable({ courses }: MyCoursesTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    <div className="bg-white border border-black rounded-[45px] shadow-[0_5px_0_0_#191A23] p-8">
      <h2 className="text-[30px] font-medium mb-6">My Courses</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort("course_name")}
                  className="flex items-center gap-2 font-bold text-base hover:text-brand-green transition-colors"
                >
                  Course Name
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      sortField === "course_name" && sortDirection === "desc"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>
              </th>
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort("terms")}
                  className="flex items-center gap-2 font-bold text-base hover:text-brand-green transition-colors"
                >
                  Terms
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      sortField === "terms" && sortDirection === "desc"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>
              </th>
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort("units")}
                  className="flex items-center gap-2 font-bold text-base hover:text-brand-green transition-colors"
                >
                  Units
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      sortField === "units" && sortDirection === "desc"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>
              </th>
              <th className="text-left py-4 px-4">
                <button
                  onClick={() => handleSort("gpa")}
                  className="flex items-center gap-2 font-bold text-base hover:text-brand-green transition-colors"
                >
                  GPA
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      sortField === "gpa" && sortDirection === "desc"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCourses.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No courses yet. Create your first course above.
                </td>
              </tr>
            ) : (
              sortedCourses.map((course) => {
                const courseColor = course.course_color || "#3B82F6";

                return (
                  <tr
                    key={course.id}
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 text-white rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ backgroundColor: courseColor }}
                        ></div>
                        <span className="font-bold text-sm text-slate-900">
                          {course.course_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {course.term
                        ? `${course.term.academicYear} ${course.term.semester}`
                        : "N/A"}
                    </td>
                    <td className="py-4 px-4 font-bold text-sm">
                      {course.units.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 font-bold text-sm">
                      {course.grade ? course.grade.toFixed(2) : "-.--"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
