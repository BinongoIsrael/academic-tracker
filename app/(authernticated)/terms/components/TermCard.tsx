"use client";

import { TermCardProps } from "@/types";
import { Bookmark, Edit2, Plus } from "lucide-react";

export default function TermCard({ term, onEdit, onAddCourse }: TermCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSemesterDisplay = () => {
    const semesterLower = term.semester.toLowerCase();
    if (semesterLower.includes("summer")) {
      return `Summer (${term.academicYear})`;
    }
    return `${term.semester} Semester (${term.academicYear})`;
  };

  if (term.isActive) {
    return (
      <div className="bg-brand-green rounded-2xl border-2 border-black p-5 sm:p-6 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Bookmark
              className="w-6 h-6 text-black flex-shrink-0 mt-0.5"
              fill="currentColor"
            />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-black mb-1">
                {getSemesterDisplay()}
              </h3>
              <span className="inline-block px-2 py-0.5 bg-black text-brand-green text-xs font-semibold rounded">
                ACTIVE
              </span>
            </div>
          </div>
          <button
            onClick={() => onEdit(term.id)}
            className="flex-shrink-0 p-2 hover:bg-green-light rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5 text-black" />
          </button>
        </div>

        {(term.startDate || term.endDate) && (
          <div className="mb-5 pb-4 border-b-2 border-black/10">
            <p className="text-sm text-black/70 font-medium">
              {term.startDate && (
                <>
                  <span className="font-semibold text-black">Start:</span>{" "}
                  {formatDate(term.startDate)}
                </>
              )}
              {term.startDate && term.endDate && <span className="mx-2">•</span>}
              {term.endDate && (
                <>
                  <span className="font-semibold text-black">End:</span>{" "}
                  {formatDate(term.endDate)}
                </>
              )}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 mb-5">
          <div className="text-center">
            <p className="text-xs sm:text-sm font-bold text-black/70 uppercase tracking-wider mb-1">
              Courses
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-black">
              {term.courses}
            </p>
          </div>
          <div className="text-center border-x-2 border-black/10">
            <p className="text-xs sm:text-sm font-bold text-black/70 uppercase tracking-wider mb-1">
              Units
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-black">
              {term.units.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm font-bold text-black/70 uppercase tracking-wider mb-1">
              Current GPA
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-black">
              {term.gpa ? term.gpa.toFixed(2) : "-.--"}
            </p>
          </div>
        </div>

        {onAddCourse && (
          <button
            onClick={() => onAddCourse(term.id)}
            className="w-full flex items-center justify-center gap-2 h-12 bg-brand-dark text-white rounded-xl font-semibold text-sm hover:bg-opacity-90 transition-all hover:shadow-[0_2px_0_0_rgba(0,0,0,0.3)]"
          >
            <Plus className="w-5 h-5" />
            <span>Add Course to Term</span>
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 rounded-2xl border-2 border-gray-300 p-5 sm:p-6 hover:border-gray-400 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <Bookmark className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-black mb-1">
              {getSemesterDisplay()}
            </h3>
            {(term.startDate || term.endDate) && (
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {term.startDate && formatDate(term.startDate)}
                {term.startDate && term.endDate && " - "}
                {term.endDate && formatDate(term.endDate)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              GPA
            </p>
            <p className="text-2xl font-bold text-black">
              {term.gpa?.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => onEdit(term.id)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-3 border-t border-gray-300">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Courses:
          </span>
          <span className="text-xl font-bold text-black">{term.courses}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Units:
          </span>
          <span className="text-xl font-bold text-black">
            {term.units.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}