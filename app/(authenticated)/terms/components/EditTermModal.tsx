"use client";

import { useState, useEffect } from "react";
import { X, XCircle, Plus, Calendar, BookOpen, Award, AlertCircle, AlertTriangle } from "lucide-react";
import { Term, Course, EditTermModalProps } from "@/types";
import DeleteCourseModal from "../../courses/[id]/components/DeleteCourseModal";

export default function EditTermModal({
  term,
  courses,
  isOpen,
  onClose,
  onSave,
  onDeleteClick,
  onRemoveCourse,
  onAddCourse,
}: EditTermModalProps) {
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("1st");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const placeholderText = `${currentYear}-${nextYear}`;

  useEffect(() => {
    if (term) {
      setAcademicYear(term.academicYear);
      const semesterLower = term.semester.toLowerCase();
      if (semesterLower.includes("summer")) {
        setSemester("Summer");
      } else if (semesterLower.includes("1st")) {
        setSemester("1st");
      } else if (semesterLower.includes("2nd")) {
        setSemester("2nd");
      }
      setStartDate(term.startDate || "");
      setEndDate(term.endDate || "");
    }
  }, [term]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!isOpen || !term) return null;

  const handleAcademicYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const isDeleting = value.length < academicYear.length;
    value = value.replace(/[^\d-]/g, "");
    
    if (value.length <= 9) {
      if (!isDeleting && value.length === 4 && !value.includes("-")) {
        value = value + "-";
      }
      const hyphenCount = (value.match(/-/g) || []).length;
      if (hyphenCount <= 1) {
        setAcademicYear(value);
        setError(null);
      }
    }
  };

  const handleSave = async () => {
    setError(null);

    const academicYearPattern = /^\d{4}-\d{4}$/;
    if (!academicYearPattern.test(academicYear)) {
      setError(`Please enter academic year in format: YYYY-YYYY (e.g., ${placeholderText})`);
      return;
    }

    const [startYear, endYear] = academicYear.split("-").map(Number);
    
    if (endYear !== startYear + 1) {
      setError(`End year must be exactly one year after start year (e.g., ${placeholderText})`);
      return;
    }

    if (startYear >= endYear) {
      setError("Start year must be before end year");
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before or equal to end date");
      return;
    }

    setLoading(true);
    try {
      await onSave(term.id, {
        academicYear,
        semester,
        startDate: startDate || null,
        endDate: endDate || null,
      });
      onClose();
    } catch (error) {
      console.error("Error saving term:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    onDeleteClick(term);
  };

  const getSemesterDisplay = () => {
    return `${term.semester} ${term.academicYear}`;
  };

  const handleConfirmRemoveCourse = async () => {
    if (courseToDelete) {
      await onRemoveCourse(courseToDelete.id);
      setCourseToDelete(null);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[90]"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-0 mx-auto w-full max-w-2xl bg-surface-container-lowest rounded-lg shadow-2xl border border-on-surface/5 overflow-hidden z-[100]">
        <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center bg-surface">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">Edit Term Detail</h2>
            <p className="text-sm text-on-surface-variant font-medium">Update academic session parameters and dates</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-error-container/20 border border-error/10 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2">
              <span className="material-symbols-outlined text-error text-xl">error</span>
              <p className="text-sm font-medium text-error flex-1">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Term Name / Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={handleAcademicYearChange}
                maxLength={9}
                placeholder={placeholderText}
                className="w-full bg-surface-container border-none rounded p-3 text-sm focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Session Type</label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-surface-container border-none rounded p-3 text-sm focus:ring-2 focus:ring-primary font-semibold custom-select"
              >
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-surface-container border-none rounded p-3 text-sm focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-surface-container border-none rounded p-3 text-sm focus:ring-2 focus:ring-primary font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-surface-container p-4 rounded-lg text-center">
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Courses</div>
              <div className="text-2xl font-bold text-on-surface">{term.courses}</div>
            </div>
            <div className="bg-surface-container p-4 rounded-lg text-center">
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Units</div>
              <div className="text-2xl font-bold text-on-surface">{term.units.toFixed(1)}</div>
            </div>
            <div className="bg-surface-container p-4 rounded-lg text-center">
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">GPA</div>
              <div className="text-2xl font-bold text-on-surface">{term.gpa ? term.gpa.toFixed(2) : '-.--'}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Associated Courses ({courses.length})</label>
              <button
                onClick={() => onAddCourse(term.id)}
                className="flex items-center gap-1 text-primary text-xs font-bold hover:underline"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span> ADD COURSE
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between bg-surface p-3 rounded-lg border border-outline-variant/10 group">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-primary rounded-sm"></div>
                    <div>
                      <div className="text-sm font-bold text-on-surface">{course.course_name}</div>
                      <div className="text-[10px] font-medium text-on-surface-variant uppercase">{course.course_code || 'No Code'} • {course.units} Units</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveCourse(course.id)}
                    className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-md transition-colors sm:opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-primary-container/10 rounded border border-primary/10">
            <span className="material-symbols-outlined text-primary text-xl">info</span>
            <p className="text-xs text-on-primary-container font-medium">Changes to term parameters may impact academic tracking analytics across your workspace.</p>
          </div>
        </div>

        <div className="p-8 bg-surface-container-low flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="px-6 py-2.5 text-sm font-bold text-error hover:bg-error-container/20 rounded-lg transition-colors"
          >
            Delete Term
          </button>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Discard Changes
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-2.5 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Term"}
            </button>
          </div>
        </div>
      </div>
      {courseToDelete && (
        <DeleteCourseModal
          courseName={courseToDelete.course_name}
          onConfirm={handleConfirmRemoveCourse}
          onClose={() => setCourseToDelete(null)}
        />
      )}
    </>
  );
}