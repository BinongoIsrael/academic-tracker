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
    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Weight Distribution</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Lecture Percentage
          </label>
          <div className="relative">
            <input
              type="number"
              value={lecturePercentage}
              onChange={(e) => onLecturePercentageChange(e.target.value)}
              placeholder="50"
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
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Laboratory Percentage
          </label>
          <div className="relative">
            <input
              type="number"
              value={laboratoryPercentage}
              onChange={(e) => onLaboratoryPercentageChange(e.target.value)}
              placeholder="50"
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
      </div>
      {isInvalid && (
        <p className="mt-2 text-sm text-red-600 font-medium">
          Total must equal 100% (Currently: {total.toFixed(1)}%)
        </p>
      )}
    </div>
  );
}
