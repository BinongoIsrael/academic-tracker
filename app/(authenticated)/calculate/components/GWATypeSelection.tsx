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
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-on-surface">Calculation Scope</h2>
        <div className="h-px flex-1 bg-outline-variant/30"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Option 1: All Academic Terms */}
        <label className="cursor-pointer group">
          <input 
            type="radio" 
            name="scope" 
            className="peer hidden" 
            checked={selectionType === "all"}
            onChange={() => {
              setSelectionType("all");
              setSelectedTermId("");
            }}
          />
          <div className="h-full p-6 bg-surface-container-low rounded-lg border-2 border-transparent peer-checked:border-primary peer-checked:bg-surface shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-surface rounded-md shadow-sm">
                <span className="material-symbols-outlined text-primary">layers</span>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center">
                <div className={`w-3 h-3 bg-primary rounded-full transition-opacity ${selectionType === "all" ? "opacity-100" : "opacity-0"}`}></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">All Academic Terms</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed"> Generate a comprehensive GWA encompassing every completed semester and credited course in your current program.</p>
          </div>
        </label>

        {/* Option 2: Specific Academic Term */}
        <label className="cursor-pointer group">
          <input 
            type="radio" 
            name="scope" 
            className="peer hidden"
            checked={selectionType === "specific"}
            onChange={() => setSelectionType("specific")}
          />
          <div className="h-full p-6 bg-surface-container-low rounded-lg border-2 border-transparent peer-checked:border-primary peer-checked:bg-surface shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-surface rounded-md shadow-sm">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
              </div>
              <div className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center">
                <div className={`w-3 h-3 bg-primary rounded-full transition-opacity ${selectionType === "specific" ? "opacity-100" : "opacity-0"}`}></div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">Specific Academic Term</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Focus on a specific semester to evaluate short-term performance or calculate Dean&apos;s List eligibility for the term.</p>
          </div>
        </label>
      </div>

      <div className={`space-y-3 transition-all duration-300 ${isSpecificTermSelectionDisabled ? 'opacity-30 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Target Session</label>
        <div className="relative">
          <select
            value={selectedTermId}
            onChange={(e) => setSelectedTermId(e.target.value)}
            className="w-full bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary/20 focus:outline-none rounded-lg py-4 px-6 font-semibold text-on-surface custom-select appearance-none cursor-pointer disabled:bg-surface-dim disabled:text-on-surface-variant/50 disabled:cursor-not-allowed"
            disabled={isSpecificTermSelectionDisabled || loadingTerms || !!termsError || terms.length === 0}
          >
            <option value="">Select an Academic Term</option>
            {terms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.academicYear} {term.semester}
              </option>
            ))}
          </select>
        </div>
        {terms.length === 0 && !loadingTerms && !termsError && (
          <p className="text-sm text-error font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            No terms available. Please add a term first.
          </p>
        )}
      </div>
    </section>
  );
}