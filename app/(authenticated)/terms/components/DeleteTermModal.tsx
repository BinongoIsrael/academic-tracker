"use client";

import { DeleteTermModalProps, Term } from "@/types";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function DeleteTermModal({
  term,
  isOpen,
  onClose,
  onConfirm,
}: DeleteTermModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !term) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(term.id);
      onClose();
    } catch (error) {
      console.error("Error deleting term:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSemesterDisplay = () => {
    return `${term.semester} ${term.academicYear}`;
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[110]"
        onClick={onClose}
      />

      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-container-lowest border border-outline-variant/10 rounded-lg shadow-2xl z-[120] overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-error-container/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-error text-2xl">warning</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Delete Term Lifecycle</h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Permanent Removal</p>
            </div>
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-on-surface">{getSemesterDisplay()}</span>? This action will permanently remove this lifecycle node and all its associated course data.
          </p>

          <div className="bg-surface p-4 rounded border border-outline-variant/10 space-y-3">
            <div className="text-[10px] uppercase font-black text-on-surface-variant tracking-tighter">Impact Analysis</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-sm">remove_circle</span>
                {term.courses} Course{term.courses !== 1 ? "s" : ""} and records
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-sm">remove_circle</span>
                {term.units.toFixed(1)} Academic Units
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-container-low flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-error text-on-error rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </div>
    </>
  );
}