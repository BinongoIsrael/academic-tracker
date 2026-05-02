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

export default function GWATrendCard({ trendData = [] }: GWATrendCardProps) {
  const data = trendData.map((gwa, index) => ({
    semester: `S${(index % 2) + 1} ${(index < 2 ? 23 : 24)}`, // Mocking years for visual appeal as in HTML
    gwa: gwa,
  }));

  return (
    <div className="bg-surface-container-low p-10 rounded-xl transition-all duration-300 hover:bg-surface-container-high h-full flex flex-col">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-xl font-bold text-on-surface tracking-tight">Performance Vector</h3>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest font-semibold">Longitudinal Analysis</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 text-[10px] font-bold bg-surface border border-outline-variant/30 shadow-sm text-on-surface">Semesters</button>
          <button className="px-4 py-1.5 text-[10px] font-bold text-on-surface-variant/50">Years</button>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--outline-variant) / 0.2)" />
            <XAxis 
              dataKey="semester" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--on-surface-variant))" }}
              dy={10}
            />
            <YAxis
              domain={[1.0, 5.0]}
              reversed={true} // In PH system, 1.0 is better than 5.0
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
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between px-2">
        <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase">Historical</span>
        <span className="text-[10px] font-bold text-on-surface uppercase">Latest Semester</span>
      </div>
    </div>
  );
}
