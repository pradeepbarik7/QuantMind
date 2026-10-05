import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Play,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Layers,
  CheckCircle,
  FileText,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { AssetSymbol, TradeRecord, BacktestParameters } from '../../types';
import {
  ASSETS_DATA,
  generateEquityCurve,
  MOCK_TRADES,
  MOCK_BACKTEST_RESULTS,
} from '../../data/mockMarketData';
import { Tooltip } from '../common/Tooltip';
import { RegimeBadge } from '../common/RegimeBadge';

interface BacktestingViewProps {
  selectedAsset: AssetSymbol;
  onSelectAsset: (asset: AssetSymbol) => void;
}

export const BacktestingView: React.FC<BacktestingViewProps> = ({
  selectedAsset,
  onSelectAsset,
}) => {
  // Strategy Parameters
  const [params, setParams] = useState<BacktestParameters>({
    symbol: selectedAsset,
    startDate: '2025-04-01',
    endDate: '2026-10-01',
    initialCapital: 1000000, // ₹10,00,000
    positionSizingPct: 10,
    stopLossPct: 2.5,
    takeProfitPct: 5.0,
    regimeFilterEnabled: true,
    sentimentFilterEnabled: true,
    biasSuppressionLevel: 'Moderate',
  });

  const [isRunning, setIsRunning] = useState(false);
  const [tradeFilter, setTradeFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');

  // Equity Curve Data
  const equityData = useMemo(() => {
    return generateEquityCurve(params.initialCapital);
  }, [params.initialCapital]);

  const handleRunBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 700);
  };

  const filteredTrades = MOCK_TRADES.filter((t) => {
    if (tradeFilter === 'WIN') return t.pnl > 0;
    if (tradeFilter === 'LOSS') return t.pnl < 0;
    return true;
  });

  const currentCapital = equityData[equityData.length - 1]?.strategyEquity || params.initialCapital;
  const benchmarkFinal = equityData[equityData.length - 1]?.benchmarkEquity || params.initialCapital;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Play className="w-5 h-5 text-emerald-400" />
            <span>Historical Backtesting & Strategy Execution Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate quantitative performance and behavioral bias reduction over historical regimes.
          </p>
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Simulating Trades...' : 'Run Backtest Simulation'}</span>
        </button>
      </div>

      {/* Parameter Configuration Panel */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Strategy Configuration & Risk Rules
          </h3>
          <span className="text-xs text-slate-400">Walk-Forward Optimized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Asset Selection */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Target Asset Universe</label>
            <select
              value={params.symbol}
              onChange={(e) => {
                const s = e.target.value as AssetSymbol;
                setParams({ ...params, symbol: s });
                onSelectAsset(s);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {Object.keys(ASSETS_DATA).map((sym) => (
                <option key={sym} value={sym} className="bg-slate-900 text-white">
                  {sym} ({ASSETS_DATA[sym as AssetSymbol].name})
                </option>
              ))}
            </select>
          </div>

          {/* Initial Capital */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Initial Capital (INR)</label>
            <select
              value={params.initialCapital}
              onChange={(e) => setParams({ ...params, initialCapital: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer font-mono"
            >
              <option value={500000}>₹5,00,000 (Five Lakhs)</option>
              <option value={1000000}>₹10,00,000 (Ten Lakhs)</option>
              <option value={2500000}>₹25,00,000 (Twenty Five Lakhs)</option>
              <option value={5000000}>₹50,00,000 (Fifty Lakhs)</option>
            </select>
          </div>

          {/* Date Window */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium">Simulation Window</label>
            <select
              value={`${params.startDate}|${params.endDate}`}
              onChange={(e) => {
                const [s, end] = e.target.value.split('|');
                setParams({ ...params, startDate: s, endDate: end });
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="2025-04-01|2026-10-01">18 Months (Apr 2025 - Oct 2026)</option>
              <option value="2024-04-01|2026-10-01">2.5 Years (Apr 2024 - Oct 2026)</option>
              <option value="2023-10-01|2026-10-01">3 Years (Oct 2023 - Oct 2026)</option>
            </select>
          </div>

          {/* Bias Suppression Level */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-medium flex items-center justify-between">
              <span>Bias Suppression</span>
              <Tooltip content="Level of algorithmic veto applied against emotional retail behaviors (FOMO, Revenge Trading)." />
            </label>
            <select
              value={params.biasSuppressionLevel}
              onChange={(e) =>
                setParams({
                  ...params,
                  biasSuppressionLevel: e.target.value as any,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Conservative">Conservative (Strict Hurdle 80%)</option>
              <option value="Moderate">Moderate (Standard Hurdle 75%)</option>
              <option value="Aggressive">Aggressive (Hurdle 70%)</option>
            </select>
          </div>
        </div>

        {/* Secondary Parameters row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-800/60">
          <div>
            <label className="text-slate-500">Max Sizing / Trade</label>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              {params.positionSizingPct}% Capital Cap
            </div>
          </div>
          <div>
            <label className="text-slate-500">Systematic Stop-Loss</label>
            <div className="font-mono font-semibold text-rose-400 mt-0.5">
              -{params.stopLossPct}% Fixed Hard Floor
            </div>
          </div>
          <div>
            <label className="text-slate-500">Take-Profit Target</label>
            <div className="font-mono font-semibold text-emerald-400 mt-0.5">
              +{params.takeProfitPct}% Trailing Objective
            </div>
          </div>
          <div>
            <label className="text-slate-500">Multi-Model Filter</label>
            <div className="font-mono font-semibold text-sky-400 mt-0.5">
              HMM + FinBERT Active
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Return */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total Return</span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
            +{MOCK_BACKTEST_RESULTS.totalReturnPct}%
          </div>
          <div className="text-[10px] text-slate-500">
            Bench: +{MOCK_BACKTEST_RESULTS.benchmarkReturnPct}%
          </div>
        </div>

        {/* CAGR */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>CAGR</span>
            <Tooltip content="Compound Annual Growth Rate of the systematic strategy over the backtest window." />
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {MOCK_BACKTEST_RESULTS.cagr}%
          </div>
          <div className="text-[10px] text-emerald-400">Annualized</div>
        </div>

        {/* Win Rate */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Win Rate</span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
            {MOCK_BACKTEST_RESULTS.winRatePct}%
          </div>
          <div className="text-[10px] text-slate-400">
            {MOCK_BACKTEST_RESULTS.winningTrades}W / {MOCK_BACKTEST_RESULTS.losingTrades}L
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Max Drawdown</span>
            <Tooltip content="Largest observed peak-to-trough decline. System cut drawdown by over half compared to benchmark." />
          </div>
          <div className="text-lg font-bold font-mono text-rose-400 tabular-nums">
            {MOCK_BACKTEST_RESULTS.maxDrawdownPct}%
          </div>
          <div className="text-[10px] text-slate-500">Bench: -14.2%</div>
        </div>

        {/* Sharpe Ratio */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sharpe Ratio</span>
            <Tooltip content="Risk-adjusted excess return per unit of standard deviation (Risk-free rate assumed 6.5%)." />
          </div>
          <div className="text-lg font-bold font-mono text-sky-400 tabular-nums">
            {MOCK_BACKTEST_RESULTS.sharpeRatio}
          </div>
          <div className="text-[10px] text-slate-400">Sortino: {MOCK_BACKTEST_RESULTS.sortinoRatio}</div>
        </div>

        {/* Profit Factor */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Profit Factor</span>
            <Tooltip content="Gross profits divided by gross losses across all simulated closed positions." />
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {MOCK_BACKTEST_RESULTS.profitFactor}
          </div>
          <div className="text-[10px] text-emerald-400">High Edge</div>
        </div>

        {/* Total Trades */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total Trades</span>
          </div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">
            {MOCK_BACKTEST_RESULTS.totalTrades}
          </div>
          <div className="text-[10px] text-slate-400">~2.3/month (Pacing)</div>
        </div>
      </div>

      {/* Equity Curve Comparison Chart */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Strategy Equity Curve vs Buy & Hold Benchmark
            </h3>
            <p className="text-xs text-slate-400">
              Normalized growth of ₹{params.initialCapital.toLocaleString('en-IN')} with systematic risk management.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">
                Strategy: ₹{currentCapital.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-400">
                Benchmark: ₹{benchmarkFinal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={equityData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => {
                  const parts = val.split('-');
                  return `${parts[0].slice(2)}-${parts[1]}`;
                }}
              />
              <YAxis
                stroke="#64748b"
                orientation="right"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
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
                formatter={(value: any, name?: any) => [
                  `₹${Number(value).toLocaleString('en-IN')}`,
                  String(name ?? ''),
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
              />

              <Line
                type="monotone"
                dataKey="benchmarkEquity"
                name="Benchmark (Buy & Hold NIFTY)"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="strategyEquity"
                name="Systematic Execution Strategy"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trade History Table */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Simulated Trade Log & Behavioral Bias Attributions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Every trade details the precise psychological bias mitigated by systematic execution.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-0.5 bg-slate-950 border border-slate-800 rounded text-xs">
            {(['ALL', 'WIN', 'LOSS'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTradeFilter(filter)}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  tradeFilter === filter ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All Trades' : filter === 'WIN' ? 'Winners' : 'Losses'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Trade ID</th>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Entry / Exit</th>
                <th className="py-2.5 px-3 text-right">Entry Price</th>
                <th className="py-2.5 px-3 text-right">Exit Price</th>
                <th className="py-2.5 px-3 text-right">P&L (INR)</th>
                <th className="py-2.5 px-3 text-right">Return %</th>
                <th className="py-2.5 px-3">Regime</th>
                <th className="py-2.5 px-3">Behavioral Bias Prevented</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-mono text-slate-200">
              {filteredTrades.map((trade) => {
                const isWin = trade.pnl > 0;
                return (
                  <tr key={trade.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-semibold">{trade.id}</td>
                    <td className="py-3 px-3 font-sans font-bold text-white">{trade.symbol}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          trade.type === 'BUY'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {trade.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      <div>In: {trade.entryDate}</div>
                      <div>Out: {trade.exitDate} ({trade.holdingPeriodDays}d)</div>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      ₹{trade.entryPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      ₹{trade.exitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold">
                      <span className={isWin ? 'text-emerald-400' : 'text-rose-400'}>
                        {isWin ? '+' : ''}₹{trade.pnl.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold">
                      <span className={isWin ? 'text-emerald-400' : 'text-rose-400'}>
                        {isWin ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <RegimeBadge regime={trade.regimeAtEntry} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-sans text-xs text-slate-300 max-w-xs">
                      {trade.biasPrevented}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
