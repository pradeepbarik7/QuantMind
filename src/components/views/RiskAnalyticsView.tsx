import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Activity,
  Calendar,
  Layers,
  Percent,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import {
  MOCK_BACKTEST_RESULTS,
  MONTHLY_RETURNS,
  generateEquityCurve,
  BEHAVIORAL_BIASES,
} from '../../data/mockMarketData';
import { Tooltip } from '../common/Tooltip';

export const RiskAnalyticsView: React.FC = () => {
  const equityData = generateEquityCurve(1000000);

  // Extract drawdown series for underwater chart
  const drawdownSeries = equityData.map((pt) => ({
    date: pt.date,
    drawdown: pt.drawdownPercent,
  }));

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Risk Profiling & Quantitative Performance Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical risk decomposition, underwater drawdowns, and empirical bias attenuation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Risk Posture:</span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
            NOMINAL (LOW RISK)
          </span>
        </div>
      </div>

      {/* Primary Risk KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Sharpe Ratio */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Sharpe Ratio</span>
            <Tooltip content="Mean excess return over risk-free rate divided by return standard deviation." />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {MOCK_BACKTEST_RESULTS.sharpeRatio}
          </div>
          <div className="text-[11px] text-slate-400">
            Sortino: <span className="text-white font-mono">{MOCK_BACKTEST_RESULTS.sortinoRatio}</span>
          </div>
        </div>

        {/* Max Drawdown */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Max Drawdown</span>
            <Tooltip content="Worst historical portfolio decline from peak to trough." />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 tabular-nums">
            {MOCK_BACKTEST_RESULTS.maxDrawdownPct}%
          </div>
          <div className="text-[11px] text-slate-400">
            Recovery: <span className="text-white font-mono">19 Days</span>
          </div>
        </div>

        {/* Value at Risk (VaR 95%) */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Daily VaR (95%)</span>
            <Tooltip content="Maximum expected daily loss at 95% statistical confidence level." />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            -{MOCK_BACKTEST_RESULTS.var95Pct}%
          </div>
          <div className="text-[11px] text-slate-400">
            CVaR / ES: <span className="text-rose-400 font-mono">-1.84%</span>
          </div>
        </div>

        {/* Profit Factor */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Profit Factor</span>
            <Tooltip content="Ratio of gross profits to gross losses." />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {MOCK_BACKTEST_RESULTS.profitFactor}
          </div>
          <div className="text-[11px] text-slate-400">
            Expectancy: <span className="text-white font-mono">+{MOCK_BACKTEST_RESULTS.expectancy}%</span>
          </div>
        </div>

        {/* Volatility */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Ann. Volatility</span>
            <Tooltip content="Standard deviation of portfolio annualized returns." />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            11.2%
          </div>
          <div className="text-[11px] text-slate-400">
            NIFTY Vol: <span className="text-slate-300 font-mono">15.8%</span>
          </div>
        </div>

        {/* Calmar Ratio */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Calmar Ratio</span>
            <Tooltip content="CAGR divided by Maximum Drawdown magnitude." />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {MOCK_BACKTEST_RESULTS.calmarRatio}
          </div>
          <div className="text-[11px] text-slate-400">
            CAGR: <span className="text-white font-mono">{MOCK_BACKTEST_RESULTS.cagr}%</span>
          </div>
        </div>
      </div>

      {/* Underwater Drawdown Chart */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Underwater Drawdown Profile (%)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualizes portfolio declines from historical equity peaks. Note shallow drawdowns due to systematic risk exits.
            </p>
          </div>
          <span className="text-xs font-mono text-rose-400">Peak Drawdown Cap: -6.4%</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={drawdownSeries} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => val.slice(2, 7)}
              />
              <YAxis
                stroke="#64748b"
                orientation="right"
                domain={[-8, 0]}
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${Number(val).toFixed(2)}%`, 'Drawdown']}
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                name="Drawdown"
                stroke="#ef4444"
                strokeWidth={1.5}
                fill="url(#drawdownGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Returns Matrix (Periodic Performance Table) */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Periodic Monthly Returns Matrix (%)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Systematic month-by-month performance displaying consistency and drawdown mitigation across market cycles.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">2026 YTD: +19.3%</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3 text-left font-sans">Year</th>
                {monthNames.map((m) => (
                  <th key={m} className="py-2.5 px-2">{m}</th>
                ))}
                <th className="py-2.5 px-3 text-right font-sans text-white">YTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {MONTHLY_RETURNS.map((row) => (
                <tr key={row.year} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-2.5 px-3 text-left font-sans font-bold text-white">
                    {row.year}
                  </td>
                  {row.months.map((val, idx) => {
                    if (val === null) {
                      return (
                        <td key={idx} className="py-2.5 px-2 text-slate-600">
                          -
                        </td>
                      );
                    }
                    const isPositive = val >= 0;
                    return (
                      <td key={idx} className="py-2.5 px-2">
                        <span
                          className={`inline-block w-full py-0.5 rounded text-[11px] font-semibold ${
                            isPositive
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPositive ? '+' : ''}{val.toFixed(1)}%
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400 tabular-nums">
                    +{row.ytd.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Behavioral Bias Protection Scorecards */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Behavioral Bias Attenuation Performance Index</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical measurements verifying how systematic constraints protect user portfolio against irrational behaviors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {BEHAVIORAL_BIASES.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">{b.biasName}</span>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{b.psychologicalTrigger}</p>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="text-emerald-400 font-medium">Algorithmic Safeguard:</span> {b.systematicMitigationRule}
              </div>
              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                Outcome: {b.riskReductionMetric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
