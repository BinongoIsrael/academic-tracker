import { AssessmentGradeInputProps } from "@/types";

export default function AssessmentGradeInput({
  title,
  assessments,
  grades,
  onGradeChange,
}: AssessmentGradeInputProps) {
  const handleInputChange = (
    assessmentId: string,
    occurrenceNumber: number,
    value: string
  ) => {
    if (value === "") {
      onGradeChange(assessmentId, occurrenceNumber, value);
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const clampedValue = Math.max(0, Math.min(100, numValue));

    if (numValue >= 0 && numValue <= 100) {
      onGradeChange(assessmentId, occurrenceNumber, value);
    } else {
      onGradeChange(assessmentId, occurrenceNumber, clampedValue.toString());
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-8 shadow-[0_20px_40px_rgba(26,27,36,0.04)]">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-primary rounded-sm"></div>
        <h2 className="text-2xl font-black tracking-tight text-on-surface uppercase">{title}</h2>
      </div>

      <div className="space-y-10">
        {assessments.map((assessment) => {
          const assessmentGrades = grades.filter(
            (g) => g.assessment_id === assessment.id
          );

          const filledGrades = assessmentGrades.filter((g) => g.grade !== null);
          const average =
            filledGrades.length > 0
              ? filledGrades.reduce((sum, g) => sum + (g.grade || 0), 0) /
                filledGrades.length
              : null;

          return (
            <div
              key={assessment.id}
              className="p-8 bg-surface-container-low/40 rounded-xl border border-outline-variant/10 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-on-surface">
                    {assessment.assessment_name}
                  </h3>
                  <div className="flex items-center gap-3 text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">percent</span>
                        {assessment.percentage}% Weight
                    </span>
                    <span className="w-1 h-1 bg-outline-variant/40 rounded-full"></span>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">history</span>
                        {assessment.occurrences} Node{assessment.occurrences !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
                {average !== null && (
                  <div className="text-left md:text-right bg-primary-container/20 px-4 py-2 rounded-lg border border-primary/10">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-on-primary-container opacity-60">Aggregate Mean</p>
                    <p className="text-2xl font-black text-on-primary-container tracking-tighter">
                      {average.toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
                {Array.from({ length: assessment.occurrences }, (_, index) => {
                  const occurrenceNumber = index + 1;
                  const gradeEntry = assessmentGrades.find(
                    (g) => g.occurrence_number === occurrenceNumber
                  );

                  const isInvalid =
                    gradeEntry?.grade !== null &&
                    gradeEntry !== undefined &&
                    (gradeEntry.grade < 0 || gradeEntry.grade > 100);

                  return (
                    <div key={occurrenceNumber} className="space-y-2">
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">
                        Node #{occurrenceNumber}
                      </label>
                      <div className="relative group/input">
                        <input
                          type="number"
                          value={gradeEntry?.grade ?? ""}
                          onChange={(e) =>
                            handleInputChange(
                              assessment.id,
                              occurrenceNumber,
                              e.target.value
                            )
                          }
                          placeholder="0.0"
                          step="0.01"
                          min="0"
                          max="100"
                          className={`w-full h-12 px-4 pr-10 bg-surface border rounded focus:outline-none focus:ring-2 transition-all font-bold text-sm ${
                            isInvalid
                              ? "border-error focus:ring-error/20"
                              : "border-outline-variant/30 focus:border-primary focus:ring-primary/20"
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[10px] font-black">
                          %
                        </span>
                      </div>
                      {isInvalid && (
                        <p className="text-[10px] text-error font-bold uppercase ml-1 animate-in fade-in zoom-in-95">
                          Limit exceeded
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
