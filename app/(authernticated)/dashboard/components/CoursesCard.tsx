import { CoursesCardProps } from "@/types";
import AddCourseButton from "./AddCourseButton";

export default function CoursesCard({ courses = [], onAddCourse }: CoursesCardProps) {
  const hasCourses = courses.length > 0;

  return (
    <div className="w-[1006px] bg-white border-2 border-black rounded-[45px] shadow-brand p-6">
      <div className="flex items-start justify-between mb-9">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg
              width="42"
              height="42"
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
            <h3 className="text-card-label text-black mb-1">
              Courses
            </h3>
            <p className="text-card-description text-gray-subtle">
              Add and monitor your grades in each course
            </p>
          </div>
        </div>

        <div className="mt-1">
          <AddCourseButton onClick={onAddCourse} />
        </div>
      </div>

      {hasCourses ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="w-full h-[101px] border border-black bg-white flex items-center justify-between px-8"
            >
              <span className="text-dashboard-subtitle text-black">
                {course.name}
              </span>
              {course.grade && (
                <span className="text-4xl font-semibold text-slate-900">
                  {course.grade.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-[101px] border border-black bg-white flex items-center justify-center">
          <p className="text-empty-state text-black">
            You currently have no courses added
          </p>
        </div>
      )}
    </div>
  );
}