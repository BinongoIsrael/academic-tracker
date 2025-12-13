import { AddAssessmentButtonProps } from "@/types";
import { Plus } from "lucide-react";

export default function AddAssessmentButton({
  onClick,
}: AddAssessmentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-brand-green border border-black rounded-[30px] text-sm font-medium hover:bg-green-light transition-colors"
    >
      <Plus className="w-4 h-4" />
      Add Assessment
    </button>
  );
}
