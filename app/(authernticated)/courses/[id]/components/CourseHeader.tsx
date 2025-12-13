import { ArrowLeft, Settings, Edit, ListChecks } from "lucide-react";
import { Course, CourseHeaderProps } from "@/types";

export default function CourseHeader({
  course,
  courseColor,
  onBack,
  onGradingScaleClick,
  onEditClick,
}: CourseHeaderProps) {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Courses
      </button>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: courseColor }}
              />
              <h1 className="text-[48px] font-bold leading-[48px] tracking-[-0.012em]">
                {course.course_name}
              </h1>
            </div>
            <p className="text-lg text-slate-600 mt-2">
              {course.term?.academicYear} {course.term?.semester} •{" "}
              {course.units} units • {course.course_type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="w-5 h-5" />
            Edit Course
          </button>
          <button
            onClick={onGradingScaleClick}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Grading Scale
          </button>
        </div>
      </div>
    </div>
  );
}
