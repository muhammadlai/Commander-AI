import React, { ReactNode } from 'react';

interface QuickStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  badgeColor?: string;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendDirection = 'up',
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-slate-100 font-mono tracking-tight">{value}</h3>
        {trend && (
          <span
            className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${
              trendDirection === 'up'
                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                : trendDirection === 'down'
                ? 'bg-rose-950/70 text-rose-400 border-rose-800/60'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] text-slate-400 mt-2 font-sans">{subtitle}</p>}
    </div>
  );
};
