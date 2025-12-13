import { ArrowLeft, Settings, Edit } from "lucide-react";
import { Course, CourseHeaderProps } from "@/types";

export default function CourseHeader({
  course,
  courseColor,
  onBack,
  onGradingScaleClick,
  onEditClick,
}: CourseHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Courses
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1">
          <div
            className="w-4 h-4 rounded-full flex-shrink-0 mt-2 sm:mt-3"
            style={{ backgroundColor: courseColor }}
          />
          <div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-[48px] font-bold leading-tight tracking-[-0.012em]">
              {course.course_name}
            </h1>
            <p className="text-xs xs:text-sm sm:text-lg text-slate-600 mt-1 sm:mt-2">
              {course.term?.academicYear} {course.term?.semester} •{" "}
              {course.units} units • {course.course_type}
            </p>
          </div>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onEditClick}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-black rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <Edit className="w-5 h-5" />
            <span className="xs:inline">Edit Course</span>
          </button>
          <button
            onClick={onGradingScaleClick}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-black rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <Settings className="w-5 h-5" />
            <span className="xs:inline">Grading Scale</span>
          </button>
        </div>
      </div>
    </div>
  );
}
