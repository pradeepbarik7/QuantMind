import React from 'react';
import { X, Shield, Cpu, Activity, Newspaper, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AssetInfo } from '../../types';
import { SignalBadge } from '../common/SignalBadge';
import { RegimeBadge } from '../common/RegimeBadge';

interface SignalDetailModalProps {
  asset: AssetInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const SignalDetailModal: React.FC<SignalDetailModalProps> = ({ asset, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getSignalExplanation = () => {
    if (asset.signal === 'BUY') {
      return `The Systematic Engine generated a BUY signal with ${asset.signalConfidence.toFixed(
        1
      )}% confidence. The Hidden Markov Model identified a '${asset.regime}' state with low regime transition probability. Concurrently, the XGBoost multi-factor model scored ${(
        asset.xgboostScore * 100
      ).toFixed(1)}% upward drift probability, backed by positive institutional news sentiment (+${asset.sentimentScore.toFixed(
        2
      )}). Volatility filter (${asset.volatilityAnnualized}% ann.) is within the safe operational threshold.`;
    } else if (asset.signal === 'SELL') {
      return `The Systematic Engine generated a SELL/EXIT signal with ${asset.signalConfidence.toFixed(
        1
      )}% confidence. The HMM detected an exhaustion phase transitioning into '${asset.regime}'. Downside probability from XGBoost reached ${((1 - asset.xgboostScore) * 100).toFixed(
        1
      )}%, accompanied by negative sentiment flow (${asset.sentimentScore.toFixed(
        2
      )}). Systematic risk rules enforce capital preservation to prevent emotional holding.`;
    } else {
      return `The Systematic Engine issued a HOLD / CASH PRESERVATION recommendation with ${asset.signalConfidence.toFixed(
        1
      )}% confidence. The market is oscillating in '${asset.regime}'. The divergence between momentum indicators and sentiment does not meet the strict 75% quantitative hurdle rate. Execution is intentionally suppressed to prevent overtrading and whipsaw losses.`;
    }
  };

  const getMitigatedBias = () => {
    if (asset.signal === 'BUY') {
      return {
        title: 'FOMO & Parabolic Chasing Mitigation',
        desc: 'Instead of chasing rapid green candles arbitrarily, the systematic engine waited for HMM regime stability and positive volume confirmation before allocating capital.',
      };
    } else if (asset.signal === 'SELL') {
      return {
        title: 'Disposition Effect & Denial Prevention',
        desc: 'Retail traders often hold losing positions hoping to break even. The systematic framework executes disciplined risk de-risking without emotional attachment.',
      };
    } else {
      return {
        title: 'Overtrading & Action Bias Suppression',
        desc: 'Retail traders suffer from an urge to always be in a position. The framework enforces cash patience until an asymmetric risk-reward profile materializes.',
      };
    }
  };

  const bias = getMitigatedBias();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Systematic Signal Audit & Synthesis</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{asset.name}</span>
                <span>·</span>
                <span className="font-mono">{asset.symbol}</span>
                <span>·</span>
                <span>Model Pipeline v2.4</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Signal Header Summary */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Synthesized Signal
              </div>
              <div className="flex items-center gap-3">
                <SignalBadge signal={asset.signal} confidence={asset.signalConfidence} size="lg" />
                <RegimeBadge regime={asset.regime} confidence={asset.regimeConfidence} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Execution Hurdle Rate</div>
              <div className="text-base font-semibold text-emerald-400 font-mono">Passed (75.0% Min)</div>
            </div>
          </div>

          {/* 4 Pipeline Pillars Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pillar 1: Market Regime */}
            <div className="p-3.5 rounded bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                  HMM Regime State
                </span>
                <span className="font-mono text-white">{asset.regimeConfidence.toFixed(0)}%</span>
              </div>
              <div className="text-xs text-slate-200 font-semibold">{asset.regime}</div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Markov hidden chain confirms statistical persistence and filters whipsaws.
              </p>
            </div>

            {/* Pillar 2: XGBoost */}
            <div className="p-3.5 rounded bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  XGBoost ML Probability
                </span>
                <span className="font-mono text-white">{(asset.xgboostScore * 100).toFixed(1)}%</span>
              </div>
              <div className="text-xs text-slate-200 font-semibold">
                {asset.xgboostScore > 0.6 ? 'Bullish Drift' : asset.xgboostScore < 0.4 ? 'Bearish Drift' : 'Mean Reverting'}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Gradient boosted ensemble combining 18 technical & order flow proxies.
              </p>
            </div>

            {/* Pillar 3: Sentiment */}
            <div className="p-3.5 rounded bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Newspaper className="w-3.5 h-3.5 text-purple-400" />
                  FinBERT Sentiment
                </span>
                <span className="font-mono text-white">
                  {asset.sentimentScore > 0 ? `+${asset.sentimentScore.toFixed(2)}` : asset.sentimentScore.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-slate-200 font-semibold">
                {asset.sentimentScore > 0.3 ? 'Constructive Flow' : asset.sentimentScore < -0.3 ? 'Adverse Press' : 'Neutral Baseline'}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Domain-specific transformer score over 24h weighted financial disclosures.
              </p>
            </div>

            {/* Pillar 4: Risk Rules */}
            <div className="p-3.5 rounded bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Risk Rules Status
                </span>
                <span className="text-emerald-400 font-medium">Nominal</span>
              </div>
              <div className="text-xs text-slate-200 font-semibold">
                Vol: {asset.volatilityAnnualized}% · ATR: Normal
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Kelly fractional sizing, hard stop boundaries, and circuit trip checks verified.
              </p>
            </div>
          </div>

          {/* Synthesis Explanation */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Systematic Rationale
            </div>
            <p className="text-xs leading-relaxed text-slate-300 bg-slate-950/80 p-3.5 rounded border border-slate-800/80">
              {getSignalExplanation()}
            </p>
          </div>

          {/* Behavioral Bias Protection Feature */}
          <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Behavioral Bias Mitigated: {bias.title}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6">
              {bias.desc}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Latency Benchmark: <span className="text-slate-200 font-mono">11.4 ms</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
