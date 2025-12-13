import { ColorPickerProps } from "@/types";

const VIBRANT_COLORS = [
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Lime", value: "#84CC16" },
  { name: "Green", value: "#22C55E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Sky", value: "#0EA5E9" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Violet", value: "#8B5CF6" },
  { name: "Purple", value: "#A855F7" },
  { name: "Fuchsia", value: "#D946EF" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
];

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * VIBRANT_COLORS.length);
  return VIBRANT_COLORS[randomIndex].value;
};

export default function ColorPicker({
  selectedColor,
  onColorChange,
}: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">
        Course Color
      </label>
      <div className="grid grid-cols-9 gap-2">
        {VIBRANT_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`w-10 h-10 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green ${
              selectedColor === color.value
                ? "ring-2 ring-offset-2 ring-black scale-110"
                : ""
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
      </div>
    </div>
  );
}
