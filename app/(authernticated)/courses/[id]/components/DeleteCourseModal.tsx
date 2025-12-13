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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-[30px] border border-black shadow-[0_5px_0_0_#191A23] max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-slate-900">Delete Course?</h3>
          <button
            onClick={onClose}
            disabled={deleting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-slate-600 mb-6">
          Are you sure you want to delete <strong>{courseName}</strong>? This
          will permanently delete all assessments, grades, and grading scales
          associated with this course. This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 px-6 py-3 bg-white border border-black text-black rounded-[20px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-[20px] font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Course"}
          </button>
        </div>
      </div>
    </div>
  );
}
