"use client";

import { InfoPanelProps } from "@/types";

export default function InfoPanel({ 
  targetGWA, 
  enrolledUnits, 
  completedUnits, 
  currentGWA 
}: InfoPanelProps) {
  const gwaProgress = Math.min(Math.max(((5 - currentGWA) / (5 - 1)) * 100, 0), 100);
  const unitsProgress = enrolledUnits > 0 ? (completedUnits / enrolledUnits) * 100 : 0;

  return (
      <div className="space-y-6">
        <div className="bg-surface-container-low border border-border rounded-2xl shadow-brand-dark p-5">
          <h3 className="text-lg font-bold text-on-surface mb-3 uppercase tracking-tight">
            Academic Goals
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Target GWA</span>
                <span className="text-sm font-bold text-on-surface">{targetGWA > 0 ? targetGWA.toFixed(2) : "--"}</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div
                  className="bg-brand-green h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${gwaProgress}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Dean&apos;s List Goal
                </span>
                <span className="text-sm font-bold text-on-surface">1.50</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-low border border-border rounded-2xl shadow-brand-dark p-5">
          <h3 className="text-lg font-bold text-on-surface mb-4 uppercase tracking-tight">
            Current Semester
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Enrolled Units</span>
              <span className="font-bold text-on-surface">{enrolledUnits.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Completed</span>
              <span className="font-bold text-on-surface">{completedUnits.toFixed(1)}</span>
            </div>
            
            <div className="w-full bg-surface-container-high rounded-full h-1 my-2">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${unitsProgress}%` }}
                ></div>
            </div>

            <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Current GWA</span>
              <span className="font-black text-on-surface text-xl">
                {currentGWA > 0 ? currentGWA.toFixed(2) : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}
