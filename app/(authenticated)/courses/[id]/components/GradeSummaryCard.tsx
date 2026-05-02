import { GradeSummaryCardProps } from "@/types";
import { getGradeRemark } from "@/utils/convertPercentageToGPA";

export default function GradeSummaryCard({
  targetGPA,
  currentGPA,
  currentPercentage,
  finalGPA,
  finalPercentage,
  hasGradingScale,
}: GradeSummaryCardProps) {
  return (
    <div className="bg-white border border-black rounded-[45px] shadow-[0_5px_0_0_#191A23] p-8 mb-8">
      <h2 className="text-[30px] font-medium mb-6">Grade Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Target GPA</p>
          <p className="text-3xl font-bold text-slate-900">
            {targetGPA.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Your goal for this course
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Current GPA</p>
          <p
            className={`text-3xl font-bold ${
              currentGPA === null
                ? "text-slate-400"
                : currentGPA <= 3.0
                ? "text-slate-900"
                : "text-orange-600"
            }`}
          >
            {currentGPA !== null ? currentGPA.toFixed(2) : "N/A"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {currentPercentage !== null && (
              <>
                {currentPercentage.toFixed(2)}% •{" "}
                {hasGradingScale && currentGPA !== null
                  ? getGradeRemark(currentGPA)
                  : "Set grading scale"}
              </>
            )}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">Final GPA</p>
          <p
            className={`text-3xl font-bold ${
              finalGPA === null
                ? "text-slate-400"
                : finalGPA <= 3.0
                ? "text-slate-900"
                : "text-red-600"
            }`}
          >
            {finalGPA !== null ? finalGPA.toFixed(2) : "N/A"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {finalPercentage !== null ? (
              <>
                {finalPercentage.toFixed(2)}% •{" "}
                {hasGradingScale && finalGPA !== null
                  ? getGradeRemark(finalGPA)
                  : "Set grading scale"}
              </>
            ) : (
              "Complete all grades to see final"
            )}
          </p>
        </div>
      </div>

      {currentGPA !== null && hasGradingScale && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            currentGPA <= 3.0
              ? "bg-slate-50 border border-slate-200"
              : "bg-orange-50 border border-orange-200"
          }`}
        >
          <p
            className={`text-sm ${
              currentGPA <= 3.0 ? "text-slate-800" : "text-orange-800"
            }`}
          >
            {currentGPA <= 3.0
              ? `✓ You're on track! Current GPA: ${currentGPA.toFixed(
                  2
                )} (${getGradeRemark(currentGPA)})`
              : `Current GPA: ${currentGPA.toFixed(2)} (${getGradeRemark(
                  currentGPA
                )}). You need improvement to pass (3.0 or below).`}
          </p>
        </div>
      )}
    </div>
  );
}
