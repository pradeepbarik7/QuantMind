import React, { useState } from 'react';
import {
  TrendingUp,
  Shield,
  Cpu,
  Search,
  ArrowRight,
  Activity,
  Layers,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { AssetSymbol, AssetInfo } from '../../types';
import { ASSETS_DATA, BEHAVIORAL_BIASES } from '../../data/mockMarketData';
import { SignalBadge } from '../common/SignalBadge';
import { RegimeBadge } from '../common/RegimeBadge';
import { Tooltip } from '../common/Tooltip';

interface HomeViewProps {
  onSelectAssetAndAnalyze: (asset: AssetSymbol) => void;
  onNavigateTab: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectAssetAndAnalyze,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const assets = Object.values(ASSETS_DATA);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.sector.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      sectorFilter === 'ALL' ||
      (sectorFilter === 'INDEX' && asset.exchange === 'INDEX') ||
      (sectorFilter === 'IT' && asset.sector.includes('Information Technology')) ||
      (sectorFilter === 'BANKING' && (asset.sector.includes('Banking') || asset.symbol === 'BANKNIFTY'));

    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero / Platform Overview */}
      <section className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 p-6 sm:p-8 overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>QuantMind · Final-Year B.Tech Capstone Project</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
            High Speed Systematic Execution Framework For Behavioural Bias Mitigation
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            An algorithmic decision-support architecture developed to eliminate emotional human biases—such as
            panic selling, fear of missing out (FOMO), and loss aversion—by systematically synthesizing
            market-regime detection (Hidden Markov Models), machine learning directional prediction (XGBoost),
            and institutional financial news sentiment (FinBERT).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-medium">NSE Live Sim</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Tick Latency: <span className="font-mono text-slate-200">11.4ms</span></span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Systematic Rule Engine: <span className="text-emerald-400 font-medium">Armed</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Search & Quick Market Summary */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Market Universe</h2>
            <p className="text-xs text-slate-400">
              Select an Indian index or equity asset to evaluate real-time systematic signals and regime states.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            {/* Segmented filter controls */}
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded">
              {(['ALL', 'INDEX', 'IT', 'BANKING'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSectorFilter(filter)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    sectorFilter === filter
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
            No assets match &ldquo;{searchQuery}&rdquo;. Try searching for NIFTY, BANKNIFTY, RELIANCE, TCS, or INFY.
            <div className="mt-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSectorFilter('ALL');
                }}
                className="px-3 py-1 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-colors"
              >
                Reset Search Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset) => {
              const isPositive = asset.change >= 0;
              return (
                <div
                  key={asset.symbol}
                  className="group relative rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top Row: Symbol & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white tracking-tight">
                            {asset.symbol}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {asset.exchange}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[180px]">
                          {asset.name}
                        </div>
                      </div>

                      <SignalBadge
                        signal={asset.signal}
                        confidence={asset.signalConfidence}
                        size="sm"
                      />
                    </div>

                    {/* Price and Change */}
                    <div className="pt-1 flex items-baseline justify-between border-t border-slate-800/80">
                      <div>
                        <div className="text-xl font-bold font-mono text-white tabular-nums">
                          ₹{asset.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div
                          className={`text-xs font-mono font-medium flex items-center gap-1 ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <span>{isPositive ? '+' : ''}{asset.change.toFixed(2)}</span>
                          <span>({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] text-slate-500">Vol: {asset.volume}</div>
                        <div className="text-[11px] text-slate-400">
                          VWAP: ₹{asset.vwap.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Regime and ML Indicators */}
                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/60">
                      <div className="flex items-center gap-1.5">
                        <RegimeBadge regime={asset.regime} size="sm" />
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        XGB: {(asset.xgboostScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-4 mt-3 border-t border-slate-800">
                    <button
                      onClick={() => onSelectAssetAndAnalyze(asset.symbol)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-emerald-600 rounded transition-colors cursor-pointer group-hover:bg-emerald-600"
                    >
                      <span>Analyze Asset</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Behavioral Bias Mitigation Architecture Section */}
      <section className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white tracking-tight">
                Behavioral Bias Mitigation Engine
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical cognitive biases in discretionary trading systematically addressed via quantitative constraints.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('risk')}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View Risk Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BEHAVIORAL_BIASES.slice(0, 3).map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200">{b.biasName}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  <span className="text-slate-500 font-medium">Trigger:</span> {b.psychologicalTrigger}
                </div>
                <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-emerald-400 font-medium">Mitigation:</span> {b.systematicMitigationRule}
                </div>
              </div>
              <div className="text-[11px] font-mono text-emerald-400/90 pt-2 border-t border-slate-800/60">
                {b.riskReductionMetric}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Stage Systematic Pipeline Overview for College Evaluators */}
      <section className="rounded-xl bg-slate-900/40 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Systematic Decision Pipeline Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-semibold">STAGE 01</div>
            <div className="text-sm font-semibold text-white">Data & Feature Pipeline</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              OHLCV normalization from tick data, rolling volatility, ATR, RSI-14, MACD, and Bollinger envelopes.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
            <div className="text-xs font-mono text-sky-400 font-semibold">STAGE 02</div>
            <div className="text-sm font-semibold text-white">HMM Regime Detection</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              4-state Hidden Markov Model identifies latent market dynamics (Bullish, Bearish, Sideways, High Volatility).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
            <div className="text-xs font-mono text-purple-400 font-semibold">STAGE 03</div>
            <div className="text-sm font-semibold text-white">XGBoost & FinBERT NLP</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gradient-boosted decision trees calculate directional drift probability while FinBERT quantifies financial news tone.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
            <div className="text-xs font-mono text-amber-400 font-semibold">STAGE 04</div>
            <div className="text-sm font-semibold text-white">Systematic Risk Synthesis</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Signal arbitration engine applies 75% confidence hurdles, volatility boundaries, and emotion-free sizing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
