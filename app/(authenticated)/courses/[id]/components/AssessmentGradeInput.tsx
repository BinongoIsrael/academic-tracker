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

    if (isNaN(numValue)) {
      return;
    }

    const clampedValue = Math.max(0, Math.min(100, numValue));

    if (numValue >= 0 && numValue <= 100) {
      onGradeChange(assessmentId, occurrenceNumber, value);
    } else {
      onGradeChange(assessmentId, occurrenceNumber, clampedValue.toString());
    }
  };

  return (
    <div className="bg-white border border-black rounded-[45px] shadow-[0_5px_0_0_#191A23] p-8 mb-8">
      <h2 className="text-[30px] font-medium mb-6">{title}</h2>

      <div className="space-y-6">
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
              className="p-6 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {assessment.assessment_name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {assessment.percentage}% • {assessment.occurrences}{" "}
                    occurrence{assessment.occurrences !== 1 ? "s" : ""}
                  </p>
                </div>
                {average !== null && (
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Average</p>
                    <p className="text-2xl font-bold text-black">
                      {average.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                    <div key={occurrenceNumber}>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        #{occurrenceNumber}
                      </label>
                      <div className="relative">
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
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value && !isNaN(parseFloat(value))) {
                              const numValue = parseFloat(value);
                              const clampedValue = Math.max(
                                0,
                                Math.min(100, numValue)
                              );
                              if (numValue !== clampedValue) {
                                onGradeChange(
                                  assessment.id,
                                  occurrenceNumber,
                                  clampedValue.toString()
                                );
                              }
                            }
                          }}
                          placeholder="0"
                          step="0.01"
                          min="0"
                          max="100"
                          className={`w-full h-10 px-3 pr-8 bg-white border rounded-md text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                            isInvalid
                              ? "border-red-500 focus:ring-red-500"
                              : "border-black focus:ring-brand-green"
                          }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                          %
                        </span>
                      </div>
                      {isInvalid && (
                        <p className="text-xs text-red-500 mt-1">
                          Must be 0-100
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
