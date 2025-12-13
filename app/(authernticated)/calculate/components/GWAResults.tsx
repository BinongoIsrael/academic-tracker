import { GWAResultsProps } from "@/types";

export default function GWAResults({
  academicGWA,
  totalGWA,
}: GWAResultsProps) {
  return (
    <div className="bg-white border-2 border-black rounded-[45px] p-4 sm:p-6 shadow-[0_5px_0_#191A23] h-full">
      <div className="grid grid-cols-2 h-full divide-x-2 divide-gray-100">
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <p className="text-sm sm:text-base font-medium text-slate-600 mb-2">
            Academic GWA
          </p>
          <p className="text-5xl sm:text-6xl font-bold text-slate-800 tracking-tighter">
            {academicGWA}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <p className="text-sm sm:text-base font-medium text-slate-600 mb-2">
            Total GWA
          </p>
          <p className="text-5xl sm:text-6xl font-bold text-slate-800 tracking-tighter">
            {totalGWA}
          </p>
        </div>
      </div>
    </div>
  );
}