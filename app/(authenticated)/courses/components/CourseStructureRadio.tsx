import { CourseStructureRadioProps } from "@/types";

export default function CourseStructureRadio({
  value,
  onChange,
}: CourseStructureRadioProps) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Course Structure</label>
      <div className="flex gap-8">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="courseStructure"
            value="Lecture"
            checked={value === "Lecture"}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary"
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">Lecture</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name="courseStructure"
            value="Lecture + Laboratory"
            checked={value === "Lecture + Laboratory"}
            onChange={(e) => onChange(e.target.value)}
            className="w-5 h-5 text-primary border-none bg-surface-container-high focus:ring-primary"
          />
          <span className="text-sm font-medium group-hover:text-primary transition-colors">Lecture + Laboratory</span>
        </label>
      </div>
    </div>
  );
}
