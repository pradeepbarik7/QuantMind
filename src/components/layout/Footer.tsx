import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  FileText,
  Lock,
  ExternalLink,
  Cpu,
  Activity,
  CheckCircle2,
  X,
  Scale,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  activeOperatorName?: string;
}

type PolicyType = 'disclaimer' | 'privacy' | 'terms' | 'model';

export const Footer: React.FC<FooterProps> = ({ onSelectTab, activeOperatorName }) => {
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  const getPolicyContent = (type: PolicyType) => {
    switch (type) {
      case 'disclaimer':
        return {
          title: 'Financial & Regulatory Disclaimer',
          subtitle: 'Academic Research & Non-Custodial Simulation Protocol',
          icon: AlertTriangle,
          content: (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
                <span className="font-semibold block">Important Academic Notice:</span>
                <p>
                  QuantMind is an academic research prototype developed as part of a final-year B.Tech capstone project.
                  This software is <strong>NOT</strong> registered with SEBI (Securities and Exchange Board of India), the US SEC,
                  or any statutory financial regulatory authority as an investment adviser or broker-dealer.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">1. Non-Custodial & Non-Execution Scope</h4>
                <p>
                  The platform does not accept customer deposits, manage financial securities, or transmit live broker orders.
                  All trade signals (BUY / SELL / HOLD), position sizing suggestions, and price levels represent deterministic
                  simulations derived from historical mathematical algorithms for behavioral bias mitigation.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">2. Hypothetical Backtesting Limitations</h4>
                <p>
                  Historical backtesting results (equity curves, CAGR, Sharpe ratios, and max drawdown curves) are simulated.
                  Hypothetical performance has inherent limitations: it does not account for real-market liquidity vacuums,
                  intraday slippage variations, exchange transaction levies, or extreme black-swan market events.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">3. No Financial Advice</h4>
                <p>
                  Nothing contained on this dashboard constitutes financial, legal, tax, or investment advice. Discretionary
                  trading involves substantial risk of capital loss. Users must consult certified financial advisors before
                  making financial commitments in live capital markets.
                </p>
              </div>
            </div>
          ),
        };

      case 'privacy':
        return {
          title: 'Privacy Policy & Data Handling',
          subtitle: 'Academic Non-Commercial Data Protection Standards',
          icon: Lock,
          content: (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-semibold text-white mb-1">1. Researcher Data Confidentiality</h4>
                <p>
                  QuantMind collects minimal profile metadata (researcher name, institutional email address, department, and role)
                  strictly to demonstrate Role-Based Access Control (RBAC) during project reviews. No personal credentials or passwords
                  are ever transmitted to commercial advertising brokers or third-party trackers.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">2. Local Storage & Session State</h4>
                <p>
                  Authentication sessions, active asset selections, and simulated strategy parameter inputs are preserved strictly
                  within your client browser&apos;s localStorage sandbox. You may purge all local workspace state at any time by
                  clicking &ldquo;Sign Out&rdquo; or clearing browser session storage.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">3. Market & Sentiment Feeds</h4>
                <p>
                  Historical price candles, volume figures, and financial news headlines originate from public non-proprietary
                  educational feeds (yFinance / public RSS). QuantMind does not track your personal financial portfolios or accounts.
                </p>
              </div>
            </div>
          ),
        };

      case 'terms':
        return {
          title: 'Terms of Research & Project Use',
          subtitle: 'Open Academic Evaluation Framework Agreement',
          icon: Scale,
          content: (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-semibold text-white mb-1">1. Academic License & Project Defense</h4>
                <p>
                  This system is made available for evaluation by the B.Tech project review committee, academic examiners, and
                  peer researchers. Unauthorized commercial redistribution, resale, or deployment as an automated trading bot
                  without express consent of the author is prohibited.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">2. Behavioral Bias Mitigation Objective</h4>
                <p>
                  The core intellectual contribution of this project is the empirical attenuation of cognitive trading biases
                  (loss aversion, fear of missing out, disposition effect, revenge trading). The software is evaluated on its
                  ability to systematically constrain irrational human deviations, not on guaranteeing guaranteed financial returns.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">3. Limitation of Liability</h4>
                <p>
                  Under no circumstances shall the author, university, or project advisors be liable for any direct, indirect,
                  or consequential damages arising out of the use or inability to use this prototype.
                </p>
              </div>
            </div>
          ),
        };

      case 'model':
        return {
          title: 'Algorithmic Model Disclosures & Limitations',
          subtitle: 'Machine Learning & Hidden Markov Model Technical Specifications',
          icon: BookOpen,
          content: (
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-semibold text-white mb-1">1. Hidden Markov Model (HMM) Regime Assumptions</h4>
                <p>
                  Market regimes (Bullish, Bearish, Sideways, High Volatility) are inferred assuming stationary Gaussian emissions
                  over rolling lookback windows. Rapid structural market breaks may cause temporary lag in state transition detection.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">2. XGBoost Multi-Factor Classifier</h4>
                <p>
                  The gradient-boosted decision trees calculate conditional probabilities based on 18 technical and order flow proxies.
                  Outputs are probabilities, not deterministic certainties. The 75% execution hurdle rate serves as an asymmetric margin of safety.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">3. FinBERT NLP Sentiment Boundaries</h4>
                <p>
                  Sentiment scores (-1.0 to +1.0) reflect contextual polarity extracted from corporate headlines. Sarcasm, ambiguous
                  geopolitical releases, and multi-interpretation monetary statements may exhibit classification divergence.
                </p>
              </div>
            </div>
          ),
        };
    }
  };

  const modalData = activePolicy ? getPolicyContent(activePolicy) : null;

  return (
    <>
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/95 text-slate-400 text-xs">
        {/* Main Footer Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Col 1: Platform Branding & Mission */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-base font-bold text-white tracking-tight">QuantMind</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                  v2.4 Capstone
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                High Speed Systematic Execution Framework For Behavioural Bias Mitigation.
                An AI-driven decision-support platform designed to eliminate emotion-driven trading errors
                through regime filtering, ML forecasts, and news sentiment.
              </p>

              <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                <div>
                  <span className="text-slate-400 font-medium">Domain:</span> Artificial Intelligence, Machine Learning & Quantitative Finance
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Project Stage:</span> B.Tech Final-Year Capstone (Review-II Evaluation)
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="lg:col-span-2 space-y-2.5">
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Platform Views
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => onSelectTab('home')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Home & Asset Selection
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('market')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Market Analysis
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('ai-sentiment')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    AI Prediction & Sentiment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('backtest')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Historical Backtesting
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('risk')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Risk & Performance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('admin')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Admin Console (RBAC)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Research Architecture & Models */}
            <div className="lg:col-span-3 space-y-2.5">
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Systematic Pipeline
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>HMM Regime Detection (hmmlearn)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>XGBoost Multi-Factor Classifier</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>FinBERT Financial Sentiment NLP</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Behavioral Bias Shield & Kelly Sizing</span>
                </li>
                <li className="pt-1">
                  <button
                    onClick={() => onSelectTab('architecture')}
                    className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View REST API & Python Architecture</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal, Policies & Disclaimers */}
            <div className="lg:col-span-3 space-y-2.5">
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Governance & Policies
              </div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setActivePolicy('disclaimer')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Financial & Regulatory Disclaimer</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('privacy')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Privacy Policy & Data Standards</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('terms')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Terms of Academic Research Use</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePolicy('model')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Model Disclosures & Boundaries</span>
                  </button>
                </li>
              </ul>

              <div className="pt-2 text-[11px] text-slate-500">
                Non-commercial educational demonstration prototype. No real-money brokerage integration.
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              &copy; 2026 QuantMind. High Speed Systematic Execution Framework. Final-Year B.Tech Capstone Project.
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              {activeOperatorName && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Operator: <strong className="text-slate-300">{activeOperatorName}</strong></span>
                </span>
              )}
              <span>·</span>
              <span className="text-slate-500">NSE Tick Poller: Nominal</span>
              <span>·</span>
              <span className="text-slate-500">Non-Custodial</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Policy & Legal Disclosures Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-slate-800 text-emerald-400">
                  <modalData.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{modalData.title}</h3>
                  <div className="text-[11px] text-slate-400">{modalData.subtitle}</div>
                </div>
              </div>
              <button
                onClick={() => setActivePolicy(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              {modalData.content}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
              <span className="text-slate-500">Review-II Compliance Document</span>
              <button
                onClick={() => setActivePolicy(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors cursor-pointer"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
