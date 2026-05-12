import { CourseAssessmentSectionProps } from "@/types";

export default function CourseAssessmentSection({
  title,
  assessments,
  onUpdate,
  onRemove,
  addButton,
  expectedTotal = 100,
}: CourseAssessmentSectionProps & { expectedTotal?: number }) {
  const totalPercentage = assessments.reduce(
    (sum, assessment) => sum + (Number(assessment.percentage) || 0),
    0
  );
  const isInvalid = Math.abs(totalPercentage - expectedTotal) > 0.01;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-on-surface">{title}</h3>
        {addButton}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-2">
        <div className="md:col-span-5">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Assessment Title</label>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Occurrences</label>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Percentage</label>
        </div>
        <div className="md:col-span-1"></div>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            <div className="md:col-span-5">
              <input
                type="text"
                value={assessment.assessment_name || ""}
                onChange={(e) =>
                  onUpdate(index, "assessment_name", e.target.value)
                }
                placeholder="Midterm Exams"
                className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-sm text-base placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface"
              />
            </div>
            <div className="md:col-span-3">
              <input
                type="number"
                value={assessment.occurrences || ""}
                onChange={(e) => onUpdate(index, "occurrences", e.target.value)}
                placeholder="Qty"
                min="1"
                className="w-full h-10 px-3 bg-surface border border-outline-variant/30 rounded-sm text-base placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface"
              />
            </div>
            <div className="md:col-span-3">
              <div className="relative">
                <input
                  type="number"
                  value={assessment.percentage || ""}
                  min="0"
                  onChange={(e) =>
                    onUpdate(index, "percentage", e.target.value)
                  }
                  placeholder="25"
                  className="w-full h-10 px-3 pr-8 bg-surface border border-outline-variant/30 rounded-sm text-base placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary font-medium text-on-surface"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                  %
                </span>
              </div>
            </div>

            <div className="md:col-span-1 flex justify-end">
              {index > 0 && (
                <button
                  onClick={() => onRemove(index)}
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-md transition-colors"
                  title="Remove assessment"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isInvalid && (
        <p className="mt-4 text-xs text-error font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">warning</span>
          Allocation must equal {expectedTotal}% (Currently: {totalPercentage.toFixed(1)}%)
        </p>
      )}
    </div>
  );
}
