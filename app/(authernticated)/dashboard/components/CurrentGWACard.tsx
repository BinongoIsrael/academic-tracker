import { CurrentGWACardProps } from "@/types";

export default function CurrentGWACard({ gwa }: CurrentGWACardProps) {
  return (
    <div className="w-[475px] h-[253px] bg-white border-2 border-black rounded-[45px] shadow-brand p-6 relative">
      <div className="inline-flex items-center px-2 py-0.5 bg-brand-green rounded-[7px]">
        <span className="text-card-label text-black">
          Cumulative GWA
        </span>
      </div>
      <div className="absolute left-1/2 top-[140px] -translate-x-1/2">
        <p className="text-card-value text-slate-900">
          {gwa.toFixed(2)}
        </p>
      </div>
    </div>
  );
}