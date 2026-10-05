import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  BarChart2,
  Calendar,
  Eye,
  Sliders,
  Maximize2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AssetSymbol, AssetInfo } from '../../types';
import { ASSETS_DATA, generatePriceHistory, FEATURE_IMPORTANCES } from '../../data/mockMarketData';
import { SignalBadge } from '../common/SignalBadge';
import { RegimeBadge } from '../common/RegimeBadge';
import { Tooltip } from '../common/Tooltip';

interface MarketAnalysisViewProps {
  selectedAsset: AssetSymbol;
  onSelectAsset: (asset: AssetSymbol) => void;
  onOpenSignalModal: () => void;
}

export const MarketAnalysisView: React.FC<MarketAnalysisViewProps> = ({
  selectedAsset,
  onSelectAsset,
  onOpenSignalModal,
}) => {
  const asset = ASSETS_DATA[selectedAsset];
  const [timeframe, setTimeframe] = useState<'30D' | '60D' | '90D'>('90D');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [chartMode, setChartMode] = useState<'area' | 'line'>('area');

  const rawHistory = useMemo(() => generatePriceHistory(selectedAsset), [selectedAsset]);

  const displayData = useMemo(() => {
    const days = timeframe === '30D' ? 30 : timeframe === '60D' ? 60 : 90;
    return rawHistory.slice(-days);
  }, [rawHistory, timeframe]);

  const isPositive = asset.change >= 0;

  // Min and max for YAxis scaling
  const minPrice = useMemo(() => {
    const min = Math.min(...displayData.map((d) => d.low));
    return Math.floor(min * 0.98);
  }, [displayData]);

  const maxPrice = useMemo(() => {
    const max = Math.max(...displayData.map((d) => d.high));
    return Math.ceil(max * 1.02);
  }, [displayData]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Asset Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Asset Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Asset:
            </span>
            <select
              value={selectedAsset}
              onChange={(e) => onSelectAsset(e.target.value as AssetSymbol)}
              className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {Object.keys(ASSETS_DATA).map((sym) => (
                <option key={sym} value={sym} className="bg-slate-900 text-white">
                  {sym} - {ASSETS_DATA[sym as AssetSymbol].name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Quick Details */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300">
              {asset.exchange}
            </span>
            <span>·</span>
            <span>{asset.sector}</span>
          </div>
        </div>

        {/* Signal & Audit CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Engine Signal:</span>
            <SignalBadge
              signal={asset.signal}
              confidence={asset.signalConfidence}
              size="md"
            />
          </div>

          <button
            onClick={onOpenSignalModal}
            className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Audit Rationale</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Latest Price */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Latest Price</span>
            <Tooltip content="Live simulated NSE price tick synchronized to market micro-structure." />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            ₹{asset.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div
            className={`text-xs font-mono font-medium flex items-center gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{asset.change.toFixed(2)}</span>
            <span>({isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Market Regime */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Market Regime</span>
            <Tooltip content="Hidden Markov Model classification of the underlying statistical state." />
          </div>
          <div className="pt-0.5">
            <RegimeBadge regime={asset.regime} size="sm" />
          </div>
          <div className="text-[11px] text-slate-400 pt-0.5">
            State Confidence: <span className="font-mono text-white">{asset.regimeConfidence.toFixed(0)}%</span>
          </div>
        </div>

        {/* Day Range */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Day Range</span>
          </div>
          <div className="text-xs font-mono text-slate-200">
            L: ₹{asset.low.toFixed(1)}
          </div>
          <div className="text-xs font-mono text-slate-200">
            H: ₹{asset.high.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Open: ₹{asset.open.toFixed(1)}
          </div>
        </div>

        {/* 52-Week Range */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>52W High / Low</span>
          </div>
          <div className="text-xs font-mono text-emerald-400/90">
            H: ₹{asset.high52w.toFixed(1)}
          </div>
          <div className="text-xs font-mono text-rose-400/90">
            L: ₹{asset.low52w.toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-500">
            VWAP: ₹{asset.vwap.toFixed(1)}
          </div>
        </div>

        {/* Volatility */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Realized Volatility</span>
            <Tooltip content="Annualized 20-day historical standard deviation of logarithmic returns." />
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {asset.volatilityAnnualized.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">
            Risk Filter: <span className="text-emerald-400 font-medium">Safe</span>
          </div>
        </div>

        {/* ML Score */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>XGBoost Drift</span>
            <Tooltip content="Gradient-boosted decision trees upward probability forecast." />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
            {(asset.xgboostScore * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400">
            Sentiment: <span className="font-mono text-slate-200">+{asset.sentimentScore.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        {/* Chart Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Systematic Price Action & Statistical Envelopes</span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Indicator Toggles */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded text-xs">
              <button
                onClick={() => setShowSMA20(!showSMA20)}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                  showSMA20 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                SMA 20
              </button>
              <button
                onClick={() => setShowEMA50(!showEMA50)}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                  showEMA50 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                EMA 50
              </button>
              <button
                onClick={() => setShowBollinger(!showBollinger)}
                className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                  showBollinger ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Bollinger Bands
              </button>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded text-xs">
              {(['30D', '60D', '90D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                    timeframe === tf ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Chart Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="bbBandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => {
                  const parts = val.split('-');
                  return `${parts[1]}/${parts[2]}`;
                }}
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                stroke="#64748b"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${val}`}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: any, name?: any) => {
                  const n = String(name ?? '');
                  if (n === 'Close Price') return [`₹${Number(value).toFixed(2)}`, n];
                  if (n === 'SMA 20') return [`₹${Number(value).toFixed(2)}`, n];
                  if (n === 'EMA 50') return [`₹${Number(value).toFixed(2)}`, n];
                  if (n === 'Upper Band' || n === 'Lower Band') return [`₹${Number(value).toFixed(2)}`, n];
                  return [value, n];
                }}
              />

              {/* Bollinger Bands */}
              {showBollinger && (
                <>
                  <Line
                    type="monotone"
                    dataKey="upperBand"
                    name="Upper Band"
                    stroke="#a855f7"
                    strokeDasharray="2 2"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="lowerBand"
                    name="Lower Band"
                    stroke="#a855f7"
                    strokeDasharray="2 2"
                    dot={false}
                    strokeWidth={1}
                  />
                </>
              )}

              {/* Moving Averages */}
              {showSMA20 && (
                <Line
                  type="monotone"
                  dataKey="sma20"
                  name="SMA 20"
                  stroke="#f59e0b"
                  dot={false}
                  strokeWidth={1.5}
                />
              )}
              {showEMA50 && (
                <Line
                  type="monotone"
                  dataKey="ema50"
                  name="EMA 50"
                  stroke="#06b6d4"
                  dot={false}
                  strokeWidth={1.5}
                />
              )}

              {/* Main Price Area */}
              <Area
                type="monotone"
                dataKey="close"
                name="Close Price"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Subchart */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Volume Profile (Institutional Liquidity)</span>
            <span className="text-[11px] font-mono">Avg Vol: {asset.volume}</span>
          </div>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#64748b" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Bar dataKey="volume" fill="#334155" opacity={0.65} radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Technical & Model Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model Features Table */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white tracking-tight">
              Feature Engine & Risk Weights
            </h4>
            <span className="text-xs text-slate-400 font-mono">SHAP Analyzed</span>
          </div>

          <div className="space-y-2 text-xs">
            {FEATURE_IMPORTANCES.map((feat, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded bg-slate-950 border border-slate-850 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>{feat.feature}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      · {feat.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {feat.description}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-emerald-400 font-semibold">
                    {feat.currentValue}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Weight: {(feat.weight * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HMM Regime State Transition & Bias Shield */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              HMM Regime State Decomposition
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hidden Markov Model infers unobservable market phases from returns distribution and volatility clustering.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Bullish Trending State</span>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {selectedAsset === 'INFY' ? '12.4%' : selectedAsset === 'RELIANCE' ? '88.0%' : '76.2%'}
              </div>
              <p className="text-[11px] text-slate-500">Low volatility drift regime</p>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Sideways / Noise State</span>
              <div className="text-lg font-bold font-mono text-sky-400">
                {selectedAsset === 'BANKNIFTY' ? '71.0%' : selectedAsset === 'TCS' ? '65.2%' : '14.5%'}
              </div>
              <p className="text-[11px] text-slate-500">High false-breakout risk</p>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">Bearish Trending State</span>
              <div className="text-lg font-bold font-mono text-rose-400">
                {selectedAsset === 'INFY' ? '79.4%' : '5.8%'}
              </div>
              <p className="text-[11px] text-slate-500">Accelerated downside regime</p>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-medium">High Volatility State</span>
              <div className="text-lg font-bold font-mono text-purple-400">
                {selectedAsset === 'BANKNIFTY' ? '18.2%' : '8.1%'}
              </div>
              <p className="text-[11px] text-slate-500">Panic clustering regime</p>
            </div>
          </div>

          {/* Active Bias Shield Card */}
          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1.5">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span>Active Bias Shield:</span>
              <span className="text-white">
                {asset.signal === 'BUY'
                  ? 'FOMO Overextension Prevention'
                  : asset.signal === 'SELL'
                  ? 'Disposition Effect Suppression'
                  : 'Overtrading Block Active'}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Systematic execution strictly requires all 4 validation hurdles (Regime + XGBoost + FinBERT + Volatility) before emitting execution events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
