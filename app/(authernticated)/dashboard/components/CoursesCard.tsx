import { CoursesCardProps } from "@/types";
import AddCourseButton from "./AddCourseButton";

export default function CoursesCard({ courses = [], onAddCourse }: CoursesCardProps) {
  const hasCourses = courses.length > 0;

  return (
    <div className="w-full lg:w-[1006px] bg-white border-2 border-black rounded-[45px] shadow-brand p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-9">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
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

          <div>
            <h3 className="text-xl sm:text-2xl lg:text-[30px] leading-tight lg:leading-[38px] font-medium text-black mb-1">
              Courses
            </h3>
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed font-medium text-gray-subtle">
              Add and monitor your grades in each course
            </p>
          </div>
        </div>

        <div className="sm:mt-1">
          <AddCourseButton onClick={onAddCourse} />
        </div>
      </div>

      {hasCourses ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="w-full min-h-[80px] sm:h-[101px] border border-black bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-0 gap-2 sm:gap-0"
            >
              <span className="text-lg sm:text-xl lg:text-2xl font-medium text-black">
                {course.name}
              </span>
              {course.grade && (
                <span className="text-2xl sm:text-3xl font-semibold text-slate-900">
                  {course.grade.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full min-h-[80px] sm:h-[101px] border border-black bg-white flex items-center justify-center px-4 py-4">
          <p className="text-lg sm:text-xl lg:text-[30px] leading-tight lg:leading-[38px] font-medium text-black text-center">
            You currently have no courses added
          </p>
        </div>
      )}
    </div>
  );
}