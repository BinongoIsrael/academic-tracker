import { ActionButtonsProps } from "@/types";

export default function ActionButtons({
  onCalculate,
  onFillPassingScores,
  onFillTargetScores,
  onClearAutoFilledScores,
  onSave,
  isSaving,
  isReadOnly,
}: ActionButtonsProps) {
  if (isReadOnly) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap justify-end items-center gap-4 w-full">
      <button
        onClick={onCalculate}
        disabled={isSaving}
        className="w-full sm:w-auto px-8 py-3.5 bg-surface-container-high text-on-surface rounded font-bold text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 active:scale-95 border border-outline-variant/10 shadow-sm disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">calculate</span>
        SYNC CALCULATIONS
      </button>
      <button
        onClick={onFillPassingScores}
        disabled={isSaving}
        className="w-full sm:w-auto px-6 py-3.5 bg-surface-container-high text-on-surface rounded font-bold text-xs sm:text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 active:scale-95 border border-outline-variant/10 shadow-sm disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">check_circle</span>
        FILL PASSING SCORES
      </button>
      <button
        onClick={onFillTargetScores}
        disabled={isSaving}
        className="w-full sm:w-auto px-6 py-3.5 bg-surface-container-high text-on-surface rounded font-bold text-xs sm:text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 active:scale-95 border border-outline-variant/10 shadow-sm disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">flag</span>
        FILL GOAL SCORES
      </button>
      <button
        onClick={onClearAutoFilledScores}
        disabled={isSaving}
        className="w-full sm:w-auto px-6 py-3.5 bg-surface-container-high text-on-surface rounded font-bold text-xs sm:text-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2 active:scale-95 border border-outline-variant/10 shadow-sm disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-lg">backspace</span>
        CLEAR AUTO-FILLED
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full sm:w-auto px-10 py-4 bg-primary text-on-primary rounded font-bold text-sm hover:shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 active:translate-y-[2px] disabled:opacity-50 disabled:hover:shadow-none"
      >
        <span className={`material-symbols-outlined text-lg ${isSaving ? 'animate-spin' : ''}`}>
          {isSaving ? 'sync' : 'save'}
        </span>
        {isSaving ? 'COMMITTING RECORDS...' : 'COMMIT ALL RECORDS'}
      </button>
    </div>
  );
}
