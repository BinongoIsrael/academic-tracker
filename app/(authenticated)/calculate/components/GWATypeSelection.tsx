import { GWATypeSelectionProps } from "@/types"; 
import { ChevronDown } from "lucide-react";

export default function GWATypeSelection({
  selectionType,
  setSelectionType,
  selectedTermId,
  setSelectedTermId,
  terms,
  loadingTerms,
  termsError,
}: GWATypeSelectionProps) {
  const isSpecificTermSelectionDisabled = selectionType !== "specific";

  return (
    <div className="bg-white border-2 border-black rounded-[45px] p-6 shadow-[0_5px_0_#191A23]">
      <div className="mb-6">
        <h4 className="text-xl font-medium mb-4">GWA Type Selection</h4>
        <div className="flex flex-col gap-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="gwa-calculation-scope"
              value="all"
              checked={selectionType === "all"}
              onChange={() => {
                setSelectionType("all");
                setSelectedTermId("");
              }}
              className="form-radio accent-brand-green"
            />
            <span className="ml-2 text-sm font-medium text-slate-900">
              All Academic Terms
            </span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="gwa-calculation-scope"
              value="specific"
              checked={selectionType === "specific"}
              onChange={() => setSelectionType("specific")}
              className="form-radio accent-brand-green"
            />
            <span className="ml-2 text-sm font-medium text-slate-900">
              Specific Academic Term
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-slate-900 mb-2 block">
          Select Term
        </label>
        <div className="relative">
          <select
            value={selectedTermId}
            onChange={(e) => setSelectedTermId(e.target.value)}
            className="w-full bg-surface-container border-none focus:ring-1 focus:ring-primary rounded-md py-3 px-4 font-semibold text-sm sm:text-base custom-select appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            disabled={isSpecificTermSelectionDisabled || loadingTerms || !!termsError || terms.length === 0}
          >
            <option value="">Select a Term</option>
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.academicYear} {term.semester}
              </option>
            ))}
          </select>
        </div>
        {terms.length === 0 && !loadingTerms && !termsError && (
          <p className="text-sm text-slate-500 mt-2">No terms available. Please add a term first.</p>
        )}
      </div>
    </div>
  );
}