import React from 'react';
import { Activity, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MarketRegimeType } from '../../types';

interface RegimeBadgeProps {
  regime: MarketRegimeType;
  confidence?: number;
  size?: 'sm' | 'md';
}

export const RegimeBadge: React.FC<RegimeBadgeProps> = ({
  regime,
  confidence,
  size = 'md',
}) => {
  const getRegimeDetails = (regime: MarketRegimeType) => {
    switch (regime) {
      case 'Bullish Trending':
        return {
          icon: ArrowUpRight,
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
          dot: 'bg-emerald-400',
        };
      case 'Bearish Trending':
        return {
          icon: ArrowDownRight,
          color: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
          dot: 'bg-rose-400',
        };
      case 'High Volatility':
        return {
          icon: ShieldAlert,
          color: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
          dot: 'bg-purple-400',
        };
      case 'Sideways / Neutral':
      default:
        return {
          icon: Activity,
          color: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
          dot: 'bg-sky-400',
        };
    }
  };

  const details = getRegimeDetails(regime);
  const Icon = details.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border ${details.color} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${details.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{regime}</span>
      {confidence !== undefined && (
        <span className="font-mono text-[10px] text-slate-400 tabular-nums border-l border-slate-700/60 pl-1.5">
          {confidence.toFixed(0)}%
        </span>
      )}
    </span>
  );
};
