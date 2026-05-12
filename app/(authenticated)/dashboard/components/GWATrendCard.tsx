import { useState } from "react";
import { GWATrendCardProps } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-dark text-white text-[10px] px-2 py-1 rounded shadow-lg">
        <p className="font-bold">
          {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function GWATrendCard({ 
  semesterTrend = [], 
  yearTrend = [] 
}: GWATrendCardProps) {
  const [viewMode, setViewMode] = useState<"semesters" | "years">("semesters");

  const activeData = viewMode === "semesters" ? semesterTrend : yearTrend;
  
  const chartData = activeData.map((item) => ({
    label: item.label,
    gwa: item.gwa,
  }));

  return (
    <div className="bg-surface-container-low p-10 rounded-xl transition-all duration-300 hover:bg-surface-container-high h-full flex flex-col">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-xl font-bold text-on-surface tracking-tight">Performance Vector</h3>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest font-semibold">Longitudinal Analysis</p>
        </div>
        <div className="flex gap-2 bg-surface-container-high/50 p-1 rounded-lg border border-outline-variant/10">
          <button 
            onClick={() => setViewMode("semesters")}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
              viewMode === "semesters" 
                ? "bg-surface border border-outline-variant/30 shadow-sm text-on-surface" 
                : "text-on-surface-variant/40 hover:text-on-surface-variant"
            }`}
          >
            Semesters
          </button>
          <button 
            onClick={() => setViewMode("years")}
            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
              viewMode === "years" 
                ? "bg-surface border border-outline-variant/30 shadow-sm text-on-surface" 
                : "text-on-surface-variant/40 hover:text-on-surface-variant"
            }`}
          >
            Years
          </button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            key={viewMode}
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--outline-variant) / 0.2)" />
            <XAxis 
              dataKey="label" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--on-surface-variant))" }}
              dy={10}
            />
            <YAxis
              domain={[1.0, 5.0]}
              reversed={true}
              hide={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="gwa"
              stroke="hsl(var(--primary))"
              strokeWidth={4}
              dot={{ fill: "hsl(var(--primary-container))", stroke: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 0 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between px-2">
        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase">Historical Trend</span>
        <span className="text-[10px] font-bold text-on-surface uppercase">{viewMode === "semesters" ? "Latest Term" : "Latest Year"}</span>
      </div>
    </div>
  );
}
