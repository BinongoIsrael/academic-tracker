import { GWATrendCardProps } from '@/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-black rounded-lg p-2 shadow-md">
        <p className="text-sm text-black">
          <span className="font-medium">Semester: </span>
          {payload[0].payload.semester}
        </p>
        <p className="text-sm text-black">
          <span className="font-medium">GWA: </span>
          {payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function GWATrendCard({ trendData = [] }: GWATrendCardProps) {
  const data = trendData.map((gwa, index) => ({
    semester: `Sem ${index + 1}`,
    gwa: gwa
  }));

  const dataMin = Math.min(...trendData);
  const dataMax = Math.max(...trendData);
  
  const minGrade = Math.floor(dataMin * 4) / 4;
  const maxGrade = Math.ceil(dataMax * 4) / 4;
  
  const ticks: number[] = [];
  for (let i = minGrade; i <= maxGrade; i += 0.25) {
    ticks.push(parseFloat(i.toFixed(2)));
  }

  return (
    <div className="w-[475px] h-[253px] bg-white border-2 border-black rounded-[45px] shadow-brand p-6">
      <div className="inline-flex items-center px-2 py-0.5 bg-brand-green rounded-[7px] mb-4">
        <span className="text-card-label text-black">
          GWA Trend
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={160}>
        <LineChart 
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis 
            dataKey="semester" 
            hide={true}
          />
          <YAxis 
            domain={[minGrade, maxGrade]}
            ticks={ticks}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 14 }}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="gwa" 
            stroke="#B9FF66" 
            strokeWidth={3} 
            dot={{ fill: '#B9FF66', stroke: '#000', strokeWidth: 1, r: 5 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}