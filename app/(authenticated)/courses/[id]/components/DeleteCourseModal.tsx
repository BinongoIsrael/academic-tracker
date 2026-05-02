"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { DeleteCourseModalProps } from "@/types";

export default function DeleteCourseModal({
  courseName,
  onConfirm,
  onClose,
}: DeleteCourseModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Error deleting course:", error);
    } finally {
      setDeleting(false);
    }
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
              <h2 className="text-xl font-bold text-on-surface">Delete Course Portfolio</h2>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Permanent Removal</p>
            </div>
          </div>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-on-surface">{courseName}</span>? This action will permanently remove all assessments, grades, and records associated with this course portfolio.
          </p>

          <div className="bg-surface p-4 rounded border border-outline-variant/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-error text-xl">delete_forever</span>
              <p className="text-[10px] font-bold text-error uppercase tracking-tighter">This operation cannot be reversed</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-container-low flex gap-4">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-3 bg-error text-on-error rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </div>
    </>
  );
}
