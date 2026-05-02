import { WeightDistributionProps } from "@/types";

export default function WeightDistribution({
  lecturePercentage,
  laboratoryPercentage,
  onLecturePercentageChange,
  onLaboratoryPercentageChange,
}: WeightDistributionProps) {
  const total =
    parseFloat(lecturePercentage) + parseFloat(laboratoryPercentage);
  const isInvalid = Math.abs(total - 100) > 0.01;

  return (
    <div className="bg-surface-container-high/50 p-6 rounded-md border border-outline-variant/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-on-surface">Weight Distribution</h3>
        <span className={`text-lg font-black ${isInvalid ? 'text-error' : 'text-primary'}`}>{total.toFixed(0)}%</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Lecture Percentage</label>
          <div className="relative">
            <input
              type="number"
              value={lecturePercentage}
              onChange={(e) => onLecturePercentageChange(e.target.value)}
              placeholder="70"
              className="w-full bg-surface-container-lowest border border-black/10 rounded-sm py-2 px-3 focus:ring-2 focus:ring-primary font-semibold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">%</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Laboratory Percentage</label>
          <div className="relative">
            <input
              type="number"
              value={laboratoryPercentage}
              onChange={(e) => onLaboratoryPercentageChange(e.target.value)}
              placeholder="30"
              className="w-full bg-surface-container-lowest border border-black/10 rounded-sm py-2 px-3 focus:ring-2 focus:ring-primary font-semibold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">%</span>
          </div>
        </div>
      </div>
      
      {!isInvalid && (
        <div className="mt-4 h-3 w-full bg-surface-container-lowest rounded-sm overflow-hidden flex shadow-inner border border-black/5">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${lecturePercentage}%` }}></div>
          <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${laboratoryPercentage}%` }}></div>
        </div>
      )}

      {isInvalid && (
        <p className="mt-4 text-xs text-error font-bold uppercase tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">warning</span>
          Total allocation must equal 100%
        </p>
      )}
    </div>
  );
}
