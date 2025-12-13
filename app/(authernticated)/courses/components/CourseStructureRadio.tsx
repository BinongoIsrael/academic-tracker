import { CourseStructureRadioProps } from "@/types";

export default function CourseStructureRadio({
  value,
  onChange,
}: CourseStructureRadioProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-slate-900 mb-2">
        Course Structure
      </label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="courseStructure"
            value="Lecture"
            checked={value === "Lecture"}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 accent-brand-green cursor-pointer"
          />
          <span className="text-sm font-medium">Lecture</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="courseStructure"
            value="Lecture + Laboratory"
            checked={value === "Lecture + Laboratory"}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 accent-brand-green cursor-pointer"
          />
          <span className="text-sm font-medium">Lecture + Laboratory</span>
        </label>
      </div>
    </div>
  );
}
