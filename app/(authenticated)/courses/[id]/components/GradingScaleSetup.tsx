"use client";

import { useState } from "react";
import {
  GradingScale,
  DEFAULT_GRADING_SCALE,
  GradingScaleSetupProps,
} from "@/types";

export default function GradingScaleSetup({
  courseId,
  onSave,
  initialScales,
  isSaving,
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
    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-8 shadow-[0_20px_40px_rgba(26,27,36,0.04)] mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h2 className="text-2xl font-black tracking-tight text-on-surface uppercase">Grading Framework</h2>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Percentage to GPA Conversion Map</p>
        </div>
        <button
          onClick={handleUseDefault}
          disabled={isSaving}
          className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-lg transition-all active:scale-95 border border-outline-variant/10 disabled:opacity-50"
        >
          Restore Default Map
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b border-outline-variant/10">
          <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Grade Point</div>
          <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Min Threshold %</div>
          <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Max Threshold %</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {scales.map((scale, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center group/row animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="col-span-3">
                <input
                    type="number"
                    value={scale.grade_point}
                    disabled={isSaving}
                    onChange={(e) =>
                        handleUpdateScale(index, "grade_point", e.target.value)
                    }
                    step="0.25"
                    min="1"
                    max="5"
                    className="w-full h-11 px-4 bg-surface border border-outline-variant/30 rounded focus:outline-none focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                />
              </div>
              <div className="col-span-4">
                <input
                    type="number"
                    value={scale.min_percentage}
                    disabled={isSaving}
                    onChange={(e) =>
                        handleUpdateScale(index, "min_percentage", e.target.value)
                    }
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full h-11 px-4 bg-surface border border-outline-variant/30 rounded focus:outline-none focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                />
              </div>
              <div className="col-span-4">
                <input
                    type="number"
                    value={scale.max_percentage}
                    disabled={isSaving}
                    onChange={(e) =>
                        handleUpdateScale(index, "max_percentage", e.target.value)
                    }
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full h-11 px-4 bg-surface border border-outline-variant/30 rounded focus:outline-none focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                    onClick={() => handleRemoveScale(index)}
                    disabled={isSaving}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-md transition-all sm:opacity-0 group-hover/row:opacity-100 disabled:opacity-50"
                    title="Remove threshold"
                >
                    <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-8 border-t border-outline-variant/20 gap-6">
        <button
          onClick={handleAddScale}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary-container/20 rounded-lg transition-all group disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">add_circle</span>
          Add Point Range
        </button>

        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 animate-in zoom-in-95 disabled:opacity-50 disabled:hover:shadow-none"
          >
            {isSaving ? 'SYNCING FRAMEWORK...' : 'COMMIT FRAMEWORK CHANGES'}
            <span className={`material-symbols-outlined text-lg ${isSaving ? 'animate-spin' : ''}`}>
              {isSaving ? 'sync' : 'save'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
