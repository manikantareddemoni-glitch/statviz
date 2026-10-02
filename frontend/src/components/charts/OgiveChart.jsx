import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function OgiveChart({ ogiveData, showMoreThan = true }) {
  const { isDark } = useTheme();
  const [selectedPercentile, setSelectedPercentile] = useState(50); // Default Median 50%

  if (!ogiveData || !ogiveData.combined_chart_data) {
    return <div className="text-center py-12 text-slate-400">No ogive data available.</div>;
  }

  const { combined_chart_data, graphical_landmarks, n } = ogiveData;

  // Find approximate graphical X for selected percentile
  const targetFreq = (selectedPercentile / 100) * n;
  let targetX = combined_chart_data[0]?.x || 0;

  for (let i = 0; i < combined_chart_data.length - 1; i++) {
    const p1 = combined_chart_data[i];
    const p2 = combined_chart_data[i + 1];
    if (p1.less_than_frequency <= targetFreq && p2.less_than_frequency >= targetFreq) {
      const denom = p2.less_than_frequency - p1.less_than_frequency || 1;
      const frac = (targetFreq - p1.less_than_frequency) / denom;
      targetX = Number((p1.x + frac * (p2.x - p1.x)).toFixed(2));
      break;
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1 z-50">
          <p className="font-bold text-slate-900 dark:text-white">Class Boundary: {d.x}</p>
          <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
            Less-Than: {d.less_than_frequency} ({d.less_than_percentage}%)
          </div>
          {showMoreThan && (
            <div className="text-pink-600 dark:text-pink-400 font-semibold">
              More-Than: {d.more_than_frequency} ({d.more_than_percentage}%)
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Interactive Graphical Quartile Reader Controls */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Graphical Reader:
          </span>
          <div className="flex items-center gap-1.5">
            {[25, 50, 75].map((pct) => (
              <button
                key={pct}
                onClick={() => setSelectedPercentile(pct)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  selectedPercentile === pct
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {pct === 25 ? 'Q₁ (25%)' : pct === 50 ? 'Median (50%)' : 'Q₃ (75%)'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="99"
            value={selectedPercentile}
            onChange={(e) => setSelectedPercentile(Number(e.target.value))}
            className="w-32 sm:w-44 accent-indigo-600 cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 min-w-[70px]">
            {selectedPercentile}% → X ≈ {targetX}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combined_chart_data} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#1f2937' : '#e2e8f0'}
              vertical={false}
            />
            <XAxis
              dataKey="x"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              tickLine={false}
              label={{
                value: 'Class Boundaries (X)',
                position: 'insideBottom',
                offset: -10,
                fill: isDark ? '#94a3b8' : '#64748b',
                fontSize: 11,
              }}
            />
            <YAxis
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, n]}
              label={{
                value: 'Cumulative Frequency',
                angle: -90,
                position: 'insideLeft',
                fill: isDark ? '#94a3b8' : '#64748b',
                fontSize: 11,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />

            {/* Less Than Ogive */}
            <Line
              type="monotone"
              name="Less-Than Ogive (Rising)"
              dataKey="less_than_frequency"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
              animationDuration={800}
            />

            {/* More Than Ogive */}
            {showMoreThan && (
              <Line
                type="monotone"
                name="More-Than Ogive (Falling)"
                dataKey="more_than_frequency"
                stroke="#ec4899"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                animationDuration={800}
              />
            )}

            {/* Graphical Landmark Target Line */}
            <ReferenceLine
              y={targetFreq}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: `${selectedPercentile}% (Freq ${targetFreq.toFixed(1)})`,
                fill: '#10b981',
                fontSize: 11,
                position: 'insideTopLeft',
              }}
            />
            <ReferenceLine
              x={targetX}
              stroke="#10b981"
              strokeDasharray="3 3"
              label={{
                value: `X = ${targetX}`,
                fill: '#10b981',
                fontSize: 11,
                position: 'insideBottomRight',
              }}
            />
            <ReferenceDot
              x={targetX}
              y={targetFreq}
              r={6}
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
