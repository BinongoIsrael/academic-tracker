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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-medium">{title}</h3>
        {addButton}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-2">
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-slate-900">
            Assessment Title
          </label>
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-slate-900">
            Number of Occurences
          </label>
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-slate-900">
            Percentage
          </label>
        </div>
        <div className="md:col-span-2"></div>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
          >
            <div className="md:col-span-4">
              <input
                type="text"
                value={assessment.assessment_name || ""}
                onChange={(e) =>
                  onUpdate(index, "assessment_name", e.target.value)
                }
                placeholder="Assessment Title"
                className="w-full h-10 px-3 bg-white border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div className="md:col-span-3">
              <input
                type="number"
                value={assessment.occurrences || ""}
                onChange={(e) => onUpdate(index, "occurrences", e.target.value)}
                placeholder="Occurences"
                min="1"
                className="w-full h-10 px-3 bg-white border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div className="md:col-span-3">
              <div className="relative">
                <input
                  type="number"
                  value={assessment.percentage || ""}
                  onChange={(e) =>
                    onUpdate(index, "percentage", e.target.value)
                  }
                  placeholder="Percentage"
                  step="1"
                  min="0"
                  max="100"
                  className="w-full h-10 px-3 pr-8 bg-white border border-black rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                  %
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              {index > 0 && (
                <button
                  onClick={() => onRemove(index)}
                  className="w-full h-10 px-4 bg-red-500 text-white rounded-md text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isInvalid && (
        <p className="mt-4 text-sm text-red-600 font-medium">
          Assessment percentages must add up to {expectedTotal}% (Currently:{" "}
          {totalPercentage.toFixed(1)}%)
        </p>
      )}
    </div>
  );
}
