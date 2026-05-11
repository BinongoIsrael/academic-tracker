import { GWAResultsProps } from "@/types";

export default function GWAResults({
  academicGWA,
  totalGWA,
}: GWAResultsProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      {/* Academic GWA Card */}
      <div className="relative overflow-hidden bg-primary p-10 rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.1)] group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <span className="material-symbols-outlined text-9xl">school</span>
        </div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-primary-container/20 text-primary-container text-xs font-bold uppercase tracking-widest rounded-sm mb-6">
            Academic Average
          </span>
          <div className="text-7xl md:text-8xl font-black text-primary-container tracking-tighter mb-2">
            {academicGWA}
          </div>
          <p className="text-primary-container/80 font-medium">
            Weighted Major Courses
          </p>
        </div>
      </div>

      {/* Total GWA Card */}
      <div className="relative overflow-hidden bg-brand-dark p-10 rounded-lg shadow-[0_20px_40px_rgba(26,27,36,0.1)] group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <span className="material-symbols-outlined text-9xl text-white">
            analytics
          </span>
        </div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-sm mb-6 border border-white/10">
            Total Curriculum
          </span>
          <div className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-2">
            {totalGWA}
          </div>
          <p className="text-white/60 font-medium">
            Full Institutional Weighted Average
          </p>
        </div>
      </div>
    </section>
  );
}