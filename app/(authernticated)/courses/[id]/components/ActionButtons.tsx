import { ActionButtonsProps } from "@/types";
import { Calculator } from "lucide-react";

export default function ActionButtons({
  onCalculate,
  onSave,
}: ActionButtonsProps) {
  return (
    <div className="flex justify-end gap-4 mt-8">
      <button
        onClick={onCalculate}
        className="flex items-center gap-2 px-6 py-3 bg-white border border-black text-black rounded-[20px] font-medium hover:bg-gray-50 transition-colors"
      >
        <Calculator className="w-5 h-5" />
        Calculate
      </button>
      <button
        onClick={onSave}
        className="px-6 py-3 bg-brand-dark text-white rounded-[20px] font-medium hover:bg-opacity-90 transition-colors"
      >
        Save Grades
      </button>
    </div>
  );
}
