import { GradeInputModeRadioProps } from "@/types";

export default function GradeInputModeRadio({
  value,
  onChange,
}: GradeInputModeRadioProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-900 mb-3">
        Grade Input Method
      </label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="gradeInputMode"
            value="assessments"
            checked={value === "assessments"}
            onChange={(e) =>
              onChange(e.target.value as "assessments" | "final")
            }
            className="w-4 h-4 accent-brand-green cursor-pointer"
          />
          <span className="text-sm font-medium">Set up assessments</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="gradeInputMode"
            value="final"
            checked={value === "final"}
            onChange={(e) =>
              onChange(e.target.value as "assessments" | "final")
            }
            className="w-4 h-4 accent-brand-green cursor-pointer"
          />
          <span className="text-sm font-medium">
            Enter final grade directly
          </span>
        </label>
      </div>
    </div>
  );
}
