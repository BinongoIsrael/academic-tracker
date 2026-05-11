import { AddAssessmentButtonProps } from "@/types";
import { Plus } from "lucide-react";

export default function AddAssessmentButton({
  onClick,
}: AddAssessmentButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center gap-1 text-primary text-sm font-bold hover:underline transition-all"
    >
      <span className="material-symbols-outlined text-sm">add_circle</span>
      ADD ASSESSMENT
    </button>
  );
}
