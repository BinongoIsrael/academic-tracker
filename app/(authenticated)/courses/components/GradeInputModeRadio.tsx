import { GradeInputModeRadioProps } from "@/types";

export default function GradeInputModeRadio({
  value,
  onChange,
}: GradeInputModeRadioProps) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Grade Input Method</label>
      <div className="flex gap-8">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="gradeInputMode"
            value="assessments"
            checked={value === "assessments"}
            onChange={(e) =>
              onChange(e.target.value as "assessments" | "final")
            }
            className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary"
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">Set up assessments</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="gradeInputMode"
            value="final"
            checked={value === "final"}
            onChange={(e) =>
              onChange(e.target.value as "assessments" | "final")
            }
            className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary"
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">Enter final grade directly</span>
        </label>
      </div>
    </div>
  );
}
