"use client";

import { useState } from "react";
import {
  GradingScale,
  DEFAULT_GRADING_SCALE,
  GradingScaleSetupProps,
} from "@/types";
import { Plus, Trash2, Check } from "lucide-react";

export default function GradingScaleSetup({
  courseId,
  onSave,
  initialScales,
}: GradingScaleSetupProps) {
  const [scales, setScales] = useState<
    Omit<GradingScale, "id" | "course_id" | "created_at" | "updated_at">[]
  >(
    initialScales?.map((s) => ({
      grade_point: s.grade_point,
      min_percentage: s.min_percentage,
      max_percentage: s.max_percentage,
    })) || DEFAULT_GRADING_SCALE
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleAddScale = () => {
    setScales([
      ...scales,
      { grade_point: 0, min_percentage: 0, max_percentage: 0 },
    ]);
    setHasChanges(true);
  };

  const handleRemoveScale = (index: number) => {
    setScales(scales.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleUpdateScale = (
    index: number,
    field: "grade_point" | "min_percentage" | "max_percentage",
    value: string
  ) => {
    const updated = [...scales];
    updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    setScales(updated);
    setHasChanges(true);
  };

  const handleUseDefault = () => {
    setScales(DEFAULT_GRADING_SCALE);
    setHasChanges(true);
  };

  const handleSave = () => {
    const sortedScales = [...scales].sort(
      (a, b) => a.grade_point - b.grade_point
    );
    onSave(sortedScales);
    setHasChanges(false);
  };

  return (
    <div className="bg-white border border-black rounded-[45px] shadow-[0_5px_0_0_#191A23] p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[30px] font-medium">Grading Scale</h2>
        <button
          onClick={handleUseDefault}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
        >
          Use Default Scale
        </button>
      </div>

      <p className="text-sm text-slate-600 mb-6">
        Define how percentage grades convert to GPA (1.0 - 5.0 scale)
      </p>

      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-4 px-4 pb-2 border-b border-gray-200">
          <p className="text-sm font-semibold text-slate-700">Grade Point</p>
          <p className="text-sm font-semibold text-slate-700">Min %</p>
          <p className="text-sm font-semibold text-slate-700">Max %</p>
          <p className="text-sm font-semibold text-slate-700"></p>
        </div>

        {scales.map((scale, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 items-center">
            <input
              type="number"
              value={scale.grade_point}
              onChange={(e) =>
                handleUpdateScale(index, "grade_point", e.target.value)
              }
              step="0.25"
              min="1"
              max="5"
              className="w-full h-10 px-3 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <input
              type="number"
              value={scale.min_percentage}
              onChange={(e) =>
                handleUpdateScale(index, "min_percentage", e.target.value)
              }
              step="0.01"
              min="0"
              max="100"
              className="w-full h-10 px-3 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <input
              type="number"
              value={scale.max_percentage}
              onChange={(e) =>
                handleUpdateScale(index, "max_percentage", e.target.value)
              }
              step="0.01"
              min="0"
              max="100"
              className="w-full h-10 px-3 bg-white border border-black rounded-md text-base focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <button
              onClick={() => handleRemoveScale(index)}
              className="h-10 px-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleAddScale}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-black rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Grade Range
        </button>

        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-brand-green text-black rounded-[20px] font-medium hover:bg-opacity-90 transition-colors"
          >
            Save Grading Scale
          </button>
        )}
      </div>
    </div>
  );
}
