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
        setSemester("summer");
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
    value = value.replace(/[^\d-]/g, "");
    
    if (value.length <= 9) {
      if (value.length === 4 && !value.includes("-")) {
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
    const semesterLower = term.semester.toLowerCase();
    if (semesterLower.includes("summer")) {
      return `Summer (${term.academicYear})`;
    }
    return `${term.semester} Semester (${term.academicYear})`;
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-x-4 top-4 bottom-4 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:inset-x-0 w-auto sm:w-full sm:max-w-[680px] sm:max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-300 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50">
        <div className="sticky top-0 bg-gradient-to-r from-gray-200 to-gray-200 border-b border-gray-200 p-4 sm:p-6 z-10 rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-black mb-1 truncate">Edit Term</h2>
                <p className="text-xs sm:text-sm font-medium text-black/70 break-words">
                  {getSemesterDisplay()}
                  {term.isActive && (
                    <span className="ml-2 inline-block px-2 py-0.5 bg-black text-brand-green text-xs font-bold rounded">
                      ACTIVE
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/10 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 animate-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-red-800 break-words">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Term Details
            </h3>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-900">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={handleAcademicYearChange}
                maxLength={9}
                placeholder={placeholderText}
                className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-gray-900">
                Semester <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {["1st", "2nd", "summer"].map((value) => (
                  <label key={value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="semester"
                      value={value}
                      checked={semester === value}
                      onChange={(e) => setSemester(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className={`h-10 sm:h-11 flex items-center justify-center border rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      semester === value
                        ? "bg-brand-green border-brand-green text-black"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}>
                      {value === "1st" && <span className="hidden sm:inline">1st Semester</span>}
                      {value === "1st" && <span className="sm:hidden">1st</span>}
                      {value === "2nd" && <span className="hidden sm:inline">2nd Semester</span>}
                      {value === "2nd" && <span className="sm:hidden">2nd</span>}
                      {value === "summer" && "Summer"}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-900">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-900">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-200">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5 sm:mb-1">
                Courses
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{term.courses}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-200">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5 sm:mb-1">
                Units
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{term.units.toFixed(1)}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 text-center border border-gray-200">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mx-auto mb-1 sm:mb-2" />
              <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wider mb-0.5 sm:mb-1">
                GPA
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {term.gpa ? term.gpa.toFixed(2) : "-.--"}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
              <h3 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                Courses in this Term ({courses.length})
              </h3>
              <button
                onClick={() => onAddCourse(term.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-green rounded-lg text-xs sm:text-sm font-bold hover:bg-green-light transition-colors shadow-sm hover:shadow-md w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>
            <div className="space-y-2 max-h-[150px] sm:max-h-[200px] overflow-y-auto">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2 sm:p-3 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-brand-green rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {course.course_name}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveCourse(course.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
                      title="Remove course"
                    >
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                  <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    No courses added yet
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    Click &quot;Add Course&quot; to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-6 rounded-b-2xl">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-red-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete Term
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-brand-green text-black rounded-lg text-xs sm:text-sm font-bold hover:bg-green-light transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
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