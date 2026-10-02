import React from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function QQPlot({ qqData }) {
  const { isDark } = useTheme();

  if (!qqData || !qqData.points) {
    return <div className="text-center py-12 text-slate-400">No Q-Q plot data available.</div>;
  }

  const { points } = qqData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1 z-50">
          <p className="font-bold text-slate-900 dark:text-white">Q-Q Coordinate</p>
          <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>Theoretical Normal Quantile (z):</span>
            <span className="font-mono font-semibold text-indigo-500">{d.theoretical_quantile}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>Sample Observed Value:</span>
            <span className="font-mono font-semibold text-emerald-500">{d.sample_quantile}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Expected Line Value:</span>
            <span className="font-mono">{d.reference_line}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={points} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#1f2937' : '#e2e8f0'}
          />
          <XAxis
            type="number"
            dataKey="theoretical_quantile"
            name="Theoretical Quantile"
            stroke={isDark ? '#64748b' : '#94a3b8'}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
            label={{
              value: 'Theoretical Standard Normal Quantiles (z)',
              position: 'insideBottom',
              offset: -10,
              fill: isDark ? '#94a3b8' : '#64748b',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="sample_quantile"
            name="Sample Quantile"
            stroke={isDark ? '#64748b' : '#94a3b8'}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: 'Ordered Sample Values',
              angle: -90,
              position: 'insideLeft',
              fill: isDark ? '#94a3b8' : '#64748b',
              fontSize: 11,
            }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Reference 45-degree Line */}
          <Line
            type="monotone"
            dataKey="reference_line"
            stroke="#ec4899"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            name="Normal Reference Line"
          />

          {/* Sample Points Scatter */}
          <Scatter
            name="Sample Quantiles"
            dataKey="sample_quantile"
            fill="#6366f1"
            line={false}
            shape={(props) => {
              const { cx, cy } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="hover:scale-150 transition-transform duration-150 cursor-pointer"
                />
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
