import { CurrentGWACardProps } from "@/types";

export default function CurrentGWACard({ gwa }: CurrentGWACardProps) {
  return (
    <div className="bg-primary-container p-10 rounded-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      <div>
        <span className="text-[0.65rem] uppercase font-extrabold tracking-[0.2em] text-on-primary-container/60 mb-8 block">
          Aggregate Excellence
        </span>
        <h3 className="text-7xl lg:text-8xl font-bold text-on-primary-container tracking-tighter mb-2">
          {gwa.toFixed(2)}
        </h3>
        <p className="text-on-primary-container/80 text-sm font-medium">Cumulative GWA ({new Date().getFullYear()})</p>
      </div>
      <div className="mt-12 flex items-center gap-4">
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-on-primary-container border border-on-primary-container/10">
          Academic Summary
        </span>
        <span className="text-xs text-on-primary-container/60 font-semibold tracking-tight">
          Keep climbing higher
        </span>
      </div>
    </div>
  );
}
