import { ActionButtonsProps } from "@/types";

export default function ActionButtons({
  onCalculate,
  onSave,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end items-center gap-4 w-full">
      <button
        onClick={onCalculate}
        className="w-full sm:w-auto px-8 py-3.5 bg-surface-container-high text-on-surface rounded font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 active:scale-95 border border-outline-variant/10 shadow-sm"
      >
        <span className="material-symbols-outlined text-lg">calculate</span>
        SYNC CALCULATIONS
      </button>
      <button
        onClick={onSave}
        className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 active:translate-y-[2px]"
      >
        <span className="material-symbols-outlined text-lg">save</span>
        COMMIT ALL RECORDS
      </button>
    </div>
  );
}
