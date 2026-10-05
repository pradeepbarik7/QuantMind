import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Server,
  Cpu,
  Database,
  Terminal,
  CheckCircle2,
  Code,
  BookOpen,
  Sparkles,
  Link2,
} from 'lucide-react';

export const PipelineSettingsView: React.FC = () => {
  const [backendMode, setBackendMode] = useState<'SIMULATED' | 'FASTAPI' | 'STREAMLIT'>('SIMULATED');
  const [hurdleRate, setHurdleRate] = useState<number>(75);
  const [hmmStates, setHmmStates] = useState<number>(4);
  const [lookbackDays, setLookbackDays] = useState<number>(252);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'endpoints' | 'viva'>('pipeline');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <span>Architecture & Python Pipeline Integration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Technical configuration, ML hyperparameters, and API contracts for B.Tech project Review-II demonstration.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded text-xs">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              activeTab === 'pipeline' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pipeline Config
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              activeTab === 'endpoints' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            REST API Schema
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              activeTab === 'viva' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Review-II Defense Guide
          </button>
        </div>
      </div>

      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Backend Mode Switcher */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Backend Execution Target</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle between client-side quantitative simulation and external Python/FastAPI ML server.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setBackendMode('SIMULATED')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  backendMode === 'SIMULATED'
                    ? 'bg-emerald-950/30 border-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                  <span>In-Browser Simulator</span>
                  {backendMode === 'SIMULATED' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  High-speed standalone deterministic mode for UI review and examiner testing without Python server setup.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-400">ACTIVE FOR DEMO</div>
              </div>

              <div
                onClick={() => setBackendMode('FASTAPI')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  backendMode === 'FASTAPI'
                    ? 'bg-emerald-950/30 border-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                  <span>FastAPI + yFinance Bridge</span>
                  {backendMode === 'FASTAPI' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  Connects to <code className="text-slate-200">http://localhost:8000/api/v1</code> running Python 3.11 with scikit-learn & hmmlearn.
                </p>
                <div className="mt-2 text-[10px] font-mono text-slate-500">STANDBY CONNECTOR</div>
              </div>

              <div
                onClick={() => setBackendMode('STREAMLIT')}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  backendMode === 'STREAMLIT'
                    ? 'bg-emerald-950/30 border-emerald-500/50'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                  <span>Streamlit Analytics Tunnel</span>
                  {backendMode === 'STREAMLIT' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  Bi-directional websocket bridge to Streamlit model inspection charts and custom parameter tuning.
                </p>
                <div className="mt-2 text-[10px] font-mono text-slate-500">STANDBY CONNECTOR</div>
              </div>
            </div>
          </div>

          {/* Model Hyperparameters & Thresholds */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Quantitative Hyperparameters & Systematic Thresholds</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Execution Hurdle Rate:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{hurdleRate}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="90"
                  value={hurdleRate}
                  onChange={(e) => setHurdleRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Signals below this confidence threshold are automatically converted to HOLD to prevent overtrading.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>HMM Hidden States:</span>
                  <span className="font-mono text-sky-400 font-semibold">{hmmStates} States</span>
                </div>
                <select
                  value={hmmStates}
                  onChange={(e) => setHmmStates(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                >
                  <option value={2}>2 States (Bullish / Bearish)</option>
                  <option value={3}>3 States (Bull / Bear / Neutral)</option>
                  <option value={4}>4 States (Bull / Bear / Sideways / High-Vol)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Gaussian Hidden Markov model emission states for market regime detection.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Feature Lookback Window:</span>
                  <span className="font-mono text-white font-semibold">{lookbackDays} Days</span>
                </div>
                <select
                  value={lookbackDays}
                  onChange={(e) => setLookbackDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                >
                  <option value={126}>6 Months (126 Trading Days)</option>
                  <option value={252}>1 Year (252 Trading Days)</option>
                  <option value={504}>2 Years (504 Trading Days)</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Rolling historical window for volatility clustering and technical indicator computation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'endpoints' && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Python Backend REST Endpoints Contract</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The frontend is fully decoupled and ready to communicate with the Python ML microservices via these standardized JSON endpoints.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Endpoint 1 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30 text-[10px]">
                  GET
                </span>
                <span className="text-white font-semibold">/api/v1/market/quote?symbol=NIFTY50</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">
                Pulls latest OHLCV tick data via yFinance, computes VWAP, 52W metrics, and realized volatility.
              </p>
            </div>

            {/* Endpoint 2 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-bold border border-sky-500/30 text-[10px]">
                  POST
                </span>
                <span className="text-white font-semibold">/api/v1/hmm/regime</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">
                Executes hmmlearn Baum-Welch training and Viterbi path decoding on returns to output regime state & transition matrix.
              </p>
            </div>

            {/* Endpoint 3 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-bold border border-purple-500/30 text-[10px]">
                  POST
                </span>
                <span className="text-white font-semibold">/api/v1/ml/predict</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">
                Feeds normalized feature vector into XGBoost classifier; returns directional probability, SHAP values, and model confidence.
              </p>
            </div>

            {/* Endpoint 4 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-500/30 text-[10px]">
                  POST
                </span>
                <span className="text-white font-semibold">/api/v1/nlp/sentiment</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">
                Scrapes news via Google News RSS / NewsAPI, runs FinBERT tokenizer, and aggregates entity-level polarity scores.
              </p>
            </div>

            {/* Endpoint 5 */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold border border-rose-500/30 text-[10px]">
                  POST
                </span>
                <span className="text-white font-semibold">/api/v1/backtest/simulate</span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">
                Vectorized event-driven backtesting engine (Backtrader/custom) with slippage, transaction costs, and bias mitigation log.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'viva' && (
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Review-II Project Defense & Theoretical Questions Guide</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Key mathematical justifications and domain explanations prepared for the project evaluation committee.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-emerald-400">
                Q1: How does this system specifically solve the &ldquo;Behavioural Bias&rdquo; problem?
              </div>
              <p className="text-slate-300 leading-relaxed">
                Human traders suffer from cognitive biases documented in Behavioral Economics (Kahneman & Tversky):
                <strong> Loss Aversion</strong> (selling too early or holding losers in denial), <strong>FOMO</strong> (buying extended tops),
                and <strong>Revenge Trading</strong> (reckless sizing after losses). The framework replaces discretionary impulses with
                strict mathematical constraints: algorithmic stop-losses, position sizing caps (Kelly fractional), and multi-pillar
                consensus requirements (HMM + XGBoost + FinBERT) that cannot be overridden by human panic or euphoria.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-sky-400">
                Q2: Why use a Hidden Markov Model (HMM) instead of just simple moving averages?
              </div>
              <p className="text-slate-300 leading-relaxed">
                Financial markets are non-stationary; a strategy that works in a trending regime fails catastrophically in a sideways chop
                or high-volatility panic. Simple moving averages lag significantly. An HMM models market returns as an unobservable Markov
                chain with Gaussian emissions, allowing the system to identify the latent regime (Bull, Bear, Sideways, High-Vol) probabilistically
                and adapt position rules dynamically.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-purple-400">
                Q3: Why FinBERT over standard VADER or basic sentiment dictionaries?
              </div>
              <p className="text-slate-300 leading-relaxed">
                Generic sentiment tools like VADER fail on financial jargon. For example, &ldquo;RBI hikes repo rate&rdquo; or &ldquo;EBITDA margin compression&rdquo;
                have complex domain-specific implications that general lexicons misclassify. FinBERT is pre-trained on large financial corpora (10-K filings,
                earnings transcripts, analyst notes) and understands financial syntax context accurately.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-amber-400">
                Q4: What is the significance of the 75% Execution Hurdle Rate?
              </div>
              <p className="text-slate-300 leading-relaxed">
                Retail trading failure is predominantly caused by overtrading. By imposing an asymmetric execution hurdle (&ge;75%), the system
                defaults to CASH / HOLD during ambiguous conditions. This directly eliminates overtrading and cuts cumulative broker transaction friction.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
