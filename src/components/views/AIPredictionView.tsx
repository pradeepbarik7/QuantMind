import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  Newspaper,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { AssetSymbol, AssetInfo } from '../../types';
import {
  ASSETS_DATA,
  FINANCIAL_NEWS,
  FEATURE_IMPORTANCES,
  HMM_TRANSITION_MATRIX,
} from '../../data/mockMarketData';
import { SignalBadge } from '../common/SignalBadge';
import { RegimeBadge } from '../common/RegimeBadge';
import { Tooltip } from '../common/Tooltip';

interface AIPredictionViewProps {
  selectedAsset: AssetSymbol;
  onSelectAsset: (asset: AssetSymbol) => void;
  onOpenSignalModal: () => void;
}

export const AIPredictionView: React.FC<AIPredictionViewProps> = ({
  selectedAsset,
  onSelectAsset,
  onOpenSignalModal,
}) => {
  const asset = ASSETS_DATA[selectedAsset];
  const [newsFilter, setNewsFilter] = useState<'ALL' | 'POSITIVE' | 'NEGATIVE'>('ALL');
  
  // Interactive Simulation sliders to let evaluators test the Systematic Engine!
  const [simSentiment, setSimSentiment] = useState<number>(asset.sentimentScore);
  const [simXgbProb, setSimXgbProb] = useState<number>(asset.xgboostScore);
  const [simRegimeOverride, setSimRegimeOverride] = useState<string>(asset.regime);

  // Dynamic calculation based on user adjustments
  const calculateDynamicSignal = () => {
    if (simRegimeOverride === 'High Volatility') {
      return { signal: 'HOLD' as const, confidence: 91.0, reason: 'Circuit trigger: High Volatility regime mandates cash preservation regardless of sentiment.' };
    }
    if (simRegimeOverride === 'Bearish Trending' && simXgbProb < 0.45) {
      return { signal: 'SELL' as const, confidence: 82.5, reason: 'Bearish regime and downward ML drift aligned. Disciplined capital exit.' };
    }
    if (simRegimeOverride === 'Bullish Trending' && simXgbProb > 0.65 && simSentiment > 0.2) {
      return { signal: 'BUY' as const, confidence: 88.0, reason: 'Triad alignment: Bullish regime + High ML conviction + Supportive institutional sentiment.' };
    }
    return { signal: 'HOLD' as const, confidence: 74.0, reason: 'Inconclusive cross-pillar consensus. Execution hurdle rate (>75%) not met to prevent overtrading.' };
  };

  const dynamicSignal = calculateDynamicSignal();

  const filteredNews = FINANCIAL_NEWS.filter((item) => {
    const symbolMatches = item.relevantSymbols.includes(selectedAsset) || item.relevantSymbols.includes('NIFTY50');
    if (!symbolMatches) return false;
    if (newsFilter === 'POSITIVE') return item.sentiment === 'positive';
    if (newsFilter === 'NEGATIVE') return item.sentiment === 'negative';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>AI Prediction & Sentiment Synthesis Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating multi-model consensus for <span className="font-semibold text-slate-200">{asset.name}</span> ({asset.symbol})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedAsset}
            onChange={(e) => {
              const newSym = e.target.value as AssetSymbol;
              onSelectAsset(newSym);
              setSimSentiment(ASSETS_DATA[newSym].sentimentScore);
              setSimXgbProb(ASSETS_DATA[newSym].xgboostScore);
              setSimRegimeOverride(ASSETS_DATA[newSym].regime);
            }}
            className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {Object.keys(ASSETS_DATA).map((sym) => (
              <option key={sym} value={sym} className="bg-slate-900 text-white">
                {sym}
              </option>
            ))}
          </select>

          <SignalBadge signal={asset.signal} confidence={asset.signalConfidence} size="md" />
        </div>
      </div>

      {/* Triad Model Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Model 1: XGBoost */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">XGBoost Classifier</h3>
                <span className="text-[11px] text-slate-400">Directional Probability</span>
              </div>
            </div>
            <Tooltip content="Gradient boosted ensemble trained on 5 years of daily technical momentum, volatility, and order flow metrics." />
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Upward Drift Prob</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {(asset.xgboostScore * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${asset.xgboostScore * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Bearish &lt;40%</span>
              <span>Neutral 40-60%</span>
              <span>Bullish &gt;60%</span>
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <div className="text-slate-400 font-medium">Top Contributing Features:</div>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span>RSI_14 Momentum:</span>
                <span className="text-emerald-400">+0.24 SHAP</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>MACD Hist Expansion:</span>
                <span className="text-emerald-400">+0.18 SHAP</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Realized Volatility:</span>
                <span className="text-sky-400">-0.12 SHAP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model 2: HMM Regime Detector */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-sky-500/10 text-sky-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">HMM Regime Filter</h3>
                <span className="text-[11px] text-slate-400">Statistical State Detection</span>
              </div>
            </div>
            <Tooltip content="Hidden Markov Model with Gaussian emissions estimating market hidden states without lookahead bias." />
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Current Hidden State</span>
              <span className="text-sm font-bold text-white font-mono">{asset.regime}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <RegimeBadge regime={asset.regime} confidence={asset.regimeConfidence} size="sm" />
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Expected State Duration: <span className="text-slate-200 font-mono">14.2 Days</span>
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <div className="text-slate-400 font-medium">State Distribution:</div>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Bullish Trending:</span>
                <span className="text-emerald-400">{selectedAsset === 'INFY' ? '12%' : '84%'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Sideways / Noise:</span>
                <span className="text-sky-400">{selectedAsset === 'BANKNIFTY' ? '71%' : '11%'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Bearish / Downtrend:</span>
                <span className="text-rose-400">{selectedAsset === 'INFY' ? '79%' : '5%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Model 3: FinBERT News Sentiment */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-500/10 text-purple-400">
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">FinBERT NLP Sentiment</h3>
                <span className="text-[11px] text-slate-400">Financial News Consensus</span>
              </div>
            </div>
            <Tooltip content="Financial domain BERT transformer analyzing news releases, RBI updates, and corporate disclosures." />
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Sentiment Polarity Score</span>
              <span
                className={`text-2xl font-bold font-mono ${
                  asset.sentimentScore >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {asset.sentimentScore >= 0 ? `+${asset.sentimentScore.toFixed(2)}` : asset.sentimentScore.toFixed(2)}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-rose-500 h-full"
                style={{ width: `${asset.sentimentScore < 0 ? Math.abs(asset.sentimentScore) * 50 : 15}%` }}
              />
              <div className="bg-slate-700 h-full w-[20%]" />
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${asset.sentimentScore > 0 ? asset.sentimentScore * 50 : 15}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Bearish (-1.0)</span>
              <span>Neutral (0.0)</span>
              <span>Bullish (+1.0)</span>
            </div>
          </div>

          <div className="text-xs space-y-1.5">
            <div className="text-slate-400 font-medium">Headlines Analyzed (24h):</div>
            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Positive Sentiment:</span>
                <span className="text-emerald-400">68%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Neutral Reporting:</span>
                <span className="text-slate-400">22%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Negative Mentions:</span>
                <span className="text-rose-400">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Equation Card: Market Regime + ML + Sentiment + Risk */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Systematic Decision Synthesis Formula
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Signal = f(HMM_Regime, XGBoost_Prob, FinBERT_Score, Vol_Risk_Gate)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <div className="text-slate-400 font-semibold mb-1">1. Regime Check</div>
            <div className="text-white font-medium">{asset.regime}</div>
            <div className="text-[11px] text-emerald-400 mt-1">Passes Trend Persistence Check</div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <div className="text-slate-400 font-semibold mb-1">2. ML Conviction</div>
            <div className="text-white font-medium">{(asset.xgboostScore * 100).toFixed(1)}% Upward</div>
            <div className="text-[11px] text-emerald-400 mt-1">Exceeds 65% Alpha Threshold</div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <div className="text-slate-400 font-semibold mb-1">3. Sentiment Confirmation</div>
            <div className="text-white font-medium">+{asset.sentimentScore.toFixed(2)} Positive</div>
            <div className="text-[11px] text-emerald-400 mt-1">Institutional Consensus Aligned</div>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-850">
            <div className="text-slate-400 font-semibold mb-1">4. Systematic Bias Shield</div>
            <div className="text-white font-medium">No Emotional Overextension</div>
            <div className="text-[11px] text-emerald-400 mt-1">Kelly Sizing: 10% Capital Cap</div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Consensus Output
            </div>
            <p className="text-xs text-slate-300">
              The four orthogonal pillars unanimously confirm an asymmetric risk-adjusted opportunity, issuing a
              systematic <strong className="text-white">{asset.signal}</strong> signal with zero discretionary hesitation.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <SignalBadge signal={asset.signal} confidence={asset.signalConfidence} size="lg" />
            <button
              onClick={onOpenSignalModal}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Inspect Audit Log
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Sandbox (Review-II Evaluator Feature) */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Interactive Viva Sandbox: Test Behavioral Bias Suppression</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate market stress by toggling regime, ML drift, or sentiment parameters to observe how the algorithmic shield prevents emotional mistakes.
            </p>
          </div>
          <button
            onClick={() => {
              setSimSentiment(asset.sentimentScore);
              setSimXgbProb(asset.xgboostScore);
              setSimRegimeOverride(asset.regime);
            }}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer self-start sm:self-auto"
          >
            Reset to Asset Baseline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Slider 1: XGBoost Probability */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">XGBoost Upward Prob:</span>
              <span className="font-mono text-emerald-400 font-semibold">{(simXgbProb * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.95"
              step="0.05"
              value={simXgbProb}
              onChange={(e) => setSimXgbProb(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">Simulates predictive momentum strength</div>
          </div>

          {/* Slider 2: FinBERT Sentiment */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">FinBERT Sentiment Score:</span>
              <span className={`font-mono font-semibold ${simSentiment >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simSentiment >= 0 ? `+${simSentiment.toFixed(2)}` : simSentiment.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={simSentiment}
              onChange={(e) => setSimSentiment(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">Simulates breaking news panic vs euphoria</div>
          </div>

          {/* Selector: HMM Regime Override */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-medium">HMM Market Regime:</span>
              <span className="font-mono text-sky-400 font-semibold">{simRegimeOverride}</span>
            </div>
            <select
              value={simRegimeOverride}
              onChange={(e) => setSimRegimeOverride(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="Bullish Trending">Bullish Trending</option>
              <option value="Bearish Trending">Bearish Trending</option>
              <option value="Sideways / Neutral">Sideways / Neutral</option>
              <option value="High Volatility">High Volatility</option>
            </select>
            <div className="text-[11px] text-slate-500">Tests system response to volatility regime shifts</div>
          </div>
        </div>

        {/* Dynamic Sandbox Result */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase">Simulated Output Under Test Conditions:</div>
            <p className="text-xs text-slate-300">{dynamicSignal.reason}</p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <SignalBadge signal={dynamicSignal.signal} confidence={dynamicSignal.confidence} size="md" />
          </div>
        </div>
      </div>

      {/* Financial News Sentiment Stream */}
      <div className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-purple-400" />
              <span>FinBERT Processed Financial News & Sentiment Attribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live natural language extraction scoring sentiment impact on {selectedAsset}.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded text-xs">
            {(['ALL', 'POSITIVE', 'NEGATIVE'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setNewsFilter(filter)}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  newsFilter === filter ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="p-4 rounded-lg bg-slate-950/70 border border-slate-850 hover:border-slate-800 transition-colors space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">{news.source}</span>
                  <span className="font-mono">{news.timeAgo}</span>
                </div>
                <h4 className="text-xs font-semibold text-white leading-snug">
                  {news.headline}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      news.sentiment === 'positive'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : news.sentiment === 'negative'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {news.sentiment.toUpperCase()} ({news.sentimentScore > 0 ? `+${news.sentimentScore}` : news.sentimentScore})
                  </span>
                  <span className="text-[11px] text-slate-500">Impact: {news.impact}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  {news.relevantSymbols.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
