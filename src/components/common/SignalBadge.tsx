import React from 'react';
import { TrendingUp, TrendingDown, PauseCircle } from 'lucide-react';
import { SignalType } from '../../types';

interface SignalBadgeProps {
  signal: SignalType;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({
  signal,
  confidence,
  size = 'md',
  showConfidence = true,
}) => {
  const config = {
    BUY: {
      label: 'BUY',
      bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-400',
      indicator: 'bg-emerald-400',
      icon: TrendingUp,
    },
    SELL: {
      label: 'SELL',
      bg: 'bg-rose-950/70 border-rose-500/40 text-rose-400',
      indicator: 'bg-rose-400',
      icon: TrendingDown,
    },
    HOLD: {
      label: 'HOLD',
      bg: 'bg-amber-950/70 border-amber-500/40 text-amber-400',
      indicator: 'bg-amber-400',
      icon: PauseCircle,
    },
  }[signal];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-2.5 py-1 gap-2',
    lg: 'text-sm font-bold px-3.5 py-1.5 gap-2.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded border ${config.bg} ${sizeClasses} tracking-wide transition-all`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.indicator}`} />
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
      {showConfidence && confidence !== undefined && (
        <span className="text-slate-400 font-mono font-normal text-[11px] tabular-nums border-l border-slate-700/60 pl-1.5">
          {confidence.toFixed(1)}%
        </span>
      )}
    </span>
  );
};
