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
    <section className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Target GPA */}
        <div className="bg-surface-container-high p-8 rounded-lg border border-outline-variant/10 relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-on-surface opacity-5 text-7xl rotate-12 group-hover:scale-110 transition-transform">flag</span>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-on-surface-variant mb-2 tracking-widest">Target Objective</p>
            <h4 className="text-5xl font-black text-on-surface tracking-tighter mb-1">{targetGPA.toFixed(2)}</h4>
            <p className="text-xs text-on-surface-variant font-medium">Desired Academic Grade Point</p>
          </div>
        </div>

        {/* Current GPA */}
        <div className="bg-primary-container p-8 rounded-lg relative overflow-hidden group">
          <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-primary opacity-10 text-7xl rotate-12 group-hover:scale-110 transition-transform">trending_up</span>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-on-primary-container/60 mb-2 tracking-widest">Real-time Average</p>
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
        <div className="bg-brand-dark p-8 rounded-lg relative overflow-hidden group shadow-lg">
          <span className="material-symbols-outlined absolute -right-2 -bottom-2 text-white opacity-5 text-7xl rotate-12 group-hover:scale-110 transition-transform">analytics</span>
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase text-white/40 mb-2 tracking-widest">Projected Grade</p>
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
