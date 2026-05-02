import { ActionButtonsProps } from "@/types";
import { Calculator } from "lucide-react";

export default function ActionButtons({
  onCalculate,
  onSave,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col xs:flex-row justify-end gap-3 xs:gap-4 mt-6 sm:mt-8 w-full">
      <button
        onClick={onCalculate}
        className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white border border-black text-black rounded-[20px] font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base w-full xs:w-auto"
      >
        <Calculator className="w-5 h-5" />
        <span className="hidden xs:inline">Calculate</span>
        <span className="inline xs:hidden">Calculate</span>
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 sm:px-6 sm:py-3 bg-brand-dark text-white rounded-[20px] font-medium hover:bg-opacity-90 transition-colors text-sm sm:text-base w-full xs:w-auto"
      >
        <span className="hidden xs:inline">Save Grades</span>
        <span className="inline xs:hidden">Save Grades</span>
      </button>
    </div>
  );
}
