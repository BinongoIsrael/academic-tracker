import { GradeSummaryCardProps } from "@/types";
import { getGradeRemark } from "@/utils/convertPercentageToGPA";

export default function GradeSummaryCard({
  targetGPA,
  currentGPA,
  currentPercentage,
  finalGPA,
  finalPercentage,
  hasGradingScale,
  requiredScoreToTarget,
  targetStatus,
}: GradeSummaryCardProps) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Target GPA */}
        <div className="bg-surface-container-high p-8 rounded-lg border border-outline-variant/10 relative group/card">
          {/* Decoration Wrapper (handles overflow for background icon) */}
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-on-surface opacity-5 text-7xl rotate-12 group-hover/card:scale-110 transition-transform">flag</span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest text-nowrap">Target Objective</p>
              <div className="group relative">
                <span className="material-symbols-outlined text-xs text-on-surface-variant cursor-help hover:text-primary transition-colors">info</span>
                {/* Modern Tooltip */}
                <div className="absolute left-0 bottom-full mb-3 w-64 p-3 bg-surface-container-highest/95 backdrop-blur-md border border-outline-variant text-on-surface text-[10px] rounded-lg shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all z-50 font-medium leading-relaxed origin-bottom-left">
                  <div className="font-black text-primary uppercase tracking-widest mb-1">Target Prediction</div>
                  Your desired goal. Based on your grading scale, this predicts the required average needed on all remaining assessments to reach this GPA.
                </div>
              </div>
            </div>
            <h4 className="text-5xl font-black text-on-surface tracking-tighter mb-1">{targetGPA.toFixed(2)}</h4>
            
            {/* Predictive Insight */}
            <div className="mt-4 pt-4 border-t border-outline-variant/10">
              {targetStatus === "possible" && requiredScoreToTarget != null && (
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary">Required average</p>
                  <p className="text-xl font-black text-on-surface tracking-tighter">
                    {requiredScoreToTarget.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-medium leading-tight">Needed on remaining tasks to reach target.</p>
                </div>
              )}
              
              {targetStatus === "reached" && (
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Target Secured</p>
                </div>
              )}

              {targetStatus === "impossible" && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-error">
                    <span className="material-symbols-outlined text-sm">block</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">Mathematically Unreachable</p>
                  </div>
                  {requiredScoreToTarget != null && requiredScoreToTarget > 100 && (
                    <p className="text-[9px] text-on-surface-variant font-medium">Requires {requiredScoreToTarget.toFixed(1)}% average (above 100%).</p>
                  )}
                </div>
              )}

              {targetStatus === "missing_scale" && (
                <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-tighter italic">Grading scale required for prediction</p>
              )}
            </div>
          </div>
        </div>

        {/* Current GPA */}
        <div className="bg-primary-container p-8 rounded-lg relative group/card border border-on-primary-container/5">
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-primary opacity-10 text-7xl rotate-12 group-hover/card:scale-110 transition-transform">trending_up</span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-black uppercase text-on-primary-container/60 tracking-widest text-nowrap">Real-time Average</p>
              <div className="group relative">
                <span className="material-symbols-outlined text-xs text-on-primary-container/60 cursor-help hover:text-on-primary-container transition-colors">info</span>
                <div className="absolute left-0 bottom-full mb-3 w-64 p-3 bg-surface-container-highest/95 backdrop-blur-md border border-outline-variant text-on-surface text-[10px] rounded-lg shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all z-50 font-medium leading-relaxed origin-bottom-left">
                  <div className="font-black text-primary uppercase tracking-widest mb-1">Efficiency Metric</div>
                  The normalized weighted average of only the tasks you have completed so far. This represents your current performance quality independent of progress.
                </div>
              </div>
            </div>
            <h4 className="text-5xl font-black text-on-primary-container tracking-tighter mb-1">
                {currentGPA !== null ? currentGPA.toFixed(2) : "N/A"}
            </h4>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-on-primary-container">
                    {currentPercentage !== null ? `${currentPercentage.toFixed(1)}%` : 'No data'}
                </span>
                {hasGradingScale && currentGPA !== null && (
                    <span className="px-2 py-0.5 bg-primary/10 rounded-sm text-[10px] font-black uppercase tracking-tighter text-on-primary-container">
                        {getGradeRemark(currentGPA)}
                    </span>
                )}
            </div>
          </div>
        </div>

        {/* Final GPA Projection */}
        <div className="bg-brand-dark p-8 rounded-lg relative group/card shadow-lg border border-white/5">
          <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
            <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-white opacity-5 text-7xl rotate-12 group-hover/card:scale-110 transition-transform">analytics</span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[10px] font-black uppercase text-white/40 tracking-widest text-nowrap">Projected Grade</p>
              <div className="group relative">
                <span className="material-symbols-outlined text-xs text-white/40 cursor-help hover:text-white transition-colors">info</span>
                <div className="absolute left-0 bottom-full mb-3 w-64 p-3 bg-surface-container-highest/95 backdrop-blur-md border border-outline-variant text-on-surface text-[10px] rounded-lg shadow-2xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all z-50 font-medium leading-relaxed origin-bottom-left">
                  <div className="font-black text-primary uppercase tracking-widest mb-1">Progress Metric</div>
                  The absolute sum of all weighted points earned so far toward the final 100% total. This grows as you complete more assessments.
                </div>
              </div>
            </div>
            <h4 className="text-5xl font-black text-white tracking-tighter mb-1">
                {finalGPA !== null ? finalGPA.toFixed(2) : "N/A"}
            </h4>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-white/60">
                    {finalPercentage !== null ? `${finalPercentage.toFixed(1)}%` : 'Pending inputs'}
                </span>
                {hasGradingScale && finalGPA !== null && (
                    <span className="px-2 py-0.5 bg-white/10 rounded-sm text-[10px] font-black uppercase tracking-tighter text-white">
                        {getGradeRemark(finalGPA)}
                    </span>
                )}
            </div>
          </div>
        </div>
      </div>

      {currentGPA !== null && hasGradingScale && (
        <div className={`p-6 rounded-lg border flex items-start gap-4 animate-in slide-in-from-top-1 ${
          currentGPA <= 3.0 
            ? "bg-primary-container/10 border-primary/20" 
            : "bg-error-container/10 border-error/20"
        }`}>
          <span className={`material-symbols-outlined ${currentGPA <= 3.0 ? 'text-primary' : 'text-error'}`}>
            {currentGPA <= 3.0 ? 'check_circle' : 'warning'}
          </span>
          <div>
            <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${currentGPA <= 3.0 ? 'text-primary' : 'text-error'}`}>
                {currentGPA <= 3.0 ? 'Performance Optimized' : 'Attention Required'}
            </p>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                {currentGPA <= 3.0
                ? `Academic standing verified. Current GPA of ${currentGPA.toFixed(2)} (${getGradeRemark(currentGPA)}) meets passed criteria.`
                : `Current performance metrics indicate a GPA of ${currentGPA.toFixed(2)} (${getGradeRemark(currentGPA)}). Optimization is required to meet passing thresholds (3.0 or below).`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
