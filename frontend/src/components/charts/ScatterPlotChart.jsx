import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function ScatterPlotChart({ scatterData, showRegressionLine = true }) {
  const { isDark } = useTheme();

  if (!scatterData || !scatterData.points) {
    return <div className="text-center py-12 text-slate-400">No scatter data available.</div>;
  }

  const {
    points,
    regression_line,
    x_name,
    y_name,
    equation,
    pearson_r,
    r_squared_pct,
    strength,
    strength_badge
  } = scatterData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md text-xs space-y-1.5 z-50">
          <p className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
            Data Point #{d.id}
          </p>
          <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>{x_name} (X):</span>
            <span className="font-mono font-bold text-indigo-500">{d.x}</span>
          </div>
          <div className="flex justify-between gap-4 text-slate-600 dark:text-slate-300">
            <span>{y_name} (Y):</span>
            <span className="font-mono font-bold text-cyan-500">{d.y}</span>
          </div>
          {d.y_pred !== undefined && (
            <div className="flex justify-between gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Fitted ŷ:</span>
              <span className="font-mono">{d.y_pred} (Residual: {d.residual})</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Format data for ComposedChart so regression line and scatter share the domain
  const mergedData = points.map((p) => ({
    ...p,
    reg_y: null,
  }));

  // Add regression line endpoints
  if (showRegressionLine && regression_line && regression_line.length >= 2) {
    mergedData.push({
      x: regression_line[0].x,
      y: null,
      reg_y: regression_line[0].y,
    });
    mergedData.push({
      x: regression_line[1].x,
      y: null,
      reg_y: regression_line[1].y,
    });
    // Sort by x
    mergedData.sort((a, b) => a.x - b.x);
  }

  return (
    <div className="space-y-4">
      {/* Equation and Stats Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 font-mono text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {equation}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Pearson r: <strong className="text-indigo-600 dark:text-indigo-400">{pearson_r}</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            r²: <strong className="text-cyan-600 dark:text-cyan-400">{r_squared_pct}%</strong>
          </div>
          <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {strength}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mergedData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#1f2937' : '#e2e8f0'}
            />
            <XAxis
              type="number"
              dataKey="x"
              name={x_name}
              domain={['auto', 'auto']}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              label={{
                value: x_name,
                position: 'insideBottom',
                offset: -10,
                fill: isDark ? '#94a3b8' : '#64748b',
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={y_name}
              domain={['auto', 'auto']}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: y_name,
                angle: -90,
                position: 'insideLeft',
                fill: isDark ? '#94a3b8' : '#64748b',
                fontSize: 11,
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Regression Line */}
            {showRegressionLine && (
              <Line
                type="linear"
                dataKey="reg_y"
                stroke="#ec4899"
                strokeWidth={3}
                dot={false}
                name="Fitted Regression Line"
                connectNulls={true}
              />
            )}

            {/* Data Scatter */}
            <Scatter
              name="Observations"
              dataKey="y"
              fill="#6366f1"
              line={false}
              shape={(props) => {
                const { cx, cy } = props;
                if (!cx || !cy) return null;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
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
    </div>
  );
}
