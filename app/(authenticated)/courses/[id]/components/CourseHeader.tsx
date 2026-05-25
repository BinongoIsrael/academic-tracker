import { Course, CourseHeaderProps } from "@/types";

export default function CourseHeader({
  course,
  courseColor,
  onBack,
  onGradingScaleClick,
  onEditClick,
  isReadOnly,
}: CourseHeaderProps) {
  return (
    <header className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-xs uppercase tracking-tighter transition-all group"
        >
          <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Return to Portfolio
        </button>
        {!isReadOnly && (
          <div className="flex items-center gap-3">
              <button
                  onClick={onEditClick}
                  className="p-2.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-all text-on-surface shadow-sm active:scale-95"
                  title="Edit Course Configuration"
              >
                  <span className="material-symbols-outlined text-xl">edit</span>
              </button>
              <button
                  onClick={onGradingScaleClick}
                  className="p-2.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-all text-on-surface shadow-sm active:scale-95"
                  title="Configure Grading Metrics"
              >
                  <span className="material-symbols-outlined text-xl">settings</span>
              </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant/20">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: courseColor }}></div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-none">
                    {course.course_name}
                </h1>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-on-surface-variant font-bold uppercase tracking-widest text-[10px] pl-4">
                <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">fingerprint</span>
                    {course.course_code || 'UNCODED MODULE'}
                </span>
                <span className="w-1 h-1 bg-outline-variant/40 rounded-full hidden md:block"></span>
                <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs">event_note</span>
                    {course.term?.semester} {course.term?.academicYear}
                </span>
                <span className="w-1 h-1 bg-outline-variant/40 rounded-full hidden md:block"></span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-surface-container-high rounded text-on-surface">
                    {course.course_type || 'ACADEMIC'}
                </span>
            </div>
        </div>
      </div>
    </header>
  );
}
