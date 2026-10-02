import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function InteractiveHistogram({
  data,
  mean,
  median,
  mode,
  showNormalCurve = true,
  showMarkers = true
}) {
  const { isDark } = useTheme();

  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-slate-400">No histogram data available.</div>;
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    label: `${item.bin_lower} - ${item.bin_upper}`,
    bin_mid: item.bin_mid,
    count: item.count,
    expected_normal: item.expected_normal_count || 0,
    pct: item.percentage || 0,
    interval: `[${item.bin_lower}, ${item.bin_upper})`
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 z-50">
          <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
            Interval: {d.interval}
          </p>
          <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>Frequency (Count):</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{d.count}</span>
          </div>
          {d.pct > 0 && (
            <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
              <span>Percentage:</span>
              <span className="font-semibold">{d.pct}%</span>
            </div>
          )}
          {showNormalCurve && d.expected_normal > 0 && (
            <div className="flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Fitted Normal Expected:</span>
              <span className="font-semibold text-cyan-500">{d.expected_normal}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 sm:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 25, left: 10 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="curveGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#1f2937' : '#e2e8f0'}
            vertical={false}
          />

          <XAxis
            dataKey="label"
            stroke={isDark ? '#64748b' : '#94a3b8'}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            stroke={isDark ? '#64748b' : '#94a3b8'}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
          />

          {/* Histogram Bars */}
          <Bar
            name="Sample Frequency"
            dataKey="count"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            animationDuration={800}
          />

          {/* Fitted Normal Curve */}
          {showNormalCurve && (
            <Line
              type="monotone"
              name="Fitted Normal Curve"
              dataKey="expected_normal"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={false}
              animationDuration={1200}
            />
          )}

          {/* Reference lines for Mean, Median, Mode */}
          {showMarkers && mean !== undefined && (
            <ReferenceLine
              x={chartData.find((d) => d.bin_mid >= mean)?.label}
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: `Mean (${mean})`,
                fill: isDark ? '#818cf8' : '#4f46e5',
                fontSize: 10,
                position: 'top',
              }}
            />
          )}

          {showMarkers && median !== undefined && (
            <ReferenceLine
              x={chartData.find((d) => d.bin_mid >= median)?.label}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="3 3"
              label={{
                value: `Median (${median})`,
                fill: '#f59e0b',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
