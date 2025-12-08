"use client";

export default function InfoPanel() {
  return (
      <div className="space-y-6">
        <div className="bg-white border-2 border-black rounded-2xl shadow-brand p-5">
          <h3 className="text-lg font-semibold text-black mb-3">
            Academic Goals
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-subtle">Target GWA</span>
                <span className="text-sm font-semibold text-black">1.25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-green h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-subtle">
                  Dean's List Goal
                </span>
                <span className="text-sm font-semibold text-black">1.50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-green h-2 rounded-full"
                  style={{ width: "95%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-2 border-black rounded-2xl shadow-brand p-5">
          <h3 className="text-lg font-semibold text-black mb-3">
            Current Semester
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-subtle">Enrolled Units:</span>
              <span className="font-semibold text-black">21</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-subtle">Completed:</span>
              <span className="font-semibold text-black">18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-subtle">Current GWA:</span>
              <span className="font-semibold text-black text-lg">
                <strong>1.00</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}
