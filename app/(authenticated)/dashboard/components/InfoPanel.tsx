"use client";

export default function InfoPanel() {
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
                <span className="text-sm font-bold text-on-surface">1.25</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-2">
                <div
                  className="bg-brand-green h-2 rounded-full"
                  style={{ width: "80%" }}
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
                  className="bg-brand-green h-2 rounded-full"
                  style={{ width: "95%" }}
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
              <span className="font-bold text-on-surface">21.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Completed</span>
              <span className="font-bold text-on-surface">18.0</span>
            </div>
            <div className="pt-3 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Current GWA</span>
              <span className="font-black text-on-surface text-xl">
                1.00
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}

