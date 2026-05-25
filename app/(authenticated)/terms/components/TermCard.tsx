"use client";

import { TermCardProps } from "@/types";
import { Bookmark, Edit2, Plus } from "lucide-react";

export default function TermCard({ term, onEdit, onAddCourse }: TermCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSemesterDisplay = () => {
    return `${term.semester} ${term.academicYear}`;
  };

  const isUpcoming = (term as any).isUpcoming;
  const isPast = (term as any).isPast;
  const isUnscheduled = (term as any).isUnscheduled;

  if (isPast) {
    return (
      <div className="bg-surface-dim/20 p-6 rounded-xl border border-outline-variant/10 grayscale">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-on-surface">{getSemesterDisplay()}</h3>
          <span className="material-symbols-outlined text-on-surface-variant">archive</span>
        </div>
        <p className="text-xs text-on-surface-variant font-bold mb-4 uppercase tracking-wider">
          Completed {term.endDate ? new Date(term.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
        </p>
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-sm">bar_chart</span>
          <span className="text-xs font-semibold">Final GPA: {term.gpa ? term.gpa.toFixed(2) : '-.--'}</span>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
          <button
            onClick={() => onEdit(term.id)}
            className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Edit Details <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
      </div>
    );
  }

  if (isUnscheduled) {
    return (
      <div className="group bg-surface-container-lowest p-6 rounded-xl border border-dashed border-outline-variant hover:border-primary/40 transition-all">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-on-surface mb-1">{getSemesterDisplay()}</h3>
            <p className="text-sm text-on-surface-variant font-medium">Draft Session</p>
          </div>
          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tight">UNSCHEDULED</span>
        </div>
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-on-surface-variant/60">
            <span className="material-symbols-outlined text-lg">calendar_clock</span>
            <span className="text-sm font-medium italic">Dates not yet finalized</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">inventory_2</span>
            <span className="text-sm font-semibold">{term.courses} Courses Added</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onEdit(term.id)}
              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              Set Dates <span className="material-symbols-outlined text-sm">schedule</span>
            </button>
          </div>
          {onAddCourse && (
            <button
              onClick={() => onAddCourse(term.id)}
              className="w-full mt-2 bg-surface-container-high text-on-surface-variant py-2 rounded-lg font-bold text-xs hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Course
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isUpcoming) {
    return (
      <div className="group bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 hover:shadow-lg transition-all opacity-80 hover:opacity-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-on-surface mb-1">{getSemesterDisplay()}</h3>
            <p className="text-sm text-on-surface-variant font-medium">Upcoming Academic Session</p>
          </div>
          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded text-[10px] font-bold uppercase">UPCOMING</span>
        </div>
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">event_upcoming</span>
            <span className="text-sm font-semibold">
              {formatDate(term.startDate)} — {formatDate(term.endDate)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
          <button
            onClick={() => onEdit(term.id)}
            className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Edit Details <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-surface-container-low p-6 rounded-xl border border-outline-variant/20 hover:border-primary/40 transition-all hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-on-surface mb-1">{getSemesterDisplay()}</h3>
          <p className="text-sm text-on-surface-variant font-medium">Academic Session</p>
        </div>
        <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded text-[10px] font-bold uppercase">ACTIVE</span>
      </div>
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">calendar_today</span>
          <span className="text-sm font-semibold">
            {formatDate(term.startDate)} — {formatDate(term.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">inventory_2</span>
          <span className="text-sm font-semibold">{term.courses} Active Courses</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant text-lg">calculate</span>
          <span className="text-sm font-semibold">GPA: {term.gpa ? term.gpa.toFixed(2) : '-.--'}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[...Array(Math.min(term.courses, 3))].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-container-low bg-primary-container flex items-center justify-center text-[8px] font-bold">
                {term.courses > 3 && i === 2 ? `+${term.courses - 2}` : ''}
              </div>
            ))}
          </div>
          <button
            onClick={() => onEdit(term.id)}
            className="text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Edit Details <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
        {onAddCourse && (
          <button
            onClick={() => onAddCourse(term.id)}
            className="w-full mt-2 bg-brand-dark text-white py-2 rounded-lg font-bold text-xs hover:shadow-brand transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Course
          </button>
        )}
      </div>
    </div>
  );
}